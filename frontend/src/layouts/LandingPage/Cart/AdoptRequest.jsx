import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./styled/CartProduct.css";
import {
    Box,
    Container,
    Breadcrumbs,
    Link,
    Typography,
    TableContainer,
    Table,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import { Button, Modal } from 'antd';
import { notification } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import Fab from '@mui/material/Fab';



const { confirm } = Modal;

export default function AdoptRequest() {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loged, setLoged] = useState(false);
    const [total, setTotal] = useState(0);
    const [userRequest, setUserRequest] = useState([]);

    const context = useAuth();

    const [quantity, setQuantity] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);


    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, mess) => {
        api[type]({
            message: 'Thông báo',
            description: mess
        });
    };


    const handleLoadAdoptRequest = async () => {
        if (context.auth.token !== undefined) {
            setLoged(true);
            try {
                const loadData = await axios.get(
                    `http://localhost:3500/adopt/getAdoptNotification/all`,
                    {
                        headers: { Authorization: context.auth.token },
                        withCredentials: true,
                    }
                );
                console.log(loadData);
                if (loadData.error) {
                    openNotificationWithIcon('error', loadData.error);
                } else {
                    setData(loadData.data);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const loadUserRequest = async (id) => {
        try {
            const user = await axios.get(`http://localhost:3500/profile/${id}`)
            if (user.error) {
                openNotificationWithIcon('error', user.error);
            }
            else {
                setUserRequest(user.data)
                console.log(user.data)
                showModal()
            }
        } catch
        (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        handleLoadAdoptRequest();
    }, []);

    //--------------------------HANDLE ACCEPT ADOPT REQUEST--------------------------
    const handleAcceptAdoptRequest = async (adoptRequest) => {
        try {
            const changeOwner = await axios.patch("http://localhost:3500/pet/", {
                id: adoptRequest.petId._id,
                userId: adoptRequest.userId._id,
                petName: adoptRequest.petId.petName,
                rank: adoptRequest.petId.rank,
                status: adoptRequest.petId.status,
                categoryId: adoptRequest.petId.categoryId,
                color: adoptRequest.petId.color,
                weight: adoptRequest.petId.weight,
                height: adoptRequest.petId.height,
                petImage: adoptRequest.petId.petImage,
                breed: adoptRequest.petId.breed,
                age: adoptRequest.petId.age,
                forAdoption: false,
            }).then((data) => {
                handleLoadAdoptRequest();
                context.handleLoadAdoptRequest();
                openNotificationWithIcon('success', 'Nhận nuôi thành công!');

            });

            const deleteAdoptRequest = await axios.delete("http://localhost:3500/adopt/deleteAdoptNotification/" + adoptRequest._id);
            handleLoadAdoptRequest();
        }
        catch (err) {
            console.log(err);
        }
    }

    //--------------------------HANDLE REJECT ADOPT REQUEST--------------------------
    const handleRejectAdoptRequest = async (adoptRequest) => {
        try {
            const deleteAdoptRequest = await axios.delete("http://localhost:3500/adopt/deleteAdoptNotification/" + adoptRequest._id)
                .then((data) => {
                    handleLoadAdoptRequest();
                    context.handleLoadAdoptRequest();
                    openNotificationWithIcon('success', 'Từ chối nhận nuôi thành công!');
                });
            handleLoadAdoptRequest();
        }
        catch (err) {
            console.log(err);
        }
    }

    // -----------------------CONFRIM/REJECT ADOPT REQUEST-------------------------
    const showConfirm = (adoptRequest) => {
        confirm({
            title: 'Bạn chắc chắn muốn cho nhận nuôi bé?',
            icon: <ExclamationCircleFilled />,
            content: '-------------------',
            onOk() {
                console.log('Vâng');
                handleAcceptAdoptRequest(adoptRequest);
            },
            onCancel() {
                console.log('không');
            },
        });
    };

    const showReject = (adoptRequest) => {
        confirm({
            title: 'Bạn chắc chắn muốn từ chối nhận nuôi bé?',
            icon: <ExclamationCircleFilled />,
            content: '-------------------',
            onOk() {
                console.log('Vâng');
                handleRejectAdoptRequest(adoptRequest);
            },
            onCancel() {
                console.log('không');
            },
        });
    }



    return (
        <>
            <toastContainer />
            {contextHolder}
            <Header />
            <Container
                sx={{ position: "relative", top: "120px", marginBottom: "150px" }}
            >
                <Breadcrumbs
                    aria-label="breadcrumb"
                    separator={<KeyboardDoubleArrowRightIcon fontSize="small" />}
                >
                    <Link
                        underline="hover"
                        sx={{ display: "flex", alignItems: "center" }}
                        color="inherit"
                        href="/"
                    >
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="medium" />
                        Trang chủ
                    </Link>
                    <Link
                        underline="hover"
                        sx={{ display: "flex", alignItems: "center" }}
                        color="#000000"
                        href="/adopt-request"
                    >
                        Đề nghị
                    </Link>
                </Breadcrumbs>
                <Box className="main-content-cart">
                    <Typography variant="h3" className="custom_blog_title">
                        Để nghị nhận nuôi
                    </Typography>
                    <Box className="shoppingcart-content">
                        <TableContainer>
                            <Table className="shop_table">
                                <TableBody sx={{ border: "1px solid #f1f1f1" }}>
                                    {data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Typography variant="body1">
                                                    Không có đề nghị nhận nuôi nào
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {data.map((product, index) => (
                                        <TableRow key={index} className="cart_item">

                                            <TableCell className="product-name" data-title="Product">
                                                <Typography variant="body1" onClick={() => loadUserRequest(product.userId._id)}>
                                                    {product.userId.fullname}
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                className="product-quantity"
                                                data-title="Quantity"
                                            >
                                                <Box sx={{ width: "120px" }}>
                                                    <Typography variant="body1"> ĐỀ NGHỊ NHẬN NUÔI </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell className="product-thumbnail">
                                                <img
                                                    src={product.petId.petImage}
                                                    alt={product.petId.petName}
                                                    className="attachment-shop_thumbnail size-shop_thumbnail wp-post-image"
                                                />
                                            </TableCell>
                                            <TableCell
                                                className="product-subtotal"
                                                data-title="Subtotal"
                                            >
                                                {product.petId.petName}
                                                {/* <span className="woocommerce-Price-currencySymbol">
                                                    VND
                                                </span> */}
                                            </TableCell>
                                            <TableCell className="product-remove">
                                                <CheckCircleIcon
                                                    fontSize="large"
                                                    color="success"
                                                    onClick={() => showConfirm(product)}
                                                />
                                            </TableCell>
                                            <TableCell className="product-remove">
                                                <DoNotDisturbOnIcon
                                                    fontSize="large"
                                                    color="error"
                                                    onClick={() => showReject(product)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Container>
            <Modal title="Thông tin người nhận nuôi" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Tên: {userRequest.fullname}</p>
                <p>Email: {userRequest.email}</p>
                <p>Số điện thoại: {userRequest.phone}</p>
                <p>Địa chỉ: {userRequest.address}</p>
                <p>Giới tính: {userRequest.gender === true ? "Nam" : "Nữ"} </p>
            </Modal>
            <Footer />
        </>
    );
}