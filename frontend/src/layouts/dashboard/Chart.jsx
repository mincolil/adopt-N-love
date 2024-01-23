import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import { Typography, Paper, Grid, Container } from "@mui/material";
import Title from "./TittleDashboard";
import axios from "axios";
import { useEffect, useState } from "react";

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

// const dataRevenue = [
//   createData(1, 1),
//   createData(2, 2),
//   createData(3, 3),
//   createData(4, 4),
//   createData(5, 5),
//   createData(6, 6),
//   createData(7, 7),
//   createData(8, 8),
//   createData(9, 9),
//   createData(10, 10),
//   createData(11, 11),
//   createData(12, 1600800),
// ];

export default function ChartDashBroad() {
  const [productStatisticcs, setProductStatisticcs] = useState();
  const [serviceStatisticcs, setServiceStatisticcs] = useState();

  async function revenueStatistics() {
    try {
      let dataRevenue = [];
      await axios
        .get(`http://localhost:3500/dashboard/revenue-statistics`)
        .then((data) => {
          data.data.revenueByMonth.map((value) => {
            dataRevenue.push(createData(value.month, value.total));
          });
          setProductStatisticcs(dataRevenue);
        });
    } catch (err) {
      console.log(err);
    }
  }

  function serviceRevenueStatistics() {
    try {
      let dataRevenue = [];
      axios.get(`http://localhost:3500/serviceDashboard/revenue-statistics`)
        .then((data) => {
          data.data.revenueByMonth.map((value) => {
            dataRevenue.push(createData(value.month, value.total));
          });
          setServiceStatisticcs(dataRevenue);
        });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    revenueStatistics();
    serviceRevenueStatistics()
  }, []);

  const theme = useTheme();

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
              }}
            >
              <React.Fragment>
                <Title>BIỂU ĐỒ DOANH THU SẢN PHẨM CÁC THÁNG</Title>
                <ResponsiveContainer>
                  <LineChart
                    data={productStatisticcs}
                    margin={{
                      top: 16,
                      right: 16,
                      bottom: 0,
                      left: 24,
                    }}
                  >
                    <XAxis
                      dataKey="time"
                      stroke={theme.palette.text.secondary}
                      style={theme.typography.body2}
                    />
                    <YAxis
                      stroke={theme.palette.text.secondary}
                      style={theme.typography.body2}
                    >
                      <Label
                        angle={270}
                        position="left"
                        style={{
                          textAnchor: "middle",
                          fill: theme.palette.text.primary,
                          ...theme.typography.body1,
                        }}
                      ></Label>
                    </YAxis>
                    <Line
                      isAnimationActive={false}
                      type="monotone"
                      dataKey="amount"
                      stroke={theme.palette.primary.main}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </React.Fragment>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
              }}
            >
              <React.Fragment>
                <Title>BIỂU ĐỒ DOANH THU DỊCH VỤ CÁC THÁNG</Title>
                <ResponsiveContainer>
                  <LineChart
                    data={serviceStatisticcs}
                    margin={{
                      top: 16,
                      right: 16,
                      bottom: 0,
                      left: 24,
                    }}
                  >
                    <XAxis
                      dataKey="time"
                      stroke={theme.palette.text.secondary}
                      style={theme.typography.body2}
                    />
                    <YAxis
                      stroke={theme.palette.text.secondary}
                      style={theme.typography.body2}
                    >
                      <Label
                        angle={270}
                        position="left"
                        style={{
                          textAnchor: "middle",
                          fill: theme.palette.text.primary,
                          ...theme.typography.body1,
                        }}
                      ></Label>
                    </YAxis>
                    <Line
                      isAnimationActive={false}
                      type="monotone"
                      dataKey="amount"
                      stroke={theme.palette.primary.main}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </React.Fragment>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
