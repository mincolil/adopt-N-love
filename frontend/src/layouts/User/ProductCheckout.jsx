import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'bootstrap';
import dayjs from "dayjs";
import { Typography } from '@mui/material';

const inputStyle = {
    width: '100%',
    boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 10%)',
    border: '1px solid #ddd', height: '2.507em',
    paddingLeft: '10px'
}

const tagPStyle = {
    marginBottom: '8px',
    fontWeight: 'bolder',
    marginTop: '20px'
}

export default function ProductCheckout() {

    // const DEFAULT_PAGE = 1;
    // const DEFAULT_LIMIT = 5;
    const PHONE_NUMBER_REGEX = /^(84|0[3|5|7|8|9])+([0-9]{8})$/;

    const navigate = useNavigate();
    const context = useAuth();

    const [data, setData] = useState([]);
    // const [quantity, setQuantity] = useState(0)
    const [loged, setLoged] = useState(false)
    const [total, setTotal] = useState(0)

    const [recipientName, setRecipientName] = useState(context.auth.fullname)
    const [recipientPhoneNumber, setRecipientPhoneNumber] = useState(context.auth.phone)
    const [deliveryAddress, setDeliveryAddress] = useState(context.auth.address)


    const checkoutProduct = async () => {
        // alert('Phần mềm đang được Hạnh Nguyên cập nhật')
        console.log(recipientName + ' ' + recipientPhoneNumber + ' ' + context.auth.token)
        if (recipientName.trim() === '') {
            toast.error("Vui lòng điền người nhận")
        } else if (deliveryAddress.trim() === '') {
            toast.error("Vui lòng nhập địa chỉ")
        }else if (recipientPhoneNumber.trim() === '') {
            toast.error("Vui lòng nhập số điện thoại")
        } else if (!recipientPhoneNumber.match(PHONE_NUMBER_REGEX)) {
            toast.error("Số điện thoại không chính xác")
        } else {
            try {
                const loadData = await axios.post(
                    `http://localhost:3500/cartProduct/checkout`,
                    {
                        recipientName: recipientName,
                        recipientPhoneNumber: recipientPhoneNumber,
                        deliveryAddress: deliveryAddress,
                        // totalPrice: total
                    },
                    {
                        headers: { 'Authorization': context.auth.token },
                        withCredentials: true
                    }
                )
                    .then((data) => {
                        if (data.data.message === 'Checkout successful') {
                            toast.success("Đặt hàng sản phẩm thành công");
                            context.handleLoadCartProduct()
                            navigate('/product-purchase')
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })

            } catch (err) {
                console.log(err);
            }
        }
    }

    const handleLoadCartProduct = async () => {
        if (context.auth.token !== undefined) {
            setLoged(true)
            try {
                const loadData = await axios.get(
                    `http://localhost:3500/cartProduct/view-cart`,
                    {
                        headers: { 'Authorization': context.auth.token },
                        withCredentials: true
                    }
                );
                if (loadData.error) {
                    toast.error(loadData.error);
                } else {
                    setData(loadData.data)
                    setRecipientName(loadData.data[0].userId.fullname)
                    setRecipientPhoneNumber(loadData.data[0].userId.phone === undefined ? "" : loadData.data[0].userId.phone)
                    setDeliveryAddress(loadData.data[0].userId.address === undefined ? "" : loadData.data[0].userId.address)
                    // console.log(loadData.data);
                    let totalPrice = 0;
                    for (let i = 0; i < loadData.data.length; i++) {
                        if (loadData.data[i].productId.discount !== 0
                            &&
                            dayjs().isBetween(dayjs(loadData.data[i].productId.saleStartTime), dayjs(loadData.data[i].productId.saleEndTime))) {
                            totalPrice += loadData.data[i].quantity * (loadData.data[i].productId.price - (loadData.data[i].productId.price * loadData.data[i].productId.discount / 100))
                        } else {
                            totalPrice += loadData.data[i].quantity * loadData.data[i].productId.price
                        }
                    }
                    setTotal(totalPrice);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    useEffect(() => {
        handleLoadCartProduct()
    }, []);

    const numberToVND = (number) => {
        return number.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    };

    return (
        <Box sx={{ flexGrow: 1, marginTop: '100px', marginLeft: '50px', marginRight: '50px' }}>
            <Grid container spacing={5}>
                <Grid item xs={7}>
                    <h6 style={{ marginTop: '30px', fontWeight: 'bolder', fontSize: '18px' }}>THÔNG TIN THANH TOÁN</h6>

                    <p style={tagPStyle}>Họ và Tên *</p>
                    <input
                        type="text"
                        placeholder='Họ và tên'
                        style={inputStyle}
                        onChange={(e) => setRecipientName(e.target.value)}
                        defaultValue={recipientName}
                    ></input>

                    <p style={tagPStyle}>Địa chỉ *</p>
                    <input
                        type="text"
                        placeholder="Địa chỉ"
                        style={inputStyle}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        defaultValue={deliveryAddress}
                    ></input>

                    {/* <p style={ tagPStyle }>Tỉnh / Thành phố *</p>
                    <input type="text" placeholder="Địa chỉ" style={ inputStyle }></input> */}

                    <p style={tagPStyle}>Số điện thoại *</p>
                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        style={inputStyle}
                        onChange={(e) => setRecipientPhoneNumber(e.target.value)}
                        defaultValue={recipientPhoneNumber}
                    ></input>
                </Grid>
                <Grid item xs={5}>
                    <h6 style={{ marginTop: '30px', fontWeight: 'bolder', fontSize: '18px' }}>ĐƠN HÀNG CỦA BẠN</h6>
                    {/* <p>Mã giỏ hàng: <span></span></p> */}

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <p style={{ marginTop: '10px', fontWeight: 'bolder', fontSize: '15px' }}>SẢN PHẨM</p>
                        </Grid>
                        <Grid item xs={6}>
                            <p style={{ textAlign: 'right' }}>TỔNG</p>
                        </Grid>
                    </Grid>
                    <hr />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <p style={{ fontWeight: 'bolder' }}>Tạm tính</p>
                        </Grid>
                        <Grid item xs={6}>
                            <p style={{ color: '#cc2121', textAlign: 'right' }}>{numberToVND(total)}</p>
                        </Grid>
                    </Grid>
                    {/* <hr />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <p style={{ fontWeight: 'bolder' }}>Giao hàng</p>
                        </Grid>
                        <Grid item xs={6}>
                            <p style={{ textAlign: 'right' }}>Giao hàng miễn phí</p>
                        </Grid>
                    </Grid> */}
                    <hr />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <p style={{ fontWeight: 'bolder' }}>Tổng</p>
                        </Grid>
                        <Grid item xs={6}>
                            <p style={{ color: '#cc2121', textAlign: 'right' }}>{numberToVND(total)}</p>
                        </Grid>
                    </Grid>
                    <hr />
                    {/* <input type="checkbox" /> */}
                    {/* <label style={{ fontWeight: 'bolder' }}>Trả tiền mặt khi nhận hàng</label><br /> */}
                    <Typography> <strong>* Lưu ý:</strong> Sau khi điền đầy đủ thông tin chính xác, ấn đặt hàng, đơn hàng của bạn sẽ được chúng tôi chuẩn bị và giao hàng. Tùy vào địa chỉ, bạn sẽ nhận hàng vào từ 2-4 ngày tới. Hãy chú ý điện thoại để nhận hàng, sau đó kiểm tra kỹ đơn hàng sau đó mới thanh toán, nếu có vấn đề gì về đơn hàng hãy liên lạc cho chúng tôi để giải quyết.</Typography>
                    <button style={{
                        cursor: 'pointer',
                        height: '40px',
                        border: 'none',
                        width: '30%',
                        backgroundColor: 'black',
                        color: 'white',
                        fontWeight: 'bolder',
                        marginTop: '20px'
                    }}
                        onClick={checkoutProduct}
                    >
                        ĐẶT HÀNG
                    </button>
                </Grid>
            </Grid>
        </Box>
    );
}
