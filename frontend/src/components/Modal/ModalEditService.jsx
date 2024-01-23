import { useEffect, useState } from "react";
// import Button from "@mui/material/Button";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Grid, Input, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ButtonCustomize from "../Button/Button";

const SERVICE_NAME_REGEX =
  /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ0-9&-\s]{3,}$/;
const PRICE_REGEX = /^[1-9]{1}\d{3,}$/;
// const DESCRIPTION_REGEX =
//   /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ0-9@#$:%^&,.?/()\s]{1,}$/;

const ModalEditSerivce = (props) => {
  const {
    open,
    onClose,
    handUpdateEditTable,
    dataEditService,
    category,
    page,
  } = props;
  const currentDate = dayjs();
  const [serviceName, setServiceName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [serviceImage, setServiceImage] = useState(null);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState(true);
  const [discount, setDiscount] = useState();
  const [saleStartTime, setSaleStartTime] = useState(null);
  const [saleEndTime, setSaleEndTime] = useState(null);
  const [isStartDateVisible, setIsStartDateVisible] = useState(false);

  // --------------------- HANLDE CHANGE STATUS -----------------------------
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    // console.log(status);
  };

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
  const [validServiceName, setValidServiceName] = useState("");
  const [validPrice, setValidPrice] = useState("");
  const [validDescription, setValidDescription] = useState("");
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

  // --------------------- HANDLE CHANGE IMAGE -----------------------------
  const handleImageChange = (e) => {
    setServiceImage(e.target.files[0]);
    // console.log("Kiểm tra image: ", e.target.files);
  };

  // --------------------- HANDLE HANLDE UPLOAD IMAGE SERVICE -----------------------------
  const handleUpload = async () => {
    try {
      if (serviceImage) {
        const formData = new FormData();
        formData.append("image", serviceImage);
        const response = await axios.post(
          `http://localhost:3500/service/upload`,
          formData
        );
        const maxSize = 1024 * 1024;
        if (serviceImage.size > maxSize) {
          toast.error("Ảnh có dung lượng lớn hơn 1MB. Vui lòng chọn ảnh khác!");
        } else {
          // console.log("Response data:", response.data.image);
          const imagePath = response.data.image;

          if (imagePath) {
            // console.log("Đã tải ảnh lên:", imagePath);
            toast.success("Thêm ảnh thành công");
            setServiceImage(
              serviceImage instanceof File ? imagePath : serviceImage
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

  // --------------------- HANLDE UPDATE SERVICE -----------------------------
  useEffect(() => {
    if (open) {
      setServiceName(dataEditService.serviceName);
      setCategoryId(dataEditService.categoryId);
      setDescription(dataEditService.description);
      setPrice(dataEditService.price);
      setStatus(dataEditService.status);
      setDiscount(dataEditService.discount);
      setSaleStartTime(dataEditService.saleStartTime);
      setSaleEndTime(dataEditService.saleEndTime);
      setServiceImage(dataEditService.serviceImage);
    }
  }, [dataEditService]);

  const handleEditService = async (serviceID) => {
    if (serviceName.trim() === "") {
      toast.error("Vui lòng nhập tên dịch vụ");
    } else if (!validServiceName) {
      toast.error(
        "Tên dịch vụ phải có ít nhất 3 kí tự và chỉ được nhập kí tự đặc biệt là & hoặc -"
      );
    } else if (description.trim() === "") {
      toast.error("Vui lòng nhập thông tin của dịch vụ");
    } else if (price === "") {
      toast.error("Vui lòng nhập giá tiền dịch vụ");
    } else if (price < 0) {
      toast.error("Giá tiền phải lớn hơn 0. Vui lòng nhập lại!");
    } else if (discount === "") {
      toast.error("% giảm giá không được để trống. Vui lòng nhập lại!");
    } else if (categoryId === "") {
      toast.error("Bạn phải chọn loại dịch vụ mình muốn");
    } else if (discount === "") {
      toast.error("Giảm giá không được để trống");
      setSaleStartTime(null);
      setSaleEndTime(null);
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
    } else if (dayjs(saleEndTime).isBefore(dayjs(saleStartTime))) {
      toast.error(
        "Ngày bắt đầu không thể sau ngày kết thúc! Vui lòng nhập lại."
      );
    } else if (dayjs().isAfter(dayjs(saleStartTime))) {
      toast.error("Ngày bắt đầu không thể ở quá khứ! Vui lòng nhập lại.");
      // setSaleStartTime(dayjs().toDate());
    } else if (!validPrice) {
      toast.error(
        "Giá tiền phải có ít nhất 4 chữ số và số đầu tiên không phải số 0"
      );
    } else {
      try {
        const res = await axios.patch(`http://localhost:3500/service`, {
          id: serviceID,
          serviceName: serviceName,
          categoryId: categoryId,
          description: description,
          price: price,
          status: status,
          discount: discount,
          saleStartTime: saleStartTime,
          saleEndTime: saleEndTime,
          serviceImage: serviceImage,
        });
        if (res.data.error) {
          // console.log(res.data.error);
          toast.error("Bạn chưa tải ảnh lên. Hãy nhấn tải ảnh");
        } else {
          toast.success("Sửa dịch vụ thành công");
          handUpdateEditTable(page);
          onClose();
        }
      } catch (err) {
        if (err.response.data.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("Bạn chưa tải ảnh lên. Hãy nhấn tải ảnh");
        }
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
          Sửa dịch vụ
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
              // error={!validServiceName}
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
              InputProps={{
                readOnly: true,
              }}
              variant="filled"
              onChange={(e) => handleValidationPrice(e)}
              // error={!validPrice}
              // helperText={validPrice ? "" : "Hãy nhập số tiền dịch vụ"}
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
                    minDate={dayjs()}
                    views={["year", "day", "hours", "minutes", "seconds"]}
                  />
                </Grid>
              </Grid>
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

            <Typography>Ảnh dịch vụ</Typography>
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
                {serviceImage && (
                  <img
                    src={
                      serviceImage instanceof File
                        ? URL.createObjectURL(serviceImage)
                        : serviceImage
                    }
                    alt="Ảnh sản phẩm"
                    style={{ maxWidth: "300px" }}
                  />
                )}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <ButtonCustomize
            onClick={() => handleEditService(dataEditService._id)}
            nameButton="Lưu thay đổi"
            variant="contained"
            sx={{ marginTop: "8px" }}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalEditSerivce;
