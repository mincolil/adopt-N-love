import { styled } from "@mui/material/styles";
import {
  Box,
  Grid,
  Typography,
  Button,
  Toolbar,
  AppBar,
  CircularProgress,
  Backdrop,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarIcon from "@mui/icons-material/Star";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Description } from "@mui/icons-material";
import TypographyCus from "../Typography/DescriptionCus";
import Comments from "../Comments/Comments";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";

const Image = styled("img")({
  maxWidth: "100%",
  maxHeight: 400,
});

const BASE_URL = "http://localhost:3500";

const ProductDetail = ({ open, onClose, product }) => {
  const [quantitySell, setQuantitySell] = useState(1);
  const context = useAuth();

  const handleIncreaseClick = () => {
    setQuantitySell(quantitySell + 1);
    // console.log(quantitySell);
  };

  const handleDecreaseClick = () => {
    setQuantitySell((quantitySell) => Math.max(quantitySell - 1, 1));
  };

  const handleAddToCartClick = () => {
    // console.log(`Add ${quantitySell} '${product?.productName}' to cart`);
  };

  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!product) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClose={onClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const {
    productName,
    quantity,
    price,
    rating,
    description,
    productImage,
    _id,
  } = product;

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
          });
      } catch (err) {
        // console.log(err);
        toast.error(err.response.data.error);
      }
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Chi tiết dịch vụ
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            color="inherit"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 2, padding: 12 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Image
              src={
                productImage !== undefined
                  ? `${productImage}`
                  : "https://cdnimg.vietnamplus.vn/uploaded/mtpyelagtpy/2018_11_30/pet_1.jpg"
              }
              alt=""
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
              <strong>{productName}</strong>
            </Typography>
            <Typography variant="h5">
              <strong>{`${price} VNĐ`}</strong>
            </Typography>
            <Typography variant="body1">Số lượng còn:{quantity}</Typography>

            <Typography variant="body1">Số lượng:</Typography>
            <Box display="flex" alignItems="center">
              <Button onClick={handleDecreaseClick} variant="outlined">
                -
              </Button>
              <Box mx={2}>{quantitySell}</Box>
              <Button onClick={(e) => handleIncreaseClick()} variant="outlined">
                +
              </Button>
            </Box>
            <Button
              onClick={() => handleAddToCart(_id)}
              variant="contained"
              sx={{ marginTop: "8px" }}
            >
              Thêm vào giỏ hàng
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Thông tin chi tiết sản phẩm
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{description}</AccordionDetails>
      </Accordion>
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
            Đánh giá sản phẩm
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Comments value={_id} />
        </AccordionDetails>
      </Accordion>
    </Dialog>
  );
};

export default ProductDetail;
