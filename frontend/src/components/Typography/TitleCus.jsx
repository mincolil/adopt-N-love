import React from "react";
import Typography from "@mui/material/Typography";

const MAX_LENGTH = 10;

const TitleCus = ({ value }) => {
  let title = value.title;

  if (title.length > MAX_LENGTH) {
    title = `${title.substring(0, MAX_LENGTH)}...`;
  }

  return <>{title}</>;
};

export default TitleCus;
