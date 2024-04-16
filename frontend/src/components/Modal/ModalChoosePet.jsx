import { styled } from "@mui/material/styles";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  AppBar,
  Box,
  Button,
  CardActionArea,
  CardActions,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Toolbar,
  colors,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { Avatar, Container, Stack, TextField } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import { Pagination } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ModalAddPet from "./ModalAddPet";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import SlotPicker from 'slotpicker';
import dayjs from "dayjs";
import { ToastContainer } from "react-toastify";

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';

const ChoosePet = ({ open, onClose, service, pet, loadData, choosenPet }) => {
  const [data, setData] = useState([]);
  const [dataCart, setDataCart] = useState([]);

  const [totalPets, setTotalPets] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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

const { confirm } = Modal;
const showConfirmPet = () => {
  return new Promise((resolve, reject) => {
    confirm({
      title: 'Xác nhận',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn có muốn cho thú cưng sử dụng dịch vụ này không ?',
      okText: 'Đồng ý', 
      cancelText: 'Hủy bỏ', 
      onOk() {
        resolve(true); // Trả về giá trị true khi người dùng nhấn OK
      },
      onCancel() {
        resolve(false); // Trả về giá trị false khi người dùng nhấn Cancel
      },
    });
  });
};

  // ----------------------------------- API GET ALL PET BY USER ID--------------------------------
  useEffect(() => {
    loadAllPetByUserId();
  }, [context.auth.id]);

  const loadAllPetByUserId = async () => {
    try {
      const loadDataPet = await axios.post(
        `/pet/booking`,
        {
          userId: context.auth.id,
          serviceId: context.auth.serviceId,
        }
      );
      if (loadDataPet.error) {
        toast.error(loadDataPet.error);
      } else {
        setTotalPages(loadDataPet.data.pages);
        // console.log("Check totalPage", totalPages);
        // setData(loadDataPet.data.docs);

        setData(loadDataPet.data);

        setTotalPets(loadDataPet.data.limit);
        // console.log("Kiểm tra pet của người dùng", loadDataPet.data);
      }
    } catch (err) {
      // console.log(err);
      toast.error(err.response.data.error);
    }
  };

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
        `/category?categoryName=Thú cưng`
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

  useEffect(() => {
    loadCategorySlot();
  }, [context.auth.serviceId]);

  // ------------------------------- HANDLE GET CATEFORY SLOT ------------------------------
  const loadCategorySlot = async () => {
    try {
      if (!context.auth.serviceId) return;
      const loadDataCategorySlot = await axios.get(`/service/${context.auth.serviceId}`);
      const categorySlot = loadDataCategorySlot.data.categoryId.slot;
      // console.log("slot con:" + categorySlot);
      setCategorySlot(categorySlot);
    } catch (err) {
      console.log(err);
    }
  };

  // ------------------------------- HANDLE CHECK EMPTY SLOT ------------------------------
  const checkEmptySlot = async (date) => {
    try {
      const totalSlots = await axios.get('/bookingDetail/bookingDate/' + date);
      const cartSlots = await axios.get('/cartService/bookingDate/' + date, {
        headers: { 'Authorization': context.auth.token },
        withCredentials: true
      });
      const total = totalSlots.data.docs.length + cartSlots.data.length;
      console.log(total);
      if (total >= categorySlot) {
        return false;
      }
      return true;
    } catch (err) {
      console.log(err);
    }
  }

  // ------------------------------- HANDLE CHECK DUPPLICATE PET ------------------------------
  const isDuplicatePet = async (id, date) => {
    try {
      const checkPetBooking = await axios.get(`/bookingDetail/${id}/${date}`);
      const checkPetCart = await axios.get(`/cartService/${id}/${date}`, {
        headers: { 'Authorization': context.auth.token },
        withCredentials: true
      });
      //check exsit pet in booking date
      const totalSlot = checkPetBooking.data.docs.length + checkPetCart.data.length;
      console.log("ee " + totalSlot);
      if (totalSlot < 1) {
        console.log("con");
        return false;
      }
      console.log("het");
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
  const handleAddToCart = async (id) => {
    if (selectedDate === null || selectedTime === null) {
      toast.error("Vui lòng chọn ngày và giờ hẹn");
      return;
    } else {
      if (
        // window.confirm("Bạn có muốn cho thú cưng sử dụng dịch vụ này không ?") ===
        // true
        await showConfirmPet()
      ) {
        const date = new Date(dateString(selectedDate, selectedTime));
        date.setUTCHours(date.getUTCHours() + 7);
        const checkSlot = await checkEmptySlot(date)
        const checkPet = await isDuplicatePet(id, date);
        if (!checkSlot) {
          toast.error("Thời gian này đã có người kín lịch, vui lòng chọn thời gian khác");
          return;
        }
        else if (checkPet) {
          toast.error("Thú cưng này của bạn đã đặt lịch hẹn vào thời gian này, vui lòng chọn thời gian khác");
          return;
        }
        else {
          try {
            const addServiceToCart = await axios
              .post(
                `/cartService/add-to-cart`,
                {
                  serviceId: context.auth.serviceId,
                  petId: id,
                  bookingDate: date,
                },
                {
                  headers: { Authorization: context.auth.token },
                  withCredentials: true,
                }
              )
              .then((data) => {
                toast.success("Thêm dịch vụ vào giỏ hàng thành công");
                context.handleLoadCartService();
                onClose();
              });
          } catch (err) {
            console.log(err);
            toast.error(err.response.data.error);
          }
        }
      }
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
          </Container>
        </LocalizationProvider>
        {pet && (
          <DialogTitle>Chọn thú cưng</DialogTitle>
        )}

        <List sx={{ pt: 0 }}>
          {pet &&
            pet.map((value, index) => {
              return (
                <ListItem disableGutters>
                  <ListItemButton onClick={() => handleAddToCart(value._id)}>
                    <ListItemAvatar>
                      <Avatar
                        src={
                          value.petImage !== undefined
                            ? `${value.petImage}`
                            : "https://static2-images.vnncdn.net/files/publish/2022/12/8/meo-1-1416.jpg"
                        }
                      ></Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={value.petName} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          {pet && (<ListItem disableGutters>
            <ListItemButton onClick={handleCreateModal}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Thêm thú cưng" />
            </ListItemButton>
          </ListItem>
          )}
        </List>



        {choosenPet && (
          <Button
            onClick={() => handleAddToCart(choosenPet._id)}
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
          > Thêm vào giỏ hàng
          </Button>
        )}

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

export default ChoosePet;