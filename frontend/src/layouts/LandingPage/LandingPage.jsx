import "./LandingPage.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import React, { useState, useEffect } from "react";
import { Typography, Button, Container, Box, Avatar } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import Grid from "@mui/material/Unstable_Grid2";
import Carousel from "react-material-ui-carousel";
import Banner from "../../images/banner.png";
import DogBanner from "../../images/dog_banner.png";
import ServiceIcon1 from "../../images/service_icon_1.png";
import ServiceIcon2 from "../../images/service_icon_2.png";
import ServiceIcon3 from "../../images/service_icon_3.png";
import Cat from "../../images/cat.png";
import AdaptIcon1 from "../../images/adapt_icon_1.png";
import AdaptIcon2 from "../../images/adapt_icon_2.png";
import Avatar1 from "../../images/avatar1.png";
import { ToastContainer } from "react-toastify";
import { notification, Space } from "antd";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import FloatingDogImage from "../../components/Floater/FloatingDogImage";
import { Alert } from "antd";

const BASE_URL = "";

const onClose = (e) => {
  console.log(e, "I was closed.");
};

const Counter = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count < target) {
        setCount(count + 1);
      } else {
        clearInterval(interval);
      }
    }, 60); // Thời gian tăng số (60ms)
    return () => clearInterval(interval);
  }, [count, target]);

  return (
    <Typography variant="h3" className="counter">
      {count}
    </Typography>
  );
};

const testimonials = [
  {
    name: "Minh Du",
    title: "Head of web design",
    testimonial:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exerci.",
    img: "https://scontent.fhan18-1.fna.fbcdn.net/v/t1.6435-9/171149322_2868980396694590_5496657584718677655_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=PowdbT7vA94AX9BjArj&_nc_ht=scontent.fhan18-1.fna&oh=00_AfCosvICIsbgK21DzE912hDS6lyixRI0d5Yd3rDtfFEHSg&oe=661A2C3B",
  },
  {
    name: "Nguyen Minh Hieu",
    title: "Head of web design",
    testimonial:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exerci.",
    img: "https://preview.colorlib.com/theme/anipat/img/testmonial/1.png.webp",
  },
  {
    name: "Dang Huy",
    title: "Head of web design",
    testimonial:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exerci.",
    img: "https://preview.colorlib.com/theme/anipat/img/testmonial/1.png.webp",
  },
];

