import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import useAuth from '../../../hooks/useAuth';
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';

export default function CartService() {
  // const DEFAULT_PAGE = 1;
  // const DEFAULT_LIMIT = 5;

  const [data, setData] = useState([]);
  // const [quantity, setQuantity] = useState(0)
  const [loged, setLoged] = useState(false)
  const [total, setTotal] = useState(0)

  const context = useAuth();
  console.log(context.auth)
  const navigate = useNavigate();

  const handleLoadCartService = async () => {
    if (context.auth.token != undefined) {
      // console.log(context.auth.token)
      setLoged(true)
      try {
        const loadData = await axios.get(
          `http://localhost:3500/cartService/view-cart`,
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
    handleLoadCartService()
  }, []);

  // ----------------------------------------------------------------

  const handleCheckOut = async () => {
    // if (window.confirm('Bạn có muốn sử dụng dịch vụ này ?') === true) {
    //   if (data.length === 0) {
    //     alert('Bạn không có dịch vụ trong giỏ hàng')
    //   } else {
    //     try {
    //       await axios.post(
    //         `http://localhost:3500/cartService/checkout`,
    //         {
    //           totalPrice: total
    //         },
    //         {
    //           headers: { 'Authorization': context.auth.token },
    //           withCredentials: true
    //         }
    //       )
    //         .then((data) => {
    //           alert('Đặt dịch vụ thành công')
    //           context.handleLoadCartService()
    //           navigate('/service-purchase')

    //         })

    //     } catch (err) {
    //       console.log(err);
    //     }
    //   }
    // }
    console.log(data)
    context.auth.fullname = data[0].userId.fullname
    data[0].userId.phone !== undefined ? context.auth.phone = data[0].userId.phone : context.auth.phone = ""
    navigate('/service-checkout');
  }

  // ----------------------------------------------------------------
  // const productStyle = {
  //   padding: '16px 0',
  //   marginTop: '0',
  //   border: '1px solid rgba(0, 0, 0, .2)'
  // }

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

  // const quantityInputStyle = {
  //   padding: '5px',
  //   width: '20%',
  //   textAlign: 'center',
  //   // borderRight: 'none',
  //   // borderLeft: 'none'
  //   border: 'none'
  // }

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

  const handleDeleteOrder = async (id) => {
    if (
      window.confirm("Bạn có chắc muốn xoá dịch vụ này không ?") ===
      true
    ) {
    try {
      await axios.delete(
        `http://localhost:3500/cartService/remove-from-cart/${id}`,
        {
          headers: { 'Authorization': context.auth.token },
          withCredentials: true
        }
      )
        .then((data) => {
          handleLoadCartService()
          context.handleLoadCartService()
          toast.success("Xoá dịch vụ thành công")
        })

    } catch (err) {
      console.log(err);
    }
  }
  }

  const numberToVND = (number) => {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', marginTop: '100px' }}>DANH SÁCH DỊCH VỤ ĐÃ CHỌN</h1>
      <Card sx={{ minWidth: 275 }} style={{ padding: '20px', margin: '0 50px 200px 50px', boxShadow: 'none' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2} style={{ border: '1px solid rgba(0, 0, 0, .2)', paddingBottom: '16px' }}>
                <Grid item xs>
                  DỊCH VỤ
                </Grid>
                <Grid item xs>
                  TÊN THÚ CƯNG
                </Grid>
                <Grid item xs>
                  GIÁ
                </Grid>
                <Grid item xs>
                  TỔNG
                </Grid>
                <Grid item xs>
                  CHỨC NĂNG
                </Grid>
              </Grid>
              {
                loged === false
                  ? <h3 style={{ textAlign: 'center' }}>VUI LÒNG ĐĂNG NHẬP</h3>
                  : data.length === 0
                    ? <h3 style={{ textAlign: 'center' }}>BẠN CHƯA ĐẶT DỊCH VỤ NÀO</h3>
                    : data.map((value, index) => {
                      return (
                        <Grid container spacing={2} style={{ padding: '10px 0' }}>
                          <Grid item xs>
                            {value.serviceId.serviceName}
                          </Grid>
                          <Grid item xs>
                            {value.petId.petName}
                          </Grid>

                          {
                            value.serviceId.discount !== 0
                              &&
                              dayjs().isBetween(dayjs(value.serviceId.saleStartTime), dayjs(value.serviceId.saleEndTime))
                              ?
                              (
                                <>
                                  <Grid item xs style={{ display: 'flex' }}>
                                    <Typography style={{ textDecoration: "line-through" }}>
                                      {
                                        value.serviceId === null ? ""
                                          : value.serviceId.discount === 0 ? ""
                                            : numberToVND(value.serviceId.price)
                                      }
                                    </Typography>
                                    <Typography style={{ color: 'red' }}>
                                      {
                                        value.serviceId === null ? ""
                                          :
                                          numberToVND((value.quantity * (value.serviceId.price - (value.serviceId.price * value.serviceId.discount / 100))))
                                      }
                                    </Typography>
                                  </Grid>
                                  <Grid item xs style={{ display: 'flex' }}>
                                    <Typography style={{ color: 'red' }}>
                                      {
                                        value.serviceId === null ? ""
                                          :
                                          numberToVND((value.quantity * (value.serviceId.price - (value.serviceId.price * value.serviceId.discount / 100))))
                                      }
                                    </Typography>
                                  </Grid>
                                </>
                              )
                              :
                              (
                                <>
                                  <Grid item xs style={{ display: 'flex' }}>
                                    <Typography style={{ color: 'red' }}>
                                      {
                                        value.serviceId === null ? ""
                                          :
                                          numberToVND(value.quantity * value.serviceId.price)
                                      }
                                    </Typography>
                                  </Grid>
                                  <Grid item xs style={{ display: 'flex' }}>
                                    <Typography style={{ color: 'red' }}>
                                      {
                                        value.serviceId === null ? ""
                                          :
                                          numberToVND(value.quantity * value.serviceId.price)
                                      }
                                    </Typography>
                                  </Grid>
                                </>
                              )
                          }

                          <Grid item xs>
                            <button
                              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                              onClick={(e) => handleDeleteOrder(value.serviceId._id)}
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
                ĐẶT DỊCH VỤ
              </button>
              :
              <button
                type='button'
                onClick={() => handleCheckOut()}
                style={{ color: 'pink', backgroundColor: 'black', width: '100%', padding: '15px 0' }}
              >
                ĐẶT DỊCH VỤ
              </button>
          }

        </Grid>
        {/* <button onClick={() => handleTest()}>click</button> */}
      </Card>
    </>
  );
}