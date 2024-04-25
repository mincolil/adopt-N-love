import * as React from "react";
import Background from "../../../images/dog_background.png";
import Cat from "../../../images/cat.png";
import { ToastContainer } from "react-toastify";
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import styled from "styled-components";

const defaultTheme = createTheme();

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    fullname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // const PWD_REGEX =
  //   /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;

  const StyledNavLink = styled(NavLink)`
  text-decoration: none;
`;

  const registerUser = async (e) => {
    e.preventDefault();
    const { fullname, email, password, passwordConfirm } = data;
    try {
      await axios.post("/register", {
        fullname,
        email,
        password,
        passwordConfirm,
        role: "customer",
        phone: "",
      })
        .then((data) => {
          toast.success("Tạo tài khoản thành công");
          localStorage.setItem("verify-email", email);
          navigate("/verify");
        })
        .catch((error) => {
          console.log(error)
          toast.error(error.response.data.error);
        });
    } catch (err) {
      console.log(err);
    }
    // }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get("email"),
    //   password: data.get("password"),
    // });
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <ToastContainer />
      <Grid container component="main" sx={{
        height: "100vh", backgroundImage:
          `url(${Background})`,
        backgroundRepeat: "no-repeat",
        backgroundColor: (t) =>
          t.palette.mode === "light"
            ? t.palette.grey[50]
            : t.palette.grey[900],
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Link href="/" ><Box
              sx={{ xs: 1, zIndex: "1" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={Cat} alt="" style={{ maxWidth: "30%" }} />
              </Box>
            </Box></Link>

            <Typography component="h1" variant="h5">
              Tạo tài khoản
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                color="warning"
                margin="normal"
                required
                fullWidth
                id="fullname"
                label="Họ và tên"
                name="fullname"
                autoComplete="fullname"
                type="text"
                autoFocus
                value={data.fullname}
                onChange={(e) => setData({ ...data, fullname: e.target.value })}
              />
              <TextField
                color="warning"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Địa chỉ email"
                name="email"
                autoComplete="email"
                autoFocus
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
              <TextField
                color="warning"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                id="password"
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              <TextField
                color="warning"
                margin="normal"
                required
                fullWidth
                name="Re-password"
                label="Nhập lại mật khẩu"
                type="password"
                id="Re-password"
                autoComplete="current-password"
                value={data.passwordConfirm}
                onChange={(e) =>
                  setData({ ...data, passwordConfirm: e.target.value })
                }
              />
              <Button
                color="warning"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={registerUser}
              >
                Tạo
              </Button>
              <Grid container>
                <Grid item xs>
                  <StyledNavLink to="/reset-password" variant="body2">
                    Quên mật khẩu?
                  </StyledNavLink>
                </Grid>
                <Grid item>
                  <StyledNavLink to="/sign-in" variant="body2">
                    {"Bạn đã có tài khoản? Đăng nhập tại đây!"}
                  </StyledNavLink>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Register;
