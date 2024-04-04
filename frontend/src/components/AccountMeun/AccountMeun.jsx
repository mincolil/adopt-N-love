import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PetsIcon from "@mui/icons-material/Pets";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { GoogleLogout, useGoogleLogout } from 'react-google-login';

import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const context = useAuth();

  // --------------------- LOGOUT -----------------------------
  const navigate = useNavigate();

  const clientId = "424228344980-l67mummet93pgl903qru8ejvjeoo098s.apps.googleusercontent.com";

  const handleLogout = async (e) => {
    try {
      localStorage.removeItem("token");
      //remove google token
      navigate("/sign-in");
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  };

  const customStyles = {
    backgroundColor: 'red', // Set the background color to red
    border: 'none', // Remove the border
    color: 'white', // Set the text color to white
    padding: '10px 20px', // Add padding
    borderRadius: '5px', // Add border radius
    cursor: 'pointer', // Change cursor to pointer
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Tuỳ chọn">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose} component={NavLink} to="/">
          <ListItemIcon>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          Trang chủ
        </MenuItem>
        {context.auth.role === "admin" ? (
          <MenuItem
            onClick={handleClose}
            component={NavLink}
            to="/dashboard/dashboard-list"
          >
            <ListItemIcon>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            Bảng điều khiển
          </MenuItem>
        ) : (
          ""
        )}
        {context.auth.role === "staff" ? (
          <MenuItem
            onClick={handleClose}
            component={NavLink}
            to="/dashboard/service-list"
          >
            <ListItemIcon>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            Bảng điều khiển
          </MenuItem>
        ) : (
          ""
        )}
        <MenuItem
          onClick={handleClose}
          component={NavLink}
          to="/change-password"
        >
          <ListItemIcon>
            <VpnKeyIcon fontSize="small" />
          </ListItemIcon>
          Đổi mật khẩu
        </MenuItem>
        <MenuItem onClick={handleClose} component={NavLink} to="/user-profile">
          <ListItemIcon>
            <AccountBoxIcon fontSize="small" />
          </ListItemIcon>
          Thông tin cá nhân
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component={NavLink}
          to="/product-purchase"
        >
          <ListItemIcon>
            <ShoppingCartIcon fontSize="small" />
          </ListItemIcon>
          Đơn hàng
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component={NavLink}
          to="/service-purchase"
        >
          <ListItemIcon>
            <ShoppingBagIcon fontSize="small" />
          </ListItemIcon>
          Lịch đặt dịch vụ
        </MenuItem>
        <MenuItem onClick={handleClose} component={NavLink} to="/pet-user">
          <ListItemIcon>
            <PetsIcon fontSize="small" />
          </ListItemIcon>
          Thú cưng của tôi
        </MenuItem>


        <GoogleLogout
          clientId={clientId}
          buttonText="hehehe"
          onLogoutSuccess={handleLogout}
          render={(renderProps) => (
            <MenuItem onClick={renderProps.onClick}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon>

              Đăng xuất
            </MenuItem>
          )}
        >
        </GoogleLogout>


      </Menu>
    </React.Fragment>
  );
}
