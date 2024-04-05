import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Footer from "../../components/Footer/Footer";
import ButtonCustomize from "../../components/Button/Button";
import Background from "../../images/background.png";
import Header from "../../components/Header/Header";
import { notification } from 'antd';
import { NavLink } from "react-router-dom";

const CustomContainer = styled(Container)({
  background:
    "linear-gradient(to bottom, #F4BEB2, #F4BEB2, #ECDAD6, #E5E6E7, #73A1CC)",
});

const defaultTheme = createTheme();

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, mess) => {
    api[type]({
      message: 'Notification Title',
      description: mess
    });
  };

  const context = useAuth();

  // Bao gồm cả chữ hoa, chữ thường, số, ký tự đặc biệt và ít nhất 8 ký tự
  const PWD_REGEX =
    /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;

  // --------------------- VALIDATION -----------------------------
  const [validNewPassword, setValidNewPassword] = useState("");
  useEffect(() => {
    setValidNewPassword(PWD_REGEX.test(newPassword));
  }, [newPassword]);

  const handleValidationNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleChangePassword = async () => {
    if (oldPassword === "") {
      openNotificationWithIcon("error", "Mật khẩu cũ không được để trống ");
    } else if (newPassword === "") {
      openNotificationWithIcon("error", "Mật khẩu mới không được để trống ");
    } else if (!validNewPassword) {
      openNotificationWithIcon("error", "Mật khẩu mới không đủ mạnh ");
    } else if (rePassword === "") {
      openNotificationWithIcon("error", "Nhập lại mật khẩu mới không được để trống ");
    } else if (oldPassword === newPassword) {
      openNotificationWithIcon("error", "Mật khẩu mới không được trùng với mật khẩu cũ. Vui lòng nhập lại. ");
    } else if (oldPassword === rePassword) {
      openNotificationWithIcon("error", "Mật khẩu mới không được trùng với mật khẩu cũ. Vui lòng nhập lại. ");
    } else if (newPassword !== rePassword) {
      openNotificationWithIcon("error", "Mật khẩu mới không trùng khớp. Vui lòng nhập lại. ");
    } else {
      try {
        const response = await axios.put(
          "http://localhost:3500/changePassword",
          {
            id: context.auth.id,
            oldPassword: oldPassword,
            newPassword: newPassword,
            rePassword: rePassword,
          }
        );
        if (response.data.error) {
          console.error("Error changing password:", response.data.error);
          openNotificationWithIcon("error", response.data.error);
        } else {
          // console.log(response.data);
          openNotificationWithIcon("success", "Đổi mật khẩu thành công");
          navigate("/sign-in");
          localStorage.removeItem("token");
          openNotificationWithIcon("success", "Đăng xuất thành công");
        }
      } catch (err) {
        console.error("Error changing password:", err);
      }
    }
  };

  return (
    <>
      {contextHolder}
      <Header />
      <ThemeProvider theme={defaultTheme}>
        <CustomContainer
          component="main"
          maxWidth="false"
          sx={{
            pt: 10,
            pb: 4,
            backgroundImage: `url(${Background})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <Container maxWidth="sm">
            <Paper
              variant="outlined"
              sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
            >
              <Typography component="h1" variant="h6" gutterBottom>
                Đổi mật khẩu
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    color="warning"
                    variant="outlined"
                    fullWidth
                    label="Mật khẩu cũ"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    color="warning"
                    variant="outlined"
                    fullWidth
                    label="Mật khẩu mới"
                    type="password"
                    value={newPassword}
                    onChange={(e) => handleValidationNewPassword(e)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    color="warning"
                    variant="outlined"
                    fullWidth
                    label="Nhập lại mật khẩu mới"
                    type="password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                <NavLink to="/reset-password">
                  <Typography variant="body2" color="textSecondary"
                    sx={{ marginTop: "8px" }}
                  >
                    Quên mật khẩu cũ?
                  </Typography>
                </NavLink>
                <ButtonCustomize
                  onClick={handleChangePassword}
                  nameButton="Đổi mật khẩu"
                  variant="contained"
                  sx={{ marginTop: "8px" }}
                />
              </Box>
            </Paper>
          </Container>
        </CustomContainer>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default ChangePassword;
