import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useState, useEffect } from "react";
// Axios
import axios from "axios";
import { toast } from "react-toastify";

//@material-ui/core
import { styled } from "@mui/material/styles";
import TypographyCus from "../../../components/Typography/DescriptionCus";
import Footer from "../../../components/Footer/Footer";
import MainPost from "../../../components/MainPost/MainPost";
import ServiceDetail from "../../../components/Modal/ModalDetaiService";
import { NavLink } from "react-router-dom";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  Avatar,
  CardActionArea,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import DropDownService from "../../../components/DropDown/DropDownService";
import ChoosePet from "../../../components/Modal/ModalChoosePet";
import useAuth from "../../../hooks/useAuth";
import dayjs from "dayjs";
import ServiceNameCus from "../../../components/Typography/ServiceNameCus";

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

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const BASE_URL = "http://localhost:3500";

const mainPost = {
  title: "Dịch vụ chăm sóc thú cưng",
  description:
    "Tại PetCare, đội ngũ bác sĩ của chúng tôi được đào tạo để nâng cao năng lực chuyên môn và làm việc tại bệnh viện với cơ sở vật chất hiện đại nhằm duy trì tiêu chuẩn cao trong công tác chăm sóc sức khỏe vật nuôi",
  image: "https://toplist.vn/images/800px/-795198.jpg",
  imageText: "Ảnh",
};

