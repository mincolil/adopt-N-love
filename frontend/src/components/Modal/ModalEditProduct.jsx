import { useEffect, useState } from "react";
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
import { Grid, Input } from "@mui/material";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ButtonCustomize from "../Button/Button";
import { format } from "date-fns-tz";

const formatDate = (dateTime) => {
  return format(dateTime, "yyyy-MM-dd HH:mm:ss", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

const PRODUCT_NAME_REGEX =
  /^[ A-Za-z0-9À-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ0-9&-\s]{3,}$/;
const PRICE_REGEX = /^[1-9]{1}\d{3,}$/;
const QUANTITY_REGEX = /^[0-9]{1,}$/;
const DESCRIPTION_REGEX =
  /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ0-9\!@#$:%^&,.?/()-\s]{1,}$/;

const ModalEditProduct = (props) => {
  const {
    open,
    onClose,
    handUpdateEditTable,
    dataEditProduct,
    category,
    page,
  } = props;
  const currentDate = dayjs();
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [saleStartTime, setSaleStartTime] = useState(null);
  const [saleEndTime, setSaleEndTime] = useState(null);
  const [isStartDateVisible, setIsStartDateVisible] = useState(false);

  //   const [status, setStatus] = useState(true);

  //   const handleStatusChange = (event) => {
  //     setStatus(event.target.value);
  //     console.log(status);
  //   };

  // // --------------------- HANLDE CHANGE DISCOUNT -----------------------------
  const handleDiscountChange = (event) => {
    const newDiscount = parseInt(event.target.value, 10);

    if (newDiscount >= 1 && newDiscount <= 100) {
      setDiscount(newDiscount);
      setSaleStartTime(dayjs());
      setSaleEndTime(dayjs());
    } else {
      setDiscount(newDiscount);
      setSaleStartTime(null);
      setSaleEndTime(null);
    }
  };

  // // --------------------- HANLDE CHANGE START DATE -----------------------------
  const handleStartDateChange = (date) => {
    if (date === null) {
      setSaleStartTime(dayjs());
    } else {
      setSaleStartTime(date);
    }
  };

  const handleEndDateChange = (date) => {
    if (date === null) {
      setSaleEndTime(dayjs());
    } else {
      setSaleEndTime(date);
    }
  };

  // --------------------- VALIDATION -----------------------------
  const [validProductName, setValidProductName] = useState("");
  const [validPrice, setValidPrice] = useState("");
  const [validQuantity, setValidQuantity] = useState("");
  const [validDescription, setValidDescription] = useState("");
  useEffect(() => {
    setValidProductName(
      PRODUCT_NAME_REGEX.test(productName) && productName.trim()
    );
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
    setValidDescription(
      DESCRIPTION_REGEX.test(description) && description.trim()
    );
  }, [description]);

  const handleValidationDescription = (e) => {
    setDescription(e.target.value);
  };

  // --------------------- CHECK TIME IF TIME CHANGE OF PASSED DATE -----------------------------
  // const updateDatesIfPassed = () => {
  //   const currentDate = dayjs();

  //   if (saleStartTime && currentDate.isAfter(saleStartTime)) {
  //     setSaleStartTime(null);
  //   }

  //   if (saleEndTime && currentDate.isAfter(saleEndTime)) {
  //     setSaleEndTime(null);
  //   }
  // };

  // useEffect(() => {
  //   updateDatesIfPassed();
  // }, [saleStartTime, saleEndTime]);

  // --------------------- HANDLE CHANGE IMAGE -----------------------------
  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
    // console.log("Kiểm tra image: ", e.target.files);
  };

  // --------------------- HANDLE HANLDE UPLOAD IMAGE PRODUCT -----------------------------
  const handleUpload = async () => {
    try {
      if (productImage) {
        const formData = new FormData();
        formData.append("image", productImage);
        const response = await axios.post(
          `http://localhost:3500/product/upload`,
          formData
        );
        const maxSize = 1024 * 1024;
        if (productImage.size > maxSize) {
          toast.error("Ảnh có dung lượng nhỏ hơn 1MB");
        } else {
          // console.log("Response data:", response.data.image);
          const imagePath = response.data.image;

          if (imagePath) {
            // console.log("Đã tải ảnh lên:", imagePath);
            toast.success("Thêm ảnh thành công");
            setProductImage(
              productImage instanceof File ? imagePath : productImage
            );
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

  // --------------------- HANDLE UPDATE PRODUCT -----------------------------
  useEffect(() => {
    if (open) {
      setProductName(dataEditProduct.productName);
      setCategoryId(dataEditProduct.categoryId);
      setDescription(dataEditProduct.description);
      setQuantity(dataEditProduct.quantity);
      setPrice(dataEditProduct.price);
      setProductImage(dataEditProduct.productImage);
      setDiscount(dataEditProduct.discount);
      setSaleStartTime(dataEditProduct.saleStartTime);
      setSaleEndTime(dataEditProduct.saleEndTime);
    }
  }, [dataEditProduct]);

  const handleEditProduct = async (productID) => {
    if (productName.trim() === "") {
      toast.error("Vui lòng nhập tên sản phẩm");
    } else if (description.trim() === "") {
      toast.error("Vui lòng nhập thông tin của sản phẩm");
    } else if (quantity === "") {
      toast.error("Vui lòng nhập số lượng của sản phẩm");
    } else if (discount === "") {
      toast.error("% giảm giá không được để trống");
    } else if (!validProductName) {
      toast.error(
        "Tên sản phẩm phải có ít nhất 3 kí tự và chỉ được nhập kí tự đặc biệt là & hoặc -"
      );
    } else if (discount < 0) {
      toast.error("% giảm giá không được âm ");
    } else if (discount > 100) {
      toast.error("% giảm giá không được lớn hơn 100");
    } else if (
      discount > 0 &&
      discount < 101 &&
      (!dayjs(saleStartTime).isValid() ||
        !dayjs(saleStartTime).hour() ||
        !dayjs(saleStartTime).minute())
    ) {
      toast.error("Ngày bắt đầu không thể bỏ trống");
      setSaleStartTime(dayjs());
    } else if (
      discount > 0 &&
      discount < 101 &&
      (!dayjs(saleEndTime).isValid() ||
        !dayjs(saleEndTime).hour() ||
        !dayjs(saleEndTime).minute())
    ) {
      toast.error("Ngày kết thúc không thể bỏ trống");
      setSaleEndTime(dayjs());
    } else if (dayjs(saleEndTime).isSame(dayjs(saleStartTime))) {
      toast.error(
        "Ngày bắt đầu không thể bằng ngày kết thúc! Vui lòng nhập lại."
      );
      setSaleStartTime(dayjs().toDate());
    } else if (dayjs(saleEndTime).isBefore(dayjs(saleStartTime))) {
      toast.error(
        "Ngày bắt đầu không thể sau ngày kết thúc! Vui lòng nhập lại."
      );
    } else if (dayjs().isAfter(dayjs(saleStartTime))) {
      toast.error("Ngày bắt đầu không thể ở quá khứ! Vui lòng nhập lại.");
    } else if (quantity < 0) {
      toast.error("Số lượng đang âm! Vui lòng nhập lại");
    } else if (!validQuantity) {
      toast.error(
        "Số lượng chỉ được nhập số và ít nhất 1 chữ số! Vui lòng nhập lại"
      );
    } else if (!validPrice) {
      toast.error("Giá tiền phải có ít nhất 4 chữ số và phải lớn hơn 0");
    } else if (!validDescription) {
      toast.error("Thông tin chi tiết không được để trống");
    } else {
      try {
        const res = await axios.patch(`http://localhost:3500/product`, {
          id: productID,
          productName: productName,
          categoryId: categoryId,
          description: description,
          quantity: quantity,
          price: price,
          discount: discount,
          saleStartTime: saleStartTime,
          saleEndTime: saleEndTime,
          productImage: productImage,
        });
        if (res.data.error) {
          toast.error("Lỗi Err", res.data.error);
        } else {
          // console.log(
          //   "kiểm tra dữ liệu chỉnh sửa",
          //   discount,
          //   saleStartTime,
          //   saleEndTime
          // );
          toast.success("Sửa thông tin sản phẩm thành công");
          handUpdateEditTable(page);
          onClose();
        }
      } catch (err) {
        // toast.error(err.message);
        if (err.response.data.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("Bạn chưa tải ảnh lên. Hãy nhấn tải ảnh");
        }
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
          Sửa thông tin sản phẩm
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
              // error={!validQuantity}
              // helperText={validQuantity ? "" : "Hãy nhập số lượng sản phẩm"}
            />

            <TextField
              required
              fullWidth
              label="Giá tiền sản phẩm"
              type="number"
              margin="normal"
              value={price}
              onChange={(e) => handleValidationPrice(e)}
              InputProps={{
                readOnly: true,
              }}
              variant="filled"
              // error={!validPrice}
              // helperText={validPrice ? "" : "Hãy nhập giá tiền sản phẩm"}
            />

            <TextField
              required
              fullWidth
              label="Giảm giá(%)"
              type="number"
              margin="normal"
              value={discount}
              // onChange={(e) => setDiscount(e.target.value)}
              onChange={handleDiscountChange}
            />

            {discount >= 1 && discount <= 100 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Ngày bắt đầu giảm giá"
                    value={dayjs(saleStartTime)}
                    onChange={handleStartDateChange}
                    minDate={dayjs()}
                    views={["year", "day", "hours", "minutes", "seconds"]}
                    // maxDate={currentDate}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Ngày kết thúc giảm giá"
                    value={dayjs(saleEndTime)}
                    onChange={handleEndDateChange}
                    views={["year", "day", "hours", "minutes", "seconds"]}
                  />
                </Grid>
              </Grid>
            )}

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
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Input
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  onChange={handleImageChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ButtonCustomize
                  onClick={handleUpload}
                  nameButton="Tải ảnh lên"
                  variant="contained"
                  sx={{ marginTop: "8px" }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                {productImage && (
                  <img
                    src={
                      productImage instanceof File
                        ? URL.createObjectURL(productImage)
                        : productImage
                    }
                    alt="Ảnh sản phẩm"
                    style={{ maxWidth: "300px" }}
                  />
                )}
              </Grid>
            </Grid>

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
            onClick={() => handleEditProduct(dataEditProduct._id)}
            nameButton="Sửa"
            variant="contained"
            sx={{ marginTop: "8px" }}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalEditProduct;
