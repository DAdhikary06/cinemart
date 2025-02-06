import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import NavbarDropdown from "./NavbarDropdown";
import NavbarDrawer from "./NavbarDrawer";
// import SearchBar from './SearchBar';
import { useTheme } from "@mui/material/styles";

const Navbar = ({ user, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: `${isSmallScreen ? "85px" : "100px"}`,
          width: "100%",
          backgroundColor: `${theme.palette.background.default}`,
          zIndex: "500",
          boxShadow: `0px 2px 15px 15px ${theme.palette.background.default}`,
        }}
      />
      <AppBar
        position="sticky"
        sx={{
          marginBottom: "50px",
          top: "25px",
          left: "10px",
          right: "10px",
          borderRadius: "10px",
          background: theme.palette.background.paper,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              marginLeft: { xs: "4px", sm: "32px" },
              textDecoration: "none",
              color: theme.palette.text.primary,
              fontFamily: "Arial",
              fontWeight: "bold",
              fontSize: "26px",
              display: "inline",
            }}
          >
            CINEMAX
          </Typography>

          {/* Search Bar
        {!isSmallScreen && <SearchBar />} */}

          {/* Hamburger Icon or Dropdown */}
          {isSmallScreen ? (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <NavbarDropdown user={user} onLogout={onLogout} />
          )}
        </Toolbar>

        {/* Drawer for small screens */}
        <NavbarDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          user={user}
          onLogout={onLogout}
        />
      </AppBar>
    </>
  );
};

export default Navbar;
