import * as React from "react";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Modal,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Stack,
  Pagination,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import ButtonCustomize from "../../../components/Button/Button";
import DateFormat from "../../../components/DateFormat";
import { ToastContainer } from "react-toastify";

//React
// Axios
import axios from "axios";
import { toast } from "react-toastify";
import { useRef, useState, useEffect, useCallback } from "react";

import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

//ant
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

export default function BasicTable() {
  // const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 10;
  const DEFAULT_STATUS = "Chờ xác nhận";
  // const DEFAULT_FROMDATE = "";
  // const DEFAULT_TODATE = "";

  const [fromDate, setFromDate] = React.useState(dayjs());
  const [toDate, setToDate] = React.useState(dayjs());

  const [pages, setPages] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // const context = useAuth();

  const OPTION_VIEW_ORDER_BY_ID = "view";

  const [option, setOption] = useState("");

  const [data, setData] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [status, setStatus] = useState(DEFAULT_STATUS);

  const [recipientName, setRecipientName] = useState(' ')
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState(' ')
  const [deliveryAddress, setDeliveryAddress] = useState(' ')

  // --------------------- MODAL HANDLE -----------------------------

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // // --------------------- HANLDE CHANGE START DATE -----------------------------
  const handleStartDateChange = (date) => {
    if (date === null) {
      setFromDate(dayjs());
    } else {
      setFromDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    if (date === null) {
      setToDate(dayjs());
    } else {
      setToDate(date);
    }
  };

  // --------------------- HANDLE OPEN MODAL UPDATE -----------------------------
  const handleViewOrderDetail = async (id, option) => {
    try {
      const dataOrderDetail = await axios.get(`http://localhost:3500/orderDetail/${id}`);
      if (dataOrderDetail.error) {
        toast.error(dataOrderDetail.error);
      } else {
        // console.log(dataOrderDetail.data)
        setOrderDetail(dataOrderDetail.data);
        console.log(data)
        data.map((value) => {
          if (value._id === id) {
            setRecipientName(value.recipientName)
            setRecipientPhoneNumber(value.recipientPhoneNumber)
            setDeliveryAddress(value.deliveryAddress)
          }
        })
      }
    } catch (err) {
      console.log(err);
    }
    setOption(option);
    handleOpen();
  };

  // --------------------- HANDLE UPDATE -----------------------------

  const convertDate = (date) => {
    // Chuỗi thời gian ban đầu
    // var timeStr = "Wed, 06 Dec 2023 21:36:23 GMT";

    // Tạo một đối tượng Date từ chuỗi thời gian
    var originalDate = new Date(date);

    // Lấy thông tin ngày, tháng và năm từ đối tượng Date
    var year = originalDate.getUTCFullYear();
    var month = ("0" + (originalDate.getUTCMonth() + 1)).slice(-2); // Thêm số 0 ở đầu nếu cần
    var day = ("0" + originalDate.getUTCDate()).slice(-2); // Thêm số 0 ở đầu nếu cần

    // Tạo chuỗi mới với định dạng YYYY-MM-DD
    var formattedTime = year + "-" + month + "-" + day;

    return formattedTime;
  };


  async function loadOrder(status) {
    try {
      await axios.get(`http://localhost:3500/order`)
        .then((data) => {
          setData(data.data);
        });
    } catch (err) {
      console.log(err);
    }
  }



  // ----------------------------------- API GET ALL USER --------------------------------
  async function loadAllOrder(page, limit, option, startDate, endDate) {
    if (!dayjs(startDate).isValid()) {
      toast.error("Ngày bắt đầu không thể bỏ trống");
    } else if (!dayjs(endDate).isValid()) {
      toast.error("Ngày kết thúc không thể bỏ trống");
    }
    else if (dayjs(endDate).isSame(dayjs(startDate))) {
      toast.error(
        "Vui lòng chọn 2 mốc thời gian khác nhau!"
      );
    } else if (dayjs(endDate).isBefore(dayjs(startDate))) {
      toast.error(
        "Ngày bắt đầu không thể sau ngày kết thúc! Vui lòng nhập lại."
      );
    } else {
      try {
        setStatus(option);
        await axios.get(
          `http://localhost:3500/order?status=${option}&page=${page}&limit=${limit}&startDate=${convertDate(startDate) !== "NaN-aN-aN"
            ? convertDate(startDate)
            : ""
          }&endDate=${convertDate(endDate) !== "NaN-aN-aN" ? convertDate(endDate) : ""
          }`
        )
          .then((data) => {
            setCurrentPage(data.data.page)
            setData(data.data.docs);
            setPages(data.data.pages);
          });
      } catch (err) {
        toast.error("Không có sản phẩm.")
        loadOrder()
      }
    }
  }

  useEffect(() => {
    loadOrder(DEFAULT_STATUS);
  }, []);

  const handlePaging = (event, value) => {
    loadAllOrder(value, DEFAULT_LIMIT, status, fromDate, toDate);
  };

  // ---------------------------------------------------------------


  const statusList = ["Chờ xác nhận", "Đã thanh toán", "Đang giao hàng", "Đã nhận hàng", "Huỷ"];

  const hanldeClickChangeStatus = async (status, id) => {
    if (
      window.confirm("Bạn có muốn cập nhật trạng thái đơn hàng không ?") === true
    ) {
      try {
        const loadData = await axios.put(
          `http://localhost:3500/order/update-status/${id}`,
          {
            orderStatus: status,
          }
        );
        if (loadData.error) {
          toast.error(loadData.error);
        } else {
          // console.log(loadData.data);
          loadOrder(status);
          handleClose();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const numberToVND = (number) => {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
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
      title: 'Tên người dùng',
      dataIndex: ['userId', 'fullname'],
      ...getColumnSearchProps('fullname', 'name'),
      width: '20%',
      key: 'fullname',
      sorter: (a, b) => a.userId.fullname.length - b.userId.fullname.length,
      sortOrder: sortedInfo.columnKey === 'fullname' ? sortedInfo.order : null,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'age',
      dataIndex: ['userId', 'phone'],
      ...getColumnSearchProps('phone', 'phone'),
      width: '15%',
    },
    {
      title: 'Ngày đặt dịch hàng',
      dataIndex: 'createdAt',
      width: '20%',
      key: 'createdAt',
    },

    {
      title: 'Tổng giá trị',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: '20%',
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      sortOrder: sortedInfo.columnKey === 'totalPrice' ? sortedInfo.order : null,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: '40%',
      render: (status) => (
        <span>
          {
            status === "Chờ xác nhận" ? <Tag color="blue">{status}</Tag> :
              status === "Đã thanh toán" ? <Tag color="green">{status}</Tag> :
                status === "Đang giao hàng" ? <Tag color="orange">{status}</Tag> :
                  status === "Đã nhận hàng" ? <Tag color="cyan">{status}</Tag> :
                    <Tag color="red">{status}</Tag>
          }
        </span>
      ),
      filters: [
        {
          text: 'Chờ xác nhận',
          value: 'Chờ xác nhận',
        },
        {
          text: 'Đã thanh toán',
          value: 'Đã thanh toán',
        },
        {
          text: 'Đang giao hàng',
          value: 'Đang giao hàng',
        },
        {
          text: 'Đã nhận hàng',
          value: 'Đã nhận hàng',
        },
        {
          text: 'Huỷ',
          value: 'Huỷ',
        },
      ],
      onFilter: (value, record) => record.status.startsWith(value),
    },
    //button edit
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={(e) => handleViewOrderDetail(
            record._id,
            OPTION_VIEW_ORDER_BY_ID,
            record.status
          )}>Edit</Button>
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
    setSortedInfo(sorter);
  };


  const columnsDetail = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Mã đơn hang',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: ['product', 'productName'],
      key: 'productName',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  return (
    <>
      <ToastContainer />
      <Grid
        spacing={2}
        container
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >

        <Grid item xs={12} sm={6} justifyContent="space-between">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Từ ngày"
                value={dayjs(fromDate)}
                onChange={handleStartDateChange}
                maxDate={toDate}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Đến ngày"
                value={dayjs(toDate)}
                onChange={handleEndDateChange}
                maxDate={dayjs().add(1, 'day')}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <ButtonCustomize
                onClick={() => handlePaging(1)}
                nameButton="Lọc"
                variant="contained"
                sx={{ marginTop: "8px" }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <ButtonCustomize
                onClick={() => loadOrder()}
                nameButton="Tất cả"
                variant="contained"
                sx={{ marginTop: "8px" }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* <ButtonCustomize
                onClick={() => loadAllOrder(DEFAULT_PAGE, DEFAULT_LIMIT, status)}
                variant="contained"
                // component={RouterLink}
                nameButton="Tìm kiếm"
            /> */}

      <Table columns={columns} dataSource={data} onChange={onChange} />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            {option === "view" ? "Chi tiết đơn hàng" : "Đang cập nhật ......"}
          </DialogTitle>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6}>
              <span>Tên người nhận: {recipientName}</span>
            </Grid>
            <Grid item xs={12} sm={6}>
              <span>Số điện thoại: {recipientPhoneNumber}</span>
            </Grid>
            <Grid item xs={12} sm={12}>
              <span>Địa chị nhận hàng: {deliveryAddress}</span>
            </Grid>
          </Grid>
          <select
            style={{
              padding: "10px 15px",
              borderRadius: "5px",
              width: "100%",
              height: "55px",
            }}
            onChange={(e) =>
              hanldeClickChangeStatus(e.target.value, orderDetail[0].orderId)
            }
          >
            {statusList.map((value, index) => {
              return <option value={value}>{value}</option>;
            })}
          </select>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <Table columns={columnsDetail} dataSource={orderDetail} />
          </DialogContent>
          {/* 
                    <DialogActions>
                        <Button
                            variant="contained"
                            margin="normal"
                            color="primary"
                        // onClick={handleUpdate}
                        >
                            Cập nhật thông tin
                        </Button>
                    </DialogActions> */}
        </Box>
      </Modal>
    </>
  );
}
