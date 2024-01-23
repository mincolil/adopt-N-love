import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TableSortLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

//React
import { useState } from "react";
// Axios
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ModalAddSerivce from "../../../components/Modal/ModalAddService";
import ModalEditSerivce from "../../../components/Modal/ModalEditService";
import ModalComfirmSerivce from "../../../components/Modal/ModalComfirmService";
import ButtonCustomize from "../../../components/Button/Button";
import DropDownService from "../../../components/DropDown/DropDownService";
import TypographyCus from "../../../components/Typography/DescriptionCus";
import ServiceDetail from "../../../components/Modal/ModalDetaiService";

const BASE_URL = "http://localhost:3500";

export default function ServiceTable() {
  const [data, setData] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const numberToVND = (number) => {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // ----------------------------------- API GET ALL SERVICE --------------------------------
  useEffect(() => {
    loadAllService(currentPage);
  }, []);

  const loadAllService = async (page, order) => {
    try {
      const loadData = await axios.get(
        `${BASE_URL}/service/manage?page=${page}&sortPrice=${order}`
      );
      if (loadData.error) {
        toast.error(loadData.error);
      } else {
        setTotalPages(loadData.data.pages);
        // console.log("Check totalPage", totalPages);
        setData(loadData.data.docs);
        setTotalServices(loadData.data.limit);
        // console.log(loadData.data);
        setCurrentPage(loadData.data.page);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // --------------------- MODAL HANDLE -----------------------------
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataEditService, setDataEditService] = useState({});
  const [openComfirmModal, setOpenComfirmModal] = useState(false);
  const [dataDeteleService, setDataDeteleService] = useState({});
  const [openDetailModal, setOpenDetailModal] = useState(false);

  // --------------------- OPEN MODAL  -----------------------------
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleEditService = (service) => {
    // console.log("Check data", service);
    setDataEditService(service);
    setOpenEditModal(true);
  };

  const handleDeleteService = (service) => {
    setOpenComfirmModal(true);
    setDataDeteleService(service);
    // console.log(service);
  };
  // --------------------- CLOSE MODAL  -----------------------------
  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenEditModal(false);
    setOpenComfirmModal(false);
    setOpenDetailModal(false);
  };

  // --------------------- GET ALL CATEGORY SERVICE -----------------------------
  const [category, setCategory] = useState([]);
  async function loadAllCategoryService() {
    try {
      const loadData = await axios.get(
        `http://localhost:3500/category?categoryName=Dịch vụ`
      );
      if (loadData.error) {
        toast.error(loadData.error);
      } else {
        setCategory(loadData.data.docs);
        // console.log(loadData.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadAllCategoryService();
  }, []);

  // --------------------- GET ALL SERVICE BY CATEGORY ID SERVICE -----------------------------
  async function hanldeClickCategory(page, cateId) {
    // console.log("Check data cate ID", cateId, order);
    setCategoryId(cateId);
    if (cateId === null) {
      loadAllService();
    } else {
      try {
        const loadData = await axios.get(
          `http://localhost:3500/service/manage?page=${page}&categoryId=${cateId}`
        );
        if (loadData.error) {
          toast.error(loadData.error);
        } else {
          // console.log("Check loaddata", loadData.data);
          setTotalPages(loadData.data.pages);
          // console.log("Check totalPage", totalPages);
          setData(loadData.data.docs);
          setTotalServices(loadData.data.limit);
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

  // --------------------- GET DETAIL SERVICE BY ID -----------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({});
  const handleShowDetail = (serviceId) => {
    // console.log("Check data", serviceId);
    setSelectedService(serviceId);
    setIsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  // --------------------- Hanlde Search -----------------------------
  const [keyword, setKeyword] = useState("");

  // --------------------- Click paging -----------------------------
  const [categoryId, setCategoryId] = useState("");
  const handlePageClick = (event, value) => {
    setCurrentPage(value);
    if (categoryId) {
      // console.log(categoryId);
      hanldeClickCategory(value, categoryId);
    } else if (keyword.trim()) {
      searchServiceByName(value);
    } else {
      // console.log(categoryId);
      loadAllService(value);
    }
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearchClick = async () => {
    if (keyword.trim() === "") {
      toast.warning("Hãy nhập kết quả bạn cần tìm");
      loadAllService(currentPage);
    } else {
      searchServiceByName();
    }
  };

  // ----------------------------------- GET ALL SERVICE BY SERVICE NAME --------------------------------
  const searchServiceByName = async (page) => {
    try {
      const loadData = await axios.get(
        `${BASE_URL}/service/manage?service=${keyword.trim()}&page=${page}`
      );
      if (loadData.data.error) {
        toast.warning(
          "Kết quả " +
            "[" +
            keyword +
            "]" +
            " bạn vừa tìm không có! Vui lòng nhập lại."
        );
        loadAllService(currentPage);
      } else {
        setData(loadData.data.docs);
        setTotalServices(loadData.data.limit);
        setTotalPages(loadData.data.pages);
        // console.log(loadData.data);
        setCurrentPage(loadData.data.page);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ----------------------------------- GET ALL SERVICE BY SERVICE NAME --------------------------------
  const [order, setOrder] = useState("");
  const handleSortPrice = () => {
    setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    loadAllService(currentPage, order);
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
            cateName="Loại dịch vụ"
            handUpdateEditTable={hanldeClickCategory}
            page={1}
          />
        </Grid>

        <Grid item>
          <ButtonCustomize
            onClick={handleOpenModal}
            color="white"
            nameButton="Thêm mới"
            startIcon={<AddCircleOutlineIcon />}
          />
        </Grid>
      </Grid>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell align="left">Tên dịch vụ</TableCell>
                <TableCell align="left">Loại dịch vụ</TableCell>
                <TableCell align="left">Thông tin</TableCell>
                <TableCell align="left">
                  <TableSortLabel
                    active={!!order}
                    direction={order}
                    onClick={handleSortPrice}
                  >
                    Số tiền
                  </TableSortLabel>
                </TableCell>
                <TableCell align="left">Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((value, index) => {
                  const statusColor = value.status ? "primary" : "error";
                  return (
                    <TableRow
                      hover
                      onClick={() => handleEditService(value)}
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {(currentPage - 1) * 10 + index + 1}
                      </TableCell>
                      <TableCell align="left">{value.serviceName}</TableCell>
                      <TableCell align="left">
                        {category.map((valueCategory, Cid) => {
                          if (value.categoryId === valueCategory._id) {
                            return valueCategory.feature;
                          }
                        })}
                      </TableCell>
                      <TableCell align="left">
                        <TypographyCus value={value} />
                      </TableCell>
                      <TableCell align="left">
                        {numberToVND(value.price)}
                      </TableCell>
                      <TableCell align="left">
                        <Chip
                          size="small"
                          variant="outlined"
                          label={value.status ? "Hoạt động" : "Không hoạt động"}
                          color={statusColor}
                          // onClick={() => handleUpdateServiceStatus(value._id)}
                        />
                      </TableCell>
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

      <ModalAddSerivce
        open={openModal}
        onClose={handleCloseModal}
        handUpdateTable={loadAllService}
        category={category}
        page={currentPage}
      />

      <ModalEditSerivce
        open={openEditModal}
        onClose={handleCloseModal}
        dataEditService={dataEditService}
        handUpdateEditTable={loadAllService}
        category={category}
        page={currentPage}
      />

      <ModalComfirmSerivce
        open={openComfirmModal}
        onClose={handleCloseModal}
        dataDeteleService={dataDeteleService}
        handUpdateDeleteTable={loadAllService}
      />

      <ServiceDetail
        open={isModalOpen}
        onClose={handleCloseEditModal}
        serviceId={selectedService}
      />
    </>
  );
}
