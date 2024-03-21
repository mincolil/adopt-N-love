import "../LandingPage.css";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import React, { useState, useEffect } from "react";
import { Typography, Container, Button, Box, Avatar } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Carousel from "react-material-ui-carousel";
import styled from "styled-components";
import Banner from "../../../images/bradcam.png";
import DogBanner from "../../../images/dog_banner.png";
import ServiceIcon1 from "../../../images/service_icon_1.png";
import ServiceIcon2 from "../../../images/service_icon_2.png";
import ServiceIcon3 from "../../../images/service_icon_3.png";
import Cat from "../../../images/cat.png";
import AdaptIcon1 from "../../../images/adapt_icon_1.png";
import AdaptIcon2 from "../../../images/adapt_icon_2.png";
import Avatar1 from "../../../images/avatar1.png";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { toast } from "react-toastify";
import { Link as RouterLink } from "react-router-dom";
import {
    List,
    ListItem,
    Checkbox,
    FormControlLabel,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CardActions,
    IconButton,
    Pagination,
    Stack,
    Slider,
    Paper,
    InputBase,
    FormControl,
    Select,
    MenuItem,
    Breadcrumbs,
    Link,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import HomeIcon from "@mui/icons-material/Home";
import DropDownService from "../../../components/DropDown/DropDownService";


const BASE_URL = "http://localhost:3500";

const Counter = ({ target }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (count < target) {
                setCount(count + 1);
            } else {
                clearInterval(interval);
            }
        }, 60); // Thời gian tăng số (60ms)
        return () => clearInterval(interval);
    }, [count, target]);

    return (
        <Typography variant="h3" className="counter">
            {count}
        </Typography>
    );
};

function PetItem({ pet }) {
    const { _id, petName, color, age, breed, petImage } = pet;
    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className="product-card">
                {/* <CardActionArea component={RouterLink} to={`/service-homepage/${_id}`}> */}
                <CardActionArea component={RouterLink} to={`/adopt-homepage/${_id}`}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={petImage}
                        alt={petName}
                    />
                    <CardContent sx={{ textAlign: "center" }}>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            className="product-title"
                            style={{ color: '#ff5722' }}
                        >
                            {petName}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            className="product-price"
                        >
                            Tuổi: {age}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            className="product-price"
                        >
                            Giống: {breed}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            className="product-price"
                        >
                            Giới tính: { }
                        </Typography>
                    </CardContent>
                </CardActionArea>
                {/* <CardActions sx={{ justifyContent: "center" }}>
                    <IconButton
                        size="large"
                        color="primary"
                        aria-label="add to shopping cart"
                    >
                        <AddShoppingCartIcon />
                    </IconButton>
                </CardActions> */}
            </Card>
        </Grid>
    );
}

