import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Typography,
  Modal,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Grid,
  Pagination,
  ButtonGroup,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";

import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

import ButtonCustomize from "../../../components/Button/Button";

//React
import { useNavigate } from "react-router-dom";
// Axios
import axios from "axios";
import { toast } from "react-toastify";
import ModalAddPet from "../../../components/Modal/ModalAddPet";
import ModalEditPet from "../../../components/Modal/ModalEditPet";
import useAuth from "../../../hooks/useAuth";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DropDownService from "../../../components/DropDown/DropDownService";

// -------------------------------STYLE MODAL----------------------
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// -------------------------------API SERVER----------------------
const BASE_URL = "http://localhost:3500";

export default function PetTable() {
  const [data, setData] = useState([]);

  const [totalPets, setTotalPets] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // --------------------- MODAL HANDLE -----------------------------
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataEditPet, setDataEditPet] = useState({});

  const context = useAuth();

  // --------------------- OPEN MODAL  -----------------------------
  const handleCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleUpdatePet = (pet) => {
    // console.log("Check data", pet);
    setDataEditPet(pet);
    setOpenEditModal(true);
  };

  // --------------------- CLOSE MODAL  -----------------------------
  const handleCloseModal = () => {
    setOpenCreateModal(false);
    setOpenEditModal(false);
  };

  // ----------------------------------- API GET ALL PET --------------------------------
  useEffect(() => {
    loadAllPet(currentPage);
  }, []);

  const loadAllPet = async (page) => {
    try {
      const loadData = await axios.get(`${BASE_URL}/pet?page=${page}`);
      if (loadData.error) {
        toast.error(loadData.error);
      } else {
        setTotalPages(loadData.data.pages);
        // console.log("Check totalPage", totalPages);
        setData(loadData.data.docs);
        setTotalPets(loadData.data.limit);
        // console.log(loadData.data.docs);
        setCurrentPage(loadData.data.page);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // --------------------- Click paging -----------------------------
  // const handlePageClick = (event, value) => {
  //   setCurrentPage(value);
  // };

  // --------------------- Hanlde Search -----------------------------
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
    if (categoryId) {
      console.log(categoryId);
      hanldeClickCategory(value, categoryId);
    } else if (keyword.trim()) {
      searchPetById(value);
    } else {
      console.log(categoryId);
      loadAllPet(value);
    }
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearchClick = async () => {
    if (keyword.trim() === "") {
      toast.warning("Hãy nhập kết quả bạn cần tìm");
      loadAllPet(currentPage);
    } else {
      searchPetById();
    }
  };

  // ----------------------------------- GET ALL PET BY USER NAME --------------------------------
  const searchPetById = async (page) => {
    try {
      const loadData = await axios.get(
        `${BASE_URL}/pet/username?name=${keyword.trim()}&page=${page}`
      );
      if (loadData.data.error) {
        toast.warning(
          "Kết quả " +
            "[" +
            keyword +
            "]" +
            " bạn vừa tìm không có! Vui lòng nhập lại. "
        );
        loadAllPet(currentPage);
      } else {
        setData(loadData.data.docs);
        setTotalPets(loadData.data.limit);
        setTotalPages(loadData.data.pages);
        setCurrentPage(loadData.data.page);
        // console.log(loadData.data);
      }
    } catch (err) {
      console.log(err);
    }
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

  // --------------------- GET ALL PRODUCT BY CATEGORY ID PRODUCT -----------------------------

  async function hanldeClickCategory(page, cateId) {
    // console.log("Check data cate ID", page, cateId);
    setCategoryId(cateId);
    // console.log(categoryId);
    if (cateId == undefined || cateId == "") {
      loadAllPet(currentPage);
    } else {
      try {
        const loadData = await axios.get(
          `http://localhost:3500/pet?page=${page}&categoryId=${cateId}`
        );
        if (loadData.error) {
          toast.error(loadData.error);
        } else {
          console.log("Check loaddata", loadData.data);
          setTotalPages(loadData.data.pages);
          // console.log("Check totalPage", totalPages);
          setData(loadData.data.docs);
          setTotalPets(loadData.data.limit);
          setCurrentPage(loadData.data.page);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    hanldeClickCategory();
  }, []);

  return (
    <>
      <Box sx={{ position: "" }}>
        <Grid
          spacing={2}
          container
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Grid item>
            <TextField
              fullWidth
              label="Tìm kiếm"
              margin="normal"
              size="small"
              value={keyword}
              onChange={handleKeywordChange}
              // sx={{ position: "fixed" }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearchClick}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>

          <Grid item>
            <DropDownService
              category={category}
              cateName="Loại thú cưng"
              handUpdateEditTable={hanldeClickCategory}
              page={1}
            />
          </Grid>

          <Grid item>
            <ButtonCustomize
              onClick={handleCreateModal}
              color="white"
              // component={RouterLink}
              nameButton="Thêm mới"
              // sx={{ position: "fixed" }}
              startIcon={<AddCircleOutlineIcon />}
            />
          </Grid>
        </Grid>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead
            // sx={{
            //   position: "-webkit-sticky",
            //   position: "sticky",
            // }}
            >
              <TableRow>
                <TableCell children>ID</TableCell>
                <TableCell align="left">Chủ thú cưng</TableCell>
                <TableCell align="left">SĐT</TableCell>
                <TableCell align="left">Tên thú cưng</TableCell>
                <TableCell align="left">Cân nặng</TableCell>
                <TableCell align="left">Chiều cao</TableCell>
                <TableCell align="left">Loại thú cưng</TableCell>
                <TableCell align="left">Trạng thái</TableCell>
                {/* <TableCell align="center">Chức năng</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((value, index) => {
                  const statusColor = value.status ? "primary" : "error";
                  return (
                    <TableRow
                      hover
                      onClick={() => handleUpdatePet(value)}
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {(currentPage - 1) * 10 + (index + 1)}
                      </TableCell>
                      <TableCell align="left">
                        {value.userId !== null ? value.userId.fullname : ""}
                      </TableCell>
                      <TableCell align="left">
                        {value.userId !== null ? value.userId.phone : ""}
                      </TableCell>
                      <TableCell align="left">{value.petName}</TableCell>
                      <TableCell align="left">{value.weight}kg</TableCell>
                      <TableCell align="left">{value.height}cm</TableCell>
                      <TableCell align="left">
                        {category.map((valueCategory, Cid) => {
                          if (value.categoryId === valueCategory._id) {
                            return valueCategory.feature;
                          }
                        })}
                      </TableCell>
                      <TableCell align="left">
                        <Chip
                          size="small"
                          variant="outlined"
                          label={value.status ? "Sức khoẻ tốt" : "Sức khoẻ xấu"}
                          color={statusColor}
                        />
                      </TableCell>
                      {/* <TableCell align="center">
                        <ButtonGroup>
                          <ButtonCustomize
                            variant="contained"
                            // component={RouterLink}
                            nameButton="Cập nhật"
                            fullWidth
                          />
                        </ButtonGroup>
                      </TableCell> */}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Paging */}
      <Stack spacing={2} mt={2} sx={{ float: "right" }}>
        <Pagination
          count={totalPages}
          onChange={handlePageClick}
          page={currentPage}
          color="primary"
        />
      </Stack>
      {/* Modal create */}
      <ModalAddPet
        open={openCreateModal}
        onClose={handleCloseModal}
        handUpdateTable={loadAllPet}
        page={currentPage}
        data={context.auth.id}
        category={category}
      />
      {/* Modal update */}
      <ModalEditPet
        open={openEditModal}
        onClose={handleCloseModal}
        dataEditPet={dataEditPet}
        handUpdateEditTable={loadAllPet}
        page={currentPage}
        data={context.auth.id}
        category={category}
      />
    </>
  );
}
