import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import PetsIcon from "@mui/icons-material/Pets";
import { Outlet, useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Link from "@mui/material/Link";
import { NavLink } from "react-router-dom";
import AccountMenu from "../AccountMeun/AccountMeun";
import LoginIcon from "@mui/icons-material/Login";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState } from "react";
import { useEffect } from "react";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

const CustomAppBar = styled(AppBar)({
  background: "linear-gradient(to right, #ADD8E6, #FFFF99, #FFC0CB)",
});

const pages = ["Trang Chủ", "Dịch vụ", "Sản Phẩm", "Blog", "Giới thiệu"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    // console.log(localStorage.getItem("token"));
    setAnchorElUser(null);
  };

  // --------------------------------------------------

  const [serviceItem, setServiceItem] = React.useState(null);
  const handleClick = (e) => {
    setServiceItem(e.currentTarget);
  };
  const handleClose = () => {
    setServiceItem(null);
  };

  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const context = useAuth();
  const [productNumber, setProductNumber] = useState(0);
  const [serviceNumber, setServiceNumber] = useState(0);

  // const handleLoadCartProduct = async () => {
  //   try {
  //     const loadData = await axios
  //       .get(`http://localhost:3500/cartProduct/view-cart`, {
  //         headers: { Authorization: context.auth.token },
  //         withCredentials: true,
  //       })
  //       .then((data) => {
  //         setProductNumber(data.data.length);
  //         context.auth.productNumber = data.data.length
  //       });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const handleLoadCartService = async () => {
  //   try {
  //     const loadData = await axios
  //       .get(`http://localhost:3500/cartService/view-cart`, {
  //         headers: { Authorization: context.auth.token },
  //         withCredentials: true,
  //       })
  //       .then((data) => {
  //         setServiceNumber(data.data.length);
  //         context.auth.serviceNumber = data.data.length
  //       });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   handleLoadCartProduct();
  //   handleLoadCartService();
  // }, [context.auth]);

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

  return (
    <>
      <CustomAppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <PetsIcon
              sx={{
                display: { xs: "none", md: "flex", color: "black" },
                mr: 1,
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component={NavLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex", color: "black" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              PetCare
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <PetsIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component={NavLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                color: "black",
              }}
            >
              PetCare
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex", color: "black" },
              }}
            >
              {/* ------------TRANG CHỦ--------------- */}
              <Button
                component={NavLink}
                to="/"
                exact
                sx={{ my: 2, color: "white", display: "block", color: "black" }}
              >
                <Typography>Trang chủ</Typography>
              </Button>
              {/* ------------DỊCH VỤ--------------- */}
              <Button
                component={NavLink}
                to="service-homepage"
                exact
                sx={{ my: 2, color: "white", display: "block", color: "black" }}
              >
                <Typography>Dịch vụ</Typography>
              </Button>

              {/* ------------SẢN PHẨM--------------- */}
              <Button
                component={NavLink}
                to="product-homepage"
                exact
                sx={{ my: 2, color: "white", display: "block", color: "black" }}
              >
                <Typography>Sản phẩm</Typography>
              </Button>
              {/* ------------BLOG--------------- */}
              <Button
                component={NavLink}
                to="blog-homepage"
                sx={{ my: 2, color: "white", display: "block", color: "black" }}
              >
                <Typography>Blog</Typography>
              </Button>
              {/* ------------GIỚI THIỆU--------------- */}
              <Button
                component={NavLink}
                to="introduce-homepage"
                sx={{ my: 2, color: "white", display: "block", color: "black" }}
              >
                <Typography>Giới thiệu</Typography>
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexGrow: 0,
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
                    title="Giỏ hàng dịch vụ"
                    style={{ position: "relative" }}
                  >
                    <NavLink to="cart-service">
                      <IconButton size="small" sx={{ ml: 2 }}>
                        <ShoppingBagIcon
                          sx={{ width: 32, height: 32 }}
                        ></ShoppingBagIcon>
                      </IconButton>
                    </NavLink>
                    <div style={reddot}>{context.serviceNumber}</div>
                  </Tooltip>
                )}

                {isLoggedIn && (
                  <Tooltip
                    title="Giỏ hàng sản phẩm"
                    style={{ position: "relative" }}
                  >
                    <NavLink to="cart-product">
                      <IconButton size="small" sx={{ ml: 2 }}>
                        <ShoppingCartIcon
                          sx={{ width: 32, height: 32 }}
                        ></ShoppingCartIcon>
                      </IconButton>
                    </NavLink>
                    <div style={reddot}>{context.productNumber}</div>
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
                    <NavLink to="/sign-up">
                      <IconButton size="small" sx={{ ml: 2 }}>
                        <AppRegistrationIcon
                          sx={{ width: 32, height: 32 }}
                        ></AppRegistrationIcon>
                      </IconButton>
                    </NavLink>
                  </Tooltip>
                )}
                {!isLoggedIn && (
                  <Tooltip title="Đăng nhập">
                    <NavLink to="/sign-in">
                      <IconButton size="small" sx={{ ml: 2 }}>
                        <LoginIcon sx={{ width: 32, height: 32 }}></LoginIcon>
                      </IconButton>
                    </NavLink>
                  </Tooltip>
                )}
              </Box>
              {isLoggedIn && <AccountMenu />}
            </Box>
          </Toolbar>
        </Container>
      </CustomAppBar>
      {/* router here */}
      <Outlet />

      {/* <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {dummyMenuItems.map(item => (
                    <MenuItem onClick={handleClose} key={item.title} value={item.title}>
                        <a href='/'>{item.title}</a>
                    </MenuItem>
                ))}
            </Menu> */}
    </>
  );
}

export default Header;
