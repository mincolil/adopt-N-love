import * as React from "react";
import {
    Box,
    Modal,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    Grid,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import ButtonCustomize from "../../../components/Button/Button";
import { useRef, useState, useEffect, useCallback } from "react";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
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

const BasicTable = () => {
    const DEFAULT_PAGE = 1;
    const DEFAULT_LIMIT = 10;
    const [pages, setPages] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const PWD_REGEX = /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;

    const [option, setOption] = useState("");
    const context = useAuth();

    const [data, setData] = useState([]);
    const [role, setRole] = useState(" ");
    const [gender, setGender] = useState(true);
    const [fullname, setFullName] = useState("");
    const [password, setPassWord] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const [id, setId] = useState("");
    const [status, setStatus] = useState("");

    // --------------------- MODAL HANDLE -----------------------------

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // --------------------- HANDLE ROLE -----------------------------
    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    // --------------------- HANDLE GENDER -----------------------------
    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    // --------------------- HANDLE OPEN MODAL CREATE -----------------------------
    const handleCreate = (event) => {
        setFullName(" ")
        setEmail(" ")
        setPhone(" ")
        setAddress(" ")
        setPassWord(" ")
        setRole("admin")
        setOption("create");
        handleOpen();
    };

    // --------------------- HANDLE OPEN MODAL UPDATE -----------------------------
    const handleLoadUserbId = async (id, password) => {
        try {
            // console.log(id);
            const data = await axios.get(`/user/${id}`);
            if (data.error) {
                toast.error(data.error);
            } else {
                // console.log(data.data);
                setId(data.data._id)
                setFullName(data.data.fullname)
                setEmail(data.data.email)
                setPhone(data.data.phone)
                setAddress(data.data.address)
                setPassWord(password)
                setStatus(data.data.status)
                setRole(data.data.role)
            }
        } catch (err) {
            console.log(err);
        }

        setOption("update");
        handleOpen();

        // console.log(event);
    };

    // --------------------- HANDLE UPDATE -----------------------------

    const handleUpdate = async () => {
        // console.log(gender)
        try {
            const data = await axios.patch(`/user`, {
                fullname: fullname,
                password: password,
                email: email,
                address: address,
                phone: phone,
                gender: gender,
                role: role,
                status: status
            });
            if (data.error) {
                toast.error(data.error);
            } else {
                // console.log(data);
                toast.success("Cập nhật thành công");
                handleClose()
                loadAllUser(DEFAULT_PAGE, DEFAULT_LIMIT);
            }
        } catch (err) {
            toast.error("Vui lòng điền đầy đủ thông tin");
        }
    }

    // --------------------- HANDLE DELETE -----------------------------
    // const handleDelete = async (id) => {
    //     if (window.confirm(`Bạn có muốn xoá không ?`) == true) {
    //         try {
    //             console.log(id);
    //             const data = await axios.delete(`/user/${id}`);
    //             if (data.error) {
    //                 toast.error(data.error);
    //             } else {
    //                 console.log(data);
    //                 toast.success("Delete successfully");
    //                 loadAllUser(DEFAULT_PAGE, DEFAULT_LIMIT);
    //                 handleClose()
    //             }
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     }
    // };

    // --------------------- HANDLE CREATE USER -----------------------------
    // useEffect(() => {
    const handleCreateUser = async (event) => {
        try {
            await axios.post("/user", {
                fullname,
                email,
                password,
                passwordConfirm: confirmPass,
                role,
                address,
                phone,
                gender,
                status: 'verifying'
            })
                .then((data) => {
                    if (data.data.error === 'Email was taken') {
                        alert('Email đã được sử dụng')
                    } else {
                        toast.success("Đăng ký thành công!");
                        // console.log(data)
                        handleClose();
                        loadAllUser(DEFAULT_PAGE, DEFAULT_LIMIT);
                    }
                })
                .catch((err) => {
                    toast.error(err.response.data.error);
                })
        } catch (err) {
            console.log(err);
        }
    };
    // })

    // ----------------------------------- API GET ALL USER --------------------------------
    async function loadAllUser(page, limit) {
        try {
            const row = [];
            const loadData = await axios.get(
                `/user`
            )
                .then((data) => {
                    setData(data.data);
                    // console.log(data.data);
                })
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loadAllUser();
    }, []);
    // ----------------------------------------------------------------

    const handleInactiveAccount = async (inActiveStatus) => {

        if (window.confirm(
            inActiveStatus === 'inactive'
                ? "Bạn có muốn KHOÁ tài khoản này không ?"
                : "Bạn có muốn KÍCH HOẠT tài khoản này không ?") === true) {
            try {
                // console.log(fullname, email, role, inActiveStatus)
                await axios.patch(`/user`, {
                    fullname: fullname,
                    email: email,
                    role: role,
                    address: address,
                    phone: phone,
                    gender: gender,
                    status: inActiveStatus
                })
                    .then((data) => {
                        handleClose()
                        loadAllUser(DEFAULT_PAGE, DEFAULT_LIMIT);
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            } catch (err) {
                console.log(err);
            }
        }
    };

    // ----------------------------------------------------------------

    const errorStyle = {
        color: "red",
        // backgroundColor: "DodgerBlue",
        paddingLeft: "15px",
        fontSize: "12px"
    };

    // ----------------------------------------------------------------
    const handlePaging = (event, value) => {
        setCurrentPage(value === undefined ? 1 : value)
        loadAllUser(value, DEFAULT_LIMIT);
    }

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
            title: 'Họ và tên',
            dataIndex: 'fullname',
            ...getColumnSearchProps('fullname'),
            width: '30%',
            key: 'fullname',
            sorter: (a, b) => a.fullname.length - b.fullname.length,
            sortOrder: sortedInfo.columnKey === 'fullname' ? sortedInfo.order : null,
        },
        {
            title: 'SĐT',
            dataIndex: 'age',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone'),
            width: '20%',
        },

        {
            title: 'Email',
            dataIndex: 'email',
            ...getColumnSearchProps('email'),
            width: '30%',
            key: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : null,
        },
        {
            title: 'Lọai toài khoản',
            dataIndex: 'role',
            width: '40%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '40%',
            render: (status) => (
                <span>
                    {
                        status === 'active' ? (
                            <Tag color="green">Hoạt động</Tag>
                        ) : status === 'verifying' ? (
                            <Tag color="yellow">Chưa kích hoạt</Tag>
                        ) : (
                            status === 'inactive' ? (
                                <Tag color="red">Khoá</Tag>
                            ) : (""

                            )
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
                    <Button onClick={(e) => handleLoadUserbId(record._id, record.password)}>Chỉnh sửa</Button>
                </Space>
            ),
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
        setSortedInfo(sorter);
    };

    return (
        context.auth.role === 'staff'
            ?
            <>
                <h1>BẠN KHÔNG CÓ QUYỀN SỬ DỤNG CHỨC NĂNG NÀY</h1>
            </>
            :
            <>
                <ButtonCustomize
                    onClick={handleCreate}
                    variant="contained"
                    // component={RouterLink}
                    nameButton="Thêm mới"
                    width="15%"
                    startIcon={<AddCircleOutlineIcon />}
                />



                <Table columns={columns} dataSource={data} onChange={onChange} />;

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                            {option === "create" ? "Thêm nhân viên" : "Cập nhật thông tin"}
                        </DialogTitle>
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
                            <Grid
                                container
                                rowSpacing={1}
                                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            >
                                <Grid item xs={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Họ và tên"
                                        margin="normal"
                                        value={fullname}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                    {fullname === "" ? <span style={errorStyle}>Vui lòng điền Họ và tên</span> : ""}
                                </Grid>

                                <Grid item xs={6}>
                                    {
                                        option === 'create'
                                            ? (<TextField
                                                required
                                                fullWidth
                                                label="Gmail"
                                                margin="normal"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />)
                                            :
                                            (<TextField
                                                required
                                                fullWidth
                                                label="Gmail"
                                                margin="normal"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled
                                            />)
                                    }
                                    {email === "" ? <span style={errorStyle}>Vui lòng điền email</span> : ""}
                                </Grid>
                                {option === "create" ? (
                                    <>
                                        <Grid item xs={6}>
                                            <TextField
                                                type="password"
                                                required
                                                fullWidth
                                                label="Mật khẩu"
                                                margin="normal"
                                                // value={serviceName}
                                                onChange={(e) => setPassWord(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                type="password"
                                                required
                                                fullWidth
                                                label="Nhập lại mật khẩu"
                                                margin="normal"
                                                // value={serviceName}
                                                onChange={(e) => setConfirmPass(e.target.value)}
                                            />
                                        </Grid>
                                    </>
                                ) : (
                                    ""
                                )}

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Số điện thoại"
                                        margin="normal"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    {/* {phone === "" ? <span style={errorStyle}>Vui lòng điền số điện thoại</span> : ""} */}
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Địa chỉ"
                                        margin="normal"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    {
                                        role === 'customer' ?
                                            (
                                                <TextField
                                                    fullWidth
                                                    label="Chức vụ"
                                                    margin="normal"
                                                    value={"Khách hàng"}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    disabled
                                                />
                                            ) :
                                            (
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">Chức vụ</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select-required"
                                                        value={role}
                                                        label="Role"
                                                        onChange={handleRoleChange}
                                                    >
                                                        <MenuItem value="admin">Quản lý</MenuItem>
                                                        <MenuItem value="staff">Nhân viên</MenuItem>
                                                        {/* <MenuItem value={"customer"} disabled>Khách hàng</MenuItem> */}
                                                    </Select>
                                                </FormControl>
                                            )
                                    }

                                    {role === "" ? <span style={errorStyle}>Vui lòng chọn role</span> : ""}
                                </Grid>
                                <Grid paddingLeft="50px" item xs={6}>
                                    <RadioGroup
                                        value={gender}
                                        onChange={handleGenderChange}
                                        row
                                        aria-label="Giới tính"
                                        name="gender"
                                    // label="Giới tính"
                                    >
                                        <FormControlLabel
                                            value={true}
                                            control={<Radio />}
                                            label="Nam"
                                        />
                                        <FormControlLabel
                                            value={false}
                                            control={<Radio />}
                                            label="Nữ"
                                        />
                                    </RadioGroup>
                                    {gender === "" ? <span style={errorStyle}>Vui lòng chọn giới tính</span> : ""}
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            {option === "create" ? (
                                <Button
                                    variant="contained"
                                    margin="normal"
                                    color="primary"
                                    onClick={handleCreateUser}
                                >
                                    Thêm nhân viên
                                </Button>
                            ) : (
                                <div>
                                    <Button
                                        variant="contained"
                                        margin="normal"
                                        color="primary"
                                        onClick={handleUpdate}
                                    >
                                        Cập nhật thông tin
                                    </Button>
                                    {
                                        status === "active" ?
                                            (<Button
                                                style={{ marginLeft: "10px" }}
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleInactiveAccount('inactive')}
                                            >
                                                Khoá tài khoản
                                            </Button>)
                                            : (<Button
                                                style={{ marginLeft: "10px" }}
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleInactiveAccount('active')}
                                            >
                                                Kích hoạt tài khoản
                                            </Button>)
                                    }
                                </div>

                            )}
                        </DialogActions>
                    </Box>
                </Modal>


            </>
    );
}

export default BasicTable;
