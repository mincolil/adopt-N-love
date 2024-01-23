import React from "react";
import { styled } from "@mui/material/styles";
import { Button, Avatar } from "@mui/material";

export default function ButtonCustomize(props) {
  const {
    nameButton,
    onClick,
    component,
    to,
    type,
    width,
    marginTop,
    marginLeft,
    paddingBottom,
    endIcon,
    border,
    bgColor,
    backgroundColor,
    backgroundAfterHover,
    boxShadow,
    borderRadius,
    height,
    color,
    startIcon,
    paddingLeft,
    variant,
    marginRight,
    iconSrc,
  } = props;

  const ColorButton = styled(Button)(({ theme }) => ({
    // color: theme.palette.getContrastText("#ffff"),
    backgroundColor: "#3CB371",
    "&:hover": {
      backgroundColor: "#eb6434",
      color: "black",
    },
    display: "center",
    textTransform: "none",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  }));
  return (
    <ColorButton
      type={type}
      onClick={onClick}
      component={component}
      to={to}
      variant={variant}
      endIcon={endIcon}
      startIcon={startIcon}
      sx={{
        color: { color },
        backgroundColor: { backgroundColor },
        ":hover": {
          backgroundColor: { backgroundAfterHover },
          color: "black",
        },
        width: { width },
        height: { height },
        marginTop: { marginTop },
        marginLeft: { marginLeft },
        paddingBottom: { paddingBottom },
        paddingLeft: { paddingLeft },
        boxShadow: { boxShadow },
        border: { border },
        borderRadius: borderRadius,
        marginRight: { marginRight },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <Avatar src = { iconSrc } alt="photoURL" sx={{ mr: 2 }} /> */}
      {nameButton}
    </ColorButton>
  );
}
