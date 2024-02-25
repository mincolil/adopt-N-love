import React from "react";
import {
  Container,
  Typography,
  Box,
  Link,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import GoogleIcon from "@mui/icons-material/Google";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import "./Footer.css";
import Logo from "../../images/logo.png";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#f8f8f8" }}>
      <Box className="footer_top">
        <Container>
          <Grid container spacing={3}>
            <Grid item xl={3} md={3} lg={3}>
              <Box className="footer_widget">
                <Typography variant="h3" className="footer_title">
                  Contact Us
                </Typography>
                <List className="address_line">
                  <ListItem sx={{ paddingLeft: "0" }}>
                    <ListItemText
                      className="txtAddress"
                      primary="+555 0000 565"
                    />
                  </ListItem>
                  <ListItem sx={{ paddingLeft: "0" }}>
                    <ListItemButton
                      className="btnAddress"
                      component=""
                      href="#"
                      sx={{ paddingLeft: "0" }}
                    >
                      <ListItemText
                        className="txtAddress"
                        primary="nmhieu21@gmail.com"
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ paddingLeft: "0" }}>
                    <ListItemText
                      className="txtAddress"
                      primary="FPT University"
                    />
                  </ListItem>
                </List>
              </Box>
            </Grid>
            <Grid item xl={3} md={3} lg={3}>
              <Box className="footer_widget">
                <Typography variant="h3" className="footer_title">
                  Our Services
                </Typography>
                <List className="links">
                  <ListItem sx={{ paddingLeft: "0" }}>
                    <ListItemButton className="btnLinks" component="" href="#">
                      <ListItemText
                        className="txtLinks"
                        primary="Pet Insurance"
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ paddingLeft: "0" }}>
                    <ListItemButton className="btnLinks" component="" href="#">
                      <ListItemText
                        className="txtLinks"
                        primary="Pet surgeries"
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ paddingLeft: "0" }}>
                    <ListItemButton className="btnLinks" component="" href="#">
                      <ListItemText
                        className="txtLinks"
                        primary="Pet Adoption"
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ paddingLeft: "0" }}>
                    <ListItemButton className="btnLinks" component="" href="#">
                      <ListItemText
                        className="txtLinks"
                        primary="Dog Insurance"
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ paddingLeft: "0" }}>
                    <ListItemButton className="btnLinks" component="" href="#">
                      <ListItemText
                        className="txtLinks"
                        primary="Dog Insurance"
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Grid>
            <Grid item xl={3} md={3} lg={3}>
              <Box className="footer_widget">
                <Typography variant="h3" className="footer_title">
                  Quick Link
                </Typography>
                <List className="links">
                  <ListItem sx={{ paddingLeft: "0" }}>
                    <ListItemButton className="btnLinks" component="" href="#">
                      <ListItemText className="txtLinks" primary="About Us" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ paddingLeft: "0" }}>
                    <ListItemButton className="btnLinks" component="" href="#">
                      <ListItemText
                        className="txtLinks"
                        primary="Privacy Policy"
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ paddingLeft: "0" }}>
                    <ListItemButton className="btnLinks" component="" href="#">
                      <ListItemText
                        className="txtLinks"
                        primary="Terms of Service"
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ paddingLeft: "0" }}>
                    <ListItemButton className="btnLinks" component="" href="#">
                      <ListItemText className="txtLinks" primary="Login info" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ paddingLeft: "0" }}>
                    <ListItemButton className="btnLinks" component="" href="#">
                      <ListItemText
                        className="txtLinks"
                        primary="Knowledge Base"
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Grid>
            <Grid item xl={3} md={3} lg={3}>
              <Box className="footer_widget">
                <Box className="footer_logo" sx={{ marginBottom: "35px" }}>
                  <Link href="#">
                    <img
                      src={Logo}
                      alt="Logo"
                    />
                  </Link>
                </Box>
                <Typography className="address_text">
                  239 E 5th St, New York NY 10003, USA
                </Typography>
                <Box className="social_links">
                  <List spacing={2} sx={{ display: "flex" }}>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ paddingLeft: "0" }}>
                        <Link href="#">
                          <FacebookIcon sx={{ color: "#7a7a7a" }} />
                        </Link>
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <Link href="#">
                          <PinterestIcon sx={{ color: "#7a7a7a" }} />
                        </Link>
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <Link href="#">
                          <GoogleIcon sx={{ color: "#7a7a7a" }} />
                        </Link>
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <Link href="#">
                          <LinkedInIcon sx={{ color: "#7a7a7a" }} />
                        </Link>
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
