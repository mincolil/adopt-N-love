import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import {
  Container,
  Typography,
  Link,
  Button,
  Box,
  IconButton,
  Breadcrumbs,
  Tabs,
  Tab,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Grid from "@mui/material/Unstable_Grid2";
import "./styled/ProductDetail.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Comments from "../../../components/Comments/Comments";
import dayjs from "dayjs";

const BASE_URL = "http://localhost:3500";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const numberToVND = (number) => {
  return number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantitySell, setQuantitySell] = useState(1);
  const context = useAuth();
  const [tab, setTab] = useState(0);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  // ----------------------------------- API GET PRODUCT BY ID --------------------------------
  useEffect(() => {
    loadProductById();
  }, []);

  const loadProductById = async () => {
    try {
      const loadData = await axios.get(`${BASE_URL}/product/${productId}`);
      if (loadData.error) {
        toast.error(loadData.error);
      } else {
        setProduct(loadData.data);
        // console.log(loadData.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!product) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  // ---------------------HANDLE INCREASE AND DECREASE QUANTITY SELL---------------------
  const handleIncreaseClick = (max) => {
    if (quantitySell >= max) {
      toast.error("Quá giới hạn số lượng");
    } else {
      setQuantitySell((quantitySell) => quantitySell + 1);
    }
  };

  const handleDecreaseClick = () => {
    setQuantitySell((quantitySell) => Math.max(quantitySell - 1, 1));
  };


  const handleAddToCart = async (id) => {
    if (context.auth.token === undefined) {
      alert("Bạn chưa đăng nhập, vui lòng đăng nhập !");
    } else if (
      window.confirm("Bạn có muốn thêm sản phẩm này không ?") == true
    ) {
      try {
        const addProductToCart = await axios
          .post(
            `${BASE_URL}/cartProduct/add-to-cart`,
            {
              productId: id,
              quantity: quantitySell,
            },
            {
              headers: { Authorization: context.auth.token },
              withCredentials: true,
            }
          )
          .then((data) => {
            toast.success("Thêm sản phẩm vào giỏ hàng thành công");
            context.handleLoadCartProduct();
          });
      } catch (err) {
        // console.log(err);
        toast.error(err.response.data.error);
      }
    }
  };


  return (
    <>
      <ToastContainer />
      <Header />

      <Container sx={{ position: "relative", top: "120px", marginBottom: "150px" }}>
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
            color="inherit"
            href="/product-homepage"
          >
            Sản phẩm
          </Link>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="#000000"
          >
            {product && product.productName}
          </Typography>
        </Breadcrumbs>
        <Box className="content-details">
          <Grid container>
            <Grid item xl={5} lg={5}>
              <Box>
                <img
                  className="img_zoom"
                  src={
                    product && product.productImage !== undefined
                      ? `${product.productImage}`
                      : "https://previews.123rf.com/images/bybochka/bybochka1510/bybochka151000200/46365274-pet-care-flat-icon-set-pet-care-banner-background-poster-concept-flat-design-vector-illustration.jpg?fj=1"
                  }
                  alt="img"
                  style={{ width: "-webkit-fill-available" }}
                />
              </Box>
            </Grid>
            <Grid item xl={7} lg={7} className="details-infor">
              <Typography variant="h1" className="product-title">
                {product && product.productName}
              </Typography>
              <Typography variant="body2" className="availability">
                Số lượng còn:
                <Link href="#"> {product && product.quantity}</Link>
              </Typography>
              <Typography variant="body1" className="price">
                {product.discount !== 0 &&
                  dayjs().isBetween(
                    dayjs(product.saleStartTime),
                    dayjs(product.saleEndTime)
                  ) ? (
                  <Box
                    display="flex"
                    flexGrow={1}
                    sx={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h2"
                      sx={{
                        textDecoration: "line-through",
                        marginRight: "8px",
                        color: "gray",
                      }}
                    >
                      {numberToVND(product.price)}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h2"
                      style={{ color: '#ff5722' }}
                    >
                      {numberToVND(
                        product.price -
                        (product.price * product.discount) / 100
                      )}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h2"
                      sx={{
                        color: "#fff",
                        backgroundColor: "#ee4d2d",
                        marginLeft: "10px",
                        fontSize: ".75rem",
                        borderRadius: "2px",
                        padding: "2px 4px",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        textTransform: "uppercase",
                      }}
                    >
                      {product.discount}% Giảm
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    style={{ color: '#ff5722' }}
                  >
                    {numberToVND(product.price)}
                  </Typography>
                )}
              </Typography>
              <Box className="product-details-description">
                <Typography variant="body2">
                  {product && product.description}
                </Typography>
              </Box>
              <Box className="quantity-add-to-cart">
                <Box className="control">
                  <IconButton className="qtyminus quantity-minus" onClick={handleDecreaseClick}>
                    -
                  </IconButton>
                  <input
                    type="text"
                    data-step="1"
                    data-min="0"
                    value={quantitySell}
                    title="Qty"
                    className="input-quantity"
                    size="4"
                  />
                  <IconButton className="qtyplus quantity-plus" onClick={() => handleIncreaseClick(product.quantity)}>
                    +
                  </IconButton>
                </Box>
                <Button
                  className="single_add_to_cart_button"
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Thêm vào giỏ hàng
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box className="tab-details-product">
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            aria-label="product tabs"
            sx={{
              "& .MuiTabs-flexContainer": {
                justifyContent: "center",
              },
            }}
          >
            <Tab label="Chi tiết sản phẩm" />
            <Tab label="Đánh giá sản phẩm" />
          </Tabs>
          <TabPanel value={tab} index={0}>
            <Typography paragraph>{product && product.description}</Typography>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            {/* <Typography variant="h6" gutterBottom>
              1 review for <span>Glorious Eau</span>
            </Typography> */}
            {/* <Box className="comment">
              <Box className="comment-container">
                <Typography variant="subtitle1">
                  <strong>Nguyen Minh Hieu</strong> - <span>June 7, 2023</span>
                </Typography>
                <Typography paragraph>
                  Simple and effective design. One of my favorites.
                </Typography>
              </Box>
            </Box>
            <Box className="review_form_wrapper">
              <Box className="review_form">
                <Typography variant="h6" gutterBottom>
                  Add a review
                </Typography>
                <form className="comment-form-review">
                  <Typography className="comment-notes" gutterBottom>
                    Your email address will not be published. Required fields
                    are marked <span className="required">*</span>
                  </Typography>
                  <Box className="comment-form-rating">
                    <Typography>Your rating</Typography>
                    <Rating name="simple-controlled" />
                  </Box>
                  <TextField
                    id="review"
                    name="review"
                    label="Your review"
                    multiline
                    rows={4}
                    fullWidth
                    required
                  />
                  <TextField
                    id="name"
                    name="name"
                    label="Name"
                    fullWidth
                    required
                  />
                  <TextField
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    required
                  />
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </form>
              </Box>
            </Box> */}
            <Comments value={product._id} />
          </TabPanel>
        </Box>

      </Container>
      <Footer />
    </>
  );
};


export default ProductDetail;
