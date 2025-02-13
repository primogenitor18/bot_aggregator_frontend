"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

import BarMenu from "./barMenu";
import Image from "next/image";
import { Fade } from "@mui/material";

interface IBarProps {
  logOut: CallableFunction;
}

export default function ButtonAppBar(props: IBarProps) {
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [show, setShow] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string | null>("");

  const openMenu = Boolean(menuAnchor);

  React.useEffect(() => {
    try {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setMenuAnchor(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="transparent"
        sx={{
          paddingLeft: "20px",
          paddingRight: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          "@media (max-width: 600px)": {
            paddingLeft: "10px",
            paddingRight: "10px",
          },
        }}
      >
        <Toolbar
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Fade in={show} timeout={1000}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                "@media (max-width: 600px)": {
                  justifyContent: "space-between",
                },
              }}
            >
              <IconButton
                size="large"
                edge="start"
                color="primary"
                aria-label="menu"
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>

              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Image src="/shum.png" alt="shum" width={40} height={20} />
              </Box>

              <Typography
                variant="h6"
                component="div"
                sx={{ fontSize: "24px", display: { xs: "none", sm: "block" } }}
                color="primary"
              >
                {username ? `Hello, ${username}` : "Hello"}
              </Typography>

              <IconButton
                size="large"
                onClick={() => {
                  props.logOut();
                }}
                color="primary"
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          </Fade>
        </Toolbar>
      </AppBar>
      <BarMenu
        menuAnchor={menuAnchor}
        openMenu={openMenu}
        handleClose={handleClose}
      />
    </Box>
  );
}
