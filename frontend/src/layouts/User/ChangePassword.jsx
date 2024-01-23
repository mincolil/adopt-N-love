import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Breadcrumbs,
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Footer from "../../components/Footer/Footer";
import { NavLink } from "react-router-dom";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize } from "@mui/material/styles";
import ButtonCustomize from "../../components/Button/Button";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

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

  const context = useAuth();
  // console.log(context);

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
      toast.error("Mật khẩu cũ không được để trống ");
    } else if (newPassword === "") {
      toast.error("Mật khẩu mới không được để trống ");
    } else if (!validNewPassword) {
      toast.error(
        "Mật khẩu bao gồm cả chữ hoa, chữ thường, số, ký tự đặc biệt và ít nhất 8 ký tự "
      );
    } else if (rePassword === "") {
      toast.error("Nhập lại mật khẩu không được để trống ");
    } else if (oldPassword === newPassword) {
      toast.error(
        "Mật khẩu Mới và Mật khẩu cũ không được trùng nhau. Vui lòng nhập lại chúng. "
      );
    } else if (oldPassword === rePassword) {
      toast.error(
        "Nhập lại mật khẩu và  Mật khẩu cũ không được trùng nhau. Vui lòng nhập lại chúng. "
      );
    } else if (newPassword !== rePassword) {
      toast.error(
        "Mật khẩu Mới và Nhập lại mật khẩu phải khớp nhau. Vui lòng nhập lại chúng. "
      );
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
          toast.error("Mật khẩu cũ không chính xác");
        } else {
          // console.log(response.data);
          toast.success("Đổi mật khẩu thành công");
          navigate("/sign-in");
          localStorage.removeItem("token");
          toast.success("Hãy đăng nhập lại");
        }
      } catch (err) {
        console.error("Error changing password:", err);
        toast.error(err);
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CustomContainer component="main" maxWidth="false" sx={{ pt: 10, pb: 4 }}>
        <Box
          maxWidth="full"
          sx={{
            bgcolor: "background.paper",
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            borderRadius: "5px",
            alignItems: "center",
          }}
        >
          <Box>
            <Breadcrumbs maxItems={2} aria-label="breadcrumb">
              <StyledBreadcrumb
                component={NavLink}
                to="/"
                label="Trang chủ"
                icon={<HomeIcon fontSize="small" />}
              />
              {/* <StyledBreadcrumb component="a" href="#" label="Catalog" /> */}
              <StyledBreadcrumb
                component={NavLink}
                to="/change-password"
                label="Đổi mật khẩu"
              />
            </Breadcrumbs>
          </Box>
        </Box>
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
                  variant="outlined"
                  fullWidth
                  label="Nhập lại mật khẩu mới"
                  type="password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
  );
};

export default ChangePassword;
