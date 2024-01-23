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

export default function ServiceCheckout() {

    // const DEFAULT_PAGE = 1;
    // const DEFAULT_LIMIT = 5;
    const PHONE_NUMBER_REGEX = /^(84|0[3|5|7|8|9])+([0-9]{8})$/;

    const navigate = useNavigate();
    const context = useAuth();
    console.log(context.auth)

    const [data, setData] = useState([]);
    // const [quantity, setQuantity] = useState(0)
    const [loged, setLoged] = useState(false)
    const [total, setTotal] = useState(0)

    const [recipientName, setRecipientName] = useState(context.auth.fullname)
    const [recipientPhoneNumber, setRecipientPhoneNumber] = useState(context.auth.phone)


    const checkoutProduct = async () => {
        // alert('Phần mềm đang được Hạnh Nguyên cập nhật')
        console.log(recipientName + ' ' + recipientPhoneNumber + ' ' + context.auth.token)
        if (recipientName.trim() === '') {
            toast.error("Vui lòng điền người nhận")
        } else if (recipientPhoneNumber.trim() === '') {
            toast.error("Vui lòng nhập số điện thoại")
        } else if (!recipientPhoneNumber.match(PHONE_NUMBER_REGEX)) {
            toast.error("Số điện thoại không chính xác")
        } else {
            try {
                await axios.post(`http://localhost:3500/cartService/checkout`,
                    {
                        recipientName: recipientName,
                        recipientPhoneNumber: recipientPhoneNumber,
                        // totalPrice: total
                    },
                    {
                        headers: { 'Authorization': context.auth.token },
                        withCredentials: true
                    }
                )
                    .then((data) => {
                        if (data.data.message === 'Checkout successful') {
                            toast.success("Đặt dịch vụ thành công");
                            context.handleLoadCartService()
                            navigate('/service-purchase')
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
                const loadData = await axios.get(`http://localhost:3500/cartService/view-cart`,
                    {
                        headers: { 'Authorization': context.auth.token },
                        withCredentials: true
                    }
                );
                if (loadData.error) {
                    toast.error(loadData.error);
                } else {
                    setData(loadData.data)
                    // console.log(loadData.data);
                    let totalPrice = 0;
                    for (let i = 0; i < loadData.data.length; i++) {
                        if (loadData.data[i].serviceId.discount !== 0
                            &&
                            dayjs().isBetween(dayjs(loadData.data[i].serviceId.saleStartTime), dayjs(loadData.data[i].serviceId.saleEndTime))) {
                            totalPrice += loadData.data[i].quantity * (loadData.data[i].serviceId.price - (loadData.data[i].serviceId.price * loadData.data[i].serviceId.discount / 100))
                        } else {
                            totalPrice += loadData.data[i].quantity * loadData.data[i].serviceId.price
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
                    <h6 style={{ marginTop: '30px', fontWeight: 'bolder', fontSize: '18px' }}>ĐƠN ĐĂNG KÍ CỦA BẠN</h6>
                    {/* <p>Mã giỏ hàng: <span></span></p> */}

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <p style={{ marginTop: '10px', fontWeight: 'bolder', fontSize: '15px' }}>DỊCH VỤ</p>
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
                    <Typography> <strong>* Lưu ý:</strong> Xin vui lòng kiểm tra điện thoại của bạn sau khi đặt dịch vụ. Nhân viên của cửa hàng chúng tôi sẽ sớm liên lạc để chốt lại thời gian.</Typography>
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
                        ĐẶT DỊCH VỤ
                    </button>
                </Grid>
            </Grid>
        </Box>
    );
}
