import React, { useState, useEffect } from "react";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import Grid from "@mui/material/Unstable_Grid2";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, NavLink } from "react-router-dom";
import Banner from "../../../images/bradcam.png";
import {
  Typography,
  Container,
  Button,
  Box,
  Avatar,
  Breadcrumbs,
  Backdrop,
  CircularProgress,
  Link
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import HomeIcon from "@mui/icons-material/Home";
import "./styled/AdoptPageDetail.css"
import useAuth from "../../../hooks/useAuth";
import { notification } from 'antd';

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Space } from 'antd';

const { confirm } = Modal;

const BASE_URL = "";

const AdoptPageDetail = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const context = useAuth();

  //----------------------------- NOTIFICATION ------------------------------
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, mess) => {
    api[type]({
      message: 'Thông báo',
      description: mess
    });
  };

  const showConfirm = () => {
    confirm({
      title: 'Bạn chắc chắn muốn nhận nuôi bé?',
      icon: <ExclamationCircleFilled />,
      content: '-------------------',
      onOk() {
        console.log('Vâng');
        createAdoptNotification();
      },
      onCancel() {
        console.log('không');
      },
    });
  };

  // ---------------------------------- API CREATE ADOPT NOTIFICATION ------------------------------
  const createAdoptNotification = async () => {
    try {
      const result = await axios.post(`${BASE_URL}/adopt/createAdoptNotification`, {
        userId: context.auth.id,
        petId: petId,
        ownerId: pet.userId
      });
      if (result.error) {
        openNotificationWithIcon('error', "Bạn đã đăng ký nhận nuôi bé rồi, vui lòng chờ xác nhận từ chủ nhân bé!");
      } else {
        openNotificationWithIcon('success', 'Nhận nuôi thành công! Vui lòng chờ xác nhận từ chủ nhân bé!');
      }
    } catch (err) {
      openNotificationWithIcon('error', "Bạn đã đăng ký nhận nuôi bé rồi, vui lòng chờ xác nhận từ chủ nhân bé!");
      console.log(err);
    }
  };



  // ----------------------------------- API GET ADOPT PET BY ID --------------------------------
  useEffect(() => {
    loadPetById();
  }, []);

  const loadPetById = async () => {
    try {
      const loadData = await axios.get(`${BASE_URL}/adopt/${petId}`);
      if (loadData.error) {
        console.log(loadData.error);
      } else {
        setPet(loadData.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!pet) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const handleScrollToService = () => {
    const serviceSection = document.getElementById('serviceSection');
    if (serviceSection) {
      serviceSection.scrollIntoView({ behavior: 'smooth' });
    }
  };



  return (
    <>
      {contextHolder}
      <ToastContainer />
      <Grid
        className="banner"
        container
        sx={{
          backgroundImage: `url(${Banner})`,
          backgroundSize: "cover",
          backgroundRepeat: "round",
          height: "150px",
          position: "relative",
          top: "80px",
        }}
      >
        <Container
          sx={{ display: "flex", flexWrap: "wrap", alignContent: "center" }}
        >
          <Grid item lg={12} md={12}>
            <Box className="banner_content" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <Typography variant="h4" sx={{ color: "#ffffff" }}>Thông tin từng bé</Typography>
            </Box>
          </Grid>
        </Container>
      </Grid>
      <Header />

      <Container sx={{ position: "relative", top: "120px", marginBottom: "150px" }}>

        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<KeyboardDoubleArrowRightIcon fontSize="small" />}
        >
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            href="/"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="medium" />
            Trang chủ
          </Link>
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            href="/product-homepage"
          >
            Nhận nuôi
          </Link>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="#000000"
          >
            Thú cưng
          </Typography>
        </Breadcrumbs>
        <Box className="content-details">
          <Grid container>
            <Grid item xl={5} lg={5}>
              <Box>
                <img
                  className="img_zoom"
                  src={
                    pet.petImage}
                  alt="img"
                  style={{ width: "-webkit-fill-available" }}
                />
              </Box>
            </Grid>
            <Grid item xl={7} lg={7} className="details-infor">
              <Typography variant="h1" className="adopt-name">
                {pet.petName}
              </Typography>
              <Typography variant="h3" className="adopt-detail">
                Giống:
                <span> {pet.breed} </span>
              </Typography>
              <Typography variant="h3" className="adopt-detail">
                Màu sắc:
                <span> {pet.color} </span>
              </Typography>
              <Typography variant="h3" className="adopt-detail">
                Tuổi:
                <span> {pet.age} </span>
              </Typography>
              <Typography variant="h3" className="adopt-detail">
                Cân nặng:
                <span> {pet.weight} </span>
              </Typography>
              <Typography variant="h3" className="adopt-detail">
                Giới tính:
                <span> {pet.sex === "male" ? "Đực" : "Cái"} </span>
              </Typography>
              <Typography variant="h3" className="adopt-detail">
                Điện thoại liên lạc:
                <span> {pet.userId.phone} </span>
              </Typography>

              <Box className="adopt-add-to-cart">
                <Button
                  className="single-adopt-add-to-cart"
                  variant="contained"
                  color="primary"
                  onClick={showConfirm}
                >
                  Nhận nuôi
                </Button>
                <Button
                  className="adopt-ask"
                  variant="contained"
                  color="primary"
                  onClick={handleScrollToService}
                >
                  Bạn có câu hỏi ?
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>


      </Container>
      <Container id="serviceSection" className="service" sx={{ padding: "100px 24px 0px 24px" }}>
        <Grid container justifyContent="center">
          <Grid item lg={7} md={10}>
            <Box className="section_title" sx={{ marginBottom: "0" }}>
              <Typography variant="h3">Quy trình nhận nuôi</Typography>
              <Typography variant="h4" style={{ margin: "20px 0" }}>
                Trước khi quyết định nhận nuôi bé chó hay mèo nào, bạn hãy tự hỏi bản thân rằng mình đã sẵn sàng để chịu trách nhiệm cả đời cho bé chưa, cả về tài chính, nơi ở cũng như tinh thần.
                Việc nhận nuôi cần được sự đồng thuận lớn từ bản thân bạn cũng như gia đình và những người liên quan.
                Xin cân nhắc kỹ trước khi liên hệ với ANL về việc nhận nuôi.
              </Typography>
              <Typography variant="h4" style={{ margin: "20px 0" }}>
                Bạn đã sẵn sàng? Hãy thực hiện các bước sau đây nhé:
              </Typography>
              <Typography variant="h4" style={{ margin: "1px 0 " }}>
                1️⃣ Tìm hiểu về thú cưng bạn muốn nhận nuôi trên trang web của ANL
              </Typography>
              <Typography variant="h4" style={{ margin: "1px 0 " }}>
                2️⃣ Liên hệ với Tình nguyện viên phụ trách bé để tìm hiểu thêm về bé.
              </Typography>
              <Typography variant="h4" style={{ margin: "1px 0 " }}>
                3️⃣ Tham gia phỏng vấn nhận nuôi.
              </Typography>
              <Typography variant="h4" style={{ margin: "1px 0 " }}>
                4️⃣ Chuẩn bị cơ sở vật chất, ký giấy tờ nhận nuôi và đóng tiền vía để đón bé về.
              </Typography>
              <Typography variant="h4" style={{ margin: "1px 0 " }}>
                5️⃣ Thường xuyên cập nhật về tình hình của bé, đặc biệt là khi có sự cố để được tư vấn kịp thời.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container >
      <Footer />
    </>
  );
};

export default AdoptPageDetail;
