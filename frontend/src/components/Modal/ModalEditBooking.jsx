import * as React from "react";
import {
    Box,
    Dialog,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { Avatar, Container, Stack, TextField } from "@mui/material";
import ModalAddPet from "./ModalAddPet";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SlotPicker from 'slotpicker';
import dayjs from "dayjs";
import { ToastContainer } from "react-toastify";
import { Button } from "@mui/material";

const EditBooking = ({ open, onClose, service, petId, loadData, bookingData }) => {
    const [bookingId, setDataBookingId] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedService, setSelectedService] = useState({});

    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setToDate] = React.useState(null);

    const [categorySlot, setCategorySlot] = useState([]);

    const context = useAuth();
    // console.log(context.auth.serviceId);

    useEffect(() => {
        setSelectedService(service);
    }, [service]);

    useEffect(() => {
        setDataBookingId(bookingData);
    }, [bookingData]);

    //Create date string
    const dateString = (selectedDate, selectedTime) => {
        const date = selectedDate.format('YYYY-MM-DD');
        const time = selectedTime.format('hh:00:00');
        return `${date}T${time}`;
    }


    // --------------------- MODAL HANDLE -----------------------------
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    // --------------------- OPEN MODAL  -----------------------------
    const handleCreateModal = () => {
        setOpenCreateModal(true);
        setSelectedService(service);
    };

    // --------------------- CLOSE MODAL  -----------------------------
    const handleCloseModal = () => {
        setOpenCreateModal(false);
        setOpenEditModal(false);
    };

    // --------------------- HANDEL DATE TIME -----------------------------
    const handleEndDateChange = (date) => {
        if (date === null) {
            setToDate(dayjs());
        } else {
            setToDate(date);
        }
    };

    const isTimeIncluded = (time, start, end) => {
        return time >= start && time <= end;
    };

    const handleSelectTime = (selected) => {
        const hour = new Date(selected).getHours();
        if (isTimeIncluded(hour, 12, 13.9)) {
            setSelectedTime(null);
        } else {
            setSelectedTime(selected);
        }
    };

    // --------------------- GET ALL CATEGORY PET -----------------------------
    const [category, setCategory] = useState([]);
    async function loadAllCategoryPet() {
        try {
            const loadDataCategoryPet = await axios.get(
                `http://localhost:3500/category?categoryName=Thú cưng`
            );
            if (loadDataCategoryPet.error) {
                toast.error(loadDataCategoryPet.error);
            } else {
                setCategory(loadDataCategoryPet.data.docs);
            }
        } catch (err) {
            toast.error(err.response.data.error);
        }
    }

    useEffect(() => {
        loadAllCategoryPet();
    }, []);



    // ------------------------------- HANDLE GET CATEFORY SLOT ------------------------------
    const loadCategorySlot = async () => {
        try {
            if (!context.auth.serviceId) return;
            const loadDataCategorySlot = await axios.get(`http://localhost:3500/service/${context.auth.serviceId}`);
            const categorySlot = loadDataCategorySlot.data.categoryId.slot;
            console.log("slot con:" + categorySlot);
            setCategorySlot(categorySlot);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadCategorySlot();
    }, [context.auth.serviceId]);

    // ------------------------------- HANDLE CHECK EMPTY SLOT ------------------------------
    const checkEmptySlot = async (date) => {
        try {
            const totalSlots = await axios.get('http://localhost:3500/bookingDetail/bookingDate/' + date);
            console.log("total slot : " + totalSlots.data.docs.length);
            console.log("category slot : " + categorySlot);
            if (totalSlots >= categorySlot) {
                console.log("het slot");
                return false;
            }
            console.log("con slot");
            return true;
        } catch (err) {
            console.log(err);
        }
    }

    // ------------------------------- HANDLE CHECK DUPPLICATE PET ------------------------------
    const isDuplicatePet = async (date) => {
        try {
            const id = petId;
            const checkPetBooking = await axios.get(`http://localhost:3500/bookingDetail/${id}/${date}`);
            const checkPetCart = await axios.get(`http://localhost:3500/cartService/${id}/${date}`, {
                headers: { 'Authorization': context.auth.token },
                withCredentials: true
            });
            //check exsit pet in booking date
            const totalSlot = checkPetBooking.data.docs.length + checkPetCart.data.length;
            console.log("ee " + totalSlot);
            if (totalSlot < 1) {
                console.log("khong trung pet");
                return false;
            }
            console.log("bi trung pet");
            return true;
        } catch (err) {
            console.log(err);
        }
    }

    // ------------------------------- Handle CONVERT DATE STRING TO DATE ------------------------------
    const formatJSONDate = (date) => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`;
    }

    // --------------------------------ADD SERVICE TO CART------------------------------
    const handleUpdateBooking = async (id) => {
        try {
            const date = new Date(dateString(selectedDate, selectedTime));
            date.setUTCHours(date.getUTCHours() + 7);
            const checkSlot = await checkEmptySlot(formatJSONDate(date));
            const checkPet = await isDuplicatePet(formatJSONDate(date));
            if (checkSlot && !checkPet) {
                const updateBooking = await axios.patch(`http://localhost:3500/bookingDetail/${bookingId}`, {
                    bookingDate: formatJSONDate(date),
                    petId: id,
                });
                if (updateBooking.error) {
                    toast.error(updateBooking.error);
                } else {
                    onClose();
                }
            } else {
                toast.error("Slot đã đầy hoặc thú cưng đã được đặt vào ngày này");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const isWeekend = (date) => {
        const day = date.day();

        return day === 0 || day === 6;
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <ToastContainer />
            <Box sx={{
                bgcolor: "background.paper",
                p: 3,
                borderRadius: "5px",
                boxShadow: 5,
            }}>
                <DialogTitle>Đặt lịch hẹn</DialogTitle>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Container
                        components={['DateTimePicker', 'DateTimePicker', 'DateTimePicker']}
                    // Adjust the margin as needed
                    >
                        <DatePicker label="Ngày hẹn" onChange={handleEndDateChange} disablePast={true} sx={{
                            "& .MuiInputLabel-root.Mui-focused": { color: "#ff5722" }, "& .MuiOutlinedInput-root": {
                                "&:hover > fieldset": { borderColor: "#ff5722" },
                                height: "48px",
                                borderRadius: "6px",
                                padding: "14px 14px",
                                marginBottom: "30px",
                            },
                        }} />
                        <SlotPicker
                            // Required, interval between two slots in minutes, 30 = 30 min
                            interval={60}
                            // Required, when user selects a time slot, you will get the 'from' selected value
                            onSelectTime={s => handleSelectTime(s)}
                            // Optional, array of unavailable time slots
                            unAvailableSlots={['12:00', '13:00']}
                            // Optional, 8AM the start of the slots
                            from={'08:00'}
                            // Optional, 09:00PM the end of the slots
                            to={'17:00'}
                            // Optional, 01:00 PM, will be selected by default
                            defaultSelectedTime={'13:00'}
                            // Optional, selected slot color
                            selectedSlotColor='#ff5722'
                            // Optional, language of the displayed text, default is english (en)
                            lang='en'
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleUpdateBooking(petId)}
                            sx={{ marginBottom: "10px" }}

                        >
                            Đổi lịch
                        </Button>
                    </Container>

                </LocalizationProvider>



                {/* Modal create */}
                <ModalAddPet
                    open={openCreateModal}
                    onClose={handleCloseModal}
                    handUpdateTable={loadData}
                    page={currentPage}
                    data={context.auth.id}
                    category={category}
                />
            </Box>
        </Dialog >
    );
};

export default EditBooking;
