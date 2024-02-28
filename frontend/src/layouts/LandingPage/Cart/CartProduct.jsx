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
import Grid from "@mui/material/Unstable_Grid2";
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

export default function CartProduct() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loged, setLoged] = useState(false);
  const [total, setTotal] = useState(0);

  const context = useAuth();

  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
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
          // console.log(loadData.data);
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

  console.log(data);

  return (
    <>
      <Header />
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
                            onClick={handleDecreaseQuantity}
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
                            onClick={handleIncreaseQuantity}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell
                        className="product-subtotal"
                        data-title="Subtotal"
                      >
                        {product.productId.price}
                        <span className="woocommerce-Price-currencySymbol">
                          VND
                        </span>
                      </TableCell>
                      <TableCell className="product-remove">
                        <DeleteIcon fontSize="large" />
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
              <Button
                variant="outlined"
                className="button btn-continue-shopping"
                sx={{marginRight: "20px"}}
              >
                Tiếp tục mua sắm
              </Button>
              <Button
                variant="outlined"
                className="button btn-cart-to-checkout"
              >
                Thanh toán
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
