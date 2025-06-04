import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/Store";
import { fetchProfile } from "../redux/ProfileSlice";

interface Profile {
  id?: string;
  name: string;
  email: string;
  age: string;
}

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useSelector((state: RootState) => state.profile.profiles);

  const [auth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profile, setProfile] = React.useState<Profile>({
    name: "",
    email: "",
    age: "",
  });

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const profileInfo = JSON.parse(localStorage.getItem("profileInfo") || "{}");
    if (profileInfo) {
      setProfile(profileInfo);
    } else {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (profiles && profiles.length > 0) {
      const latestProfile = profiles[profiles.length - 1];
      console.log(latestProfile);
      setProfile(latestProfile);
    }
  }, [profiles]);

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
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Profile Management
          </Typography>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>{profile.name}</MenuItem>
                <MenuItem onClick={handleClose}>{profile.email}</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
