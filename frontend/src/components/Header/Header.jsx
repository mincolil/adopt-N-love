import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Hidden from "@mui/material/Hidden";
import { Link, NavLink } from "react-router-dom";
import { DsAppBar, DsButton } from "./styled";
import {
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Grid,
  Container,
  Tooltip,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LoginIcon from "@mui/icons-material/Login";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import Fade from "@mui/material/Fade";
import Logo from "../../images/RealLogo2.png";
import useAuth from "../../hooks/useAuth";
import AccountMenu from "../AccountMeun/AccountMeun";
import { styled } from "@mui/material/styles";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isLoggedIn, setLoggedIn] = useState(false);



  const context = useAuth();
  const [productNumber, setProductNumber] = useState(0);

  const reddot = {
    backgroundColor: "red",
    position: "absolute",
    width: "20px",
    height: "20px",
    top: "0",
    right: "0",
    borderRadius: "50%",
    fontSize: "15px",
  };

  const { auth } = context;

  useEffect(() => {
    if (auth) {
      const token = localStorage.getItem("token");
      setLoggedIn(!!token);
    }

  }, [auth]);

  return (
    <DsAppBar position="fixed" style={{ backgroundColor: "#ffffff" }}>
      <Container>
        <Grid container alignItems="center">
          {/* Logo */}
          <Grid item xl={3}>
            <Typography variant="h6">
              <Link to="/">
                <img
                  src={Logo}
                  alt="Logo"
                  style={{ maxWidth: "100%", cursor: "pointer" }}
                />
              </Link>
            </Typography>
          </Grid>
          {/* Navigation Buttons */}
          <Hidden smDown>
            <Grid item xl={6}>
              <Box
                sx={{
                  color: "#000",
                  "& > button": {
                    fontSize: "20px",
                    fontFamily: "'Poppins', sans-serif !important",
                  },
                }}
              >
                <DsButton
                  color="inherit"
                  href="/"
                  sx={{
                    fontFamily: "'Poppins', sans-serif !important",
                    fontSize: "20px",
                  }}
                >
                  Trang chủ
                </DsButton>

                <DsButton color="inherit" href="/adopt-homepage" sx={{
                  fontFamily: "'Poppins', sans-serif !important",
                  fontSize: "20px",
                }}>
                  Nhận nuôi
                  {/* <ArrowDropDownIcon /> */}
                </DsButton>

                <DsButton
                  color="inherit"
                  href="/service-homepage"
                  sx={{
                    fontFamily: "'Poppins', sans-serif !important",
                    fontSize: "20px",
                  }}
                >
                  Dịch vụ
                </DsButton>

                <DsButton
                  color="inherit"
                  href="/product-homepage"
                  sx={{
                    fontFamily: "'Poppins', sans-serif !important",
                    fontSize: "20px",
                  }}
                >
                  Sản phẩm
                </DsButton>

                <DsButton color="inherit" href="/blog-homepage" sx={{
                  fontFamily: "'Poppins', sans-serif !important",
                  fontSize: "20px",
                }}>Blog</DsButton>
              </Box>
            </Grid>
          </Hidden>
          <Grid item xl={3}>
            <Box
              sx={{
                display: "flex",
                flexGrow: 0,
                justifyContent: "flex-end"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >

                {isLoggedIn && (
                  <Tooltip
                    title="Đề nghị nhận nuôi thú cưng"
                    style={{ position: "relative" }}
                  >
                    <div>
                      <NavLink to="/adopt-request">
                        <IconButton size="small" sx={{ ml: 2 }}>
                          <MarkEmailUnreadIcon
                            sx={{ width: 32, height: 32 }}
                          ></MarkEmailUnreadIcon>
                        </IconButton>
                      </NavLink>
                      <div style={reddot}>{context.adoptRequestNumber}</div>
                    </div>
                  </Tooltip>
                )}

                {isLoggedIn && (
                  <Tooltip
                    title="Giỏ hàng dịch vụ"
                    style={{ position: "relative" }}
                  >
                    <div>
                      <NavLink to="/cart-service">
                        <IconButton size="small" sx={{ ml: 2 }}>
                          <ShoppingBagIcon
                            sx={{ width: 32, height: 32 }}
                          ></ShoppingBagIcon>
                        </IconButton>
                      </NavLink>
                      <div style={reddot}>{context.serviceNumber}</div>
                    </div>
                  </Tooltip>
                )}

                {isLoggedIn && (
                  <Tooltip
                    title="Giỏ hàng sản phẩm"
                    style={{ position: "relative" }}
                  >
                    <div>
                      <NavLink to="/cart-product">
                        <IconButton size="small" sx={{ ml: 2 }}>
                          <ShoppingCartIcon
                            sx={{ width: 32, height: 32 }}
                          ></ShoppingCartIcon>
                        </IconButton>
                      </NavLink>
                      <div style={reddot}>{context.productNumber}</div>
                    </div>
                  </Tooltip>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {!isLoggedIn && (
                  <Tooltip title="Đăng kí">
                    <div>
                      <NavLink to="/sign-up">
                        <IconButton size="small" sx={{ ml: 2 }}>
                          <AppRegistrationIcon
                            sx={{ width: 32, height: 32 }}
                          ></AppRegistrationIcon>
                        </IconButton>
                      </NavLink>
                    </div>
                  </Tooltip>
                )}
                {!isLoggedIn && (
                  <Tooltip title="Đăng nhập">
                    <div>
                      <NavLink to="/sign-in">
                        <IconButton size="small" sx={{ ml: 2 }}>
                          <LoginIcon sx={{ width: 32, height: 32 }}></LoginIcon>
                        </IconButton>
                      </NavLink>
                    </div>
                  </Tooltip>
                )}
              </Box>
              {isLoggedIn && <AccountMenu />}
            </Box>
          </Grid>

          {/* Menu Icon for Small Screens */}
          <Hidden smUp>
            <Grid item xs={2}>
              <IconButton edge="start" color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
            </Grid>
          </Hidden>
        </Grid>
      </Container>
    </DsAppBar>
  );
};

export default Header;
