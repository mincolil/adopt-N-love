import "./LandingPage.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import * as React from "react";
import { Grid, Typography, Container, Button, Box } from "@mui/material";
import styled from "styled-components";

const DsButton = styled(Button)`
  text-transform: none !important;
`;

function Home() {
  return (
    <>
      <Header />
      <Grid
        container
        sx={{
          backgroundImage:
            'url("https://preview.colorlib.com/theme/anipat/img/banner/banner.png.webp")',
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
              Contact us
            </Button>
          </Grid>
        </Container>
        <Box
          sx={{ position: "absolute", zIndex: "1", right: "0", bottom: "-15%" }}
        >
          <img
            src="https://preview.colorlib.com/theme/anipat/img/banner/dog.png.webp"
            alt=""
            style={{ maxWidth: "80%" }}
          />
        </Box>
      </Grid>
    </>
  );
}

export default Home;
