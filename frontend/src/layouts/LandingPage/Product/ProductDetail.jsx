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
  Chip,
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
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Comments from "../../../components/Comments/Comments";

const BASE_URL = "http://localhost:3500";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));


const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantitySell, setQuantitySell] = useState(1);
  const [expanded, setExpanded] = useState("panel1");
  const context = useAuth();

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

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Header />
      <Container>
        <Breadcrumbs aria-label="breadcrumb" sx={{ position: "relative", top: "120px" }}>
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
                >
                  Thêm vào giỏ hàng
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              <strong> Đánh giá sản phẩm</strong>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Comments value={product._id} />
          </AccordionDetails>
        </Accordion>

      </Container>
      <Footer />
    </>
  );
};

export default ProductDetail;
