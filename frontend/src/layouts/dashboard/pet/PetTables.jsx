import { useRef, useState, useEffect, useCallback } from "react";
import {
  //Table
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  // Button,
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
import SearchIcon from "@mui/icons-material/Search";

import { ToastContainer } from "react-toastify";

import ButtonCustomize from "../../../components/Button/Button";

// Axios
import axios from "axios";
import { toast } from "react-toastify";
import ModalAddPet from "../../../components/Modal/ModalAddPet";
import ModalEditPet from "../../../components/Modal/ModalEditPet";
import useAuth from "../../../hooks/useAuth";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DropDownService from "../../../components/DropDown/DropDownService";
import ModalDetailPet from "../../../components/Modal/ModalDetailPet";

import { Table, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, InputNumber } from 'antd';
import Highlighter from 'react-highlight-words';

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
  const [originalData, setOriginalData] = useState([]);

  const [totalPets, setTotalPets] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // --------------------- MODAL HANDLE -----------------------------
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataEditPet, setDataEditPet] = useState({});
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [dataDetailPet, setDataDetailPet] = useState({});

  const context = useAuth();

  // --------------------- OPEN MODAL  -----------------------------
  const handleCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleUpdatePet = (pet, e) => {
    e.stopPropagation();
    // console.log("Check data", pet);
    setDataEditPet(pet);
    setOpenEditModal(true);
  };

  const handleDetailPet = (pet) => {
    // console.log("Check data", pet);
    setDataDetailPet(pet);
    setOpenDetailModal(true);
  };

  // --------------------- CLOSE MODAL  -----------------------------
  const handleCloseModal = () => {
    setOpenCreateModal(false);
    setOpenDetailModal(false);
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
        setOriginalData(loadData.data.docs);
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

  // ----------------------------------- DELETE PET BY ID --------------------------------
  const handleDeletePet = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa không?") === false) return;
    try {
      const deleteData = await axios.delete(`${BASE_URL}/pet/${id}`);
      if (deleteData.error) {
        toast.error(deleteData.error);
      } else {
        toast.success(deleteData.data.message);
        loadAllPet(currentPage);
      }
    } catch (err) {
      console.log(err);
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
          setOriginalData(loadData.data.docs);
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

  // --------------------- ANT TABLE -----------------------------
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [sortedInfo, setSortedInfo] = useState({});


  const handleSave = async (record, e) => {
    e.stopPropagation();
    try {
      const updateSlot = await axios.patch(`${BASE_URL}/pet`, {
        id: record._id,
        userId: record.userId._id,
        petName: record.petName,
        rank: record.rank,
        status: record.status,
        categoryId: record.categoryId,
        color: record.color,
        weight: record.weight,
        height: record.height,
        petImage: record.petImage,
        breed: record.breed,
        age: record.age,
        forAdoption: record.forAdoption,
        facebook: record.facebook,
        adoptDes: record.adoptDes,
        discount: record.discount,
      });
      toast.success("Data saved successfully!");
      setOriginalData(data);
    } catch (error) {
      toast.error("Failed to save data!");
    }
  };

  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex, field) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (field == 'name') {
        return record.userId.fullname.toLowerCase().includes(value.toLowerCase());
      } else if (field == 'phone') {
        return record.userId.phone.toLowerCase().includes(value.toLowerCase());
      } else {
        if (record[dataIndex]) return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      }

    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Tên thú cưng',
      dataIndex: 'petName',
      ...getColumnSearchProps('petName'),
      width: '20%',
      key: 'petName',
      sorter: (a, b) => a.petName.length - b.petName.length,
      sortOrder: sortedInfo.columnKey === 'petName' ? sortedInfo.order : null,
    },
    {
      title: 'Chủ thú cưng',
      dataIndex: ['userId', 'fullname'],
      ...getColumnSearchProps('fullname', 'name'),
      width: '20%',
      key: 'fullname',
      sorter: (a, b) => a.userId.fullname.length - b.userId.fullname.length,
      sortOrder: sortedInfo.columnKey === 'fullname' ? sortedInfo.order : null,
    },
    {
      title: 'SĐT',
      dataIndex: ['userId', 'phone'],
      ...getColumnSearchProps('phone', 'phone'),
      width: '15%',
    },
    {
      title: 'Giống loại',
      dataIndex: 'breed',
      width: '20%',
    },
    {
      title: 'Giảm giá',
      key: 'action',
      width: '15%',
      render: (text, record) => (
        <Space size="middle">
          <InputNumber min={0} max={100} value={record.discount}
            onChange={(value) => {
              const newData = data.map((item) =>
                item._id === record._id ? { ...item, discount: value } : item
              );
              setData(newData);
            }}
            onClick={(e) => e.stopPropagation()} />
          <Button
            type="primary"
            disabled={record.discount === originalData.find((item) => item._id === record._id)?.discount}
            onClick={(e) => handleSave(record, e)}
          >
            Save
          </Button>
        </Space>

      ),

    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: '40%',
      render: (status) => (
        <span>
          {
            status ? (
              <Tag color="green">Sức khoẻ tốt</Tag>
            ) : (
              <Tag color="red">Sức khoẻ xấu</Tag>
            )
          }
        </span>
      )
    },
    //button edit
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button onMouseDown={(e) => handleUpdatePet(record, e)}>Edit</Button>
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
    setSortedInfo(sorter);
  };



  return (
    <>
      <ToastContainer />
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
                  <IconButton onClick={onChange}>
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

      <Table columns={columns} dataSource={data} onChange={onChange}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              console.log(record)
              handleDetailPet(record)
            }, // click row
          };
        }}
      />;


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
      <ModalDetailPet
        open={openDetailModal}
        onClose={handleCloseModal}
        dataEditPet={dataDetailPet}
        handUpdateEditTable={loadAllPet}
        page={currentPage}
        data={context.auth.id}
        category={category}
      />
    </>
  );
}
