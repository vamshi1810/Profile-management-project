import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { deepPurple } from "@mui/material/colors";
import Button from "@mui/material/Button";
import { Avatar, Grid, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/Store";
import { fetchProfile } from "../redux/ProfileSlice";

interface Profile {
  id?: string;
  name: string;
  email: string;
  age: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    age: "",
  });
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useSelector((state: RootState) => state.profile.profiles);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profiles && profiles.length > 0) {
      const latestProfile = profiles[profiles.length - 1];
      console.log(latestProfile);
      setProfile(latestProfile);
    }
  }, [profiles]);
  useEffect(() => {
    const localData = localStorage.getItem("profileInfo");
    if (localData) {
      setProfile(JSON.parse(localData));
    } else {
      dispatch(fetchProfile());
    }
  }, []);

  const handleDelete = () => {
    localStorage.clear();
    dispatch(fetchProfile());
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: any) => {
    console.log(event);
    setOpen(false);
    if (event === "close") {
      setOpen(false);
    } else if (event === "delete") {
      handleDelete();
      setOpen(false);
    }
  };
  const handleEditClick = () => {
    navigate(`/profile-form?isEditing=true&id=${profile.id}`);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want delete localstorage data?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose("close")}>Close</Button>
          <Button onClick={() => handleClose("delete")} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <Paper
          elevation={3}
          sx={{ maxWidth: 345, width: "100%", padding: 2 }}
          square={false}
        >
          <Grid container spacing={2}>
            <Grid
              size={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Avatar
                alt="Cindy Baker"
                sx={{ bgcolor: deepPurple[500], width: 86, height: 86 }}
              >
                <div style={{ fontSize: "60px" }}>
                  {" "}
                  {profile.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </Avatar>
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            <Grid size={4} fontSize={18}>
              Name
            </Grid>
            <Grid size={8}>
              <div>{profile.name}</div>
            </Grid>
            <Grid size={12}>
              <Divider />
            </Grid>
            <Grid size={4} fontSize={18}>
              Email
            </Grid>
            <Grid size={8}>
              <div>{profile.email}</div>
            </Grid>
            <Grid size={12}>
              <Divider />
            </Grid>
            <Grid
              size={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={4}
            >
              <IconButton color="error" onClick={handleClickOpen}>
                <DeleteIcon />
              </IconButton>

              <IconButton
                color="primary"
                aria-label="edit"
                onClick={handleEditClick}
              >
                <EditIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </>
  );
};

export default Profile;
