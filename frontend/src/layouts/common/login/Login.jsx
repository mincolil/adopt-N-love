import * as React from "react";
//MUI
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
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
//React
import { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

// Axios
import axios from "axios";
import { toast } from "react-toastify";

import useAuth from "../../../hooks/useAuth";

import { jwtDecode } from "jwt-decode";

const defaultTheme = createTheme();
const Login = () => {
  // const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const context = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  React.useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data } = await axios.post("http://localhost:3500/login", {
        email,
        password,
      })
        .then((data) => {
          if (data.data.error === 'Unverified') {
            localStorage.setItem("verify-email", email);
            navigate('/verify', { replace: true });
          } else {
            // console.log(data)
            const dataDecode = jwtDecode(data.data.token);

            localStorage.setItem("token", data.data.token);

            context.setAuth({
              id: dataDecode.id,
              email: dataDecode.email,
              role: dataDecode.role,
              token: data.data.token,
            });

            toast.success("Đăng nhập thành công");
            navigate(from, { replace: true });
          }
        })
        .catch((error) => {
          toast.error(error.response.data.error);
        })
    } catch (err) {
      // console.log(err)
    }
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
              Đăng nhập
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
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={loginUser}
              >
                Đăng nhập
              </Button>
              <Grid container>
                <Grid item xs>
                  <NavLink to="/reset-password" variant="body2">
                    Quên mật khẩu?
                  </NavLink>
                </Grid>
                <Grid item>
                  <NavLink to="/sign-up" variant="body2">
                    {"Bạn chưa có tài khoản? Tạo tài khoản tại đây!"}
                  </NavLink>
                </Grid>
              </Grid>
              {/* <NavLink to="/reset-password" variant="body2">
                {"Đặt lại mật khẩu"}
              </NavLink> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;