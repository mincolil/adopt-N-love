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
    TextField,
    Button,
    IconButton,
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

import Fab from '@mui/material/Fab';

export default function AdoptRequest() {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loged, setLoged] = useState(false);
    const [total, setTotal] = useState(0);

    const context = useAuth();

    const [quantity, setQuantity] = useState(1);

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
                    toast.error(loadData.error);
                } else {
                    setData(loadData.data);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

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
            });

            const deleteAdoptRequest = await axios.delete("http://localhost:3500/adopt/deleteAdoptNotification/" + adoptRequest._id);
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
                    toast.success("Xoá sản phẩm thành công");
                });
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <toastContainer />
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
                        href="/cart-product"
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
                                    {data.map((product, index) => (
                                        <TableRow key={index} className="cart_item">

                                            <TableCell className="product-name" data-title="Product">
                                                <Typography variant="body1">
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
                                                    onClick={() => handleAcceptAdoptRequest(product)}
                                                />
                                            </TableCell>
                                            <TableCell className="product-remove">
                                                <DoNotDisturbOnIcon
                                                    fontSize="large"
                                                    color="error"
                                                    onClick={() => handleRejectAdoptRequest(product)}
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
            <Footer />
        </>
    );
}