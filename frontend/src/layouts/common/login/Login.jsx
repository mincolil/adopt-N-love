import * as React from "react";
import Background from "../../../images/dog_background.png";
import Cat from "../../../images/cat.png";
import { ToastContainer } from "react-toastify";
//MUI
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

// import GoogleLogin from "react-google-login";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import styled from "styled-components";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const defaultTheme = createTheme();

const StyledGoogleLogin = styled(GoogleLogin)`
  width: 100%;
  justify-content: center;
  margin-bottom: 20px;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
`;

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
      const { data } = await axios
        .post("/login", {
          email,
          password,
        })
        .then((data) => {
          if (data.data.error === "Unverified") {
            localStorage.setItem("verify-email", email);
            navigate("/verify", { replace: true });
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
        });
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
  const clientid =
    "424228344980-5arbdr989ojpjsd909ve7v5r7qut1uu6.apps.googleusercontent.com";


  const responseGoogle = async (response) => {
    console.log(response);

    const decode = jwtDecode(response.credential);
    console.log(decode);
    const email = decode.email;
    const googleId = decode.jti;
    console.log(email, googleId);

    try {
      const { data } = await axios
        .post("/google", {
          email,
          googleId,
        })
        .then((data) => {
          if (data.data.error === "Unverified") {
            localStorage.setItem("verify-email", email);
            navigate("/verify", { replace: true });
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
        });
    } catch (err) {
      // console.log(err)
    }
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <ThemeProvider theme={defaultTheme}>
      <ToastContainer />
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
          backgroundImage: `url(${Background})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} />
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
              <Box sx={{ xs: 1, zIndex: "1" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src={Cat} alt="" style={{ maxWidth: "30%" }} />
                </Box>
              </Box>
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
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                sx={{ mt: 3, mb: 3, py: 1.5 }}
                onClick={loginUser}
              >
                Đăng nhập
              </Button>
              <GoogleOAuthProvider clientId={clientid}>
                <StyledGoogleLogin
                  clientId={clientid}
                  buttonText="Đăng nhập bằng Google"
                  onSuccess={responseGoogle}
                  onFailure={onFailure}
                  cookiePolicy={"single_host_origin"}
                  isSignedIn={true}
                  prompt="select_account"
                />
              </GoogleOAuthProvider>

              <Grid container>
                <Grid item xs>
                  <StyledNavLink to="/reset-password" variant="body2">
                    Quên mật khẩu?
                  </StyledNavLink>
                </Grid>
                <Grid item>
                  <StyledNavLink to="/sign-up" variant="body2">
                    {"Bạn chưa có tài khoản? Tạo tài khoản tại đây!"}
                  </StyledNavLink>
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
