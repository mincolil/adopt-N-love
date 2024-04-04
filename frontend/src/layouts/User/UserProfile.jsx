import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import { Radio, RadioGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import Footer from "../../components/Footer/Footer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { emphasize } from "@mui/material/styles";
import ButtonCustomize from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import Background from "../../images/background.png";
import { ToastContainer } from "react-toastify";



const CustomContainer = styled(Container)({
  background:
    "linear-gradient(to bottom, #F4BEB2, #F4BEB2, #ECDAD6, #E5E6E7, #73A1CC)",
});

const defaultTheme = createTheme();

export default function UserPRofile() {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(null);
  const [address, setAddress] = useState("");
  const [password, setPassWord] = useState("");
  const [gender, setGender] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const FULL_NAME_REGEX =
    /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ\s]{2,}$/;
  const PHONE_NUMBER_REGEX = /^(0[3|5|7|8|9])+([0-9]{8})$/;

  // --------------------- VALIDATION -----------------------------
  const [validFullName, setValidFullName] = useState("");
  const [validPhone, setValidPhone] = useState();
  useEffect(() => {
    setValidFullName(FULL_NAME_REGEX.test(fullname) && fullname.trim());
  }, [fullname]);

  const handleValidationFullName = (e) => {
    setFullName(e.target.value);
  };

  useEffect(() => {
    setValidPhone(PHONE_NUMBER_REGEX.test(phone));
  }, [phone]);

  const handleValidationPhone = (e) => {
    setPhone(e.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const context = useAuth();

  // --------------------- HANDLE GET USER BY ID -----------------------------
  const handleGetUserById = async () => {
    try {
      const dataUser = await axios.get(
        `http://localhost:3500/user/${context.auth.id}`
      );
      if (dataUser.error) {
        toast.error(dataUser.error);
      } else {
        // console.log(dataUser.data);
        setFullName(dataUser.data.fullname);
        setEmail(dataUser.data.email);
        setPhone(dataUser.data.phone);
        setAddress(dataUser.data.address);
        setGender(dataUser.data.gender);
        setPassWord(dataUser.data.password);
        setRole(dataUser.data.role);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const { auth } = context;
  useEffect(() => {
    if (auth)
      handleGetUserById();
  }, [auth]);

  // --------------------- HANDLE UPDATE -----------------------------

  const handleUpdate = async (userId) => {
    if (fullname.trim() === "") {
      toast.error("Tên không được bỏ trống. Vui lòng nhập lại.");
    } else if (!validFullName) {
      toast.error(
        "Tên không được nhập kí tự đặc biệt và phải có ít nhất 3 kí tự"
      );
    } else {
      try {
        const data = await axios.patch(
          `http://localhost:3500/user/updateProfile`,
          {
            // _id: userId,
            fullname: fullname,
            email: email,
            // password: password,
            role: role,
            address: address,
            phone: phone,
            gender: gender,
            status: "active",
          }
        );
        if (data.error) {
          toast.error(data.error);
        } else {
          // console.log(data);
          handleGetUserById();
          toast.success("Cập nhật thông tin thành công");
          navigate("/");
        }
      } catch (err) {
        console.log(err);
        toast.error(err.response.data.error);
      }
    }
  };

  useEffect(() => {
    setFullName(fullname);
    setEmail(email);
    setPhone(phone);
    setAddress(address);
    setGender(gender);
    setPassWord(password);
    setRole(role);
  }, [fullname, email, password, phone, role, gender, address]);

  return (
    <>
      <Header />
      <ThemeProvider theme={defaultTheme}>
        <ToastContainer />
        <CustomContainer component="main" maxWidth="false" sx={{ pt: 10, pb: 4, backgroundImage: `url(${Background})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
          <CssBaseline />
          <Container maxWidth="lg">
            <Paper
              variant="outlined"
              sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
            >
              <Typography variant="h6" gutterBottom>
                Thông tin cá nhân
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color="warning"
                    required
                    id="firstName"
                    name="firstName"
                    label="Họ và tên"
                    fullWidth
                    value={fullname}
                    autoComplete="given-name"
                    variant="standard"
                    onChange={(e) => handleValidationFullName(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RadioGroup
                    value={gender}
                    onChange={handleGenderChange}
                    row
                    aria-label="gender"
                    name="gender"
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio sx={{
                        color: "orange",
                        '&.Mui-checked': {
                          color: "orange",
                        },
                      }} />}
                      label="Nam"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio sx={{
                        color: "orange",
                        '&.Mui-checked': {
                          color: "orange",
                        },
                      }} />}
                      label="Nữ"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color="warning"
                    required
                    id="password"
                    name="password"
                    value={password}
                    label="Password"
                    autoComplete="shipping email"
                    variant="standard"
                    sx={{ display: "none" }}
                    onChange={(e) => setPassWord(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color="warning"
                    required
                    id="rolle"
                    name="role"
                    value={role}
                    label="Password"
                    autoComplete="shipping email"
                    variant="standard"
                    sx={{ display: "none" }}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    color="warning"
                    required
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    fullWidth
                    autoComplete="shipping email"
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    color="warning"
                    id="address"
                    name="address"
                    label="Địa chỉ"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    fullWidth
                    autoComplete="shipping address"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color="warning"
                    required
                    id="phone"
                    name="phone"
                    label="Số điện thoại"
                    value={phone}
                    onChange={(e) => handleValidationPhone(e)}
                    fullWidth
                    autoComplete="shipping phone"
                    variant="standard"
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <ButtonCustomize
                  onClick={() => handleUpdate(context.auth.id)}
                  nameButton="Cập nhật"
                  variant="contained"
                  sx={{ marginTop: "8px" }}
                />
              </Box>
            </Paper>
          </Container>
        </CustomContainer>
        <Footer />
      </ThemeProvider >
    </>
  );
}
