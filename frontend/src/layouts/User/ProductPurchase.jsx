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
  IconButton,
  Grid,
  DialogActions,
} from "@mui/material";
import Header from "../../components/Header/Header";

import CloseIcon from "@mui/icons-material/Close";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import DateFormat from "../../components/DateFormat";
import { useNavigate } from "react-router-dom";
import ButtonCustomize from "../../components/Button/Button";

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal as AntModal } from 'antd';

const { confirm } = AntModal;
const showConfirmPurch = () => {
  return new Promise((resolve, reject) => {
    confirm({
      title: 'Xác nhận',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn có muốn cập nhật trạng thái đơn hàng không ?',
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

export default function ProductPurchase() {
  // const DEFAULT_PAGE = 1;
  // const DEFAULT_LIMIT = 5;
  const DEFAULT_STATUS = "Chờ xác nhận";
  const CANCEL_STATUS = "Huỷ";

  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [orderDetail, setOrderDetail] = useState([]);
  const [id, setId] = useState();

  // --------------------- MODAL HANDLE -----------------------------

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const context = useAuth();
  const navigate = useNavigate();

  const handleLoadCartProductById = async (option) => {
    if (context.auth.token !== undefined) {
      try {
        setStatus(option);
        setSelectedStatus(option);
        const loadData = await axios
          .get(`/order/get-all-order-by-uid/${context.auth.id}`, {
            headers: { Authorization: context.auth.token },
            withCredentials: true,
          })
          .then((data) => {
            const filterData = [];
            // console.log(data.data)

            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].status === option) {
                filterData.push(data.data[i]);
              }
            }
            setData(filterData);
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  // ------------------------LOAD PAGE----------------------------------------
  const { auth } = context;

  useEffect(() => {
    if (auth) handleLoadCartProductById(DEFAULT_STATUS);
  }, [auth]);

  // ----------------------------------------------------------------

  const handleFeedBack = (id) => {
    context.auth.feedback = true;
    navigate(`/product-homepage/${id}`);
    // console.log(context.auth)
  };

  // ----------------------------------------------------------------

  const handleViewOrderDetail = async (id, option) => {
    try {
      const data = await axios.get(`/orderDetail/${id}`);
      if (data.error) {
        toast.error(data.error);
      } else {
        // console.log(data.data);
        setId(id);
        setOrderDetail(data.data);
      }
    } catch (err) {
      console.log(err);
    }
    handleOpen();
  };

  // ----------------------------------------------------------------

  const handleRemoveOrder = async (id, status) => {
    if (
      // window.confirm("Bạn có muốn cập nhật trạng thái đơn hàng không ?") ===
      // true
      await showConfirmPurch()
    ) {
      try {
        await axios
          .put(`/order/update-status/${id}`, {
            orderStatus: status,
          })
          .then((data) => {
            handleLoadCartProductById(CANCEL_STATUS);
            handleClose();
          })
          .catch((error) => {});
      } catch (err) {
        console.log(err);
      }
    }
  };

  // ----------------------------------------------------------------

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
    width: "100%",
    padding: "16px 0",
    marginBottom: "20px",
    fontSize: "17px",
    border: "none",
    backgroundColor: "#efeff5",
    color: "black",
    cursor: "pointer",
  };

  const selectedButtonStyle = {
    ...buttonStyle,
    backgroundColor: "rgb(255 87 34 / 22%)",
  };

  const numberToVND = (number) => {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const statusList = [
    "Chờ xác nhận",
    "Đã thanh toán",
    "Yêu cầu huỷ",
    "Đang giao hàng",
    "Đã nhận hàng",
    "Huỷ",
  ];

  return (
    <>
      <Header />
      <h1 style={{ textAlign: "center", marginTop: "100px" }}>ĐƠN HÀNG</h1>
      <Grid container>
        {statusList.map((value) => {
          return (
            <Grid item xs={12 / statusList.length}>
              <button
                className="button-status"
                style={
                  selectedStatus === value ? selectedButtonStyle : buttonStyle
                }
                onClick={(e) => handleLoadCartProductById(value)}
              >
                {value}
              </button>
            </Grid>
          );
        })}
      </Grid>

      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell align="center">Người nhận hàng</TableCell>
              <TableCell align="center">Địa chỉ</TableCell>
              <TableCell align="center">Ngày đặt hàng</TableCell>
              <TableCell align="center">Tổng giá trị</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableCell
                colSpan={6}
                style={{ textAlign: "center", fontWeight: "bold" }}
              >
                KHÔNG CÓ SẢN PHẨM TRONG MỤC NÀY
              </TableCell>
            ) : (
              data.map((value, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={(e) => handleViewOrderDetail(value._id)}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="center">{value.recipientName}</TableCell>
                  <TableCell align="center">{value.deliveryAddress}</TableCell>
                  <TableCell align="center">
                    <DateFormat date={value.updatedAt} />
                  </TableCell>
                  <TableCell align="center">
                    {numberToVND(value.totalPrice)}
                  </TableCell>
                  <TableCell align="center">{value.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
              <Table sx={{ width: "100%" }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell children>STT</TableCell>
                    <TableCell align="left">Mã đơn hàng</TableCell>
                    <TableCell align="left">Tên sản phẩm</TableCell>
                    <TableCell align="left">Số lượng</TableCell>
                    <TableCell align="left">Giá</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderDetail.map((value, index) => {
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="left">{value.orderId}</TableCell>
                        <TableCell align="left">
                          {value.productId !== null ? (
                            <Button
                              onClick={() => handleFeedBack(value.product._id)}
                              variant="text"
                              sx={{p:0, color:"#121212", textTransform:"none"}}
                            >
                              {value.product.productName}
                            </Button>
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell align="left">{value.quantity}</TableCell>
                        <TableCell align="left">
                          {numberToVND(value.price)}
                        </TableCell>
                        <TableCell align="left">
                          {status === "Đã nhận hàng" ? (
                            <ButtonCustomize
                              onClick={() => handleFeedBack(value.product._id)}
                              nameButton="Đánh giá"
                              variant="contained"
                              sx={{ marginTop: "8px" }}
                            />
                          ) : (
                            ""
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
          </DialogContent>
          {status === DEFAULT_STATUS ? (
            <DialogActions>
              <Button
                variant="contained"
                margin="normal"
                color="primary"
                onClick={() => handleRemoveOrder(id, "Huỷ")}
              >
                Huỷ đặt hàng
              </Button>
            </DialogActions>
          ) : status === "Đã thanh toán" ? (
            <DialogActions>
              <Button
                variant="contained"
                margin="normal"
                color="primary"
                onClick={() => handleRemoveOrder(id, "Yêu cầu huỷ")}
              >
                Yêu cầu hủy
              </Button>
            </DialogActions>
          ) : (
            ""
          )}
        </Box>
      </Modal>
    </>
  );
}
