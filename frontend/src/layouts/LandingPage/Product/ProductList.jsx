import React, { useState, useEffect } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import {
  Typography,
  Container,
  Box,
  List,
  ListItem,
  Checkbox,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Pagination,
  Stack,
  Slider,
  Paper,
  InputBase,
  FormControl,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Unstable_Grid2";
import "./styled/ProductList.css";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import dayjs from "dayjs";
import FloatingDogImage from "../../../components/Floater/FloatingDogImage";

const BASE_URL = "http://localhost:3500";

const DsCheckbox = styled(Checkbox)`
  color: #eeeeee !important;
  &.Mui-checked {
    color: #000 !important;
  }
`;

const numberToVND = (number) => {
  return number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

function ProductItem({ product }) {
  const {
    _id,
    productName,
    quantity,
    price,
    productImage,
    discount,
    saleEndTime,
    saleStartTime,
  } = product;
  const [quantitySell, setQuantitySell] = useState(1);
  const context = useAuth();

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
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card className="product-card">
        <CardActionArea component={RouterLink} to={`/product-homepage/${_id}`}>
          <CardMedia
            component="img"
            height="200"
            image={productImage}
            alt={productName}
          />
          {discount !== 0 &&
            dayjs().isBetween(dayjs(saleStartTime), dayjs(saleEndTime)) ? (
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
                {discount}%
              </Typography>
            </Card>
          ) : (
            ""
          )}
          <CardContent sx={{ textAlign: "center" }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="product-title"
              style={{ color: "#838b8b" }}
            >
              {productName}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              className="product-price"
            >
              {discount !== 0 &&
                dayjs().isBetween(dayjs(saleStartTime), dayjs(saleEndTime)) ? (
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
                    {numberToVND(price)}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    style={{ color: "#ff5722" }}
                  >
                    {numberToVND(price - (price * discount) / 100)}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  style={{ color: "#ff5722" }}
                >
                  {numberToVND(price)}
                </Typography>
              )}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ justifyContent: "center" }}>
          <IconButton
            size="large"
            color="primary"
            aria-label="add to shopping cart"
            onClick={() => handleAddToCart(product._id)}
          >
            <AddShoppingCartIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default function ProductList() {
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (event) => {
    const { _id, checked } = event.target;
    setCheckedItems({ ...checkedItems, [_id]: checked });
  };

  const [data, setData] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 1000000]);
  const [sortBy, setSortBy] = React.useState("price-asc");

  // ----------------------------------- FILTER BY PRICE --------------------------------
  const handlePriceChange = (event, newValue) => {
    if (newValue) {
      const [minPrice, maxPrice] = newValue;
      const priceRange = maxPrice - minPrice;
      // Kiểm tra nếu price[0] không được kéo qua price[1]
      if (priceRange < 10000 && event.target === null) {
        if (event[0] < event[1]) {
          setPrice([event[0], event[0] + 10000]);
          filterProductsByPrice(event[0], event[0] + 10000);
        } else {
          setPrice([event[1] - 10000, event[1]]);
          filterProductsByPrice(event[1] - 10000, event[1]);
        }
      } else {
        // Đảm bảo price[0] không vượt qua price[1]
        if (minPrice !== price[0] || maxPrice !== price[1]) {
          setPrice(newValue);
          filterProductsByPrice(minPrice, maxPrice);
        }
      }
    }
  };

  async function filterProductsByPrice(minPrice, maxPrice) {
    if (price[0] === 0 && price[1] === 1000000) {
      loadAllProduct(currentPage);
    } else {
      try {
        const loadData = await axios.get(
          `http://localhost:3500/product?page=1&limit=12&minPrice=${minPrice}&maxPrice=${maxPrice}`
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
          console.log(`http://localhost:3500/product?page=1&limit=12&minPrice=${minPrice}&maxPrice=${maxPrice}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    handlePriceChange();
  }, []);

  // ----------------------------------- API SORT PRODUCT --------------------------------

  const handleSortChange = (event) => {
    if (event && event.target) {
      const selectedSort = event.target.value;
      setSortBy(selectedSort);
      // Gọi hàm để sort sản phẩm với giá trị mới
      filterProductsBySort(selectedSort);
    }
  };

  async function filterProductsBySort(sortOption) {
    let sortParam = "";
    switch (sortOption) {
      case "price-asc":
        sortParam = "asc";
        break;
      case "price-desc":
        sortParam = "desc";
        break;
      case "rating":
        sortParam = "rating";
        break;
      case "newest":
        sortParam = "newest";
        break;
      default:
        sortParam = "";
    }

    if (sortOption === "" && sortOption === undefined) {
      loadAllProduct(currentPage);
    } else {
      try {
        const loadData = await axios.get(
          `http://localhost:3500/product?sortPrice=${sortParam}`
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
    handleSortChange();
  }, []);

  // ----------------------------------- API GET ALL PRODUCT --------------------------------

  useEffect(() => {
    loadAllProduct(currentPage);
  }, []);

  const loadAllProduct = async (page) => {
    try {
      const loadData = await axios.get(
        `${BASE_URL}/product?page=${page}&limit=12`
      );
      if (loadData.error) {
        toast.error(loadData.error);
      } else {
        setTotalPages(loadData.data.pages);
        setData(loadData.data.docs);
        setTotalProducts(loadData.data.limit);
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

  // --------------------- GET ALL PRODUCT BY CATEGORY ID PRODUCT -----------------------------
  async function hanldeClickCategory(cateId) {
    // console.log("Check data cate ID", cateId);
    setCategoryId(cateId);
    if (cateId === undefined || cateId === "") {
      loadAllProduct(currentPage);
    } else {
      try {
        const loadData = await axios.get(
          `http://localhost:3500/product?page=1&categoryId=${cateId}&limit=12`
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchClick();
    }
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
        `${BASE_URL}/product?product=${keyword.trim()}&page=${page}&limit=12`
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

  return (
    <>
      <Header />
      <Container
        sx={{ position: "relative", top: "120px", paddingBottom: "200px" }}
      >
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ marginBottom: "30px" }}
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
            color="#000000"
            href="/product-homepage"
          >
            Sản phẩm
          </Link>
        </Breadcrumbs>
        <Grid container spacing={1}>
          <Grid item sm={12} md={3} lg={3} className="sidebar">
            <Box className="product_filter">
              <Box className="category">
                <Typography variant="h3" className="title">
                  Danh mục
                </Typography>
                <List className="list-categories">
                  {category.map((category, _id) => (
                    <ListItem key={_id} className="list-categories-item">
                      <Button
                        size="small"
                        onClick={() => hanldeClickCategory(category._id)}
                        className="list-categories-item"
                        variant="text"
                      >
                        {category.feature}
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box className="price">
                <Typography variant="h3" className="title">
                  Giá
                </Typography>
                <Box className="price-slider-wrapper">
                  <Slider
                    className="slider"
                    size="medium"
                    value={price}
                    onChange={handlePriceChange}
                    valueLabelDisplay="off"
                    aria-labelledby="range-slider"
                    getAriaValueText={(value) => `${value}`}
                    min={0}
                    max={1000000}
                    sx={{
                      color: "orange",
                      "& .MuiSlider-rail": {
                        backgroundColor: "orange",
                      },
                      "& .MuiSlider-track": {
                        backgroundColor: "#ff5722",
                      },
                      "& .MuiSlider-thumb": {
                        backgroundColor: "#ff5722",
                      },
                      "& .MuiSlider-valueLabel": {
                        backgroundColor: "#ff5722",
                        color: "black", // You can adjust the color of the value label text
                      },
                    }}
                  />
                  <Box className="price-slider-amount">
                    <Typography
                      variant="body1"
                      component="span"
                      className="from"
                    >
                      {price[0]}
                    </Typography>
                    <Typography variant="body1" component="span" className="to">
                      {price[1]}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box className="brand"></Box>
              <Box className="popular_tag"></Box>
            </Box>
          </Grid>
          <Grid item sm={12} md={9} lg={9} className="content-area">
            <Box className="site-main">
              <Typography variant="h3">Sản phẩm</Typography>
              <Grid container className="shop-top-control">
                <Grid item xl={9} lg={9}>
                  <Paper
                    component="form"
                    sx={{
                      p: "1px 4px",
                      display: "flex",
                      alignItems: "center",
                      width: "90%",
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Tìm sản phẩm ... "
                      value={keyword}
                      onChange={handleKeywordChange}
                      onKeyDown={handleKeyDown}
                    />
                    <IconButton
                      sx={{ p: "10px" }}
                      aria-label="search"
                      onClick={handleSearchClick}
                    >
                      <SearchIcon />
                    </IconButton>
                  </Paper>
                </Grid>
                <Grid item xl={3} lg={3}>
                  <FormControl fullWidth size="medium">
                    <Select
                      className="sort-by-select"
                      value={sortBy}
                      onChange={handleSortChange}
                      fullWidth
                    >
                      <MenuItem className="menu-item" value={"price-asc"}>
                        Giá: Thấp đến Cao
                      </MenuItem>
                      <MenuItem className="menu-item" value={"price-desc"}>
                        Giá: Cao đến Thấp
                      </MenuItem>
                      <MenuItem className="menu-item" value={"rating"}>
                        Đánh giá
                      </MenuItem>
                      <MenuItem className="menu-item" value={"newest"}>
                        Mới nhất
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                {!data || data.length === 0 ? (
                  <Typography variant="body1">
                    Không có sản phẩm tương ứng
                  </Typography>
                ) : (
                  data.map((product, index) => (
                    <ProductItem key={index} product={product} />
                  ))
                )}
              </Grid>
              <Stack
                spacing={2}
                sx={{ paddingTop: "20px", alignItems: "center" }}
              >
                <Pagination
                  count={totalPages}
                  onChange={handlePageClick}
                  page={currentPage}
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <div>
        <FloatingDogImage />
      </div>
    </>
  );
}
