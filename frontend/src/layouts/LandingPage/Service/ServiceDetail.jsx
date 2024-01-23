import { useParams } from "react-router-dom";
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
  Divider,
  Container,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Footer from "../../../components/Footer/Footer";
import { NavLink } from "react-router-dom";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { Description } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import { useEffect } from "react";
import ChoosePet from "../../../components/Modal/ModalChoosePet";
import ServiceSlider from "../../../components/Header/SliderService";
import dayjs from "dayjs";
import ButtonCustomize from "../../../components/Button/Button";
import CommentService from "../../../components/Comments/CommentsService";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

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

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const Image = styled("img")({
  maxWidth: "100%",
  maxHeight: 400,
});

const numberToVND = (number) => {
  return number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const CustomContainer = styled(Container)({
  background:
    "linear-gradient(to bottom, #F4BEB2, #F4BEB2, #ECDAD6, #E5E6E7, #73A1CC)",
});

const BASE_URL = "http://localhost:3500";

const defaultTheme = createTheme();

const ServiceDetail = () => {
  const [dataPet, setDataPet] = useState([]);
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [quantitySell, setQuantitySell] = useState(1);
  const [expanded, setExpanded] = useState("panel1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({});
  const context = useAuth();

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

  const handleIncreaseClick = () => {
    setQuantitySell((quantitySell) => quantitySell + 1);
  };

  const handleDecreaseClick = () => {
    setQuantitySell((quantitySell) => Math.max(quantitySell - 1, 1));
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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
          `http://localhost:3500/pet/booking`,
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
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <CustomContainer component="main" maxWidth="full" sx={{ pt: 12 }}>
        {/* <MainPost post={mainPost} /> */}
        <Container
          maxWidth="full"
          sx={{
            bgcolor: "background.paper",
            p: 3,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            borderRadius: "16px",
          }}
        >
          <Breadcrumbs maxItems={2} aria-label="breadcrumb">
            <StyledBreadcrumb
              component={NavLink}
              to="/"
              label="Trang chủ"
              icon={<HomeIcon fontSize="small" />}
            />
            {/* <StyledBreadcrumb component="a" href="#" label="Catalog" /> */}
            <StyledBreadcrumb
              component={NavLink}
              to="/service-homepage"
              label="Dịch vụ"
            />
            <StyledBreadcrumb label="Thông tin chi tiết dịch vụ" />
          </Breadcrumbs>
        </Container>
        <Grid container spacing={1} sx={{ flexGrow: 2 }}>
          <Grid item xs={12} sm={8}>
            <Container maxWidth="false" sx={{ pb: 3 }}>
              <Paper
                variant="outlined"
                sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
              >
                <Grid container spacing={2} sx={{ flexGrow: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Image
                      src={
                        service.serviceImage !== undefined
                          ? `${service.serviceImage}`
                          : "https://previews.123rf.com/images/bybochka/bybochka1510/bybochka151000200/46365274-pet-care-flat-icon-set-pet-care-banner-background-poster-concept-flat-design-vector-illustration.jpg?fj=1"
                      }
                      alt=""
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography
                      variant="h5"
                      sx={{ textTransform: "uppercase" }}
                    >
                      <strong>{service.serviceName}</strong>
                    </Typography>
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
                          sx={{ color: "red" }}
                        >
                          {numberToVND(
                            service.price -
                              (service.price * service.discount) / 100
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
                        sx={{
                          color: "red",
                        }}
                      >
                        {numberToVND(service.price)}
                      </Typography>
                    )}

                    <ButtonCustomize
                      onClick={() => handleAddToCartClick(service._id)}
                      variant="contained"
                      sx={{ marginTop: "8px" }}
                      nameButton="Đăng kí dịch vụ"
                    />
                  </Grid>
                </Grid>
                <Accordion
                  expanded={expanded === "panel1"}
                  onChange={handleChange("panel1")}
                  sx={{ marginTop: "20px" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography sx={{ width: "33%", flexShrink: 0 }}>
                      <strong>Thông tin chi tiết dịch vụ</strong>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>{service.description}</AccordionDetails>
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
                      <strong> Xem đánh giá địch vụ</strong>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <CommentService value={service._id} />
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </Container>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Container maxWidth="false" sx={{ pb: 3 }}>
              <Paper
                variant="outlined"
                sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
              >
                <Grid item xs={12} sm={12}>
                  <Typography variant="h5" sx={{ textTransform: "uppercase" }}>
                    <strong>Dịch vụ mới</strong>
                  </Typography>
                </Grid>
                <ServiceSlider loadServiceById={loadServiceById} />
              </Paper>
            </Container>
          </Grid>
        </Grid>
      </CustomContainer>

      {/* Choose Pet */}
      <ChoosePet
        open={isModalOpen}
        onClose={handleCloseEditModal}
        service={selectedService}
        pet={dataPet}
        loadData={handleAddToCartClick}
      />

      {/* End footer */}
      <Footer />
    </ThemeProvider>
  );
};

export default ServiceDetail;
