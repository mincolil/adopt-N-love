import "./LandingPage.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import React, { useState, useEffect } from "react";
import { Typography, Container, Button, Box, Avatar } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Carousel from "react-material-ui-carousel";
import styled from "styled-components";
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

const DsButton = styled(Button)`
  text-transform: none !important;
`;

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
    name: "Jhon Walker",
    title: "Head of web design",
    testimonial:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exerci.",
    img: "https://preview.colorlib.com/theme/anipat/img/testmonial/1.png.webp",
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
  return (
    <>
      <Header />
      <ToastContainer />
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
                fontFamily: "'Poppins', sans-serif",
                fontSize: "4rem",
              }}
            >
              We Care <br />{" "}
              <span style={{ fontWeight: "800" }}>Your Pets</span>
            </Typography>
            <Typography
              sx={{
                marginTop: "20px",
                marginBottom: "40px",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur <br /> adipiscing elit,
              sed do eiusmod.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#fff",
                color: "#ff3500",
                borderRadius: "30px",
                padding: "17px 50px",
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Liên hệ
            </Button>
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
              <Typography variant="h3">Services for every dog</Typography>
              <Typography variant="h4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" spacing={3}>
          <Grid className="single_service" item md={3}>
            <Box className="service_thumb">
              <Box className="service_icon">
                <img
                  src={ServiceIcon1}
                  alt=""
                />
              </Box>
            </Box>
            <Box className="service_content">
              <Typography variant="h3">Pet Boarding</Typography>
              <Typography variant="h4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut
              </Typography>
            </Box>
          </Grid>
          <Grid className="single_service" item md={3}>
            <Box className="service_thumb">
              <Box className="service_icon">
                <img
                  src={ServiceIcon2}
                  alt=""
                />
              </Box>
            </Box>
            <Box className="service_content">
              <Typography variant="h3">Healthy Meals</Typography>
              <Typography variant="h4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut
              </Typography>
            </Box>
          </Grid>
          <Grid className="single_service" item md={3}>
            <Box className="service_thumb">
              <Box className="service_icon">
                <img
                  src={ServiceIcon3}
                  alt=""
                />
              </Box>
            </Box>
            <Box className="service_content">
              <Typography variant="h3">Pet Spa</Typography>
              <Typography variant="h4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box className="pet_care_area">
        <Container>
          <Grid container alignItems="center">
            <Grid item lg={5} md={5}>
              <Box className="pet_thumb">
                <img
                  src={Cat}
                  alt=""
                />
              </Box>
            </Grid>
            <Grid item lg={6} lgOffset={1} mdOffset={1} md={6}>
              <Box className="pet_info">
                <Typography variant="h3">
                  <span>We care your pet </span> <br /> As you care
                </Typography>
                <Typography variant="h4">
                  Lorem ipsum dolor sit, consectetur adipiscing elit, sed do{" "}
                  <br /> iusmod tempor incididunt ut labore et dolore magna
                  aliqua. <br /> Quis ipsum suspendisse ultrices gravida. Risus
                  commodo <br />
                  viverra maecenas accumsan.
                </Typography>
                <Button
                  href="about.html"
                  variant="contained"
                  className="btn-aboutUs"
                >
                  About Us
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className="adapt_area">
        <Container>
          <Grid container justifyContent={"space-between"}>
            <Grid item lg={4}>
              <Box className="adapt_help">
                <Box className="section_title">
                  <Typography variant="h3">
                    <span>We need your</span> <br />
                    help Adopt Us
                  </Typography>
                  <Typography variant="h4">
                    Lorem ipsum dolor sit, consectetur adipiscing elit, sed do
                    iusmod tempor incididunt ut labore et dolore magna aliqua.
                    Quis ipsum suspendisse ultrices.
                  </Typography>
                  <Button
                    href="contact.html"
                    variant="contained"
                    className="btn-aboutUs"
                  >
                    Contact Us
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item lg={6}>
              <Box className="adapt_about">
                <Grid container alignItems="center" spacing={4}>
                  <Grid item lg={6} md={6}>
                    <Box className="single_adapt text-center">
                      <img
                        src={AdaptIcon1}
                        alt=""
                      />
                      <Box className="adapt_content">
                        <Counter target={452} />
                        <Typography variant="h4">Pets Available</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item lg={6} md={6}>
                    <Box className="single_adapt text-center">
                      <img
                        src={AdaptIcon1}
                        alt=""
                      />
                      <Box className="adapt_content">
                        <Counter target={52} />
                        <Typography variant="h4">Pets Available</Typography>
                      </Box>
                    </Box>
                    <Box className="single_adapt text-center">
                      <img
                        src={AdaptIcon2}
                        alt=""
                      />
                      <Box className="adapt_content">
                        <Counter target={52} />
                        <Typography variant="h4">Pets Available</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
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
      <Footer />
    </>
  );
}

export default Home;
