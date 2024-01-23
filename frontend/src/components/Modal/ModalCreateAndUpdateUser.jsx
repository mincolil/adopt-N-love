import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Typography,
  Modal,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

// import ButtonCustomize from '../../../components/Button/Button';

//React
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Axios
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

// -------------------------------STYLE MODAL----------------------
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ModalCreateAndUpdateUser(props) {
  const { open, onClose, handUpdateTable } = props;

  const DEFAULT_PAGE = 1;
  const IDEA = 0;

  const [data, setData] = useState([]);
  const [role, setRole] = useState("");
  const [gender, setGender] = useState(true);
  const [fullname, setFullName] = useState("");
  const [password, setPassWord] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // --------------------- MODAL HANDLE -----------------------------

  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const handleUpdateTable = (value) => {
    setData([value, ...data]);
  };

  // --------------------- HANDLE ROLE -----------------------------
  const handleRoleChange = (event) => {
    setRole(event.target.value);
    console.log(role);
  };

  // --------------------- HANDLE GENDER -----------------------------
  const handleGenderChange = (event) => {
    setGender(event.target.value);
    console.log(gender);
  };

  // --------------------- HANDLE CREATE USER -----------------------------
  // useEffect(() => {
  const handleCreateUser = async (event) => {
    // e.preventDefault();
    // const { fullname, email, password } = data;
    try {
      const data = await axios.post("http://localhost:3500/register", {
        fullname,
        email,
        password,
        role,
        address,
        phone,
        gender,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Register successful. Welcome!");
        handleUpdateTable({
          fullname: fullname,
          email: email,
          phone: phone,
          gender: gender,
          address: address,
        });
        // handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };
  // })
  return (
    <>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Thêm nhân viên
          </DialogTitle>
          <IconButton
            aria-label="close"
            // onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Họ và tên"
                  margin="normal"
                  value={fullname}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Gmail"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Mật khẩu"
                  margin="normal"
                  // value={serviceName}
                  onChange={(e) => setPassWord(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Nhập lại mật khẩu"
                  margin="normal"
                  // value={serviceName}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  margin="normal"
                  // value={serviceName}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  margin="normal"
                  // value={serviceName}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Chức vụ</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={role}
                    label="Role"
                    onChange={handleRoleChange}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="customer">Customer</MenuItem>
                    {/* <MenuItem value={30}>Thirty</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid paddingLeft="50px" item xs={6}>
                <RadioGroup
                  value={gender}
                  onChange={handleGenderChange}
                  row
                  aria-label="Giới tính"
                  name="gender"
                  // label="Giới tính"
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Nữ"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {IDEA == 0 ? (
              <Button
                variant="contained"
                margin="normal"
                color="primary"
                onClick={handleCreateUser}
              >
                Thêm nhân viên 123
              </Button>
            ) : (
              <Button
                variant="contained"
                margin="normal"
                color="primary"
                onClick={handleCreateUser}
              >
                Thêm nhân viên abc
              </Button>
            )}
          </DialogActions>
        </Box>
      </Modal>
    </>
  );
}
