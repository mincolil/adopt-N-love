import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  Toolbar,
  AppBar,
  CircularProgress,
  Backdrop,
  Paper,
  Divider,
  Container,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Avatar, CardActionArea, IconButton, Tooltip } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../../components/Footer/Footer";

const Image = styled("img")({
  maxWidth: "100%",
  maxHeight: 400,
});

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const CustomContainer = styled(Container)({
  background:
    "linear-gradient(to bottom, #F4BEB2, #F4BEB2, #ECDAD6, #E5E6E7, #73A1CC)",
});

const BASE_URL = "http://localhost:3500";

const defaultTheme = createTheme();

const Introduce = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <CustomContainer component="main" maxWidth="full" sx={{ pt: 12 }}>
        {/* <MainPost post={mainPost} /> */}
        <Container
          maxWidth="full"
          sx={{
            bgcolor: "background.paper",
            p: 3,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            borderRadius: "16px",
          }}
        >
          <Breadcrumbs maxItems={2} aria-label="breadcrumb">
            <StyledBreadcrumb
              component={NavLink}
              to="/"
              label="Trang chủ"
              icon={<HomeIcon fontSize="small" />}
            />
            {/* <StyledBreadcrumb component="a" href="#" label="Catalog" /> */}
            <StyledBreadcrumb
              component={NavLink}
              to="/introduce-homepage"
              label="Giới thiệu"
            />
            <StyledBreadcrumb label="Pet Care- nâng lưu thú cưng của bạn" />
          </Breadcrumbs>
        </Container>
        <Grid container spacing={3} sx={{ flexGrow: 2 }}>
          <Grid item xs={12} sm={12}>
            <Container maxWidth="false" sx={{ pb: 3 }}>
              <Paper
                variant="outlined"
                sx={{ my: { xs: 3, md: 5 }, p: { xs: 2, md: 3 } }}
              >
                <Box sx={{ flexGrow: 2, padding: 8 }}>
                  {/* <Grid container spacing={3}> */}
                  <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
                    <strong>Pet Care- nâng lưu thú cưng của bạn</strong>
                  </Typography>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Image
                      src="https://vuipet.com/wp-content/uploads/2022/04/cho-phoc-soc-mini-gia-re-3.jpg"
                      alt="Pet Care"
                    />
                  </Grid>
                  <Typography variant="h5">
                    Xuất phát từ những con người có tình cảm đặc biệt với thú
                    cưng, chúng tôi nhận thấy công việc chăm sóc thú cưng cần
                    được đặc biệt quan tâm hơn một cách khoa học và logic. Chính
                    vì thế Pet Care ra đời.
                  </Typography>

                  <Typography variant="h5">
                    PetCare là nơi bạn không chỉ có thể tìm mua các vật dụng, đồ
                    dùng dành cho thú cưng mà còn cung cấp đầy đủ các dịch vụ
                    chăm sóc, khám chữa bệnh và các dịch vụ thẩm mỹ cho thú
                    cưng. Đặc biệt với trang web Pet Care, bạn có thể đăng ký
                    tài khoản, tạo hồ sơ cho thú cưng của mình và đặt lịch từ xa
                    đối với các dịch vụ hệ thống cung cấp. Việc sử dụng dịch vụ
                    và lưu thông tin thú cưng sẽ giúp bạn cũng như các bác sỹ
                    thú y dễ dàng theo dõi, chăm sóc thú cưng của bạn một cách
                    tốt nhất.
                  </Typography>
                  <Grid item xs={12} sm={12}>
                    <Image
                      src="https://vuipet.com/wp-content/uploads/2022/04/cho-phoc-soc-mini-7.jpg"
                      alt="Pet Care"
                    />
                  </Grid>
                  <Typography variant="h5">
                    Tại PetCare, đội ngũ bác sĩ của chúng tôi không những có
                    chứng chỉ y khoa mà còn được tham gia các khóa đào tạo để
                    nâng cao năng lực và làm việc cộng với cơ sở vật chất hiện
                    đại nhằm duy trì tiêu chuẩn cao trong công tác chăm sóc sức
                    khỏe vật nuôi. Các dịch vụ đều được làm theo các quy trình
                    chuẩn khoa học, an toàn và logic.
                  </Typography>
                  <Typography variant="h5">
                    Các vật dụng ý tế, chăm sóc, thuốc, vaccine đều được nhập
                    chính hãng từ các cơ sở dược liệu uy tín trong và ngoài
                    nước.
                  </Typography>
                </Box>
              </Paper>
            </Container>
          </Grid>
        </Grid>
      </CustomContainer>

      {/* End footer */}
      <Footer />
    </ThemeProvider>
  );
};

export default Introduce;
