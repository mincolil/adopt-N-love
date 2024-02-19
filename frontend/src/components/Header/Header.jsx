import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Hidden from "@mui/material/Hidden";
import { Link } from "react-router-dom";
import { DsAppBar, DsButton } from "./styled";
import {
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Grid,
  Container,
  Slide,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Fade from "@mui/material/Fade";
import Collapse from "@mui/material/Collapse";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const slideProps = {
    mountOnEnter: true,
    unmountOnExit: true,
    timeout: { enter: 225, exit: 195 },
  };

  return (
    <DsAppBar position="fixed" style={{ backgroundColor: "#ffffff" }}>
      <Container>
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Grid item xl={4}>
            <Typography variant="h6">
              <Link to="/">
                <img
                  src="https://preview.colorlib.com/theme/anipat/img/logo.png.webp"
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
                    fontSize: "16px",
                    fontFamily: "'Poppins', sans-serif !important",
                  },
                }}
              >
                <DsButton color="inherit">Home</DsButton>
                <DsButton color="inherit">About</DsButton>
                <DsButton color="inherit" onClick={handleClick}>
                  Blog
                  <ArrowDropDownIcon />
                </DsButton>
                <Menu
                  id="blog-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "blog-button",
                  }}
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 300 }}
                >
                  <MenuItem onClick={handleClose}>Blog 1</MenuItem>
                  <MenuItem onClick={handleClose}>Blog 2</MenuItem>
                  <MenuItem onClick={handleClose}>Blog 3</MenuItem>
                </Menu>
                <DsButton
                  color="inherit"
                  href="product-homepage"
                  sx={{ fontFamily: "'Poppins', sans-serif !important", fontSize: "16px" }}
                >
                  Product
                </DsButton>
                <DsButton color="inherit">Services</DsButton>
                <DsButton color="inherit">Contact</DsButton>
              </Box>
            </Grid>
          </Hidden>
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
