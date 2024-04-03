import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { Avatar, Box, Container, Grid, Stack, TextField } from "@mui/joy";
import PetsIcon from "@mui/icons-material/Pets";
import { Breadcrumbs, Modal, Pagination } from "@mui/material";
import ModalAddPet from "../../components/Modal/ModalAddPet";
import ModalEditPet from "../../components/Modal/ModalEditPet";
import { Link, NavLink } from "react-router-dom";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize, styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Background from "../../images/background.png";
import { orange } from '@mui/material/colors';
import Icon from "../../images/adapt_icon_2.png";
import ModalDetailPet from "../../components/Modal/ModalDetailPet";
import ServiceListModal from "../../components/Modal/ModalServiceList";

const CustomContainer = styled(Container)({
  background:
    "linear-gradient(to bottom, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF)",
});

const defaultTheme = createTheme();

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

export default function PetUser() {
  const [data, setData] = useState([]);

  const [totalPets, setTotalPets] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const context = useAuth();
  const { auth } = context

  // ----------------------------------- API GET ALL PET BY USER ID--------------------------------
  useEffect(() => {
    if (auth)
      loadAllPetByUserId(currentPage);
  }, [currentPage, auth]);

  const loadAllPetByUserId = async (page) => {
    console.log("Kiểm tra page", page);
    try {
      const loadDataPet = await axios.get(
        `http://localhost:3500/pet/userid?id=${context.auth.id}&limit=2&page=${page}`
      );
      if (loadDataPet.error) {
        toast.error(loadDataPet.error);
      } else {
        setTotalPages(loadDataPet.data.pages);
        // console.log("Check totalPage", totalPages);
        setData(loadDataPet.data.docs);
        setTotalPets(loadDataPet.data.limit);
        // console.log("Kiểm tra pet của người dùng", loadDataPet.data.docs);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // --------------------- Click paging -----------------------------
  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  // --------------------- color theme -----------------------------
  const { palette } = createTheme();
  const { augmentColor } = palette;
  const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
  const theme = createTheme({
    palette: {
      orange: createColor('#ed6c021'),
      apple: createColor('#5DBA40'),
      steelBlue: createColor('#5C76B7'),
      violet: createColor('#BC00A3'),
    },
  });

  // --------------------- MODAL HANDLE -----------------------------
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataEditPet, setDataEditPet] = useState({});
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [dataDetailPet, setDataDetailPet] = useState({});

  // --------------------- OPEN MODAL  -----------------------------
  const handleCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleUpdatePet = (pet) => {
    // console.log("Check data", pet);
    setDataEditPet(pet);
    setOpenEditModal(true);
  };

  const handleDetailPet = (pet) => {
    // console.log("Check data", pet);
    setDataDetailPet(pet);
    setOpenDetailModal(true);
  };

  const handleServiceModal = (pet) => {
    setDataDetailPet(pet);
    setOpenServiceModal(true);
  };

  // --------------------- CLOSE MODAL  -----------------------------
  const handleCloseModal = () => {
    setOpenCreateModal(false);
    setOpenEditModal(false);
    setOpenDetailModal(false);
    setOpenServiceModal(false);
  };

  // --------------------- GET ALL CATEGORY PET -----------------------------
  const [category, setCategory] = useState([]);
  async function loadAllCategoryPet() {
    try {
      const loadDataCategoryPet = await axios.get(
        `http://localhost:3500/category?categoryName=Thú cưng`
      );
      if (loadDataCategoryPet.error) {
        toast.error(loadDataCategoryPet.error);
      } else {
        setCategory(loadDataCategoryPet.data.docs);
        // console.log(loadDataCategoryPet.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadAllCategoryPet();
  }, []);

  //---------------------- HNADLE ADOPT PET -----------------------------
  const handleAdoptPet = (pet) => {
    try {
      const updatePet = axios.patch(`http://localhost:3500/pet/adopt`, {
        id: pet._id,
        forAdoption: !pet.forAdoption,
      });
      if (updatePet.error) {
        toast.error(updatePet.error);
      } else {
        toast.success("Cập nhật thành công");
        loadAllPetByUserId(currentPage);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <toastContainer />
      <Header />
      <React.Fragment>
        <CustomContainer component="main" maxWidth="false" sx={{ pt: 10, pb: 4 }}>
          <Container
            component="main"
            maxWidth="lg"
            sx={{ mt: 4, display: "flex", flexDirection: "row" }}
          >
            {data &&
              data.map((value, index) => {
                const statusColor = value.status ? "primary" : "error";
                return (
                  <Card
                    data-resizable
                    sx={{
                      mr: 3,
                      textAlign: "center",
                      alignItems: "center",
                      width: 343,
                      // to make the demo resizable
                      overflow: "auto",
                      resize: "horizontal",
                      "--icon-size": "100px",
                      boxShadow: "1px 2px 9px #000000",
                    }}
                  >
                    <CardOverflow
                      variant="solid"
                      style={{ backgroundColor: "#f57c00", backgroundImage: `url(${Background})` }}
                      sx={{
                        resize: "vertical",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      {value.discount > 0 && (
                        <Card
                          style={{
                            position: "absolute",
                            top: "0px",
                            right: "0px",
                            fontSize: "18px",
                            alignItems: "center",
                            padding: "5px",
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                              color: "#fff",
                              backgroundColor: "#ffffff",
                              fontSize: "1rem",
                              borderRadius: "2px",
                              padding: "2px 4px",
                              fontWeight: "800",
                              whiteSpace: "nowrap",
                              textTransform: "uppercase",
                              color: "#f57c00",
                            }}
                          >
                            Ưu đãi
                            <br />
                            {value.discount}%
                          </Typography>
                        </Card>
                      )}
                      <AspectRatio
                        variant="outlined"
                        style={{ backgroundColor: "#f57c00" }}
                        ratio="1"
                        sx={{
                          m: "auto",
                          transform: "translateY(50%)",
                          borderRadius: "50%",
                          width: "var(--icon-size)",
                          boxShadow: "sm",
                          bgcolor: "background.surface",
                          position: "relative",
                        }}
                      >
                        <Avatar
                          onClick={() => handleDetailPet(value)}
                          src={
                            value.petImage !== undefined
                              ? `${value.petImage}`
                              : "https://static2-images.vnncdn.net/files/publish/2022/12/8/meo-1-1416.jpg"
                          }
                        />
                      </AspectRatio>

                      <AspectRatio
                        variant="outlined"
                        color="warning"
                        ratio="1"
                        sx={{
                          m: "auto",
                          transform: "translateY(90%)",
                          borderRadius: "50%",
                          width: "var(--icon-size)",
                          boxShadow: "sm",
                          bgcolor: "background.surface",
                          position: "relative",
                          width: "20%",
                        }}
                      >
                        <Typography level="h2" component="div">
                          LV{value.rank}
                        </Typography>
                      </AspectRatio>
                    </CardOverflow>
                    <Typography
                      level="h2"
                      sx={{ mt: "calc(var(--icon-size) / 2)" }}
                    >
                      🎊 {value.petName} 🎊
                    </Typography>
                    {/* <Typography level="h3" component="div">
                      Chủ nhân
                    </Typography>
                    <Typography level="h2" sx={{ maxWidth: "40ch" }}>
                      {value.userId.fullname}
                    </Typography> */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h5" component="h1">
                          Chiều cao
                        </Typography>
                        <Typography level="h4" sx={{ maxWidth: "40ch" }}>
                          {value.height}cm
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h5" component="h1">
                          Cân nặng
                        </Typography>
                        <Typography level="h4" sx={{ maxWidth: "40ch" }}>
                          {value.weight}kg
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h5" component="h1">
                          Màu lông
                        </Typography>
                        <Typography level="h4" sx={{ maxWidth: "40ch" }}>
                          {value.color}kg
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h5" component="h1">
                          Giống
                        </Typography>
                        <Typography level="h4" sx={{ maxWidth: "40ch" }}>
                          {value.breed}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h5" component="h1">
                          Tuổi
                        </Typography>
                        <Typography level="h4" sx={{ maxWidth: "40ch" }}>
                          {value.age}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={value.status ? "Sức khoẻ tốt" : "Sức khoẻ xấu"}
                          color={statusColor}
                        />
                      </Grid>
                      {value.forAdoption && (
                        <Grid item xs={12} sm={6}>
                          <Chip
                            size="small"
                            variant="outlined"
                            label="Đã đăng ký nhận nuôi"
                            color="primary"
                          />
                        </Grid>
                      )}
                    </Grid>
                    <CardActions
                      orientation="vertical"
                      buttonFlex={1}
                      sx={{
                        "--Button-radius": "40px",
                        width: "clamp(min(100%, 160px), 50%, min(100%, 200px))",
                      }}
                    >
                      <Button onClick={() => handleServiceModal(value)} variant="solid" color="warning" style={{ backgroundColor: "#f57c00" }}>
                        Đăng ký phòng khám
                      </Button>
                      <Button onClick={(e) => {
                        e.stopPropagation();
                        handleAdoptPet(value);
                      }} variant="solid" color="warning" style={{ backgroundColor: "#f57c00" }}>
                        {value.forAdoption ? "Cancel Adopt" : "Adopt"}
                      </Button>
                      <Button onMouseDown={() => handleUpdatePet(value)} variant="solid" color="warning" style={{ backgroundColor: "#f57c00" }}>
                        Sửa
                      </Button>
                    </CardActions>
                  </Card>
                );
              })}
            <Card
              data-resizable
              sx={{
                textAlign: "center",
                alignItems: "center",
                width: 343,
                // to make the demo resizable
                overflow: "auto",
                resize: "horizontal",
                "--icon-size": "100px",
                boxShadow: "1px 2px 9px #000000"
              }}
            >
              <CardOverflow
                variant="solid"
                style={{ backgroundColor: "#f57c00", backgroundImage: `url(${Background})` }}
                sx={{
                  resize: "vertical",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AspectRatio
                  variant="outlined"
                  color="warning"
                  ratio="1"
                  sx={{
                    m: "auto",
                    transform: "translateY(50%)",
                    borderRadius: "50%",
                    width: "var(--icon-size)",
                    boxShadow: "sm",
                    bgcolor: "background.surface",
                    position: "relative",
                  }}
                >
                  <Avatar
                    src={
                      Icon
                    }
                  />
                </AspectRatio>
              </CardOverflow>
              <Typography
                level="title-lg"
                sx={{ mt: "calc(var(--icon-size) / 2)" }}
              >
                Thêm thú cưng
              </Typography>

              <CardActions
                orientation="vertical"
                buttonFlex={1}
                sx={{
                  "--Button-radius": "40px",
                  width: "clamp(min(100%, 160px), 50%, min(100%, 200px))",
                }}
              >
                <Button
                  variant="solid"
                  color="warning"
                  onClick={handleCreateModal}
                  style={{ backgroundColor: "#f57c00" }}
                >
                  Thêm
                </Button>
              </CardActions>
            </Card>
          </Container>
          <Container
            maxWidth="full"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              m: 2,
            }}
          >
            {/* Paging */}
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                onChange={handlePageClick}
                page={currentPage}
                color="warning"
              />
            </Stack>
          </Container>
        </CustomContainer>

        {/* Footer */}
        <Footer />
        {/* Modal create */}
        <ModalAddPet
          open={openCreateModal}
          onClose={handleCloseModal}
          handUpdateTable={loadAllPetByUserId}
          page={currentPage}
          data={context.auth.id}
          category={category}
        />
        {/* Modal update */}
        <ModalEditPet
          open={openEditModal}
          onClose={handleCloseModal}
          dataEditPet={dataEditPet}
          handUpdateEditTable={loadAllPetByUserId}
          page={currentPage}
          category={category}
          data={context.auth.id}
        />
        <ModalDetailPet
          open={openDetailModal}
          onClose={handleCloseModal}
          dataEditPet={dataDetailPet}
          handUpdateEditTable={loadAllPetByUserId}
          page={currentPage}
          data={context.auth.id}
          category={category}
        />
        <ServiceListModal
          open={openServiceModal}
          onClose={handleCloseModal}
          dataEditPet={dataDetailPet}
          handUpdateEditTable={loadAllPetByUserId}
          page={currentPage}
          pet= {dataDetailPet}
          data={context.auth.id}
          category={category}
        />
      </React.Fragment >
    </>
  );
}
