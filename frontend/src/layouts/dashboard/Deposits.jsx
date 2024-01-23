import * as React from 'react';
// import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './TittleDashboard';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// import axios from "axios";

// import { useEffect, useState } from "react";


// function preventDefault(event) {
//   event.preventDefault();
// }



function DepositsDashboard(props) {

  const [selectedValue, setSelectedValue] = React.useState(null);
  const [previousValue, setPreviousValue] = React.useState(null);

  const [selectedMonth, setSelectedMonth] = React.useState(null);
  const [previousMonth, setPreviousMonth] = React.useState(null);

  const handleSelectChange = (event) => {
    const currentValue = parseInt(event.target.value, 10);
  
    // Lưu giá trị trước đó vào previousValue
    setPreviousValue(selectedValue);

    // Cập nhật giá trị hiện tại
    setSelectedValue(currentValue);
  };

  const handleSelectServiceMonthChange = (event) => {
    const currentValue = parseInt(event.target.value, 10);
  
    // Lưu giá trị trước đó vào previousValue
    setPreviousMonth(selectedMonth);

    // Cập nhật giá trị hiện tại
    setSelectedMonth(currentValue);
  };

  const selectStyle = {
    width: '100%',
    padding: '16px 8px'
  }

  const numberToVND = (number) => {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <React.Fragment>
      {props.props !== undefined ? (
        <>
          <Title>Doanh thu sản phẩm</Title>
          <Typography component="p" variant="h4">
            {props.props !== undefined ? numberToVND(Number(props.props.totalPrice)) : ''}
          </Typography>
          <hr />
          <Title>Doanh thu dịch vụ</Title>
          <Typography component="p" variant="h4">
            {props.props !== undefined ? numberToVND(Number(props.props.revenueService)) : ''}
          </Typography>
        </>
      ) : ''
      }

      {props.sold !== undefined ? (
        <>
          <Title>Sản phẩm đã bán</Title>
          <Typography component="p" variant="h4">
            {props.sold !== undefined ? Number(props.sold.productSold) : ''}
          </Typography>
          <hr />
          <Title>Dịch vụ được sử dụng</Title>
          <Typography component="p" variant="h4">
            {props.sold !== undefined ? Number(props.sold.serviceSold) : ''}
          </Typography>
        </>
      ) : ''
      }

      {props.raw !== undefined ? (
        <>
          <Title>Doanh thu sản phẩm theo tháng</Title>
          <div>
            <select style={selectStyle} onChange={handleSelectChange} value={selectedValue !== null ? selectedValue : ''}>
              <option value={0} disabled>Tháng 1</option>
              {props.raw.revenueByMonth.map((value) => (
                <option key={value.month} value={value.total}>
                  Tháng {value.month}
                </option>
              ))}
            </select>
            <p>Doanh thu: {selectedValue === null ? numberToVND(0) : numberToVND(selectedValue)}</p>
          </div>
        </>
      ) : ''
      }

      {props.dataRaw !== undefined ? (
        <>
        {console.log(props.dataRaw)}
          <Title>Doanh thu dịch vụ theo tháng</Title>
          <div>
            <select style={selectStyle} onChange={handleSelectServiceMonthChange} value={selectedMonth !== null ? selectedMonth : ''}>
              <option value={0} disabled>Tháng 1</option>
              {props.dataRaw.revenueByMonth.map((value) => (
                <option key={value.month} value={value.total}>
                  Tháng {value.month}
                </option>
              ))}
            </select>
            <p>Doanh thu: {selectedMonth === null ? numberToVND(0) : numberToVND(selectedMonth)}</p>
          </div>
        </>
      ) : ''
      }

      {props.dataBooking !== undefined ? 
      (
        <>
          <Title>Dịch vụ được sử dụng</Title>
          <Typography component="p" variant="h4">
            {props.dataBooking !== undefined ? Number(props.dataBooking) : ''}
          </Typography>
        </>
      ) 
      : ''
      }

      <Typography color="text.secondary" sx={{ flex: 1 }}>
      </Typography>
      <div>
        {/* <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link> */}
      </div>
    </React.Fragment>
  );
}

export default DepositsDashboard