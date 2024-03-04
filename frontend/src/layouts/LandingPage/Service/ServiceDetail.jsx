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
  TextField,
  Rating,
  Chip,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Grid from "@mui/material/Unstable_Grid2";
//import "./styled/Servicedetail.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Comments from "../../../components/Comments/Comments";

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
              {/* <Box className="stars-rating">
              <Box className="star-rating">
                <span className="star-5"></span>
              </Box>
              <Typography variant="body2" className="count-star">
                (7)
              </Typography>
            </Box> */}
              <Typography variant="body2" className="availability">
                Số lượng còn:
                <Link href="#"> {product && product.quantity}</Link>
              </Typography>
              <Typography variant="body1" className="price">
                <span>{product && product.price} VND</span>
              </Typography>
              <Box className="product-details-description">
                <Typography variant="body2">
                  {product && product.description}
                </Typography>
              </Box>
              <Box className="quantity-add-to-cart">
                <Box className="control">
                  <IconButton className="qtyminus quantity-minus" href="#">
                    -
                  </IconButton>
                  <input
                    type="text"
                    data-step="1"
                    data-min="0"
                    value="1"
                    title="Qty"
                    className="input-quantity"
                    size="4"
                  />
                  <IconButton className="qtyplus quantity-plus" href="#">
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
            <Typography variant="h6" gutterBottom>
              1 review for <span>Glorious Eau</span>
            </Typography>
            <Box className="comment">
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
            </Box>
          </TabPanel>
        </Box>

      </Container>
      <Footer />
    </>
  );
};


export default ProductDetail;