import * as React from "react";
// import { useTheme } from "@mui/material/styles";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Label,
//   ResponsiveContainer,
// } from "recharts";
import {
  Box,
  Container,
  Grid,
  Paper,
  // Toolbar,
  // Typography,
} from "@mui/material";
import ChartDashBroad from "./Chart";
import DepositsDashboard from "./Deposits";
// import OrdersDashboard from "./Orders";
import { PieChart } from '@mui/x-charts/PieChart';

// import useAuth from "../../hooks/useAuth";

import axios from "axios";

import { useEffect, useState } from "react";
import { set } from "date-fns";

export default function DashboardList() {
  // const context = useAuth()

  // const theme = useTheme();

  // const drawerWidth = 240;

  const [data, setData] = useState([]);
  const [dataBooking, setDataBooking] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customer, setCustomer] = useState(0);
  const [staff, setStaff] = useState(0);
  const [pet, setPet] = useState(0);
  const [revenue, setRevenue] = useState();
  const [revenueService, setRevenueService] = useState();
  const [revenueRaw, setRevenueRaw] = useState();
  const [serviceRaw, setServiceRaw] = useState();
  const [revenueServiceByPetType, setRevenueServiceByPetType] = useState();

  async function loadAllOrder() {
    try {
      await axios.get(`http://localhost:3500/dashboard/order`)
        .then((data) => {
          let price = 0;

          data.data.totalOrders.map((value) => {
            if (value.status === 'Đã nhận hàng') price += value.totalPrice
          })
          setTotalPrice(price)
          setData(data.data.totalOrders)
        })
    } catch (err) {
    }
  }

  async function loadAllBooking() {
    try {
      await axios.get(`http://localhost:3500/serviceDashboard/booking`)
        .then((data) => {
          setDataBooking(data.data.totalBookings)
        })
    } catch (err) {
    }
  }

  async function revenueStatistics() {
    try {
      let totalRevenue = 0;
      await axios
        .get(`http://localhost:3500/dashboard/revenue-statistics`)
        .then((data) => {
          data.data.revenueByMonth.map((value) => {
            totalRevenue += value.total
          })
          setRevenueRaw(data.data)
          setRevenue(totalRevenue);
        });
    } catch (err) {
    }
  }

  async function revenueServiceStatistics() {
    try {
      await axios
        .get(`http://localhost:3500/serviceDashboard/revenue-statistics`)
        .then((data) => {
          setServiceRaw(data.data)
        });
    } catch (err) {
    }
  }

  async function loadAllCustomer() {
    try {
      await axios.get(`http://localhost:3500/dashboard/customer`)
        .then((data) => {
          let customer = 0;
          let staff = 0;
          data.data.map((value) => {
            if (value.role === 'customer') {
              customer++
            } else if (value.role === 'staff') {
              staff++
            }
          })
          setCustomer(customer)
          setStaff(staff)

        })
    } catch (err) {
    }
  }

  async function loadAllPet() {
    try {
      await axios.get(`http://localhost:3500/pet`)
        .then((data) => {
          setPet(data.data.total)
        })
    } catch (err) {
    }
  }

  async function loadRevenueService() {
    try {
      await axios.get(`http://localhost:3500/serviceDashboard/revenue`)
        .then((data) => {
          setRevenueService(data.data[0].total)
        })
    } catch (err) {
    }
  }

  async function loadRevenueServiceByPetType() {
    try {
      await axios.get(`http://localhost:3500/serviceDashboard/revenue-statistics-by-pet-type`)
        .then((data) => {
          console.log(data)
          setRevenueServiceByPetType(data.data)
        })
    } catch (err) {
    }
  }


  useEffect(() => {
    loadAllOrder();
    loadAllBooking()
    loadAllCustomer()
    loadAllPet()
    revenueStatistics()
    loadRevenueService()
    revenueServiceStatistics()
    loadRevenueServiceByPetType()
  }, []);


  return (
    <>
      <React.Fragment>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 240,
                }}
              >
                <DepositsDashboard props={{ totalPrice, revenueService }} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 240,
                }}
              >
                <DepositsDashboard raw={revenueRaw} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 240,
                }}
              >
                <DepositsDashboard petTypeRaw={revenueServiceByPetType} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 240,
                }}
              >
                <DepositsDashboard dataRaw={serviceRaw} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 240,
                }}
              >
                <DepositsDashboard sold={{ serviceSold: dataBooking.length, productSold: data.length }} />
              </Paper>
            </Grid>
            <ChartDashBroad />

          </Grid>
        </Container>
      </React.Fragment>
    </>
  );
}
