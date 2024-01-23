import React from "react";

import {
  Divider,
  Avatar,
  Grid,
  Paper,
  Typography,
  Rating,
  Box,
  TextField,
  IconButton,
  Stack,
  Pagination,
} from "@mui/material";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarIcon from "@mui/icons-material/Star";
import NavigationIcon from "@mui/icons-material/Navigation";
import useAuth from "../../hooks/useAuth";
import DateFormat from "../DateFormat";

const imgLink =
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

export default function CommentService({ value }) {
  let id = value;
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [star, setStar] = useState(0);

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const context = useAuth();
  // console.log("Check người dùng", context.auth.token);
  // ----------------------------------- API GET FEEDBACK BY ID SERVICE --------------------------------
  useEffect(() => {
    loadAllFeedbackById(currentPage);
  }, [currentPage]);

  const loadAllFeedbackById = async (page) => {
    // console.log("Check id", id);
    try {
      const loadDataFeedback = await axios.get(
        `http://localhost:3500/feedback/service?serviceId=${id}&limit=3&page=${page}`
      );
      if (loadDataFeedback.error) {
        toast.error(loadDataFeedback.error);
      } else {
        setTotalPages(loadDataFeedback.data.pages);
        setData(loadDataFeedback.data.docs);
        setTotalProducts(loadDataFeedback.data.limit);
        // console.log(loadDataFeedback.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  // --------------------------------ADD COMMENT------------------------------
  const handleAddComment = async () => {
    if (star === 0) {
      toast.error("Số sao không được để trống");
    }  else {
      try {
        const addComment = await axios
          .post(
            `http://localhost:3500/feedback/service`,
            {
              serviceId: id,
              comment: comment,
              star: star,
            },
            {
              headers: { Authorization: context.auth.token },
              withCredentials: true,
            }
          )
          .then((data) => {
            toast.success("Đánh giá thành công");
            setComment("");
            setStar(0);
            loadAllFeedbackById(currentPage);
            // console.log("Check dữ diệu đánh giá", data);
            context.auth.feedback = false;
          });
      } catch (err) {
        // console.log(err);
        toast.error(err.response.data.error);
      }
    }
  };

  //--------------------- Click paging -----------------------------
  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      {data &&
        data.map((fb, index) => {
          return (
            <Paper sx={{ padding: "40px 20px", mb: 1 }}>
              <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                  <Avatar alt="Remy Sharp" />
                </Grid>
                <Grid justifyContent="left" item xs zeroMinWidth>
                  <Typography sx={{ margin: 0, textAlign: "left" }}>
                    {fb.userId !== null ? fb.userId.fullname : ""}
                  </Typography>

                  <Box>
                    <Rating
                      value={fb.star}
                      precision={0.5}
                      readOnly
                      emptyIcon={<StarBorderIcon sx={{ fontSize: "1.5rem" }} />}
                      halfIcon={<StarHalfIcon sx={{ fontSize: "1.5rem" }} />}
                      icon={<StarIcon sx={{ fontSize: "1.5rem" }} />}
                    />
                    <p sx={{ textAlign: "left" }}>{fb.comment}</p>
                  </Box>
                </Grid>
                <Grid item>
                  <DateFormat
                    date={fb.createdAt !== undefined ? fb.createdAt : ""}
                  />
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      {/* Paging */}
      <Stack spacing={2} mt={2} sx={{ float: "right" }}>
        <Pagination
          count={totalPages}
          onChange={handlePageClick}
          page={currentPage}
          color="primary"
        />
      </Stack>
      {isLoggedIn && context.auth.feedback === true ? (
        <Paper sx={{ padding: "40px 20px", mb: 1 }}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Avatar alt="Remy Sharp" />
            </Grid>
            <Grid justifyContent="left" item xs zeroMinWidth>
              <TextField
                label="Đánh giá"
                fullWidth
                placeholder="Điền đánh giá của bạn ở đây"
                multiline
                rows={4}
                margin="normal"
                maxRows={4}
                sx={{ margin: 0, textAlign: "left" }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleAddComment}>
                      <NavigationIcon />
                    </IconButton>
                  ),
                }}
              />
              <Rating
                value={star}
                onChange={(e) => setStar(e.target.value)}
                precision={1}
                emptyIcon={<StarBorderIcon sx={{ fontSize: "1.5rem" }} />}
                halfIcon={<StarHalfIcon sx={{ fontSize: "1.5rem" }} />}
                icon={<StarIcon sx={{ fontSize: "1.5rem" }} />}
              />
            </Grid>
          </Grid>
        </Paper>
      ) : (
        ""
      )}
    </>
  );
}
