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
import ButtonCustomize from "../Button/Button";

const PET_NAME_REGEX =
  /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ\s]{2,}$/;
const PET_HEIH_REGEX = /^\d*(\.\d+)?$/;

const ModalEditPet = (props) => {
  const {
    open,
    onClose,
    dataEditPet,
    handUpdateEditTable,
    page,
    data,
    category,
  } = props;

  const [userId, setUserId] = useState("");
  const [petName, setPetName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [rank, setRank] = useState(0);
  const [color, setColor] = useState("");
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [status, setStatus] = useState(false);
  const [petImage, setPetImage] = useState(null);

  // --------------------- HANLDE CHANGE STATUS -----------------------------
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    // console.log(status);
  };

  // --------------------- VALIDATION -----------------------------
  const [valid, setValid] = useState("");
  const [validHeight, setValidHeight] = useState("");
  const [validWeight, setValidWeight] = useState("");
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
    if (open) {
      setUserId(data);
    }
  }, [data]);

  // --------------------- HANDLE CHANGE IMAGE -----------------------------
  const handleImageChange = (e) => {
    setPetImage(e.target.files[0]);
  };

  // --------------------- HANDLE HANLDE UPLOAD IMAGE PET -----------------------------
  const handleUpload = async () => {
    try {
      // if (petImage) {
      const formData = new FormData();
      formData.append("image", petImage);
      const response = await axios.post(
        `http://localhost:3500/pet/upload`,
        formData
      );
      const maxSize = 1024 * 1024;
      if (petImage.size > maxSize) {
        toast.error("Ảnh có dung lượng nhỏ hơn 1MB");
      } else {
        // console.log("Response data:", response.data.image);
        const imagePath = response.data.image;

        if (imagePath) {
          // console.log("Đã tải ảnh lên:", imagePath);
          toast.success("Thêm ảnh thành công");
          setPetImage(petImage instanceof File ? imagePath : petImage);
        } else {
          // console.log("Lỗi: Không có đường dẫn ảnh sau khi tải lên.");
          toast.error("Lỗi: Không có đường dẫn ảnh sau khi tải lên.");
        }
      }
      // } else {
      //   // console.log("Vui lòng chọn ảnh trước khi tải lên.");
      //   toast.error("Vui lòng chọn ảnh trước khi tải lên.");
      // }
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
    }
  };

  // --------------------- HANDLE UPDATE PET -----------------------------
  useEffect(() => {
    if (open) {
      setUserId(dataEditPet.userId);
      setPetName(dataEditPet.petName);
      setCategoryId(dataEditPet.categoryId);
      setRank(dataEditPet.rank);
      setStatus(dataEditPet.status);
      setColor(dataEditPet.color);
      setHeight(dataEditPet.height);
      setWeight(dataEditPet.weight);
      setPetImage(dataEditPet.petImage);
    }
  }, [dataEditPet]);

  const handleEditPet = async (petID) => {
    // console.log(
    //   "Check data truyền vào của thú cưng",
    //   petName,
    //   userId._id,
    //   categoryId,
    //   rank,
    //   status,
    //   height,
    //   weight,
    //   color,
    //   petImage
    // );
    if (petName === "") {
      toast.error("Tên thú cưng không được để trống");
    } else if (!valid) {
      toast.error(
        "Tên thú cưng không được nhập số, kí tự đặc biệt và phải có ít nhất 2 kí tự"
      );
    } else if (categoryId === "") {
      toast.error("Bạn phải chọn loại thú cưng mình muốn");
    } else {
      try {
        const res = await axios.patch(`http://localhost:3500/pet`, {
          id: petID,
          userId: userId._id,
          petName: petName,
          categoryId: categoryId,
          rank: rank,
          status: status,
          height: height === "" ? null : height,
          weight: weight === "" ? null : weight,
          color: color,
          petImage: petImage,
        });
        if (res.data.error) {
          // console.log(res.data.error);
          toast.error("Bạn chưa tải ảnh lên. Hãy nhấn tải ảnh");
        } else {
          toast.success("Sửa thông tin thú cưng thành công");
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
          Sửa thông tin thú cưng
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
              sx={{ display: "none" }}
              onChange={(e) => setUserId(e.target.value)}
              // defaultValue={dataEditPet.userId.fullname}
            />
            <TextField
              required={true}
              fullWidth
              label="Tên thú cưng"
              margin="normal"
              value={petName}
              onChange={(e) => handleValidationPetName(e)}
              error={!valid}
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
              value={height}
              onChange={(e) => handleValidationPetHeight(e)}
            />

            <TextField
              fullWidth
              label="Cân nặng (kg)"
              margin="normal"
              value={weight}
              onChange={(e) => handleValidationPetWeight(e)}
            />

            <TextField
              fullWidth
              label="Mô tả màu lông"
              margin="normal"
              value={color}
              onChange={(e) => setColor(e.target.value)}
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
            <Typography>Ảnh thú cưng</Typography>
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
                {petImage && (
                  <img
                    src={
                      petImage instanceof File
                        ? URL.createObjectURL(petImage)
                        : petImage
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
            onClick={() => handleEditPet(dataEditPet._id)}
            nameButton="Sửa"
            variant="contained"
            sx={{ marginTop: "8px" }}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalEditPet;
