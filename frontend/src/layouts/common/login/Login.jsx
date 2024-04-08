import * as React from "react";
import Banner from "../../../images/banner.png";
import DogBanner from "../../../images/dog_banner.png";
import Background from "../../../images/dog_background.png";
import Cat from "../../../images/cat.png";
import { ToastContainer } from "react-toastify";
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

import GoogleLogin, { GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script'

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
      const { data } = await axios.post("/login", {
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

  //----------------------LOGIN WITH GG---------------------
  // const clientid = "424228344980-l67mummet93pgl903qru8ejvjeoo098s.apps.googleusercontent.com";
  const clientid = "424228344980-rs1e1chulrhg9uhc51u3p3q7espor5pd.apps.googleusercontent.com";

  const responseGoogle = async (response) => {
    const { tokenId, profileObj } = response;
    const token = tokenId;
    const email = profileObj.email;
    const googleId = profileObj.googleId;

    try {
      const { data } = await axios.post("/google", {
        email,
        googleId
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
  }

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
  }


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
        backgroundPosition: "center"
      }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
        // sx={{
        //   backgroundImage:
        //     `url(${Background})`,
        //   backgroundRepeat: "no-repeat",
        //   backgroundColor: (t) =>
        //     t.palette.mode === "light"
        //       ? t.palette.grey[50]
        //       : t.palette.grey[900],
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
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
              Đăng nhập
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
              {/* <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                /> */}
              <Button
                color="warning"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, }}
                onClick={loginUser}
              >
                Đăng nhập
              </Button>
              <GoogleLogin
                clientId={clientid}
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
                prompt="select_account"
              />
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