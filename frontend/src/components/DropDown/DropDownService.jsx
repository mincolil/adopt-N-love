import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

export default function DropDownService(props) {
  const { category, handUpdateEditTable, cateName, page, setCategoryId } =
    props;
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleChangeCate = (event) => {
    const categoryId = event.target.value;
    // console.log(categoryId);
    setSelectedCategory(categoryId);
    handUpdateEditTable(page, categoryId);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
      <InputLabel id="demo-select-small-label">{cateName}</InputLabel>
      <Select
        label="Loại dịch vụ"
        value={selectedCategory}
        onChange={handleChangeCate}
      >
        <MenuItem value="">Tất cả</MenuItem>
        {category &&
          category.map((value) => {
            return (
              <MenuItem
                key={value._id}
                value={value._id}
                // onClick={(e) => hanldeClickCategory(e.target.value)}
              >
                {value.feature}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
}
