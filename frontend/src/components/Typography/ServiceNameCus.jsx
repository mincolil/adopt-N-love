import React from "react";
import Typography from "@mui/material/Typography";

const MAX_LENGTH = 20;

const ServiceNameCus = ({ value }) => {
  let serviceName = value.serviceName;

  if (serviceName.length > MAX_LENGTH) {
    serviceName = `${serviceName.substring(0, MAX_LENGTH)}...`;
  }

  return <>{serviceName}</>;
};

export default ServiceNameCus;
