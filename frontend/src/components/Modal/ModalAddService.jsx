import { useState, useEffect } from "react";
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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Input, Typography } from "@mui/material";
import ButtonCustomize from "../Button/Button";

const SERVICE_NAME_REGEX =
  /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ0-9&-\s]{3,}$/;
const PRICE_REGEX = /^[1-9]{1}\d{3,}$/;
// const DESCRIPTION_REGEX =
// /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ0-9@#$:%^&,.?"/+=!()-\s]{1,}$/;

const ModalAddSerivce = (props) => {
  const { open, onClose, handUpdateTable, category, page } = props;

  const [serviceName, setServiceName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState(null);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    // console.log(status);
  };

  // --------------------- VALIDATION -----------------------------
  const [validServiceName, setValidServiceName] = useState("");
  const [validPrice, setValidPrice] = useState("");
  // const [validDescription, setValidDescription] = useState("");
  useEffect(() => {
    setValidServiceName(
      SERVICE_NAME_REGEX.test(serviceName) && serviceName.trim() !== ""
    );
  }, [serviceName]);

  const handleValidationServiceName = (e) => {
    setServiceName(e.target.value);
  };

  useEffect(() => {
    setValidPrice(PRICE_REGEX.test(price));
  }, [price]);

  const handleValidationPrice = (e) => {
    setPrice(e.target.value);
  };

  // useEffect(() => {
  //   setValidDescription(
  //     DESCRIPTION_REGEX.test(description) && description.trim()
  //   );
  // }, [description]);

  // const handleValidationDescription = (e) => {
  //   setDescription(e.target.value);
  // };

  // --------------------- HANDLE HANLDE CHANGE IMAGE SERVICE -----------------------------
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    // console.log("Kiểm tra image: ", e.target.files);
  };

  // --------------------- HANDLE HANLDE UPLOAD IMAGE SERVICE -----------------------------
  const handleUpload = async () => {
    try {
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const response = await axios.post(
          `http://localhost:3500/service/upload`,
          formData
        );
        const maxSize = 1024 * 1024;
        if (image.size > maxSize) {
          toast.error("Ảnh có dung lượng lớn hơn 1MB. Vui lòng chọn ảnh khác!");
        } else {
          // console.log("Response data:", response.data.image);
          const imagePath = response.data.image;

          if (imagePath) {
            // console.log("Đã tải ảnh lên:", imagePath);
            handleCreateService(imagePath);
          } else {
            // console.log("Lỗi: Không có đường dẫn ảnh sau khi tải lên.");
            toast.error("Lỗi: Không có đường dẫn ảnh sau khi tải lên.");
          }
        }
      } else {
        // console.log("Vui lòng chọn ảnh trước khi tải lên.");
        toast.error("Vui lòng chọn ảnh trước khi tải lên.");
      }
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error.message);
    }
  };

  // --------------------- HANDLE CREATE SERVICE -----------------------------
  const handleCreateService = async (serviceImage) => {
    // console.log(
    //   "Check data truyền vào",
    //   serviceName,
    //   categoryId,
    //   description,
    //   price,
    //   status,
    //   serviceImage
    // );
    if (serviceName.trim() === "") {
      toast.error("Vui lòng nhập tên dịch vụ");
    } else if (description.trim() === "") {
      toast.error("Vui lòng nhập thông tin của dịch vụ");
    } else if (price === "") {
      toast.error("Vui lòng nhập giá tiền dịch vụ");
    } else if (price < 0) {
      toast.error("Giá tiền phải lớn hơn 0. Vui lòng nhập lại!");
    } else if (!validServiceName) {
      toast.error(
        "Tên dịch vụ phải có ít nhất 3 kí tự và chỉ được nhập kí tự đặc biệt là & hoặc -"
      );
    } else if (categoryId === "") {
      toast.error("Vui lòng chọn loại dịch vụ");
    } else if (!validPrice) {
      toast.error("Giá tiền phải có ít nhất 4 chữ số. Vui lòng nhập lại!");
    } else {
      try {
        const response = await axios.post("http://localhost:3500/service", {
          serviceName,
          categoryId,
          description,
          price,
          status,
          serviceImage,
        });
        if (response.error) {
          toast.error(response.error);
        } else {
          // console.log("Thành công!!", response);
          toast.success("Thêm mới dịch vụ thành công!");
          setServiceName("");
          setCategoryId("");
          setDescription("");
          setPrice();
          setImage(null);
          handUpdateTable(page);
          onClose();
        }
      } catch (error) {
        // console.log(error);
        toast.error(error.response.data.error);
      }
    }
  };

  // --------------------- HANDLE CHANGE CATEGORY SERVICE -----------------------------
  const handleChange = (e) => {
    const selectedCategory = e.target.value;
    // console.log("Check ID cate add Service", selectedCategory);
    setCategoryId(selectedCategory);
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
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Thêm dịch vụ
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
          <form>
            <TextField
              // required
              fullWidth
              label="Tên dịch vụ"
              margin="normal"
              value={serviceName}
              onChange={(e) => handleValidationServiceName(e)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-select-small-label">
                Chọn loại dịch vụ
              </InputLabel>
              <Select
                label="Loại dịch vụ"
                value={categoryId}
                onChange={handleChange}
              >
                {category &&
                  category.map((value) => {
                    return (
                      <MenuItem
                        key={value._id}
                        value={value._id}
                        // onClick={(e) => hanldeClickCategory(e.target.value)}
                      >
                        {value.feature}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <TextField
              label="Thông tin dịch vụ"
              fullWidth
              placeholder="Điền thông tin dịch vụ ở đây"
              multiline
              rows={4}
              margin="normal"
              maxRows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              required
              fullWidth
              label="Giá dịch vụ"
              type="number"
              margin="normal"
              value={price}
              onChange={(e) => handleValidationPrice(e)}
            />
            <Typography>Ảnh dịch vụ </Typography>
            <Input
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleImageChange}
              style={{ marginBottom: "1rem" }}
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Ảnh sản phẩm"
                style={{ maxWidth: "100%" }}
              />
            )}
            <RadioGroup
              value={status}
              onChange={handleStatusChange}
              row
              aria-label="status"
              name="status"
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Hoạt động"
              />

              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Không hoạt động"
              />
            </RadioGroup>
          </form>
        </DialogContent>
        <DialogActions>
          <ButtonCustomize
            onClick={handleUpload}
            nameButton="Tạo dịch vụ"
            variant="contained"
            sx={{ marginTop: "8px" }}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalAddSerivce;
