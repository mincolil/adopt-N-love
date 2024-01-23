import React from "react";
import Typography from "@mui/material/Typography";

const MAX_LENGTH = 35;

const ContentCus = ({ value }) => {
  let content = value.content;

  if (content.length > MAX_LENGTH) {
    content = `${content.substring(0, MAX_LENGTH)}...`;
  }

  return <Typography>{content}</Typography>;
};

export default ContentCus;
