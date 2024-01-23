import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import Toolbar from "@mui/material/Toolbar";
import ListSubheader from "@mui/material/ListSubheader";
import * as React from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

import { Link } from "@mui/material";
import { toast } from "react-toastify";
// icon
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import PetsIcon from "@mui/icons-material/Pets";
import SpaIcon from "@mui/icons-material/Spa";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ClassIcon from "@mui/icons-material/Class";
import useAuth from "../../hooks/useAuth";

const DrawerDashborad = () => {
  const context = useAuth();
  const navigate = useNavigate();
  const links = [
    { text: "Doanh thu", path: "/dashboard/dashboard-list" },
    { text: "Danh sách người dùng", path: "/dashboard/user-list" },
  ];

  const links2 = [
    { text: "Danh sách dịch vụ", path: "/dashboard/service-list" },
    {
      text: "Lịch đăng kí dịch vụ",
      path: "/dashboard/booking-list",
    },
  ];

  const links3 = [
    { text: "Danh sách thú cưng", path: "/dashboard/pet-list" },
    // {
    //   text: "Lịch sử thanh toán thú cưng",
    //   path: "/dashboard/history-pet-list",
    // },
  ];

  const links4 = [
    { text: "Danh sách sản phẩm", path: "/dashboard/product-list" },
    {
      text: "Đơn hàng",
      path: "/dashboard/order-list",
    },
  ];

  const links5 = [
    { text: "Danh sách tin tức", path: "/dashboard/blog-list" },
    // {
    //   text: "Danh sách thể loại",
    //   path: "/dashboard/category-list",
    // },
  ];

  const handleLogout = async () => {
    try {
      // const response = await axios.post("http://localhost:3500/logout");
      // thông báo logout thành công và chuyển hướng về trang đăng nhập
      // console.log(response);

      localStorage.removeItem("token"); // xóa token lưu trữ trong localStorage
      navigate("/sign-in"); // chuyển hướng về trang đăng nhập
      toast.success("Đăng xuất thành công!");
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  };

  return (
    <>
      <Toolbar />
      <Divider />

      {context.auth.role !== "staff" ? (
        <List>
          <ListSubheader component="div" id="nested-list-subheader">
            Quản lý
          </ListSubheader>
          {links.map((link, index) => (
            <ListItem key={link.text} disablePadding>
              <ListItemButton component={NavLink} to={link.path}>
                <ListItemIcon>
                  {index % 2 === 0 ? <DashboardIcon /> : <PersonIcon />}
                </ListItemIcon>
                <ListItemText primary={link.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        ""
      )}

      <Divider />

      <List>
        <ListSubheader component="div" id="nested-list-subheader">
          Dịch vụ
        </ListSubheader>
        {links2.map((link, index) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton component={NavLink} to={link.path}>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <MedicalServicesIcon />
                ) : (
                  <MedicalInformationIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />

      <List>
        <ListSubheader component="div" id="nested-list-subheader">
          Thú cưng
        </ListSubheader>
        {links3.map((link, index) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton component={NavLink} to={link.path}>
              <ListItemIcon>
                {index % 2 === 0 ? <PetsIcon /> : <SpaIcon />}
              </ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />

      <List>
        <ListSubheader component="div" id="nested-list-subheader">
          Sản phẩm
        </ListSubheader>
        {links4.map((link, index) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton component={NavLink} to={link.path}>
              <ListItemIcon>
                {index % 2 === 0 ? <InventoryIcon /> : <ClassIcon />}
              </ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />

      <List>
        <ListSubheader component="div" id="nested-list-subheader">
          Tin tức & Thể loại
        </ListSubheader>
        {links5.map((link, index) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton component={NavLink} to={link.path}>
              <ListItemIcon>
                {index % 2 === 0 ? <NewspaperIcon /> : <CategoryIcon />}
              </ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </>
  );
};

export default DrawerDashborad;
