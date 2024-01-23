import React from "react";
import Typography from "@mui/material/Typography";

const MAX_LENGTH = 20;

const ProductNameCus = ({ value }) => {
  let productName = value.productName;

  if (productName.length > MAX_LENGTH) {
    productName = `${productName.substring(0, MAX_LENGTH)}...`;
  }

  return <>{productName}</>;
};

export default ProductNameCus;
