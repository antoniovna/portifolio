import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Cart from "./cart_modal/cart_modal";
import Link from "next/link";
import { is_logged_in } from "./../../util/api";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function PrimarySearchAppBar({ children }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const router = useRouter();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {loggedIn ? (
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Link href="/account">
            <PermIdentityIcon />
          </Link>
        </Box>
      ) : null}
      <MenuItem>
        <IconButton size="large" aria-haspopup="true" color="inherit">
          <Badge badgeContent={4} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Carrinho</p>
      </MenuItem>
    </Menu>
  );
  useEffect(() => {
    is_logged_in().then((res) => {
      setLoggedIn(res);
    });
  }, [loggedIn]);
  return (
    <Box
      style={{
        position: "fixed",
        width: "100%",
        zIndex: "100",
      }}
      sx={{ flexGrow: 1 }}
    >
      <AppBar
        style={{
          backgroundColor: router.pathname === "/" ? "transparent" : "#000",
        }}
        position="static"
      >
        <Toolbar>
          <Link href={"/"}>
            <img
              style={{ zIndex: "100" }}
              height="70px"
              width="auto"
              src="/logo.png"
            />
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          <Box>
            <Cart />
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {children}
    </Box>
  );
}
