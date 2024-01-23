import React from "react";
import Typography from "@mui/material/Typography";

const MAX_LENGTH = 40;

const TypographyCus = ({ value }) => {
  let description = value.description;

  if (description.length > MAX_LENGTH) {
    description = `${description.substring(0, MAX_LENGTH)}...`;
  }

  return <>{description}</>;
};

export default TypographyCus;
