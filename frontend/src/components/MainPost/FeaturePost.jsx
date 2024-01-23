import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { NavLink } from "react-router-dom";

function FeaturedPost(props) {
  const { post1, post2, post3 } = props;

  return (
    <>
      <Grid item xs={12} md={8}>
        <CardActionArea component={NavLink} to="service-homepage">
          <Card sx={{ display: "flex" }}>
            <CardMedia
              component="img"
              sx={{
                width: 300,
                height: "auto",
                display: { xs: "none", sm: "block" },
              }}
              image={post1.image}
              alt={post1.imageLabel}
            />
            <CardContent
              sx={{ flex: 1, textAlign: "center", justifyContent: "center" }}
            >
              <Typography component="h2" variant="h3">
                {post1.title}
              </Typography>
              <Typography variant="h5" paragraph>
                {post1.description}
              </Typography>
              <Typography variant="h5" paragraph>
                {post1.description2}
              </Typography>
              <Typography variant="h5" paragraph>
                {post1.description3}
              </Typography>
            </CardContent>
          </Card>
        </CardActionArea>
      </Grid>
      <Grid item xs={12} md={8}>
        <CardActionArea component={NavLink} to="product-homepage">
          <Card sx={{ display: "flex" }}>
            <CardContent
              sx={{ flex: 1, textAlign: "center", justifyContent: "center" }}
            >
              <Typography component="h2" variant="h3">
                {post2.title}
              </Typography>
              <Typography variant="h5" paragraph>
                {post2.description}
              </Typography>
              <Typography variant="h5" paragraph>
                {post2.description2}
              </Typography>
              <Typography variant="h5" paragraph>
                {post2.description3}
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              sx={{
                width: 300,
                height: "auto",
                display: { xs: "none", sm: "block" },
              }}
              image={post2.image}
              alt={post2.imageLabel}
            />
          </Card>
        </CardActionArea>
      </Grid>
      <Grid item xs={12} md={8}>
        <CardActionArea component={NavLink} to="blog-homepage">
          <Card sx={{ display: "flex" }}>
            <CardMedia
              component="img"
              sx={{
                width: 300,
                height: "auto",
                display: { xs: "none", sm: "block" },
              }}
              image={post3.image}
              alt={post3.imageLabel}
            />
            <CardContent
              sx={{ flex: 1, textAlign: "center", justifyContent: "center" }}
            >
              <Typography component="h2" variant="h3">
                {post3.title}
              </Typography>
              <Typography variant="h5" paragraph>
                {post3.description}
              </Typography>
              <Typography variant="h5" paragraph>
                {post3.description2}
              </Typography>
              <Typography variant="h5" paragraph>
                {post3.description3}
              </Typography>
            </CardContent>
          </Card>
        </CardActionArea>
      </Grid>
    </>
  );
}

FeaturedPost.propTypes = {
  post: PropTypes.shape({
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default FeaturedPost;
