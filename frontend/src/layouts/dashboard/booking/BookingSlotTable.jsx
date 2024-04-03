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
import EditBooking from "../../../components/Modal/ModalEditBooking";

//React
import { useRef, useState, useEffect, useCallback } from "react";
// import useAuth from "../../../hooks/useAuth";
// Axios
import axios from "axios";
import { toast } from "react-toastify";

import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

//ant
import { Table, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, InputNumber, Badge, Calendar } from 'antd';
import Highlighter from 'react-highlight-words';
import useAuth from "../../../hooks/useAuth";

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

export default function BookingSlotTable() {
    const DEFAULT_PAGE = 1;
    const DEFAULT_LIMIT = 10;
    const DEFAULT_STATUS = "Chờ xác nhận";
    // const DEFAULT_FROMDATE = "";
    // const DEFAULT_TODATE = "";
    const [booking, setDataBooking] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [petId, setPetId] = useState({});
    const context = useAuth();

    const [fromDate, setFromDate] = React.useState(dayjs());
    const [toDate, setToDate] = React.useState(dayjs());

    // const context = useAuth();

    const OPTION_VIEW_ORDER_BY_ID = "view";

    const [option, setOption] = useState("");

    const [data, setData] = useState([]);
    // const [id, setId] = useState("");
    const [orderDetail, setOrderDetail] = useState([]);
    const [status, setStatus] = useState(DEFAULT_STATUS);
    // const [total, setTotal] = useState(0);

    const [recipientName, setRecipientName] = useState(' ')
    const [recipientPhoneNumber, setRecipientPhoneNumber] = useState(' ')

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

    // --------------------- MODAL HANDLE -----------------------------

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCloseEditModal = () => {
        setIsModalOpen(false);
        loadBooking();
    };


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

    async function loadBooking() {
        try {
            await axios.get(`http://localhost:3500/bookingDetail`)
                .then((data) => {
                    setData(data.data);
                });
        } catch (err) {
            console.log(err);
        }
        // }
    }

    // ----------------------------------- API GET ALL USER --------------------------------
    async function loadAllBooking(startDate, endDate) {
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
                await axios.get(
                    `http://localhost:3500/bookingDetail?startDate=${convertDate(startDate) !== "NaN-aN-aN"
                        ? convertDate(startDate)
                        : ""
                    }&endDate=${convertDate(endDate) !== "NaN-aN-aN" ? convertDate(endDate) : ""
                    }`
                )
                    .then((data) => {
                        setData(data.data);
                    });
            } catch (err) {
                toast.error("Không có đơn hàng nào ở trạng thái này")
                loadBooking()
            }
        }
    }

    useEffect(() => {
        loadBooking();
    }, []);


    const handlePaging = (event) => {
        loadAllBooking(fromDate, toDate);
    };

    // ----------------------------------------------------------------


    const statusList = ['Chờ xác nhận', 'Đã thanh toán', 'Đã xác nhận', 'Hoàn thành', 'Huỷ'];

    const hanldeClickChangeStatus = async (status, id) => {
        if (
            window.confirm("Bạn có muốn cập nhật trạng thái đơn hàng không ?") === true
        ) {
            try {
                const loadData = await axios.put(
                    `http://localhost:3500/booking/update-status/${id}`,
                    {
                        bookingStatus: status,
                    }
                );
                if (loadData.error) {
                    toast.error(loadData.error);
                } else {
                    // console.log(loadData.data);
                    loadBooking(status);
                    handleClose();
                    toast.success("Cập nhật trạng thái đơn hàng thành công");
                    //re load data
                    loadAllBooking(DEFAULT_PAGE, DEFAULT_LIMIT);
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
                return record.bookingId.recipientName.toLowerCase().includes(value.toLowerCase());
            } else if (field == 'phone') {
                return record.bookingId.recipientPhoneNumber.toLowerCase().includes(value.toLowerCase());
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
            dataIndex: ['bookingId', 'recipientName'],
            ...getColumnSearchProps('recipientName', 'name'),
            width: '15%',
            key: 'recipientName',
            sorter: (a, b) => a.userId.fullname.length - b.userId.fullname.length,
            sortOrder: sortedInfo.columnKey === 'recipientName' ? sortedInfo.order : null,
        },
        {
            title: 'Tên thú cưng',
            dataIndex: ['petId', 'petName'],
            key: 'petName',
            width: '15%',
            ...getColumnSearchProps('petName', 'name'),
            sorter: (a, b) => a.petId.petName.length - b.petId.petName.length,
            sortOrder: sortedInfo.columnKey === 'petName' ? sortedInfo.order : null,
        },
        {
            title: 'Số điện thoại',
            dataIndex: ['bookingId', 'recipientPhoneNumber'],
            ...getColumnSearchProps('recipientPhoneNumber', 'phone'),
            width: '15%',
        },
        {
            title: 'Ngày đặt lịch',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '20%',
            render: text => moment.utc(text).format("DD/MM/YYYY HH:mm:ss")
        },
        {
            title: 'Ngày hẹn lịch',
            dataIndex: 'bookingDate',
            width: '20%',
            key: 'bookingDate',
            render: text => moment.utc(text).format("DD/MM/YYYY HH:mm:ss")
        },

        {
            title: 'Giá trị',
            dataIndex: 'price',
            key: 'price',
            width: '20%',
            sorter: (a, b) => a.price - b.price,
            sortOrder: sortedInfo.columnKey === 'price' ? sortedInfo.order : null,
            //take number to VND and get 3 number after dot
            render: (price) => numberToVND(price),
        },
        {
            title: 'Trạng thái',
            dataIndex: ['bookingId', 'status'],
            width: '40%',
            render: (status) => (
                <span>
                    {
                        status === "Chờ xác nhận" ? <Tag color="blue">{status}</Tag> :
                            status === "Đã thanh toán" ? <Tag color="green">{status}</Tag> :
                                status === "Đã xác nhận" ? <Tag color="orange">{status}</Tag> :
                                    status === "Hoàn thành" ? <Tag color="cyan">{status}</Tag> :
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
                    text: 'Đã xác nhận',
                    value: 'Đã xác nhận',
                },
                {
                    text: 'Hoàn thành',
                    value: 'Hoàn thành',
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
                    <Button onClick={(e) => handleEditSlot(record._id, record.petId._id)}>Edit</Button>
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
            title: 'Tên thú cưng',
            dataIndex: ['pet', 'petName'],
            key: 'petName',
        },
        {
            title: 'Dịch vụ',
            dataIndex: ['service', 'serviceName'],
            key: 'serviceName',
        },
        {
            title: 'Ngày hẹn',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
            render: text => moment(text).format("DD/MM/YYYY HH:mm:ss")
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
    ];

    // calende

    const dateCellRender = (value, bookingData) => {
        const listData = data.filter(item => {
            const bookingDate = new Date(item.bookingDate);
            return bookingDate.getDate() === value.date() &&
                bookingDate.getMonth() === value.month() &&
                bookingDate.getFullYear() === value.year();
        });


        return (
            <ul className="events" style={{ listStyleType: 'none' }}>
                {listData.map(item => (
                    <li key={item._id}>
                        <Badge status="success" text={`${item.petId.petName}`} />
                    </li>
                ))}
            </ul>
        );
    };

    const cellRender = (current, info) => {
        if (info.type === 'date') return dateCellRender(current)
        return info.originNode;
    };

    const handleEditSlot = async (bookingDetailId, petId) => {
        setDataBooking(bookingDetailId);
        setPetId(petId);
        setIsModalOpen(true);
    };

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
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <ButtonCustomize
                                onClick={() => handlePaging()}
                                nameButton="Lọc"
                                variant="contained"
                                sx={{ marginTop: "8px" }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <ButtonCustomize
                                onClick={() => loadBooking()}
                                nameButton="TẤT CẢ"
                                variant="contained"
                                sx={{ marginTop: "8px" }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Table columns={columns} dataSource={data} onChange={onChange} />


            <EditBooking
                open={isModalOpen}
                onClose={handleCloseEditModal}
                bookingData={booking}
                petId={petId}
            />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        {option === "view" ? "Chi tiết dịch vụ" : "Đang cập nhật ......"}
                    </DialogTitle>
                    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                        <Grid item xs={12} sm={6}>
                            <span>Tên người nhận: {recipientName}</span>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <span>Số điện thoại: {recipientPhoneNumber}</span>
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
                            hanldeClickChangeStatus(e.target.value, orderDetail[0].bookingId)
                        }
                    >
                        <option value={status} disabled selected>
                            {status}
                        </option>
                        {statusList.map((value, index) => {
                            return (
                                <>
                                    <option value={value}>{value}</option>
                                </>
                            );
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
                </Box>
            </Modal>
        </>
    );
}
