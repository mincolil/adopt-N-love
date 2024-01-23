import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";


export default function CartProduct() {
  // const DEFAULT_PAGE = 1;
  // const DEFAULT_LIMIT = 5;
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [quantity, setQuantity] = useState(0)
  const [loged, setLoged] = useState(false)
  const [total, setTotal] = useState(0)

  const context = useAuth();

  const handleDeleteOrder = async (id) => {
    if (
      window.confirm("Bạn có chắc muốn xoá sản phẩm này không ?") ===
      true
    ) {
    try {
      await axios.delete(
        `http://localhost:3500/cartProduct/remove-from-cart/${id}`,
        {
          headers: { 'Authorization': context.auth.token },
          withCredentials: true
        }
      )
        .then((data) => {
          handleLoadCartProduct()
          context.handleLoadCartProduct()
          toast.success("Xoá sản phẩm thành công")
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

  // ----------------------------------------------------------------

  const handleCheckOut = async () => {
    context.auth.fullname = data[0].userId.fullname
    data[0].userId.address !== undefined ? context.auth.address = data[0].userId.address : context.auth.address = ""
    data[0].userId.phone !== undefined ? context.auth.phone = data[0].userId.phone : context.auth.phone = ""
    navigate('/product-checkout');
  }

  // ----------------------------------------------------------------
  const productStyle = {
    padding: '16px 0',
    marginTop: '0',
    border: '1px solid rgba(0, 0, 0, .2)'
  }

  // const cartHeader = {
  //   fontWeight: 'bolder',
  //   fontSize: '15px'
  // }

  // const quantityButtonRightStyle = {
  //   padding: '5px 12px',
  //   borderLeft: 'none',
  //   background: 'none'
  // }

  // const quantityButtonLeftStyle = {
  //   padding: '5px 12px',
  //   borderRight: 'none',
  //   background: 'none'
  // }

  const quantityInputStyle = {
    padding: '5px',
    width: '20%',
    textAlign: 'center',
    // borderRight: 'none',
    // borderLeft: 'none',
    border: 'none'
  }
  const checkout = {
    position: 'fixed',
    left: '0',
    bottom: '0',
    width: '100%',
    backgroundColor: 'white',
    // color: 'white',
    textAlign: 'center',
    boxShadow: '0 -5px 10px #b3b3b3',
    paddingTop: '20px'
  }

  const numberToVND = (number) => {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', marginTop: '100px' }}>GIỎ HÀNG SẢN PHẨM</h1>
      <Card sx={{ minWidth: 275 }} style={{ padding: '20px', margin: '0 50px 200px 50px', boxShadow: 'none' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2} style={{ border: '1px solid rgba(0, 0, 0, .2)', paddingBottom: '16px' }}>
                <Grid item xs={4}>
                  SẢN PHẨM
                </Grid>
                <Grid item xs style={{ textAlign: 'center' }}>
                  ĐƠN GIÁ
                </Grid>
                <Grid item xs>
                  SỐ LƯỢNG
                </Grid>
                <Grid item xs>
                  SỐ TIỀN
                </Grid>
                <Grid item xs={1}>
                  THAO TÁC
                </Grid>
              </Grid>
              {
                loged === false
                  ? <h3 style={{ textAlign: 'center' }}>VUI LÒNG ĐĂNG NHẬP</h3>
                  : data.length === 0
                    ? <h3 style={{ textAlign: 'center' }}>KHÔNG CÓ SẢN PHẨM TRONG GIỎ HÀNG</h3>
                    : data.map((value, index) => {
                      return (
                        <Grid container spacing={2} style={productStyle}>
                          <Grid item xs={4}>
                            {value.productId === null ? "" : value.productId.productName}
                          </Grid>
                          <Grid item xs style={{ textAlign: 'center' }}>
                            {value.productId === null ? "" : numberToVND(value.productId.price)}
                          </Grid>
                          <Grid item xs>
                            {/* <button style={quantityButtonLeftStyle}>-</button> */}
                            <input type='text' style={quantityInputStyle} value={value.quantity} onChange={(e) => setQuantity(e.target.value)} disabled />
                            {/* <button onClick={() => handleProduct()} style={quantityButtonRightStyle}>+</button> */}
                          </Grid>
                          <Grid item xs style={{ display: 'flex' }}>
                            {
                              value.productId.discount !== 0
                                &&
                                dayjs().isBetween(dayjs(value.productId.saleStartTime), dayjs(value.productId.saleEndTime))
                                ?
                                (
                                  <>
                                    <Typography style={{ textDecoration: "line-through" }}>
                                      {
                                        value.productId === null ? ""
                                          : value.productId.discount === 0 ? ""
                                            : numberToVND((value.quantity * value.productId.price))
                                      }
                                    </Typography>
                                    <Typography style={{ color: 'red' }}>
                                      {
                                        value.productId === null ? ""
                                          :
                                          numberToVND((value.quantity * (value.productId.price - (value.productId.price * value.productId.discount / 100))))
                                      }
                                    </Typography>
                                  </>
                                )
                                :
                                (
                                  <Typography>
                                    {
                                      value.productId === null ? ""
                                        : numberToVND(value.productId.price)
                                    }
                                  </Typography>

                                )
                            }
                          </Grid>
                          <Grid item xs={1}>
                            <button
                              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                              onClick={(e) => handleDeleteOrder(value.productId._id)}
                            >
                              Xoá
                            </button>
                          </Grid>
                        </Grid>
                      )
                    })
              }
            </Grid>
          </Grid>
        </Box>
        <Grid item xs={12} style={checkout}>
          <Grid container spacing={3} style={{ paddingBottom: '20px' }}>
            <Grid item xs>
              TẤT CẢ
            </Grid>
            <Grid item xs>
              {numberToVND(total)}
            </Grid>
          </Grid>
          <p>Phí vận chuyển được tính khi thanh toán</p>
          {
            data.length === 0
              ?
              <button
                type='button'
                onClick={() => handleCheckOut()}
                style={{ color: 'pink', backgroundColor: 'black', width: '100%', padding: '15px 0' }}
                disabled
              >
                Không có sản phẩm trong giỏ hàng
              </button>
              :
              <button
                type='button'
                onClick={() => handleCheckOut()}
                style={{ color: 'pink', backgroundColor: 'black', width: '100%', padding: '15px 0' }}
              >
                Đặt hàng
              </button>
          }
        </Grid>
        {/* <button onClick={() => handleTest()}>click</button> */}
      </Card>
    </>
  );
}