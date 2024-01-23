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
// import { Description } from "@mui/icons-material";
// import TypographyCus from "../Typography/DescriptionCus";
import ChoosePet from "./ModalChoosePet";
import useAuth from "../../hooks/useAuth";
import CommentService from "../Comments/CommentsService";

const Image = styled("img")({
  maxWidth: "100%",
  maxHeight: 400,
});

const ServiceDetail = ({ open, onClose, service }) => {
  const [quantitySell, setQuantitySell] = useState(1);
  const context = useAuth();

  const handleIncreaseClick = () => {
    setQuantitySell((quantitySell) => quantitySell + 1);
  };

  const handleDecreaseClick = () => {
    setQuantitySell((quantitySell) => Math.max(quantitySell - 1, 1));
  };

  // --------------------- GET DETAIL SERVICE BY ID -----------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({});

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };
  const handleAddToCartClick = () => {
    if (context.auth.token === undefined) {
      alert("Bạn chưa đăng nhập, vui lòng đăng nhập !");
    } else {
      // console.log("Check data", service);
      setSelectedService(service);
      setIsModalOpen(true);
    }
  };

  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!service) {
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
    serviceName,
    description,
    price,
    rating,
    // reviews,
    _id,
    serviceImage,
  } = service;

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
                serviceImage !== undefined
                  ? `${serviceImage}`
                  : "https://mcdn.coolmate.me/uploads/November2021/spa-thu-cung-la-gi-24.jpg"
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
              <strong>{serviceName}</strong>
            </Typography>
            <Typography variant="h5">
              <strong>{`${price} VNĐ`}</strong>
            </Typography>
            <Box>
              <Rating
                value={rating}
                precision={0.5}
                readOnly
                emptyIcon={<StarBorderIcon sx={{ fontSize: "1.5rem" }} />}
                halfIcon={<StarHalfIcon sx={{ fontSize: "1.5rem" }} />}
                icon={<StarIcon sx={{ fontSize: "1.5rem" }} />}
              />
            </Box>
            <Typography variant="body1">Số lượng:</Typography>
            <Box display="flex" alignItems="center">
              <Button onClick={handleDecreaseClick} variant="outlined">
                -
              </Button>
              <Box mx={2}>{quantitySell}</Box>
              <Button onClick={handleIncreaseClick} variant="outlined">
                +
              </Button>
            </Box>
            <Button
              onClick={handleAddToCartClick}
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
            Thông tin chi tiết dịch vụ
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
            Đánh giá dịch vụ
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CommentService value={_id} />
        </AccordionDetails>
      </Accordion>

      <ChoosePet
        open={isModalOpen}
        onClose={handleCloseEditModal}
        service={selectedService}
      />
    </Dialog>
  );
};

export default ServiceDetail;
