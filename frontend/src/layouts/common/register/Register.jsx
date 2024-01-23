import * as React from "react";
//MUI
import {
  Avatar,
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
//MUI Icon
import PetsIcon from "@mui/icons-material/Pets";
// Router
import { NavLink, useNavigate } from "react-router-dom";
// Axios
import axios from "axios";
import { toast } from "react-toastify";
//React
import { useState } from "react";

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

  const registerUser = async (e) => {
    e.preventDefault();
    const { fullname, email, password, passwordConfirm } = data;
    try {
      await axios.post("http://localhost:3500/register", {
        fullname,
        email,
        password,
        passwordConfirm,
        role: "customer",
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
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://img.freepik.com/premium-vector/veterinary-clinic-doctor-examining-vaccination-health-care-pets-like-dogs-cats-flat-cartoon-background-vector-illustration-poster-banner_2175-3383.jpg?w=2000)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
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
            <Link href="/">
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <PetsIcon />
              </Avatar>
            </Link>

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
                  <NavLink to="/reset-password" variant="body2">
                    Quên mật khẩu?
                  </NavLink>
                </Grid>
                <Grid item>
                  <NavLink to="/sign-in" variant="body2">
                    {"Bạn đã có tài khoản? Đăng nhập tại đây!"}
                  </NavLink>
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
