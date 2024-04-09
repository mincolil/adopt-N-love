import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import {
  Container,
  Typography,
  Link,
  Button,
  Box,
  Breadcrumbs,
  Tabs,
  Tab,
  TextField,
  Rating,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Grid from "@mui/material/Unstable_Grid2";
import "./styled/ServiceDetail.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ChoosePet from "../../../components/Modal/ModalChoosePet";
import dayjs from "dayjs";
import Comments from "../../../components/Comments/Comments";
import FloatingDogImage from "../../../components/Floater/FloatingDogImage";

const BASE_URL = "";

const numberToVND = (number) => {
  return number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

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

const ServiceDetail = () => {
  const [dataPet, setDataPet] = useState([]);
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({});
  const [tab, setTab] = useState(0);
  const context = useAuth();

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  // ----------------------------------- API GET SERVICE BY ID --------------------------------
  useEffect(() => {
    loadServiceById();
  }, []);

  const loadServiceById = async () => {
    try {
      const loadData = await axios.get(`${BASE_URL}/service/${serviceId}`);
      if (loadData.error) {
        toast.error(loadData.error);
      } else {
        setService(loadData.data);
        // console.log(loadData.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!service) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  // --------------------- GET DETAIL SERVICE BY ID -----------------------------

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleAddToCartClick = async (serviceId) => {
    if (context.auth.token === undefined) {
      toast.warning("Bạn chưa đăng nhập, vui lòng đăng nhập !");
    } else {
      try {
        const loadDataPet = await axios.post(
          `/pet/booking`,
          {
            userId: context.auth.id,
            serviceId: serviceId,
          }
        );
        if (loadDataPet.error) {
          toast.error(loadDataPet.error);
        } else {
          // setData(loadDataPet.data.docs);

          setDataPet(loadDataPet.data);
          setIsModalOpen(true);
          setSelectedService(serviceId);
          if (serviceId !== undefined) {
            context.auth.serviceId = serviceId;
          }

          // console.log("Kiểm tra pet của người dùng", loadDataPet.data);
        }
      } catch (err) {
        console.log(err);
      }
      // console.log("Check data id", serviceId);
      // setSelectedService(serviceId);
    }
  };

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
            color="inherit"
            href="/service-homepage"
          >
            Dịch vụ
          </Link>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="#000000"
          >
            {service && service.serviceName}
          </Typography>
        </Breadcrumbs>
        <Box className="content-details">
          <Grid container>
            <Grid item xl={5} lg={5}>
              <Box>
                <img
                  className="img_zoom"
                  src={
                    service && service.serviceImage !== undefined
                      ? `${service.serviceImage}`
                      : "https://previews.123rf.com/images/bybochka/bybochka1510/bybochka151000200/46365274-pet-care-flat-icon-set-pet-care-banner-background-poster-concept-flat-design-vector-illustration.jpg?fj=1"
                  }
                  alt="img"
                  style={{ width: "-webkit-fill-available" }}
                />
              </Box>
            </Grid>
            <Grid item xl={7} lg={7} className="details-infor">
              <Typography variant="h1" className="product-title">
                {service && service.serviceName}
              </Typography>
              {/* <Box className="stars-rating">
              <Box className="star-rating">
                <span className="star-5"></span>
              </Box>
              <Typography variant="body2" className="count-star">
                (7)
              </Typography>
            </Box> */}
              {service.discount !== 0 &&
                dayjs().isBetween(
                  dayjs(service.saleStartTime),
                  dayjs(service.saleEndTime)
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
                    {numberToVND(service.price)}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    style={{ color: "#ff5722" }}
                  >
                    {numberToVND(
                      service.price - (service.price * service.discount) / 100
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
                    {service.discount}% Giảm
                  </Typography>
                </Box>
              ) : (
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  style={{ color: "#ff5722" }}
                >
                  {numberToVND(service.price)}
                </Typography>
              )}
              <Box className="product-details-description">
                <Typography variant="body2">
                  {service && service.description}
                </Typography>
              </Box>
              <Box className="quantity-add-to-cart">
                <Button
                  className="single_add_to_cart_button"
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCartClick(service._id)}
                >
                  Đăng ký dịch vụ
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
            <Tab label="Chi tiết dịch vụ" />
            <Tab label="Đánh giá dịch vụ" />
          </Tabs>
          <TabPanel value={tab} index={0}>
            <Typography paragraph>{service && service.description}</Typography>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Comments value={service._id} />
          </TabPanel>
        </Box>
        {/* Choose Pet */}
        <ChoosePet
          open={isModalOpen}
          onClose={handleCloseEditModal}
          service={selectedService}
          pet={dataPet}
          loadData={handleAddToCartClick}
        />
      </Container>
      <Footer />
      <FloatingDogImage />
    </>
  );
};

export default ServiceDetail;
