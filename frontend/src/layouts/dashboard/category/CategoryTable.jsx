import { useRef, useState, useEffect, useCallback } from "react";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
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
import { ToastContainer } from "react-toastify";

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
import ContentCus from "../../../components/Typography/ContentCus";

//ant
import { Table, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words'

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

export default function CategoryTable() {
  const [data, setData] = useState([]);

  const [totalCategorys, setTotalCategorys] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // --------------------- MODAL HANDLE -----------------------------
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataEditPet, setDataEditPet] = useState({});

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

  // ----------------------------------- API GET ALL CATEGORY --------------------------------
  useEffect(() => {
    loadAllCategory(currentPage);
  }, [currentPage]);

  const loadAllCategory = async (page) => {
    try {
      const loadData = await axios.get(`${BASE_URL}/category?categoryName=Dịch vụ`);
      if (loadData.error) {
        toast.error(loadData.error);
      } else {
        setTotalPages(loadData.data.pages);
        // console.log("Check totalPage", totalPages);
        setData(loadData.data.docs);
        setTotalCategorys(loadData.data.limit);
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

  // --------------------- ANT TABLE -----------------------------
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [sortedInfo, setSortedInfo] = useState({});
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
      title: 'Loại',
      dataIndex: 'categoryName',
      ...getColumnSearchProps('categoryName'),
      width: '30%',
      key: 'categoryName',
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
      sortOrder: sortedInfo.columnKey === 'categoryName' ? sortedInfo.order : null,
    },
    {
      title: 'Tên thể loại',
      dataIndex: 'feature',
      ...getColumnSearchProps('feature'),
      width: '30%',
      key: 'feature',
      sorter: (a, b) => a.feature.length - b.feature.length,
      sortOrder: sortedInfo.columnKey === 'feature' ? sortedInfo.order : null,
    },
    {
      title: 'Số phòng',
      dataIndex: 'slot',
      width: '40%',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button>Edit</Button>
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

      <Table columns={columns} dataSource={data} onChange={onChange} />;

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
                <TableCell align="left">Loại</TableCell>
                <TableCell align="left">Tên thể loại</TableCell>
                <TableCell align="left">Số phòng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((value, index) => {
                  const statusColor = value.status ? "primary" : "error";
                  return (
                    <TableRow
                      hover
                      // onClick={() => handleUpdatePet(value)}
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {(currentPage - 1) * 10 + (index + 1)}
                      </TableCell>
                      <TableCell align="left">{value.categoryName}</TableCell>
                      <TableCell align="left">{value.feature}</TableCell>
                      <TableCell align="left">{value.slot}</TableCell>
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
        handUpdateTable={loadAllCategory}
        page={currentPage}
      />
      {/* Modal update */}
      <ModalEditPet
        open={openEditModal}
        onClose={handleCloseModal}
        dataEditPet={dataEditPet}
        handUpdateEditTable={loadAllCategory}
        page={currentPage}
      />
    </>
  );
}
