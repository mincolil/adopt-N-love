import * as React from "react";
import Card from "@mui/material/Card";
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
import useAuth from "../../../hooks/useAuth";
import { NavLink } from "react-router-dom";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { CardActionArea, IconButton, TextField, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import DropDownService from "../../../components/DropDown/DropDownService";
import ProductNameCus from "../../../components/Typography/ProductNameCus";

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

// const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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

const numberToVND = (number) => {
  return number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const CustomContainer = styled(Container)({
  background:
    "linear-gradient(to bottom, #F4BEB2, #F4BEB2, #ECDAD6, #E5E6E7, #73A1CC)",
});

export default function ProductList() {
  const [data, setData] = useState([]);

  const [totalProducts, setTotalProducts] = useState(0);
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

  // ----------------------------------- API GET ALL PRODUCT --------------------------------
  useEffect(() => {
    loadAllProduct(currentPage);
  }, []);

  const loadAllProduct = async (page) => {
    try {
      const loadData = await axios.get(
        `${BASE_URL}/product?page=${page}&limit=9`
      );
      if (loadData.error) {
        toast.error(loadData.error);
      } else {
        setTotalPages(loadData.data.pages);
        // console.log("Check totalPage", totalPages);
        setData(loadData.data.docs);
        setTotalProducts(loadData.data.limit);
        // console.log(loadData.data.docs);
        setCurrentPage(loadData.data.page);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // --------------------- Click paging -----------------------------
  const [categoryId, setCategoryId] = useState("");
  const handlePageClick = (event, value) => {
    setCurrentPage(value);
    if (categoryId) {
      // console.log(categoryId);
      hanldeClickCategory(value, categoryId);
    } else if (keyword.trim()) {
      searchProductByName(value);
    } else {
      // console.log(categoryId);
      loadAllProduct(value);
    }
  };
  // ----------------------------------------------------------------

  const handleAddToCart = async (id) => {
    if (context.auth.token === undefined) {
      toast.warning("Bạn chưa đăng nhập, vui lòng đăng nhập !");
    } else {
      try {
        const addProductToCart = await axios
          .post(
            `${BASE_URL}/cartProduct/add-to-cart`,
            {
              productId: id,
              quantity: 1,
            },
            {
              headers: { Authorization: context.auth.token },
              withCredentials: true,
            }
          )
          .then((data) => {
            toast.success("Thêm sản phẩm vào giỏ hàng thành công");
            context.handleLoadCartProduct();
            // console.log(context.auth);
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  // --------------------- GET ALL CATEGORY PRODUCT -----------------------------
  const [category, setCategory] = useState([]);
  async function loadAllCategoryProduct() {
    try {
      const loadDataCategoryProduct = await axios.get(
        `http://localhost:3500/category?categoryName=Sản phẩm`
      );
      if (loadDataCategoryProduct.error) {
        toast.error(loadDataCategoryProduct.error);
      } else {
        setCategory(loadDataCategoryProduct.data.docs);
        // console.log(loadDataCategoryProduct.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadAllCategoryProduct();
  }, []);

  // --------------------- GET ALL PRODUCT BY CATEGORY ID PRODUCT -----------------------------
  async function hanldeClickCategory(page, cateId) {
    // console.log("Check data cate ID", cateId);
    setCategoryId(cateId);
    if (cateId == undefined || cateId == "") {
      loadAllProduct(currentPage);
    } else {
      try {
        const loadData = await axios.get(
          `http://localhost:3500/product?page=${page}&categoryId=${cateId}&limit=9`
        );
        if (loadData.error) {
          toast.error(loadData.error);
        } else {
          // console.log("Check loaddata", loadData.data);
          setTotalPages(loadData.data.pages);
          // console.log("Check totalPage", totalPages);
          setData(loadData.data.docs);
          setTotalProducts(loadData.data.limit);
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

  // --------------------- Hanlde Search -----------------------------
  const [keyword, setKeyword] = useState("");

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearchClick = async () => {
    if (keyword.trim() === "") {
      toast.warning("Hãy nhập kết quả bạn cần tìm");
      loadAllProduct(currentPage);
    } else {
      searchProductByName();
    }
  };

  // ----------------------------------- GET ALL PRODUCTS BY PRODUCT NAME --------------------------------
  const searchProductByName = async (page) => {
    try {
      const loadData = await axios.get(
        `${BASE_URL}/product?product=${keyword.trim()}&page=${page}&limit=9`
      );
      if (loadData.data.error) {
        toast.warning(
          "Kết quả " +
            "[" +
            keyword +
            "]" +
            " bạn vừa tìm không có! Vui lòng nhập lại. "
        );
        loadAllProduct(currentPage);
      } else {
        setData(loadData.data.docs);
        setTotalProducts(loadData.data.limit);
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

      <CustomContainer component="main" maxWidth="full" sx={{ pt: 9 }}>
        <MainPost
          sx={{
            bgcolor: "background.paper",
            p: 3,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            borderEndStartRadius: "5px",
            borderEndEndRadius: "5px",
          }}
          post={mainPost}
        />
        <Container
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
              <StyledBreadcrumb label="Sản phẩm" />
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

          <Box>
            <DropDownService
              category={category}
              cateName="Loại sản phẩm"
              handUpdateEditTable={hanldeClickCategory}
              page={1}
            />
          </Box>
        </Container>

        <Container sx={{ py: 8 }}>
          {/* End hero unit */}
          <Grid container spacing={4}>
            {data &&
              data.map((value, index) => {
                return (
                  <Grid hover item key={index} xs={12} sm={6} md={4}>
                    <CardActionArea>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                        }}
                      >
                        <Card
                          key={index}
                          onMouseOver={() => handleMouseOver(index)}
                          onMouseOut={handleMouseOut}
                          style={{ display: "inline-block", margin: "10px" }}
                        >
                          <CardMedia
                            component={NavLink}
                            to={`/product-homepage/${value._id}`}
                            src={
                              value.productImage !== undefined
                                ? `${value.productImage}`
                                : "https://previews.123rf.com/images/bybochka/bybochka1510/bybochka151000200/46365274-pet-care-flat-icon-set-pet-care-banner-background-poster-concept-flat-design-vector-illustration.jpg?fj=1"
                            }
                            sx={{
                              border: "none",
                              backgroundImage: `url(${
                                isHovered === index
                                  ? `${value.productImage}`
                                  : `${value.productImage}`
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
                                to={`/product-homepage/${value._id}`}
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

                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h5" component="h1">
                            <NavLink
                              to={`/product-homepage/${value._id}`}
                              style={{
                                textDecoration: "none",
                                color:
                                  isHoveredName === index ? "pink" : "inherit",
                              }}
                              title={value.productName}
                              onMouseOver={() => handleMouseOverName(index)}
                              onMouseOut={handleMouseOutName}
                            >
                              <ProductNameCus value={value} />
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
                            {value.quantity !== 0 ? (
                              <Tooltip
                                title="Thêm vào giỏ hàng"
                                onClick={() => handleAddToCart(value._id)}
                                sx={{ backgroundColor: "pink" }}
                              >
                                <IconButton>
                                  <AddShoppingCartIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Typography>HẾT HÀNG</Typography>
                            )}
                          </Box>
                          <Typography>
                            SỐ LƯỢNG CÒN: {value.quantity}
                          </Typography>
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

      {/* End footer */}
      <Footer />
    </ThemeProvider>
  );
}