const numberToVND = (number) => {
  return number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const CustomBox = styled(Box)({
  background: "linear-gradient(to right, #ADD8E6, #FFFF99, #FFC0CB)",
});

const CustomContainer = styled(Container)({
  background:
    "linear-gradient(to bottom, #F4BEB2, #F4BEB2, #ECDAD6, #E5E6E7, #73A1CC)",
});

export default function ServiceList() {
  const [data, setData] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const context = useAuth();

  // --------------------- HOVER -----------------------------
  const [isHovered, setIsHovered] = useState(null);
  const [isHoveredName, setIsHoveredName] = useState(null);

  const handleMouseOver = (index) => {
    setIsHovered(index);
  };

  const handleMouseOut = () => {
    setIsHovered(null);
  };

  const handleMouseOverName = (index) => {
    setIsHoveredName(index);
  };

  const handleMouseOutName = () => {
    setIsHoveredName(null);
  };

  // ----------------------------------- API GET ALL SERVICE --------------------------------
  useEffect(() => {
    loadAllService(currentPage);
  }, []);

  const loadAllService = async (page) => {
    try {
      const loadData = await axios.get(
        `${BASE_URL}/service?page=${page}&limit=9&status=true`
      );
      if (loadData.error) {
        toast.error(loadData.error);
      } else {
        // console.log("check data", loadData.data.docs);
        setTotalPages(loadData.data.pages);
        // console.log("Check totalPage", totalPages);
        setData(loadData.data.docs);
        setTotalServices(loadData.data.limit);
        // console.log(loadData.data);
        setCurrentPage(loadData.data.page);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // --------------------- GET ALL CATEGORY SERVICE -----------------------------
  const [category, setCategory] = useState([]);
  async function loadAllCategoryService() {
    try {
      const loadData = await axios.get(
        `http://localhost:3500/category/cateName/Dịch vụ`
      );
      if (loadData.error) {
        toast.error(loadData.error);
      } else {
        setCategory(loadData.data.data);
        // console.log(loadData.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadAllCategoryService();
  }, []);

  // --------------------- GET ALL SERVICE BY CATEGORY ID SERVICE -----------------------------
  async function hanldeClickCategory(page, cateId) {
    // console.log("Check data cate ID", cateId);
    setCategoryId(cateId);
    if (cateId === undefined || cateId == "") {
      loadAllService(currentPage);
    } else {
      try {
        const loadData = await axios.get(
          `http://localhost:3500/service?page=${page}&categoryId=${cateId}&status=true&limit=9`
        );
        if (loadData.error) {
          toast.error(loadData.error);
        } else {
          // console.log("Check loaddata", loadData.data);
          setTotalPages(loadData.data.pages);
          // console.log("Check totalPage", totalPages);
          setData(loadData.data.docs);
          setTotalServices(loadData.data.limit);
          setCurrentPage(loadData.data.page);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    hanldeClickCategory();
  }, []);

  // --------------------- GET DETAIL SERVICE BY ID -----------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalChoosePetOpen, setIsModalChoosePetOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({});
  const handleShowDetail = (serviceId) => {
    // console.log("Check data", serviceId);
    setSelectedService(serviceId);
    setIsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setIsModalChoosePetOpen(false);
    setSelectedService(null);
  };

  // ----------------------------------- API GET ALL PET BY USER ID--------------------------------
  const [dataPet, setDataPet] = useState([]);
  useEffect(() => {
    loadAllPetByUserId();
  }, [context.auth.id]);

  const loadAllPetByUserId = async () => {};

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
          setTotalPages(loadDataPet.data.pages);
          // console.log("Check totalPage", totalPages);
          // setData(loadDataPet.data.docs);

          setDataPet(loadDataPet.data);
          setIsModalChoosePetOpen(true);
          setSelectedService(serviceId);
          if (serviceId !== undefined) {
            context.auth.serviceId = serviceId;
          }

          console.log("Kiểm tra pet của người dùng", loadDataPet.data);
        }
      } catch (err) {
        console.log(err);
      }
      // console.log("Check data id", serviceId);
      // setSelectedService(serviceId);
    }
  };

  // --------------------- Hanlde Search -----------------------------
  const [keyword, setKeyword] = useState("");

  // --------------------- Click paging -----------------------------
  const [categoryId, setCategoryId] = useState("");
  const handlePageClick = (event, value) => {
    setCurrentPage(value);
    if (categoryId) {
      // console.log(categoryId);
      hanldeClickCategory(value, categoryId);
    } else if (keyword.trim()) {
      searchServiceByName(value);
    } else {
      // console.log(categoryId);
      loadAllService(value);
    }
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearchClick = async () => {
    if (keyword.trim() === "") {
      toast.warning("Hãy nhập kết quả bạn cần tìm");
      loadAllService(currentPage);
    } else {
      searchServiceByName();
    }
  };

  // ----------------------------------- GET ALL SERVICE BY SERVICE NAME --------------------------------
  const searchServiceByName = async (page) => {
    try {
      const loadData = await axios.get(
        `${BASE_URL}/service?service=${keyword.trim()}&page=${page}&limit=9`
      );
      if (loadData.data.error) {
        toast.warning(
          "Kết quả " +
            "[" +
            keyword +
            "]" +
            " bạn vừa tìm không có! Vui lòng nhập lại."
        );
        loadAllService(currentPage);
      } else {
        setData(loadData.data.docs);
        setTotalServices(loadData.data.limit);
        setTotalPages(loadData.data.pages);
        // console.log(loadData.data);
        setCurrentPage(loadData.data.page);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <CustomContainer component="main" maxWidth="full" sx={{ mt: 8 }}>
        <MainPost post={mainPost} />
        <Box
          maxWidth="full"
          sx={{
            bgcolor: "background.paper",
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            borderEndStartRadius: "5px",
            borderEndEndRadius: "5px",
            alignItems: "center",
          }}
        >
          <Box>
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
            </Breadcrumbs>
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Tìm kiếm"
              margin="normal"
              size="small"
              value={keyword}
              onChange={handleKeywordChange}
              // sx={{ position: "fixed" }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearchClick}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Box
            sx={{
              justifyContent: "center",
            }}
          >
            <DropDownService
              category={category}
              cateName="Loại dịch vụ"
              handUpdateEditTable={hanldeClickCategory}
              page={1}
            />
          </Box>
        </Box>

        <Container sx={{ py: 8 }}>
          {/* End hero unit */}
          <Grid container spacing={4}>
            {data &&
              data.map((value, index) => {
                return (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <CardActionArea>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Card
                          key={index}
                          onMouseOver={() => handleMouseOver(index)}
                          onMouseOut={handleMouseOut}
                          style={{
                            display: "inline-block",
                            margin: "10px",
                            position: "relative",
                          }}
                        >
                          <CardMedia
                            component={NavLink}
                            to={`/service-homepage/${value._id}`}
                            src={
                              value.serviceImage !== undefined
                                ? `${value.serviceImage}`
                                : "https://previews.123rf.com/images/bybochka/bybochka1510/bybochka151000200/46365274-pet-care-flat-icon-set-pet-care-banner-background-poster-concept-flat-design-vector-illustration.jpg?fj=1"
                            }
                            sx={{
                              border: "none",
                              backgroundImage: `url(${
                                isHovered === index
                                  ? `${value.serviceImage}`
                                  : `${value.serviceImage}`
                              })`,
                              backgroundSize: "cover",
                              height: "200px",
                              filter:
                                isHovered === index
                                  ? "brightness(50%)"
                                  : "brightness(100%)",
                              transition: "filter 0.3s ease-in-out",
                            }}
                          >
                            {value.discount !== 0 &&
                            dayjs().isBetween(
                              dayjs(value.saleStartTime),
                              dayjs(value.saleEndTime)
                            ) ? (
                              <Card
                                style={{
                                  position: "absolute",
                                  top: "0px",
                                  right: "0px",
                                  fontSize: "18px",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  component="h2"
                                  sx={{
                                    color: "#fff",
                                    backgroundColor: "#ee4d2d",
                                    fontSize: "1rem",
                                    borderRadius: "2px",
                                    padding: "2px 4px",
                                    fontWeight: "800",
                                    whiteSpace: "nowrap",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {value.discount}%
                                </Typography>
                              </Card>
                            ) : (
                              ""
                            )}

                            {isHovered === index && (
                              <IconButton
                                title="Xem chi tiết"
                                component={NavLink}
                                to={`/service-homepage/${value._id}`}
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  backgroundColor: "white",
                                  backgroundColor: "pink",
                                }}
                              >
                                <SearchIcon />
                              </IconButton>
                            )}
                          </CardMedia>
                        </Card>

                        <CardContent hover sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h5"
                            component="h1"
                            title="Xem chi tiết dịch vụ"
                          >
                            <NavLink
                              to={`/service-homepage/${value._id}`}
                              style={{
                                textDecoration: "none",
                                color:
                                  isHoveredName === index ? "pink" : "inherit",
                              }}
                              title={value.serviceName}
                              onMouseOver={() => handleMouseOverName(index)}
                              onMouseOut={handleMouseOutName}
                            >
                              <ServiceNameCus value={value} />
                            </NavLink>
                          </Typography>

                          <Box
                            display="flex"
                            flexGrow={1}
                            sx={{ justifyContent: "space-between" }}
                          >
                            {value.discount !== 0 &&
                            dayjs().isBetween(
                              dayjs(value.saleStartTime),
                              dayjs(value.saleEndTime)
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
                                  {numberToVND(value.price)}
                                </Typography>
                                <Typography
                                  gutterBottom
                                  variant="h6"
                                  component="h2"
                                  sx={{ color: "red" }}
                                >
                                  {numberToVND(
                                    value.price -
                                      (value.price * value.discount) / 100
                                  )}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography
                                gutterBottom
                                variant="h6"
                                component="h2"
                                sx={{ color: "red" }}
                              >
                                {numberToVND(value.price)}
                              </Typography>
                            )}

                            <Tooltip
                              title="Thêm vào giỏ dịch vụ"
                              onClick={() => handleAddToCartClick(value._id)}
                              sx={{ backgroundColor: "pink" }}
                            >
                              <IconButton>
                                <AddShoppingCartIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          <TypographyCus value={value} />
                        </CardContent>
                      </Card>
                    </CardActionArea>
                  </Grid>
                );
              })}
          </Grid>
          {/* Paging */}
          <Container
            maxWidth="full"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              m: 2,
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                onChange={handlePageClick}
                page={currentPage}
                color="primary"
              />
            </Stack>
          </Container>
        </Container>
      </CustomContainer>

      <ServiceDetail
        open={isModalOpen}
        onClose={handleCloseEditModal}
        service={selectedService}
      />
      {/* Choose pet */}
      <ChoosePet
        open={isModalChoosePetOpen}
        onClose={handleCloseEditModal}
        service={selectedService}
        pet={dataPet}
        loadData={handleAddToCartClick}
      />
      {/* End footer */}
      <Footer />
    </ThemeProvider>
  );
}