const AdoptPage = () => {
    const [data, setData] = useState([]);

    const [totalPets, setTotalPets] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // ----------------------------------- API GET ALL PET --------------------------------
    useEffect(() => {
        loadAllPet(currentPage);
    }, []);

    const loadAllPet = async (page) => {
        try {
            const loadData = await axios.get(`${BASE_URL}/adopt?page=${page}`);
            if (loadData.error) {
                toast.error(loadData.error);
            } else {
                setTotalPages(loadData.data.pages);
                // console.log("Check totalPage", totalPages);
                setData(loadData.data.docs);
                setTotalPets(loadData.data.limit);
                // console.log(loadData.data.docs);
                setCurrentPage(loadData.data.page);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // --------------------- Hanlde Search -----------------------------
    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const handlePageClick = (event, value) => {
        setCurrentPage(value);
        if (categoryId) {
            console.log(categoryId);
            hanldeClickCategory(value, categoryId);
        } else if (keyword.trim()) {
            searchPetById(value);
        } else {
            console.log(categoryId);
            loadAllPet(value);
        }
    };

    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearchClick = async () => {
        if (keyword.trim() === "") {
            toast.warning("Hãy nhập kết quả bạn cần tìm");
            loadAllPet(currentPage);
        } else {
            searchPetById();
        }
    };

    // ----------------------------------- GET ALL PET BY USER NAME --------------------------------
    const searchPetById = async (page) => {
        try {
            const loadData = await axios.get(
                `${BASE_URL}/adopt/petname?petName=${keyword.trim()}&page=${page}`
            );
            if (loadData.data.error) {
                toast.warning(
                    "Kết quả " +
                    "[" +
                    keyword +
                    "]" +
                    " bạn vừa tìm không có! Vui lòng nhập lại. "
                );
                loadAllPet(currentPage);
            } else {
                setData(loadData.data.docs);
                setTotalPets(loadData.data.limit);
                setTotalPages(loadData.data.pages);
                setCurrentPage(loadData.data.page);
                //console.log(loadData.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // --------------------- GET ALL Pet BY CATEGORY ID -----------------------------

    async function hanldeClickCategory(page, cateId) {
        // console.log("Check data cate ID", page, cateId);
        setCategoryId(cateId);
        // console.log(categoryId);
        if (cateId == undefined || cateId == "") {
            loadAllPet(currentPage);
        } else {
            try {
                const loadData = await axios.get(
                    `http://localhost:3500/adopt?page=${page}&categoryId=${cateId}`
                );
                if (loadData.error) {
                    toast.error(loadData.error);
                } else {
                    console.log("Check loaddata", loadData.data);
                    setTotalPages(loadData.data.pages);
                    // console.log("Check totalPage", totalPages);
                    setData(loadData.data.docs);
                    setTotalPets(loadData.data.limit);
                    setCurrentPage(loadData.data.page);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    useEffect(() => {
        hanldeClickCategory();
    }, []);

    // --------------------- GET ALL CATEGORY PET -----------------------------
    const [category, setCategory] = useState([]);
    async function loadAllCategoryPet() {
        try {
            const loadDataCategoryPet = await axios.get(
                `http://localhost:3500/category?categoryName=Thú cưng`
            );
            if (loadDataCategoryPet.error) {
                toast.error(loadDataCategoryPet.error);
            } else {
                setCategory(loadDataCategoryPet.data.docs);
                // console.log(loadDataCategoryPet.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loadAllCategoryPet();
    }, []);


    return (
        <>
            <Header />
            <ToastContainer />
            <Grid
                className="banner"
                container
                sx={{
                    backgroundImage: `url(${Banner})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "round",
                    height: "250px",
                    position: "relative",
                    top: "80px",
                }}
            >
                <Container
                    sx={{ display: "flex", flexWrap: "wrap", alignContent: "center" }}
                >
                    <Grid item lg={12} md={12}>
                        <Box className="banner_content" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                            <Typography variant="h2" sx={{ color: "#ffffff" }}>Nhận nuôi</Typography>
                        </Box>
                    </Grid>
                </Container>
            </Grid>
            <Container className="service" sx={{ padding: "100px 24px 0px 24px" }}>
                <Grid container justifyContent="center">
                    <Grid item lg={7} md={10}>
                        <Box className="section_title" sx={{ marginBottom: "0" }}>
                            <Typography variant="h3">Quy trình nhận nuôi</Typography>
                            <Typography variant="h4" style={{ margin: "20px 0" }}>
                                Trước khi quyết định nhận nuôi bé chó hay mèo nào, bạn hãy tự hỏi bản thân rằng mình đã sẵn sàng để chịu trách nhiệm cả đời cho bé chưa, cả về tài chính, nơi ở cũng như tinh thần.
                                Việc nhận nuôi cần được sự đồng thuận lớn từ bản thân bạn cũng như gia đình và những người liên quan.
                                Xin cân nhắc kỹ trước khi liên hệ với ANL về việc nhận nuôi.
                            </Typography>
                            <Typography variant="h4" style={{ margin: "20px 0" }}>
                                Bạn đã sẵn sàng? Hãy thực hiện các bước sau đây nhé:
                            </Typography>
                            <Typography variant="h4" style={{ margin: "1px 0 " }}>
                                1️⃣ Tìm hiểu về thú cưng bạn muốn nhận nuôi trên trang web của HPA
                            </Typography>
                            <Typography variant="h4" style={{ margin: "1px 0 " }}>
                                2️⃣ Liên hệ với Tình nguyện viên phụ trách bé để tìm hiểu thêm về bé.
                            </Typography>
                            <Typography variant="h4" style={{ margin: "1px 0 " }}>
                                3️⃣ Tham gia phỏng vấn nhận nuôi.
                            </Typography>
                            <Typography variant="h4" style={{ margin: "1px 0 " }}>
                                4️⃣ Chuẩn bị cơ sở vật chất, ký giấy tờ nhận nuôi và đóng tiền vía để đón bé về.
                            </Typography>
                            <Typography variant="h4" style={{ margin: "1px 0 " }}>
                                5️⃣ Thường xuyên cập nhật về tình hình của bé, đặc biệt là khi có sự cố để được tư vấn kịp thời.
                            </Typography>

                            <Typography variant="h3" style={{ margin: "50px 0px 10px 0px" }}>Điều kiện nhận nuôi</Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container justifyContent="center" spacing={3}>
                    <Grid className="single_service" style={{ height: "300px" }} item md={3}>
                        <Box className="service_thumb">
                            <Box className="service_icon">
                                <img
                                    src={ServiceIcon1}
                                    alt=""
                                />
                            </Box>
                        </Box>
                        <Box className="service_content">
                            <Typography variant="h3">Tài chính tự chủ và ổn định.</Typography>
                        </Box>
                    </Grid>
                    <Grid className="single_service" style={{ height: "300px" }} item md={3}>
                        <Box className="service_thumb">
                            <Box className="service_icon">
                                <img
                                    src={ServiceIcon2}
                                    alt=""
                                />
                            </Box>
                        </Box>
                        <Box className="service_content">
                            <Typography variant="h3">
                                Chỗ ở cố định, ưu tiên tại Hà Nội</Typography>
                        </Box>
                    </Grid>
                    <Grid className="single_service" style={{ height: "300px" }} item md={3}>
                        <Box className="service_thumb">
                            <Box className="service_icon">
                                <img
                                    src={ServiceIcon3}
                                    alt=""
                                />
                            </Box>
                        </Box>
                        <Box className="service_content">
                            <Typography variant="h3">
                                Cam kết tiêm phòng và triệt sản </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container >

            <Container
                sx={{ position: "relative", top: "120px", paddingBottom: "200px" }}
            >
                <Grid container spacing={1}>
                    <Grid item sm={12} md={12} lg={12} className="content-area">
                        <Box className="site-main">
                            <Typography variant="h3">Nhận nuôi</Typography>
                            <Grid container className="shop-top-control">
                                <Grid item xl={9} lg={9}>
                                    <Paper
                                        component="form"
                                        sx={{
                                            p: "1px 4px",
                                            display: "flex",
                                            alignItems: "center",
                                            width: "90%",
                                        }}
                                    >
                                        <InputBase
                                            sx={{ ml: 1, flex: 1 }}
                                            placeholder="Tìm kiếm bé ... "
                                            value={keyword}
                                            onChange={handleKeywordChange}
                                        // onKeyDown={handleKeyDown}
                                        />
                                        <IconButton
                                            sx={{ p: "10px" }}
                                            aria-label="search"
                                            onClick={handleSearchClick}
                                        >
                                            <SearchIcon />
                                        </IconButton>
                                    </Paper>
                                </Grid>
                                <Grid item xl={3} lg={3}>
                                    <FormControl fullWidth size="medium">
                                        <DropDownService
                                            category={category}
                                            cateName="Loại thú cưng"
                                            handUpdateEditTable={hanldeClickCategory}
                                            page={1}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                {data.map((pet, index) => (
                                    <PetItem key={index} pet={pet} />
                                ))}
                            </Grid>
                            <Stack
                                spacing={2}
                                sx={{ paddingTop: "20px", alignItems: "center" }}
                            >
                                <Pagination
                                    count={totalPages}
                                    onChange={handlePageClick}
                                    page={currentPage}
                                    size="large"
                                    showFirstButton
                                    showLastButton
                                />
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default AdoptPage;
