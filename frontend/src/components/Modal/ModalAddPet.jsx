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
import { Grid, Input } from "@mui/material";
import ButtonCustomize from "../Button/Button";

const PET_NAME_REGEX =
  /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ\s]{2,}$/;
// /^[ A-Za-z0-9À-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ\s]+$/;
const PET_HEIH_REGEX = /^\d*(\.\d+)?$/;
const ModalAddPet = (props) => {
  const { open, onClose, handUpdateTable, page, data, category } = props;

  const [userId, setUserId] = useState("");
  const [petName, setPetName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [rank, setRank] = useState(0);
  const [status, setStatus] = useState(true);
  const [color, setColor] = useState("");
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [image, setImage] = useState(null);

  // --------------------- HANLDE CHANGE STATUS -----------------------------
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  // --------------------- VALIDATION -----------------------------
  const [valid, setValid] = useState("");
  const [validHeight, setValidHeight] = useState("");
  const [validWeight, setValidWeight] = useState("");
  const [validColor, setValidColor] = useState("");

  useEffect(() => {
    setValid(PET_NAME_REGEX.test(petName.trim()));
  }, [petName]);

  const handleValidationPetName = (e) => {
    setPetName(e.target.value);
  };

  useEffect(() => {
    setValidHeight(PET_HEIH_REGEX.test(height));
  }, [height]);

  const handleValidationPetHeight = (e) => {
    setHeight(e.target.value);
  };

  useEffect(() => {
    setValidWeight(PET_HEIH_REGEX.test(weight));
  }, [weight]);

  const handleValidationPetWeight = (e) => {
    setWeight(e.target.value);
  };

  useEffect(() => {
    setValidColor(color.trim());
  }, [color]);

  const handleValidationColor = (e) => {
    setColor(e.target.value);
  };

  useEffect(() => {
    if (open) {
      setUserId(data);
    }
  }, [data]);

  // --------------------- HANDLE HANLDE CHANGE IMAGE -----------------------------
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    // console.log("Kiểm tra image: ", e.target.files);
  };

  // --------------------- HANDLE HANLDE UPLOAD IMAGE PET -----------------------------
  const handleUpload = async () => {
    const maxSize = 1024 * 1024;

    try {
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const response = await axios.post(
          `http://localhost:3500/pet/upload`,
          formData
        );
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
      console.error("Lỗi khi tải ảnh lên:", error);
    }
  };

  // --------------------- HANDLE CREATE PET -----------------------------
  const handleCreateService = async (petImage) => {
    // console.log(
    //   userId,
    //   petName,
    //   categoryId,
    //   rank,
    //   status,
    //   color,
    //   height,
    //   weight,
    //   petImage
    // );
    if (petName.trim() === "") {
      toast.error("Tên thú cưng không được để trống");
    } else if (!valid) {
      toast.error(
        "Tên thú cưng không được nhập số, kí tự đặc biệt và phải có ít nhất 2 kí tự"
      );
    } else if (categoryId === "") {
      toast.error("Bạn phải chọn loại thú cưng mình muốn");
    } else {
      try {
        const response = await axios.post("http://localhost:3500/pet", {
          userId: data,
          petName,
          categoryId,
          rank,
          status,
          color,
          height: height === "" ? null : height,
          weight: weight === "" ? null : weight,
          petImage,
        });
        if (response.error) {
          toast.error(response.error);
        } else {
          // console.log("Thành công!!", response);
          toast.success("Thêm mới thú cưng thành công!");
          setUserId("");
          setPetName("");
          setCategoryId("");
          setRank(0);
          setStatus(true);
          setColor("");
          setHeight(null);
          setWeight(null);
          setImage(null);
          handUpdateTable();
          onClose();
        }
      } catch (error) {
        // console.log(error);
        toast.error(error.response.data.error);
      }
    }
  };

  // --------------------- HANDLE CHANGE CATEGORY PET -----------------------------
  const handleChangePet = (e) => {
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
          Thêm thú cưng mới
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
              required
              fullWidth
              label="Id chủ thú cưng"
              margin="normal"
              value={data}
              onChange={(e) => setUserId(e.target.value)}
              sx={{ display: "none" }}
            />
            <TextField
              required={true}
              fullWidth
              label="Tên thú cưng"
              margin="normal"
              value={petName}
              onChange={(e) => handleValidationPetName(e)}
              // error={!valid}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-select-small-label">
                Chọn loại thú cưng
              </InputLabel>
              <Select
                label="Loại thú cưng"
                value={categoryId}
                onChange={handleChangePet}
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
              fullWidth
              label="Chiều cao (cm)"
              margin="normal"
              type="number"
              value={height}
              onChange={(e) => handleValidationPetHeight(e)}
            />

            <TextField
              fullWidth
              label="Cân nặng (kg)"
              margin="normal"
              type="number"
              value={weight}
              onChange={(e) => handleValidationPetWeight(e)}
            />

            <TextField
              fullWidth
              label="Mô tả màu lông"
              margin="normal"
              value={color}
              onChange={(e) => handleValidationColor(e)}
            />

            <TextField
              required={true}
              fullWidth
              label="Cấp thú cưng ban đầu"
              type="number"
              margin="normal"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              InputProps={{
                readOnly: true,
              }}
              variant="filled"
            />
            <Typography>Ảnh thú cưng</Typography>
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
                style={{ maxWidth: "300px" }}
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
                label="Sức khoẻ tốt"
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Sức khoẻ xấu"
              />
            </RadioGroup>
          </form>
        </DialogContent>
        <DialogActions>
          <ButtonCustomize
            onClick={handleUpload}
            nameButton="Thêm thú cưng"
            variant="contained"
            sx={{ marginTop: "8px" }}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalAddPet;
