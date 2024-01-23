import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContentText from "@mui/material/DialogContentText";

const ModalComfirmProduct = (props) => {
  const { open, onClose, handUpdateDeleteTable, dataDeteleProduct } = props;

  const handleDeleteService = async (productID) => {
    try {
      const res = await axios.delete(
        `http://localhost:3500/product/${productID}`
      );
      console.log("Check API delete", res);
      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        toast.success("Xoá dịch vụ thành công");
        handUpdateDeleteTable();
        onClose();
      }
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 2,
          borderRadius: "12px",
          boxShadow: 5,
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn có chắc muốn xoá sản phẩm này?"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">
            Sản phẩm bạn đang muốn xoá tên là: {dataDeteleProduct.productName}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            margin="normal"
            color="primary"
            onClick={() => handleDeleteService(dataDeteleProduct._id)}
          >
            Xoá
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalComfirmProduct;
