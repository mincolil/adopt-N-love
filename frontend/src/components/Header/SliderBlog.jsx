import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { useState, useEffect } from "react";
// Axios
import axios from "axios";
import { toast } from "react-toastify";

//@material-ui/core
import { NavLink, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CardActionArea,
  Divider,
  IconButton,
  ListItemAvatar,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const BASE_URL = "http://localhost:3500";
export default function BlogSlider({ loadBlogById }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // --------------------- HOVER -----------------------------
  const [isHoveredTitle, setIsHoveredTitle] = useState(null);

  const handleMouseOverTilte = (index) => {
    setIsHoveredTitle(index);
  };

  const handleMouseOutTilte = () => {
    setIsHoveredTitle(null);
  };

  // ----------------------------------- API GET ALL BLOG --------------------------------
  useEffect(() => {
    loadAllBlog();
  }, []);

  const loadAllBlog = async () => {
    try {
      const loadData = await axios.get(`${BASE_URL}/blog?limit=9`);
      if (loadData.error) {
        toast.error(loadData.error);
      } else {
        setData(loadData.data.docs);
        // console.log(loadData.data.docs);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hanldeClickProductName = (id) => {
    // console.log(id);
    navigate(`/blog-homepage/${id}`);
    loadBlogById();
  };

  return (
    <Grid container spacing={1}>
      {data &&
        data.map((value, index) => {
          return (
            <>
              <Grid item xs={12} sm={2}>
                <ListItemAvatar>
                  <Avatar
                    src={
                      value.image !== undefined
                        ? `${value.image}`
                        : "https://static2-images.vnncdn.net/files/publish/2022/12/8/meo-1-1416.jpg"
                    }
                  ></Avatar>
                </ListItemAvatar>
              </Grid>

              <Grid item xs={12} sm={10}>
                <Typography
                  variant="h6"
                  component="h1"
                  onClick={() => hanldeClickProductName(value._id)}
                >
                  <NavLink
                    style={{
                      textDecoration: "none",
                      color: isHoveredTitle === index ? "pink" : "inherit",
                    }}
                    title={value.title}
                    onMouseOver={() => handleMouseOverTilte(index)}
                    onMouseOut={handleMouseOutTilte}
                  >
                    {value.title}
                  </NavLink>
                </Typography>
                <Divider />
              </Grid>
            </>
          );
        })}
    </Grid>
  );
}
