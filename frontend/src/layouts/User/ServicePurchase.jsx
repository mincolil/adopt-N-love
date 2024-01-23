import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    Modal,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Grid,
    Stack,
    Pagination,
    Typography
} from "@mui/material";

// import { styled } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/Close";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import useAuth from '../../hooks/useAuth';
import DateFormat from '../../components/DateFormat';
import ButtonCustomize from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
// import dayjs from "dayjs";

export default function ServicePurchase() {
    // const DEFAULT_PAGE = 1;
    // const DEFAULT_LIMIT = 5;
    const DEFAULT_STATUS = "Chờ xác nhận"
    const CANCEL_STATUS = "Huỷ"

    const [data, setData] = useState([]);
    // const [quantity, setQuantity] = useState(0)
    // const [loged, setLoged] = useState(false)
    // const [total, setTotal] = useState(0)
    const [pages, setPages] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [status, setStatus] = useState('');
    const [id, setId] = useState();

    const [orderDetail, setOrderDetail] = useState([]);

    // --------------------- MODAL HANDLE -----------------------------

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const context = useAuth();
    const navigate = useNavigate();

    const handleLoadCartServiceById = async (option) => {
        if (context.auth.token !== undefined) {
            try {
                setStatus(option)
                await axios.get(`http://localhost:3500/booking/get-all-booking-by-uid/${context.auth.id}`,
                    {
                        headers: { 'Authorization': context.auth.token },
                        withCredentials: true
                    }
                )
                    .then((data) => {
                        const filterData = []
                        // console.log(option)

                        for (let i = 0; i < data.data.length; i++) {
                            if (data.data[i].status === option) {
                                filterData.push(data.data[i])
                            }
                        }
                        // console.log(filterData)
                        setData(filterData)
                    })
            } catch (err) {
                console.log(err);
            }
        }
    }

    useEffect(() => {
        handleLoadCartServiceById(DEFAULT_STATUS)
    }, []);

    // ----------------------------------------------------------------

    const handlePaging = (event, value) => {
        setCurrentPage(value === undefined ? 1 : value)
        handleLoadCartServiceById(DEFAULT_STATUS);
    }

    // ----------------------------------------------------------------

    const handleViewBookingDetail = async (id, option) => {
        try {
            const data = await axios.get(`http://localhost:3500/bookingDetail/${id}`);
            if (data.error) {
                toast.error(data.error);
            } else {
                // console.log(data.data);
                setId(id);
                setOrderDetail(data.data)
            }
        } catch (err) {
            console.log(err);
        }
        handleOpen();
    };

    // ----------------------------------------------------------------

    const handleRemoveOrder = async (id) => {
        if (window.confirm("Bạn có muốn huỷ dịch vụ không ?") === true) {
            try {
                await axios.put(`http://localhost:3500/booking/update-status/${id}`, { bookingStatus: CANCEL_STATUS })
                    .then((data) => {
                        handleLoadCartServiceById(CANCEL_STATUS)
                        handleClose();
                    })
                    .catch((error) => {

                    })
            } catch (err) {
                console.log(err);
            }
        }
    };

    // ----------------------------------------------------------------

    const handleFeedBack = (id) => {
        context.auth.feedback = true
        navigate(`/service-homepage/${id}`)
        // console.log(context.auth)
    }

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "70%",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    const buttonStyle = {
        width: '100%',
        padding: '16px 0',
        marginBottom: '20px',
        fontSize: '17px',
        border: 'none',
        backgroundColor: '#efeff5',
        color: 'black',
        cursor: 'pointer',
    }

    const statusList = ['Chờ xác nhận', 'Đang xử lý', 'Hoàn thành', 'Huỷ']

    const numberToVND = (number) => {
        return number.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    };

    return (
        <>
            <h1 style={{ textAlign: 'center', marginTop: '100px' }}>DỊCH VỤ ĐÃ ĐẶT</h1>
            <Grid container>
                {statusList.map((value) => {
                    return (
                        <Grid item xs={12 / statusList.length}>
                            <button className="button-status" style={buttonStyle} onClick={(e) => handleLoadCartServiceById(value)}>{value}</button>
                        </Grid>
                    )
                })}
            </Grid>

            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell children>STT</TableCell>
                                <TableCell align="left">Tên người dùng</TableCell>
                                <TableCell align="left">Ngày đặt dịch vụ</TableCell>
                                <TableCell align="left">Tổng giá trị</TableCell>
                                <TableCell align="left">Trạng thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.length === 0
                                ? (<TableCell colSpan={5} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    KHÔNG CÓ SẢN PHẨM TRONG MỤC NÀY
                                </TableCell>)
                                : data.map((value, index) => {
                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                            onClick={(e) => handleViewBookingDetail(value._id)}
                                        >
                                            <TableCell component="th" scope="row">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="left">{value.userId !== null ? value.userId.fullname : ""}</TableCell>
                                            <TableCell align="left"><DateFormat date={value.createdAt} /></TableCell>
                                            <TableCell align="left">{numberToVND(value.totalPrice)}</TableCell>
                                            <TableCell align="left">
                                                {value.status}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <hr style={{ opacity: '0.5' }} />
                <Stack spacing={2} sx={{ float: "right" }} style={{ margin: '10px 0', justifyContent: 'center' }}>
                    <Pagination
                        count={pages}
                        page={currentPage}
                        color="primary"
                        onChange={handlePaging}
                    />
                </Stack>
            </Paper>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Chi tiết đơn hàng
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        >

                            <Table sx={{ width: '100%' }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell children>STT</TableCell>
                                        <TableCell align="left">Tên thú cưng</TableCell>
                                        <TableCell align="left">Tên dịch vụ</TableCell>
                                        <TableCell align="left">Số lượng</TableCell>
                                        <TableCell align="left">Giá</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderDetail &&
                                        orderDetail.map((value, index) => {
                                            return (
                                                <TableRow
                                                    key={index}
                                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell align="left">{value.petId !== null ? value.pet.petName : ''}</TableCell>
                                                    <TableCell align="left">{value.serviceId !== null ? value.service.serviceName : ''}</TableCell>
                                                    <TableCell align="left">{value.quantity}</TableCell>
                                                    <TableCell align="left">
                                                        {value.price}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {
                                                            status === 'Hoàn thành'
                                                                ? (
                                                                    <ButtonCustomize
                                                                        onClick={() => handleFeedBack(value.service._id)}
                                                                        nameButton="Đánh giá"
                                                                        variant="contained"
                                                                        sx={{ marginTop: "8px" }}
                                                                    />

                                                                ) : ''
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>

                        </Grid>
                    </DialogContent>
                    {
                        status === DEFAULT_STATUS ?
                            (
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        margin="normal"
                                        color="primary"
                                        onClick={() => handleRemoveOrder(id)}
                                    >
                                        Huỷ đặt hàng
                                    </Button>
                                </DialogActions>
                            ) : ""
                    }
                </Box>
            </Modal>
        </>
    );
}