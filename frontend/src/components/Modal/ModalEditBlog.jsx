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
import { CardMedia, Container, Grid, Input } from "@mui/material";
import ButtonCustomize from "../Button/Button";

const Title_REGEX =
  /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ0-9\s]{3,}$/;
const CONTENT_REGEX =
  /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ0-9\!@#$:%^&,.?/()-\s]{1,}$/;
const PRICE_REGEX = /^[1-9]{1}\d{3,}$/;

const ModalEditBlog = (props) => {
  const { open, onClose, handUpdateTable, page, uId, dataEditBlog } = props;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState(null);

  //   const handleStatusChange = (event) => {
  //     setStatus(event.target.value);
  //     console.log(status);
  //   };

  // --------------------- VALIDATION -----------------------------
  const [validTitle, setValidTitle] = useState("");
  const [validContent, setValidContent] = useState("");
  useEffect(() => {
    setValidTitle(Title_REGEX.test(title) && title.trim() !== "");
  }, [title]);

  const handleValidationTitle = (e) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    setValidContent(CONTENT_REGEX.test(content) && content.trim());
  }, [content]);

  const handleValidationContent = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    // console.log("Kiểm tra image: ", e.target.files);
  };

  // --------------------- HANDLE HANLDE UPLOAD IMAGE BLOG -----------------------------
  const handleUpload = async () => {
    try {
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const response = await axios.post(
          `http://localhost:3500/blog/upload`,
          formData
        );
        const maxSize = 1024 * 1024;
        if (image.size > maxSize) {
          toast.error("Ảnh có dung lượng nhỏ hơn 1MB");
        } else {
          // console.log("Hình ảnh:", response.data.docs.image);
          const imagePath = response.data.docs.image;

          if (imagePath) {
            // console.log("Đã tải ảnh lên:", imagePath);
            toast.success("Thêm ảnh thành công");
            setImage(image instanceof File ? imagePath : image);
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

  // --------------------- HANDLE UPDATE BLOG -----------------------------
  useEffect(() => {
    if (open) {
      setUserId(dataEditBlog.userId);
      setTitle(dataEditBlog.title);
      setContent(dataEditBlog.content);
      setImage(dataEditBlog.image);
    }
  }, [dataEditBlog]);

  const handleEditBlog = async (blogId) => {
    // console.log("Check data truyền vào blog", title, content, userId, image);
    if (title.trim() === "") {
      toast.error("Tiêu dề không được để trống");
    } else if (!validTitle) {
      toast.error(
        "Tiêu đề không được nhập số, kí tự đặc biệt và phải có ít nhất 3 kí tự"
      );
    } else if (content.trim() === "") {
      toast.error("Nội dung không được để trống");
    } else {
      try {
        const res = await axios.patch(`http://localhost:3500/blog/${blogId}`, {
          id: blogId,
          title: title,
          content: content,
          image: image,
        });
        if (res.data.error) {
          // console.log(res.data.error);
          toast.error("Bạn chưa tải ảnh lên. Hãy nhấn tải ảnh");
        } else {
          toast.success("Sửa thông tin thành công");
          handUpdateTable(page);
          onClose();
        }
      } catch (err) {
        // toast.error(err.message);
        toast.error(err.message);
        // console.log(err.message);
      }
    }
  };

  useEffect(() => {
    if (open) {
      setUserId(uId);
    }
  }, [uId]);

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
          Thêm bài đăng
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
              label="Tiêu đề"
              margin="normal"
              value={title}
              onChange={(e) => handleValidationTitle(e)}
            />

            <TextField
              label="Thông tin bài đăng"
              fullWidth
              placeholder="Điền thông tin bài đăng ở đây"
              multiline
              rows={4}
              margin="normal"
              maxRows={4}
              value={content}
              onChange={(e) => handleValidationContent(e)}
            />
            <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
              <Typography>Ảnh tin tức</Typography>
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
                  {image && (
                    <img
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      alt="Ảnh tin tức"
                      style={{ maxWidth: "300px" }}
                    />
                  )}
                </Grid>
              </Grid>
            </Container>
          </form>
        </DialogContent>
        <DialogActions>
          <ButtonCustomize
            onClick={() => handleEditBlog(dataEditBlog._id)}
            nameButton="Lưu thay đổi"
            variant="contained"
            sx={{ marginTop: "8px" }}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalEditBlog;
