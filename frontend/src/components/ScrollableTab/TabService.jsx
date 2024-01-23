import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ScrollableTabService(props) {
  const { category, handUpdateEditTable, handleLoadAllService } = props;
  // const [selectedCategory, setSelectedCategory] = useState("");
  const [value, setValue] = useState();

  const handleChange = (event, newValue) => {
    // console.log("Kiểm tra Id cate", newValue);
    setValue(newValue);
    handUpdateEditTable(newValue);
  };

  return (
    <Box sx={{ bgcolor: "background.paper" }} maxWidth="lg">
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {/* <Tab label="Tất cả dịch vụ" value="all" /> */}
        {category &&
          category.map((cate) => {
            return <Tab key={cate._id} value={cate._id} label={cate.feature} />;
          })}
      </Tabs>
    </Box>
  );
}
