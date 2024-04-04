import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Grid, Input } from "@mui/material";
import ButtonCustomize from "../Button/Button";
import Chip from "@mui/material/Chip";

import DateFormat from "../../components/DateFormat";

const PET_NAME_REGEX =
    /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ\s]{2,}$/;
const PET_HEIH_REGEX = /^\d*(\.\d+)?$/;

const ModalDetailPet = (props) => {
    const DEFAULT_PAGE = 1;
    const DEFAULT_LIMIT = 10;
    const DEFAULT_STATUS = "Chờ xác nhận";

    const {
        open,
        onClose,
        dataEditPet,
        handUpdateEditTable,
        page,
        data,
        category,
    } = props;

    const [petId, setPetId] = useState("");
    const [userId, setUserId] = useState("");
    const [petName, setPetName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [rank, setRank] = useState(0);
    const [color, setColor] = useState("");
    const [weight, setWeight] = useState(null);
    const [height, setHeight] = useState(null);
    const [status, setStatus] = useState(false);
    const [petImage, setPetImage] = useState(null);


    // --------------------- HANLDE CHANGE STATUS -----------------------------

    const numberToVND = (number) => {
        return number.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    };

    // --------------------- VALIDATION -----------------------------
    const [valid, setValid] = useState("");
    const [validHeight, setValidHeight] = useState("");
    const [validWeight, setValidWeight] = useState("");
    useEffect(() => {
        setValid(PET_NAME_REGEX.test(petName.trim()));
    }, [petName]);

    const handleValidationPetName = (e) => {
        setPetName(e.target.value);
    };

    useEffect(() => {
        setValidHeight(PET_HEIH_REGEX.test(height));
    }, [height]);

    const handleValidationPetHeight = (e) => {
        setHeight(e.target.value);
    };

    useEffect(() => {
        setValidWeight(PET_HEIH_REGEX.test(weight));
    }, [weight]);

    const handleValidationPetWeight = (e) => {
        setWeight(e.target.value);
    };

    useEffect(() => {
        if (open) {
            setUserId(data);
        }
    }, [data]);

    // --------------------- HANDLE CHANGE IMAGE -----------------------------
    const handleImageChange = (e) => {
        setPetImage(e.target.files[0]);
    };

    // --------------------- HANDLE HANLDE UPLOAD IMAGE PET -----------------------------
    const handleUpload = async () => {
        try {
            // if (petImage) {
            const formData = new FormData();
            formData.append("image", petImage);
            const response = await axios.post(
                `http://localhost:3500/pet/upload`,
                formData
            );
            const maxSize = 1024 * 1024;
            if (petImage.size > maxSize) {
                toast.error("Ảnh có dung lượng nhỏ hơn 1MB");
            } else {
                // console.log("Response data:", response.data.image);
                const imagePath = response.data.image;

                if (imagePath) {
                    // console.log("Đã tải ảnh lên:", imagePath);
                    toast.success("Thêm ảnh thành công");
                    setPetImage(petImage instanceof File ? imagePath : petImage);
                } else {
                    // console.log("Lỗi: Không có đường dẫn ảnh sau khi tải lên.");
                    toast.error("Lỗi: Không có đường dẫn ảnh sau khi tải lên.");
                }
            }
            // } else {
            //   // console.log("Vui lòng chọn ảnh trước khi tải lên.");
            //   toast.error("Vui lòng chọn ảnh trước khi tải lên.");
            // }
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên:", error);
        }
    };

    // --------------------- HANDLE UPDATE PET -----------------------------
    useEffect(() => {
        if (open) {
            setPetId(dataEditPet._id);
            setUserId(dataEditPet.userId);
            setPetName(dataEditPet.petName);
            setCategoryId(dataEditPet.categoryId);
            setRank(dataEditPet.rank);
            setStatus(dataEditPet.status);
            setColor(dataEditPet.color);
            setHeight(dataEditPet.height);
            setWeight(dataEditPet.weight);
            setPetImage(dataEditPet.petImage);
            console.log("Check dataEditPet", petId, dataEditPet);
        }
    }, [dataEditPet]);


    // --------------------- HANDLE CHANGE CATEGORY PET -----------------------------
    const handleChangePet = (e) => {
        const selectedCategory = e.target.value;
        // console.log("Check ID cate add Product", selectedCategory);
        setCategoryId(selectedCategory);
    };

    // ---------------------- HANDlE LOAD BOOKING BY PET ID -------------------------


    const handleLoadBookingByPetId = async (petId) => {
        try {
            const loadData = await axios.get(
                `http://localhost:3500/bookingDetail/history/${petId}`
            );
            if (loadData.error) {
                toast.error(loadData.error);
            } else {
                setBookingByPetId(loadData.data.docs);
                // console.log(loadData.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu booking by pet id:", error);
        }
    };

    useEffect(() => {
        if (open) {
            console.log("Check petId", petId);
            handleLoadBookingByPetId(petId);
        }
    }, [open, petId]);

    const [bookingByPetId, setBookingByPetId] = useState([]);

    // useEffect(() => {
    //     handleLoadBookingByPetId(petId);
    // }, []);



    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Box
                sx={{
                    bgcolor: "background.paper",
                    p: 2,
                    borderRadius: "12px",
                    boxShadow: 5,
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Thông tin thú cưng
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <form>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                                {petImage && (
                                    <img
                                        src={
                                            petImage instanceof File
                                                ? URL.createObjectURL(petImage)
                                                : petImage
                                        }
                                        alt="Ảnh sản phẩm"
                                        style={{ maxWidth: "300px" }}
                                    />
                                )}
                            </Grid>
                        </Grid>
                        <TextField
                            required
                            fullWidth
                            label="Id chủ thú cưng"
                            margin="normal"
                            value={data}
                            sx={{ display: "none" }}
                            onChange={(e) => setUserId(e.target.value)}
                        // defaultValue={dataEditPet.userId.fullname}
                        />
                        <Typography level="h3" component="div">
                            Giống thú cưng: {category.find((x) => x._id === categoryId)?.feature}
                        </Typography>
                        <Typography level="h3" component="div">
                            Tên thú cưng: {petName}
                        </Typography>
                        <Typography level="h3" component="div">
                            Chiều cao (cm): {height}
                        </Typography>
                        <Typography level="h3" component="div">
                            Cân nặng: {weight}
                        </Typography>
                        <Typography level="h3" component="div">
                            Màu lông: {color}
                        </Typography>
                        <Typography level="h3" component="div">
                            Cấp độ thú cưng: {rank}
                        </Typography>
                        <Chip
                            size="small"
                            variant="outlined"
                            label={status ? "Sức khoẻ tốt" : "Sức khoẻ xấu"}
                            {...(status ? { color: "success" } : { color: "error" })}
                        />
                    </form>
                </DialogContent>
                <Typography>Lịch sử dịch vụ</Typography>
                <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "20px" }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Tên dịch vụ</TableCell>
                                    <TableCell align="left">Ngày đặt</TableCell>
                                    <TableCell align="left">Số lượng</TableCell>
                                    <TableCell align="left">Giá trị</TableCell>
                                    <TableCell align="left">Trạng thái</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookingByPetId.length === 0
                                    ? (<TableCell colSpan={5} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                        KHÔNG CÓ SẢN PHẨM TRONG MỤC NÀY
                                    </TableCell>)
                                    : bookingByPetId.map((value, index) => {
                                        return (
                                            <TableRow
                                                key={index}
                                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                            >
                                                <TableCell align="left">
                                                    {value.serviceId !== null ? value.serviceId.serviceName : ""}
                                                </TableCell>
                                                <TableCell align="left">
                                                    <DateFormat date={value.createdAt} />
                                                </TableCell>
                                                <TableCell align="left">
                                                    {value.quantity}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {numberToVND(value.serviceId.price)}
                                                </TableCell>
                                                <TableCell align="left">{value.bookingId.status}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <hr style={{ opacity: "0.5" }} />
                </Paper>

            </Box>
        </Dialog>
    );
};

export default ModalDetailPet;
