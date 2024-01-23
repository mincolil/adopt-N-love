import React from "react";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { Button, IconButton, Tooltip } from "@mui/material";
import { NavLink } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";

const FooterContainer = styled("footer")(({ theme }) => ({
  background: "linear-gradient(to right, #86CBE8, #DFDC9F, #E0A9E9, #CBC0EC)",
  color: "#000",
  padding: theme.spacing(6, 0),
}));

const LinkWrapper = styled("ul")(({ theme }) => ({
  margin: theme.spacing(1, 0),
  padding: "0",
  listStyle: "none",
}));

const FooterLink = styled(Link)(({ theme }) => ({
  margin: theme.spacing(1, 1.5),
  color: "#000",
  textDecoration: "none",
}));

const Footer = () => {
  return (
    <FooterContainer>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Dịch vụ chăm sóc thú cưng
            </Typography>
            <Typography variant="h6" component="h1">
              Địa chỉ: Hoà lạc - Thạch thất - Hà Nội
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Liên hệ
            </Typography>
            <LinkWrapper>
              <Tooltip title="Facebook">
                <NavLink to="https://www.facebook.com/honghanh0404">
                  <IconButton size="small" sx={{ ml: 2 }}>
                    <FacebookIcon sx={{ width: 32, height: 32 }}></FacebookIcon>
                    <Typography variant="h6" component="h1">
                      Facebook
                    </Typography>
                  </IconButton>
                </NavLink>
              </Tooltip>
            </LinkWrapper>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Về chúng tôi
            </Typography>
            <Typography
              variant="h6"
              component={NavLink}
              to="/introduce-homepage"
              sx={{ textDecoration: "none", color: "black" }}
            >
              Giới thiệu
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Hỗ trợ
            </Typography>
            <Typography variant="h6" component="h1">
              Số điện thoại liên hệ: 0969176706
            </Typography>
          </Grid>
        </Grid>
        {/* <Typography
          variant="body2"
          color="inherit"
          align="center"
          sx={{ mt: 2 }}
        >
          {"© "}
          Copy right
          {"."}
        </Typography> */}
      </Container>
    </FooterContainer>
  );
};

export default Footer;
