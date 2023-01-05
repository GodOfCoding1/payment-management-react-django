import { Outlet, Link } from "react-router-dom";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useState } from "react";
import { isLoggedin } from "../helpers/protected";
import { api } from "../apis/axios";
import { Container } from "@mui/material";

function NavBar() {
  const [isAuthenticated, setisAuthenticated] = useState(true);
  useEffect(() => {
    (async () => {
      const auth = await isLoggedin();
      setisAuthenticated(auth);
    })();
  }, []);

  const logout = async () => {
    try {
      await api["get"]("auth/logout");
      window.location.reload();
    } catch (error) {
      window.location.reload();
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Link style={{ textDecoration: "none", color: "white" }} to="/">
              <HomeIcon />
            </Link>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link style={{ textDecoration: "none", color: "white" }} to="/">
              Home
            </Link>
          </Typography>
          <Container>
            <Typography>
              {localStorage.getItem("username")
                ? "Username:  " + localStorage.getItem("username")
                : ""}
            </Typography>
          </Container>
          <Button color="inherit">
            {isAuthenticated ? (
              <div onClick={logout}>Logout</div>
            ) : (
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/login"
              >
                Login
              </Link>
            )}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default Layout;
