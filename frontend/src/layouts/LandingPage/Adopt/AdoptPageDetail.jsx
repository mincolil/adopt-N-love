import React, { useState, useEffect } from "react";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import Grid from "@mui/material/Unstable_Grid2";
import styled from "styled-components";
import Avatar1 from "../../../images/avatar1.png";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { toast } from "react-toastify";
import { Typography, 
    Container, 
    Button, 
    Box, 
    Avatar,
    Breadcrumbs,
    Link } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import HomeIcon from "@mui/icons-material/Home";
import "./styled/AdoptPageDetail.css"

const AdoptPageDetail = () => {
  return (
    <>
      <ToastContainer />
      <Header />

      <Container sx={{ position: "relative", top: "120px", marginBottom: "150px" }}>
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
            href="/product-homepage"
          >
            Nhận nuôi
          </Link>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="#000000"
          >
            Thú cưng
          </Typography>
        </Breadcrumbs>
        <Box className="content-details">
          <Grid container>
            <Grid item xl={5} lg={5}>
              <Box>
                <img
                  className="img_zoom"
                  src={
                    "https://previews.123rf.com/images/bybochka/bybochka1510/bybochka151000200/46365274-pet-care-flat-icon-set-pet-care-banner-background-poster-concept-flat-design-vector-illustration.jpg?fj=1"
                  }
                  alt="img"
                  style={{ width: "-webkit-fill-available" }}
                />
              </Box>
            </Grid>
            <Grid item xl={7} lg={7} className="details-infor">
              <Typography variant="h1" className="adopt-name">
                Buu
              </Typography>
              <Typography variant="h3" className="adopt-detail">
                Giống:
                <span> Mèo ta</span>
              </Typography>
              <Typography variant="h3" className="adopt-detail">
                Màu sắc:
                <span> Trắng</span>
              </Typography>
              <Typography variant="h3" className="adopt-detail">
                Tuổi:
                <span> Nhí</span>
              </Typography>
              <Typography variant="h3" className="adopt-detail">
                Cân nặng:
                <span> 1.5</span>
              </Typography>
              <Typography variant="h3" className="adopt-detail">
                Giới tính:
                <span> Cái</span>
              </Typography>
              <Typography variant="h3" className="adopt-detail">
                Mã:
                <span> B4311</span>
              </Typography>
              
              <Box className="adopt-add-to-cart">
                <Button
                  className="single-adopt-add-to-cart"
                  variant="contained"
                  color="primary"
                >
                  Nhận nuôi
                </Button>
                <Button
                  className="adopt-ask"
                  variant="contained"
                  color="primary"
                >
                  Bạn có câu hỏi ?
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

    </>
  );
};

export default AdoptPageDetail;
