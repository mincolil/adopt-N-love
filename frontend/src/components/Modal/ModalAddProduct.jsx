import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
import { Input } from "@mui/material";
import YardIcon from "@mui/icons-material/Yard";
import ButtonCustomize from "../Button/Button";

const SERVICE_NAME_REGEX =
  /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ0-9&-\s]{3,}$/;
const PRICE_REGEX = /^[1-9]{1}\d{3,}$/;
const QUANTITY_REGEX = /^[0-9]{1,}$/;
const DESCRIPTION_REGEX =
  /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ0-9\!@#$:%^&,.?/()-\s]{1,}$/;

const ModalAddProduct = (props) => {
  const { open, onClose, handUpdateTable, category, page } = props;

  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  //   const [status, setStatus] = useState(true);

  //   const handleStatusChange = (event) => {
  //     setStatus(event.target.value);
  //     console.log(status);
  //   };

  // --------------------- VALIDATION -----------------------------
  const [validProductName, setValidProductName] = useState("");
  const [validPrice, setValidPrice] = useState("");
  const [validQuantity, setValidQuantity] = useState("");
  const [validDescription, setValidDescription] = useState("");
  useEffect(() => {
    setValidProductName(SERVICE_NAME_REGEX.test(productName.trim()));
  }, [productName]);

  const handleValidationProductName = (e) => {
    setProductName(e.target.value);
  };

  useEffect(() => {
    setValidPrice(PRICE_REGEX.test(price));
  }, [price]);

  const handleValidationPrice = (e) => {
    setPrice(e.target.value);
  };

  useEffect(() => {
    setValidQuantity(QUANTITY_REGEX.test(quantity));
  }, [quantity]);

  const handleValidationQuantity = (e) => {
    setQuantity(e.target.value);
  };

  useEffect(() => {
    setValidDescription(DESCRIPTION_REGEX.test(description.trim()));
  }, [description]);

  const handleValidationDescription = (e) => {
    setDescription(e.target.value);
  };

  // --------------------- HANDLE CHANGE IMAGE -----------------------------
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    // console.log("Kiểm tra image: ", e.target.files);
  };

  // --------------------- HANDLE HANLDE UPLOAD IMAGE PRODUCT -----------------------------
  const handleUpload = async () => {
    try {
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const response = await axios.post(
          `http://localhost:3500/product/upload`,
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
            handleCreateProduct(imagePath);
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
      console.error("Lỗi khi tải ảnh lên:", error);
    }
  };

  // --------------------- HANDLE CREATE PRODUCT -----------------------------
  const handleCreateProduct = async (productImage) => {
    // console.log(
    //   "Check data truyền vào sản phẩm",
    //   productName,
    //   categoryId,
    //   quantity,
    //   price,
    //   description,
    //   productImage
    // );
    if (productName.trim() === "") {
      toast.error("Vui lòng nhập tên sản phẩm");
    } else if (description.trim() === "") {
      toast.error("Vui lòng nhập thông tin của sản phẩm");
    } else if (quantity === "") {
      toast.error("Vui lòng nhập số lượng của sản phẩm");
    } else if (!validProductName) {
      toast.error(
        "Tên sản phẩm phải có ít nhất 3 kí tự và chỉ được nhập kí tự đặc biệt là & hoặc - "
      );
    } else if (categoryId === "") {
      toast.error("Bạn phải chọn loại sản phẩm mình muốn");
    } else if (quantity < 0) {
      toast.error("Số lượng đang âm! Vui lòng nhập lại");
    } else if (!validQuantity) {
      toast.error("Số lượng không được để trống và phải lớn hơn 0");
    } else if (!validPrice) {
      toast.error("Giá tiền phải có ít nhất 4 chữ số và phải lớn hơn 0");
    } else if (!validDescription) {
      toast.error("Thông tin chi tiết không được để trống");
    } else {
      try {
        const response = await axios.post("http://localhost:3500/product", {
          productName,
          categoryId,
          quantity,
          price,
          description,
          productImage,
        });
        if (response.error) {
          toast.error(response.error);
        } else {
          // console.log("Thành công!!", response);
          toast.success("Thêm mới sản phẩm thành công");
          setProductName("");
          setCategoryId("");
          setQuantity();
          setPrice();
          setDescription("");
          // setStatus(true);
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

  // --------------------- HANDLE CHANGE CATEGORY PRODUCT -----------------------------
  const handleChange = (e) => {
    const selectedCategory = e.target.value;
    // console.log("Check ID cate add Product", selectedCategory);
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
          Thêm sản phẩm mới
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
              label="Tên sản phẩm"
              margin="normal"
              value={productName}
              onChange={(e) => handleValidationProductName(e)}
              // error={!validProductName}
              // helperText={validProductName ? "" : "Hãy nhập tên sản phẩm"}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-select-small-label">
                Chọn loại sản phẩm
              </InputLabel>
              <Select
                label="Loại sản phẩm"
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
              // required
              fullWidth
              label="Số lượng"
              margin="normal"
              type="number"
              value={quantity}
              onChange={(e) => handleValidationQuantity(e)}
            />

            <TextField
              required
              fullWidth
              label="Giá tiền sản phẩm"
              type="number"
              margin="normal"
              value={price}
              onChange={(e) => handleValidationPrice(e)}
            />

            <TextField
              label="Thông tin sản phẩm"
              fullWidth
              placeholder="Điền thông tin sản phẩm ở đây"
              multiline
              rows={4}
              margin="normal"
              maxRows={4}
              value={description}
              onChange={(e) => handleValidationDescription(e)}
            />
            <Typography>Ảnh sản phẩm</Typography>
            <Input
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleImageChange}
              style={{ marginBottom: "1rem" }}
            />
            {/* {image === null ||
              (!image && (
                <Typography>Nhấn "Xem ảnh" để xem trước hình ảnh</Typography>
              ))} */}
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Ảnh sản phẩm"
                style={{ maxWidth: "100%" }}
              />
            )}

            {/* Status */}
            {/* <RadioGroup
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
              <FormControlLabel value={false} control={<Radio />} label="Ẩn" />
            </RadioGroup> */}
          </form>
        </DialogContent>
        <DialogActions>
          <ButtonCustomize
            onClick={handleUpload}
            nameButton="Thêm"
            variant="contained"
            sx={{ marginTop: "8px" }}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalAddProduct;
