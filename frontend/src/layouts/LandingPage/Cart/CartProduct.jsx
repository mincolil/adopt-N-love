import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./styled/CartProduct.css";
import {
  Box,
  Container,
  Breadcrumbs,
  Link,
  Typography,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import dayjs from "dayjs";
import Grid from "@mui/material/Unstable_Grid2";
import { notification, Space } from 'antd';

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';

export default function CartProduct() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loged, setLoged] = useState(false);
  const [total, setTotal] = useState(0);

  const context = useAuth();

  const [quantity, setQuantity] = useState(1);

  const numberToVND = (number) => {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  //ant notify
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, des) => {
    api[type]({
      message: 'Notification Title',
      description: des,
    });
  };

const { confirm } = Modal;
const showConfirmRemove = () => {
  return new Promise((resolve, reject) => {
    confirm({
      title: 'Xác nhận',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn có muốn xoá sản phẩm này khỏi giỏ hàng không ?',
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

  // -----------------------HANDLE INCREASE QUANTITY-----------------------
  const handleIncreaseQuantity = async (product) => {
    if (product.quantity < product.productId.quantity) {
      try {
        const increaseCart = await axios.put(
          `http://localhost:3500/cartProduct/update-cart`,
          {
            productId: product.productId._id,
            quantity: product.quantity + 1,
          },
          {
            headers: { Authorization: context.auth.token },
            withCredentials: true,
          }
        );
        if (increaseCart.error) {
          toast.error(increaseCart.error);
        } else {
          handleLoadCartProduct();
          context.handleLoadCartProduct();
        }
      }
      catch (err) {
        console.log(err);
      }
    } else {
      openNotificationWithIcon('error', 'Số lượng sản phẩm không đủ')
    }
  };

  const handleDecreaseQuantity = async (product) => {
    if (product.quantity > 1) {
      try {
        const descreaseCart = await axios.put(
          `http://localhost:3500/cartProduct/update-cart`,
          {
            productId: product.productId._id,
            quantity: product.quantity - 1,
          },
          {
            headers: { Authorization: context.auth.token },
            withCredentials: true,
          }
        );
        if (descreaseCart.error) {
          toast.error(descreaseCart.error);
        } else {
          handleLoadCartProduct();
          context.handleLoadCartProduct();
        }
      }
      catch (err) {
        console.log(err);
      }
    } else {
      openNotificationWithIcon('error', 'Số lượng sản phẩm không thể bằng 0')
    }
  };

  const handleCheckOut = async () => {
    context.auth.fullname = data[0].userId.fullname;
    data[0].userId.address !== undefined
      ? (context.auth.address = data[0].userId.address)
      : (context.auth.address = "");
    data[0].userId.phone !== undefined
      ? (context.auth.phone = data[0].userId.phone)
      : (context.auth.phone = "");
    navigate("/product-checkout");
  };

  const handleLoadCartProduct = async () => {
    if (context.auth.token !== undefined) {
      setLoged(true);
      try {
        const loadData = await axios.get(
          `http://localhost:3500/cartProduct/view-cart`,
          {
            headers: { Authorization: context.auth.token },
            withCredentials: true,
          }
        );
        if (loadData.error) {
          toast.error(loadData.error);
        } else {
          setData(loadData.data);
          let totalPrice = 0;
          for (let i = 0; i < loadData.data.length; i++) {
            if (
              loadData.data[i].productId.discount !== 0 &&
              dayjs().isBetween(
                dayjs(loadData.data[i].productId.saleStartTime),
                dayjs(loadData.data[i].productId.saleEndTime)
              )
            ) {
              totalPrice +=
                loadData.data[i].quantity *
                (loadData.data[i].productId.price -
                  (loadData.data[i].productId.price *
                    loadData.data[i].productId.discount) /
                  100);
            } else {
              totalPrice +=
                loadData.data[i].quantity * loadData.data[i].productId.price;
            }
          }
          setTotal(totalPrice);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    handleLoadCartProduct();
  }, []);

  const handleDeleteOrder = async (id) => {
    // window.confirm("Bạn có chắc muốn xoá sản phẩm này không ?") === true
    if (await showConfirmRemove() ) {
      try {
        await axios
          .delete(`http://localhost:3500/cartProduct/remove-from-cart/${id}`, {
            headers: { Authorization: context.auth.token },
            withCredentials: true,
          })
          .then((data) => {
            handleLoadCartProduct();
            context.handleLoadCartProduct();
            toast.success("Xoá sản phẩm thành công");
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <toastContainer />
      <Header />
      {contextHolder}
      <Container
        sx={{ position: "relative", top: "120px", marginBottom: "150px" }}
      >
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<KeyboardDoubleArrowRightIcon fontSize="small" />}
        >
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            href="/"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="medium" />
            Trang chủ
          </Link>
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="#000000"
            href="/cart-product"
          >
            Giỏ hàng
          </Link>
        </Breadcrumbs>
        <Box className="main-content-cart">
          <Typography variant="h3" className="custom_blog_title">
            Giỏ hàng
          </Typography>
          <Box className="shoppingcart-content">
            <TableContainer>
              <Table className="shop_table">
                {/* <TableHead>
                  <TableRow>
                    <TableCell className="product-remove"></TableCell>
                    <TableCell className="product-thumbnail"></TableCell>
                    <TableCell className="product-name"></TableCell>
                    <TableCell className="product-price"></TableCell>
                    <TableCell className="product-quantity"></TableCell>
                    <TableCell className="product-subtotal"></TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody sx={{ border: "1px solid #f1f1f1" }}>
                  {data.map((product, index) => (
                    <TableRow key={index} className="cart_item">
                      <TableCell className="product-thumbnail">
                        <img
                          src={product.productId.productImage}
                          alt={product.productId.productName}
                          className="attachment-shop_thumbnail size-shop_thumbnail wp-post-image"
                        />
                      </TableCell>
                      <TableCell className="product-name" data-title="Product">
                        <Typography variant="body1">
                          {product.productId.productName}
                        </Typography>
                      </TableCell>
                      <TableCell
                        className="product-quantity"
                        data-title="Quantity"
                      >
                        <Box sx={{ width: "120px" }}>
                          <IconButton
                            aria-label="decrease quantity"
                            onClick={() => handleDecreaseQuantity(product)}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <input
                            type="text"
                            data-step="1"
                            data-min="0"
                            value={product.quantity}
                            title="Qty"
                            className="input-quantity"
                            size="4"
                          />
                          <IconButton
                            aria-label="increase quantity"
                            onClick={() => handleIncreaseQuantity(product)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell
                        className="product-subtotal"
                        data-title="Subtotal"
                      >
                        {
                          product.productId.discount !== 0
                            &&
                            dayjs().isBetween(dayjs(product.productId.saleStartTime), dayjs(product.productId.saleEndTime))
                            ?
                            (
                              <>
                                <Grid item xs style={{ display: 'flex' }}>
                                  <Typography style={{ textDecoration: "line-through" }}>
                                    {
                                      product.productId === null ? ""
                                        : product.productId.discount === 0 ? ""
                                          : numberToVND(product.quantity * product.productId.price)
                                    }
                                  </Typography>
                                  <Typography style={{ color: '#ff5722' }}>
                                    {
                                      product.productId === null ? ""
                                        :
                                        numberToVND(product.quantity * (product.productId.price - (product.productId.price * product.productId.discount) / 100))
                                    }
                                  </Typography>
                                </Grid>
                              </>
                            )
                            :
                            (
                              <>
                                <Grid item xs style={{ display: 'flex' }}>
                                  <Typography style={{ color: '#ff5722' }}>
                                    {
                                      product.productId === null ? ""
                                        :
                                        numberToVND(product.quantity * product.productId.price)
                                    }
                                  </Typography>
                                </Grid>
                              </>
                            )
                        }
                        <span className="woocommerce-Price-currencySymbol">
                          VND
                        </span>
                      </TableCell>
                      <TableCell className="product-remove">
                        <DeleteIcon
                          fontSize="large"
                          onClick={(e) =>
                            handleDeleteOrder(product.productId._id)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="actions" colSpan={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          className="coupon"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Typography
                            variant="subtitle1"
                            className="coupon_code"
                          >
                            Nhập mã:
                          </Typography>
                          <TextField
                            type="text"
                            className="input-text"
                            placeholder="Promotion code here"
                            sx={{
                              marginLeft: "15px",
                              marginRight: "8px",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "15px",
                              },
                            }}
                            InputProps={{
                              endAdornment: (
                                <IconButton>
                                  <ArrowForwardIcon />
                                </IconButton>
                              ),
                            }}
                          />
                        </Box>

                        <Box
                          className="order-total"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Typography variant="h3">Tổng:</Typography>
                          <Typography variant="h3" className="total-price">
                            {total} VND
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box className="control-cart">
              {data.length === 0 ? (
                <Button
                  variant="outlined"
                  className="button btn-continue-shopping"
                  sx={{
                    marginRight: "20px",
                    backgroundColor: "#ffcdd2"
                  }}
                >
                  Không có sản phẩm trong giỏ hàng
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    className="button btn-continue-shopping"
                    sx={{ marginRight: "20px" }}
                    href="/product-homepage"
                  >
                    Tiếp tục mua sắm
                  </Button>
                  <Button
                    variant="outlined"
                    className="button btn-cart-to-checkout"
                    onClick={() => handleCheckOut()}
                    sx={{ backgroundColor: "#a5d6a7" }}
                  >
                    Thanh toán
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}