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
import ContentCus from "../../../components/Typography/ContentCus";
import ModalAddBlog from "../../../components/Modal/ModalAddBlog";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useAuth from "../../../hooks/useAuth";
import ModalEditBlog from "../../../components/Modal/ModalEditBlog";

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

export default function BlogTable() {
  const [data, setData] = useState([]);

  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // --------------------- MODAL HANDLE -----------------------------
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataEditBlog, setDataEditBlog] = useState({});
  const context = useAuth();
  // console.log(context);

  // --------------------- OPEN MODAL  -----------------------------
  const handleCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleUpdatePet = (pet) => {
    // console.log("Check data", pet);
    setDataEditBlog(pet);
    setOpenEditModal(true);
  };

  // --------------------- CLOSE MODAL  -----------------------------
  const handleCloseModal = () => {
    setOpenCreateModal(false);
    setOpenEditModal(false);
  };

  // ----------------------------------- API GET ALL BLOG --------------------------------
  useEffect(() => {
    loadAllBlog(currentPage);
  }, [currentPage]);

  const loadAllBlog = async (page) => {
    try {
      const loadData = await axios.get(`${BASE_URL}/blog?page=${page}`);
      if (loadData.error) {
        toast.error(loadData.error);
      } else {
        setTotalPages(loadData.data.pages);
        // console.log("Check totalPage", totalPages);
        setData(loadData.data.docs);
        setTotalBlogs(loadData.data.limit);
        // console.log(loadData.data.docs);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //   --------------------- Click paging -----------------------------
  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Grid
        spacing={2}
        container
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Grid item>
          <ButtonCustomize
            onClick={handleCreateModal}
            color="white"
            nameButton="Thêm mới"
            startIcon={<AddCircleOutlineIcon />}
          />
        </Grid>
      </Grid>
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
                <TableCell children>STT</TableCell>
                <TableCell align="left">Tiêu đề</TableCell>
                <TableCell align="left">Nội dung</TableCell>
                <TableCell align="left">Người đăng</TableCell>
                {/* <TableCell align="center">Image</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((value, index) => {
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
                      <TableCell align="left">{value.title}</TableCell>
                      <TableCell align="left">
                        <ContentCus value={value} />
                      </TableCell>
                      <TableCell align="left">
                        {value.userId !== null ? value.userId.fullname : ""}
                      </TableCell>
                      {/* <TableCell align="center">
                        <img
                          src={`${value.image}`}
                          alt={value.image}
                          height="100px"
                          width="150px"
                        />
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
      <ModalAddBlog
        open={openCreateModal}
        onClose={handleCloseModal}
        handUpdateTable={loadAllBlog}
        page={currentPage}
        uId={context.auth.id}
      />
      {/* Modal update */}
      <ModalEditBlog
        open={openEditModal}
        onClose={handleCloseModal}
        dataEditBlog={dataEditBlog}
        handUpdateTable={loadAllBlog}
        page={currentPage}
        uId={context.auth.id}
      />
    </>
  );
}
