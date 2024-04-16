import * as React from "react";
// import Link from '@mui/material/Link';
import Typography from "@mui/material/Typography";
import Title from "./TittleDashboard";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

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

  const [selectedPetType, setSelectedPetType] = React.useState(null);
  const [previousPetType, setPreviousPetType] = React.useState(null);

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

  const handleSelectChangePetType = (event) => {
    const currentValue = parseInt(event.target.value, 10);

    setSelectedPetType(currentValue);
  };

  const selectStyle = {
    width: "100%",
    padding: "16px 8px",
  };

  const numberToVND = (number) => {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const getRevenue = (selectedMonth) => {
    const selectedData = props.raw.revenueByMonth.find(
      (item) => item.month === selectedMonth
    );
    return selectedData ? selectedData.total : 0;
  };

  const getServiceRevenue = (selectedMonth) => {
    const selectedData = props.dataRaw.revenueByMonth.find(
      (item) => item.month === selectedMonth
    );
    return selectedData ? selectedData.total : 0;
  };

  return (
    <React.Fragment>
      {props.props !== undefined ? (
        <>
          <Title>Doanh thu sản phẩm</Title>
          <Typography component="p" variant="h4">
            {props.props !== undefined
              ? numberToVND(Number(props.props.totalPrice))
              : ""}
          </Typography>
          <hr />
          <Title>Doanh thu dịch vụ</Title>
          <Typography component="p" variant="h4">
            {props.props !== undefined
              ? numberToVND(Number(props.props.revenueService))
              : ""}
          </Typography>
        </>
      ) : (
        ""
      )}

      {props.sold !== undefined ? (
        <>
          <Title>Sản phẩm đã bán</Title>
          <Typography component="p" variant="h4">
            {props.sold !== undefined ? Number(props.sold.productSold) : ""}
          </Typography>
          <hr />
          <Title>Dịch vụ được sử dụng</Title>
          <Typography component="p" variant="h4">
            {props.sold !== undefined ? Number(props.sold.serviceSold) : ""}
          </Typography>
        </>
      ) : (
        ""
      )}

      {props.raw !== undefined ? (
        <>
          <Title>Doanh thu sản phẩm theo tháng</Title>
          <div>
            <select
              style={selectStyle}
              onChange={handleSelectChange}
              value={selectedValue !== null ? selectedValue : 0}
            >
              <option value={0} disabled>
                -- Chọn tháng --
              </option>
              {props.raw.revenueByMonth.map((value) => (
                <option key={value.month} value={value.month}>
                  Tháng {value.month}
                </option>
              ))}
            </select>
            <p>
              Doanh thu:{" "}
              {selectedValue === null
                ? numberToVND(0)
                : numberToVND(getRevenue(selectedValue))}
            </p>
          </div>
        </>
      ) : (
        ""
      )}

      {props.dataRaw !== undefined ? (
        <>
          <Title>Doanh thu dịch vụ theo tháng</Title>
          <div>
            <select
              style={selectStyle}
              onChange={handleSelectServiceMonthChange}
              value={selectedMonth !== null ? selectedMonth : ""}
            >
              <option value="" disabled selected>
                -- Chọn tháng --
              </option>
              {props.dataRaw.revenueByMonth.map((value) => (
                <option key={value.month} value={value.month}>
                  Tháng {value.month}
                </option>
              ))}
            </select>

            <p>
              Doanh thu:{" "}
              {selectedMonth === null
                ? numberToVND(0)
                : numberToVND(getServiceRevenue(selectedMonth))}
            </p>
          </div>
        </>
      ) : (
        ""
      )}

      {props.petTypeRaw !== undefined ? (
        <>
          {console.log(props.dataRaw)}
          <Title>Doanh thu tháng theo loại thú cưng</Title>
          <div>
            <select
              style={selectStyle}
              onChange={handleSelectChangePetType}
              value={selectedPetType !== null ? selectedPetType : ""}
            >
              <option value="" disabled>
                Chọn loại thú cưng
              </option>
              {props.petTypeRaw.map((value) => (
                <option value={value.totalPrice}>
                  {value._id === "654c892a49de3af51bdaa32c"
                    ? "Mèo"
                    : value._id === "6570b9a3e87b4feefedef514"
                    ? "Chó"
                    : "Khác"}
                </option>
              ))}
            </select>

            <p>
              Doanh thu:{" "}
              {selectedPetType === null
                ? numberToVND(0)
                : numberToVND(selectedPetType)}
            </p>
          </div>
        </>
      ) : (
        ""
      )}

      {props.dataBooking !== undefined ? (
        <>
          <Title>Dịch vụ được sử dụng</Title>
          <Typography component="p" variant="h4">
            {props.dataBooking !== undefined ? Number(props.dataBooking) : ""}
          </Typography>
        </>
      ) : (
        ""
      )}

      <Typography color="text.secondary" sx={{ flex: 1 }}></Typography>
      <div>
        {/* <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link> */}
      </div>
    </React.Fragment>
  );
}

export default DepositsDashboard;
