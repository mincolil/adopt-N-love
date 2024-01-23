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
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useState, useEffect } from "react";
// Axios
import axios from "axios";
import { toast } from "react-toastify";

//@material-ui/core
import { styled } from "@mui/material/styles";
import Footer from "../../../components/Footer/Footer";
import MainPost from "../../../components/MainPost/MainPost";
import { NavLink } from "react-router-dom";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Avatar, CardActionArea, IconButton, Tooltip } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useAuth from "../../../hooks/useAuth";
import ContentCus from "../../../components/Typography/ContentCus";
import DateFormat from "../../../components/DateFormat";
import SearchIcon from "@mui/icons-material/Search";
import TitleCus from "../../../components/Typography/TitleCus";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

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

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const BASE_URL = "http://localhost:3500";

const mainPost = {
  title: "Sản phẩm dành cho thú cưng",
  description: "Cung cấp đầy đủ các loại sản phẩm hàng ngày dành cho thú cưng",
  image:
    "https://vuaphukienthucung.com/public/media/images/thiet-ke-hinh-anh-phu-kien-thu-cung-01.jpg",
  imageText: "Ảnh sản phẩm",
};

export default function BlogPage() {
  const [data, setData] = useState([]);

  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // --------------------- MODAL HANDLE -----------------------------
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataEditPet, setDataEditPet] = useState({});
  const context = useAuth();
  // console.log(context);

  // --------------------- HOVER -----------------------------
  const [isHovered, setIsHovered] = useState(null);
  const [isHoveredTitle, setIsHoveredTitle] = useState(null);

  const handleMouseOver = (index) => {
    setIsHovered(index);
  };

  const handleMouseOut = () => {
    setIsHovered(null);
  };

  const handleMouseOverTilte = (index) => {
    setIsHoveredTitle(index);
  };

  const handleMouseOutTilte = () => {
    setIsHoveredTitle(null);
  };

  // --------------------- OPEN MODAL  -----------------------------
  const handleCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleUpdatePet = (pet) => {
    // console.log("Check data", pet);
    setDataEditPet(pet);
    setOpenEditModal(true);
  };

  // --------------------- CLOSE MODAL  -----------------------------
  const handleCloseModal = () => {
    setOpenCreateModal(false);
    setOpenEditModal(false);
  };

  // ----------------------------------- API GET ALL BLOG --------------------------------
  useEffect(() => {
    loadAllBlog(currentPage);
  }, [currentPage]);

  const loadAllBlog = async (page) => {
    try {
      const loadData = await axios.get(`${BASE_URL}/blog?page=${page}&limit=9`);
      if (loadData.error) {
        toast.error(loadData.error);
      } else {
        setTotalPages(loadData.data.pages);
        // console.log("Check totalPage", totalPages);
        setData(loadData.data.docs);
        setTotalBlogs(loadData.data.limit);
        // console.log(loadData.data.docs);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //   --------------------- Click paging -----------------------------
  const handlePageClick = (event, value) => {
    setCurrentPage(value);
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
            <StyledBreadcrumb label="Tin tức" />
          </Breadcrumbs>
        </Container>

        <Container sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {data &&
              data.map((value, index) => {
                return (
                  <Grid item xs={12} sm={6} md={4}>
                    <CardActionArea>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          textDecoration: "none",
                        }}
                      >
                        <CardHeader
                          avatar={
                            <Avatar
                              sx={{ bgcolor: red[500] }}
                              aria-label="Ảnh người đăng"
                            >
                              Admin
                            </Avatar>
                          }
                          title={
                            <Typography variant="h5">
                              {value.userId !== null
                                ? value.userId.fullname
                                : ""}
                            </Typography>
                          }
                          subheader={<DateFormat date={value.createdAt} />}
                        />
                        <Card
                          key={index}
                          onMouseOver={() => handleMouseOver(index)}
                          onMouseOut={handleMouseOut}
                          style={{ display: "inline-block", margin: "10px" }}
                        >
                          <CardMedia
                            component={NavLink}
                            to={`/blog-homepage/${value._id}`}
                            src={
                              value.image !== undefined
                                ? `${value.image}`
                                : "https://cdnimg.vietnamplus.vn/uploaded/mtpyelagtpy/2018_11_30/pet_1.jpg"
                            }
                            sx={{
                              border: "none",
                              backgroundImage: `url(${
                                isHovered === index
                                  ? `${value.image}`
                                  : `${value.image}`
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
                            {isHovered === index && (
                              <IconButton
                                title="Xem chi tiết"
                                component={NavLink}
                                to={`/blog-homepage/${value._id}`}
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                                  backgroundColor: "pink",
                                }}
                              >
                                <SearchIcon />
                              </IconButton>
                            )}
                          </CardMedia>
                        </Card>

                        <CardContent>
                          <Typography variant="h7" component="h1">
                            <NavLink
                              to={`/blog-homepage/${value._id}`}
                              style={{
                                textDecoration: "none",
                                color:
                                  isHoveredTitle === index ? "pink" : "inherit",
                              }}
                              title={value.title}
                              onMouseOver={() => handleMouseOverTilte(index)}
                              onMouseOut={handleMouseOutTilte}
                            >
                              <TitleCus value={value} />
                            </NavLink>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <ContentCus value={value} />
                          </Typography>
                        </CardContent>
                        {/* <CardActions disableSpacing>
                          <IconButton aria-label="add to favorites">
                            <FavoriteIcon />
                          </IconButton>
                          <IconButton aria-label="share">
                            <ShareIcon />
                          </IconButton>
                        </CardActions> */}
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

      {/* End footer */}
      <Footer />
    </ThemeProvider>
  );
}
