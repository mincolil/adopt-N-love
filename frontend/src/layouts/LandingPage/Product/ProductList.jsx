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
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Pagination,
  Stack,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Grid from "@mui/material/Unstable_Grid2";
import "./ProductList.css";
import styled from "styled-components";

const DsCheckbox = styled(Checkbox)`
  color: #eeeeee !important;
  &.Mui-checked {
    color: #000 !important;
  }
`;

function ProductItem({ product }) {
  const { title, price } = product;
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card className="product-card">
        <CardActionArea>
          <CardMedia
            component="img"
            height="200"
            image="https://cdn.dummyjson.com/product-images/1/1.jpg"
            alt={title}
          />
          <CardContent sx={{ textAlign: "center" }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="product-title"
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              className="product-price"
            >
              ${price}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ justifyContent: "center" }}>
          <IconButton
            size="large"
            color="primary"
            aria-label="add to shopping cart"
          >
            <AddShoppingCartIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default function ProductList() {
  const [checkedItems, setCheckedItems] = useState({
    "New Arrival": false,
    Dining: false,
    Desks: false,
    Accents: false,
    Accessories: false,
    Tables: false,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems({ ...checkedItems, [name]: checked });
  };

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((data) => {
        const productList = data.products;
        setProducts(productList);
      })
      .catch((error) => {
        console.error("Đã xảy ra lỗi khi gọi API:", error);
      });
  }, []);

  return (
    <>
      <Header />
      <Container sx={{ position: "relative", top: "120px", paddingBottom: "200px" }}>
        <Grid container spacing={1}>
          <Grid item sm={12} md={3} lg={3} className="sidebar">
            <Box className="product_filter">
              <Box className="category">
                <Typography variant="h3" className="title">
                  Categories
                </Typography>
                <List className="list-categories">
                  {Object.keys(checkedItems).map((label) => (
                    <ListItem key={label} className="list-categories-item">
                      <FormControlLabel
                        control={
                          <DsCheckbox
                            size="small"
                            checked={checkedItems[label]}
                            onChange={handleCheckboxChange}
                            name={label}
                          />
                        }
                        label={label}
                        sx={{
                          fontSize: "12px",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box className="price"></Box>
              <Box className="brand"></Box>
              <Box className="popular_tag"></Box>
            </Box>
          </Grid>
          <Grid item sm={12} md={9} lg={9} className="content-area">
            <Box className="site-main">
              <Typography variant="h3">Products</Typography>
              <Box className="shop-top-control">
                <FormControl
                  variant="standard"
                  className="select-item select-form"
                >
                  <InputLabel id="select-items-label">Sort</InputLabel>
                  <Select
                    labelId="select-items-label"
                    id="select-items"
                    label="Sort"
                    defaultValue={1}
                    style={{ display: "none" }}
                  >
                    <MenuItem value={1}>12 Products/Page</MenuItem>
                    <MenuItem value={2}>9 Products/Page</MenuItem>
                    <MenuItem value={3}>10 Products/Page</MenuItem>
                    <MenuItem value={4}>8 Products/Page</MenuItem>
                    <MenuItem value={5}>6 Products/Page</MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  variant="standard"
                  className="filter-choice select-form"
                >
                  <InputLabel id="sort-by-label">Sort by</InputLabel>
                  <Select
                    labelId="sort-by-label"
                    id="sort-by"
                    label="Sort by"
                    defaultValue={1}
                    style={{ display: "none" }}
                  >
                    <MenuItem value={1}>Price: Low to High</MenuItem>
                    <MenuItem value={2}>Sort by popularity</MenuItem>
                    <MenuItem value={3}>Sort by average rating</MenuItem>
                    <MenuItem value={4}>Sort by newness</MenuItem>
                    <MenuItem value={5}>Sort by price: low to high</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Grid container spacing={2}>
                {currentProducts.map((product, index) => (
                  <ProductItem key={index} product={product} />
                ))}
              </Grid>
              <Stack spacing={2} sx={{ paddingTop: "20px", alignItems: "center" }}>
                <Pagination
                  count={Math.ceil(products.length / productsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
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
    </>
  );
}