function Home() {
  const context = useAuth();
  const [hasDiscount, setHasDiscount] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/pet/userId?id=${context.auth.id}`
        );
        const count = res.data.docs.filter((pet) => pet.discount > 0).length;
        setHasDiscount(count > 0);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [context.auth.id]);

  const [api, contextHolder] = notification.useNotification();

  //--------------------------------------------LOAD PAGE
  const { auth } = context;

  return (
    <>
      <Header />
      {hasDiscount && (
        <div
          style={{
            position: "fixed",
            bottom: "180px",
            right: "10px",
            zIndex: "9999",
          }}
        >
          <Alert
            message="Thú cưng của bạn có ưu đãi!"
            description="Hãy kiểm tra ngay"
            type="success"
            showIcon
            closable
            onClose={onClose}
            style={{
              width: "250px",
            }}
          />
        </div>
      )}
      <ToastContainer />
      {contextHolder}
      <Grid
        className="banner"
        container
        sx={{
          backgroundImage: `url(${Banner})`,
          backgroundSize: "cover",
          backgroundRepeat: "round",
          height: "600px",
          position: "relative",
          top: "80px",
        }}
        item="true"
      >
        <Container
          sx={{ display: "flex", flexWrap: "wrap", alignContent: "center" }}
        >
          <Grid item xs={12} md={4} sx={{ color: "#fff" }}>
            <Typography
              variant="h3"
              sx={{
                lineHeight: "1.3",
                fontWeight: "lighter",
                fontFamily: "'Open Sans', sans-serif",
                fontSize: "4rem",
              }}
            >
              Chăm sóc
              <br /> Nhận nuôi
            </Typography>
            <Typography
              sx={{
                marginTop: "20px",
                marginBottom: "40px",
                fontFamily: "'Open Sans', sans-serif",
              }}
            >
              Chúng tôi chăm sóc thú cưng của bạn với dịch vụ tốt nhất <br />{" "}
              Nhận nuôi nhưng chú chó và mèo cần tìm một mái nhà mới
            </Typography>
            <Button variant="contained">Liên hệ</Button>
          </Grid>
        </Container>
        <Box
          sx={{ position: "absolute", zIndex: "1", right: "0", bottom: "-15%" }}
        >
          <img src={DogBanner} alt="" style={{ maxWidth: "80%" }} />
        </Box>
      </Grid>
      <Container className="service">
        <Grid container justifyContent="center">
          <Grid item lg={7} md={10}>
            <Box className="section_title">
              <Typography variant="h3">
                Trải nghiệm những dịch vụ của chúng tôi
              </Typography>
              <Typography variant="h4">
                Việc chăm sóc bệnh nhân là rất quan trọng, bệnh nhân sẽ được
                bệnh nhân theo dõi, nhưng đó là thời điểm vô cùng đau đớn và khổ
                sở.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" spacing={3}>
          <Grid className="single_service" item md={3}>
            <Box className="service_thumb">
              <Box className="service_icon">
                <img src={ServiceIcon1} alt="" />
              </Box>
            </Box>
            <Box className="service_content">
              <Typography variant="h3">Nhận nuôi</Typography>
              <Typography variant="h4">
                Giúp đỡ những con vật nhỏ có ngôi nhà để ở, chúng xứng đáng có được tình yêu thương
              </Typography>
            </Box>
          </Grid>
          <Grid className="single_service" item md={3}>
            <Box className="service_thumb">
              <Box className="service_icon">
                <img src={ServiceIcon2} alt="" />
              </Box>
            </Box>
            <Box className="service_content">
              <Typography variant="h3">Dịch vụ</Typography>
              <Typography variant="h4">
                Cung cấp dịch vụ chăm sóc thú cưng tốt nhất, giúp chúng khỏe mạnh và hạnh phúc
              </Typography>
            </Box>
          </Grid>
          <Grid className="single_service" item md={3}>
            <Box className="service_thumb">
              <Box className="service_icon">
                <img src={ServiceIcon3} alt="" />
              </Box>
            </Box>
            <Box className="service_content">
              <Typography variant="h3">Sản phẩm</Typography>
              <Typography variant="h4">
                Cung cấp các sản phẩm chăm sóc thú cưng tốt nhất, giúp chúng khỏe mạnh và hạnh phúc
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box className="adapt_area">
        <Container>
          <Grid container justifyContent={"space-between"}>
            <Grid item lg={4}>
              <Box className="adapt_help">
                <Box className="section_title">
                  <Typography variant="h3">
                    <span>Chúng tôi cần bạn</span> <br />
                    giúp chúng tôi nhận nuôi
                  </Typography>
                  <Typography variant="h4">
                    Những con vật đáng thương này chưa có gia đình để chăm sóc,
                    chúng xứng đáng có được tình yêu thương. Đó là một điêu
                    tuyệt vời
                  </Typography>
                  <Button
                    href="https://www.facebook.com/profile.php?id=61558254325214&mibextid=LQQJ4d&locale=vi_VN"
                    variant="contained"
                    className="btn-aboutUs"
                  >
                    Liên hệ
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item lg={6}>
              <Box className="adapt_about">
                <Grid container alignItems="center" spacing={4}>
                  <Grid item lg={6} md={6}>
                    <Box className="single_adapt text-center">
                      <img src={AdaptIcon1} alt="" />
                      <Box className="adapt_content">
                        <Counter target={20} /> 
                        <Typography variant="h4">Thú cưng cần nhận nuôi</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item lg={6} md={6}>
                    <Box className="single_adapt text-center">
                      <img src={AdaptIcon1} alt="" />
                      <Box className="adapt_content">
                        <Counter target={30} />
                        <Typography variant="h4">Dịch vụ</Typography>
                      </Box>
                    </Box>
                    <Box className="single_adapt text-center">
                      <img src={AdaptIcon2} alt="" />
                      <Box className="adapt_content">
                        <Counter target={20} /> 
                        <Typography variant="h4">Sản phẩm</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className="pet_care_area">
        <Container>
          <Grid container alignItems="center">
            <Grid item lg={5} md={5}>
              <Box className="pet_thumb">
                <img src={Cat} alt="" />
              </Box>
            </Grid>
            <Grid item lg={6} lgOffset={1} mdOffset={1} md={6}>
              <Box className="pet_info">
                <Typography variant="h3">
                  <span>Chúng tôi cần các bạn </span> <br /> nhận nuôi chúng
                </Typography>
                <Typography variant="h4">
                  Những con vật đáng thương này chưa có gia đình để chăm sóc{" "}
                  <br /> chúng xứng đáng có được tình yêu thương. <br /> Đó là
                  một điêu tuyệt vời <br />
                  viverra maecenas accumsan.
                </Typography>
                <Button
                  href="about.html"
                  variant="contained"
                  className="btn-aboutUs"
                >
                  Liên hệ
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className="testmonial_area">
        <Container>
          <Grid container justifyContent="center">
            <Grid item lg={10}>
              <Carousel>
                {testimonials.map((testimonial, index) => (
                  <Box key={index} className="single_testmonial">
                    <Avatar
                      src={Avatar1}
                      alt=""
                      sx={{
                        marginRight: "25px",
                        width: "130px",
                        height: "auto",
                      }}
                    />
                    <Box className="test_content">
                      <Typography variant="h3">{testimonial.name}</Typography>
                      <Typography variant="h4">{testimonial.title}</Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontSize: "18px",
                          color: "#66666f",
                          lineHeight: "35px",
                          textAlign: "justify",
                        }}
                      >
                        {testimonial.testimonial}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Carousel>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <div>
        <FloatingDogImage />
      </div>
      <Footer />
    </>
  );
}

export default Home;
