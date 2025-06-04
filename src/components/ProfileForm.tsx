import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Snackbar,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { fetchProfileById, saveProfile } from "../redux/ProfileSlice";
import type { AppDispatch, RootState } from "../redux/Store";

type Severity = "success" | "error" | "info" | "warning";

type SnackbarState = {
  open: boolean;
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
  severity: Severity;
  message: string;
};

interface Profile {
  id?: string;
  name: string;
  email: string;
  age: string;
}
const ProfileForm = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.profile.profiles);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "success",
    message: "",
  });

  const { open, vertical, horizontal, severity, message } = snackbarState;

  const handleClose = () => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    age?: string;
  }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const [profileFormData, setProfileFormData] = useState<Profile>({
    name: "",
    email: "",
    age: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const validateForm = (data: typeof profileFormData) => {
    const newErrors: { name?: string; email?: string; age?: string } = {};
    const nameTrimmed = data.name.trim();
    const emailTrimmed = data.email.trim();
    const ageTrimmed = data.age.trim();

    if (!nameTrimmed) {
      newErrors.name = "Name is required";
    } else if (nameTrimmed.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!emailTrimmed) {
      newErrors.email = "Email is required";
    } else {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(emailTrimmed)) {
        newErrors.email = "Email is not valid";
      }
    }

    if (ageTrimmed) {
      const ageNum = Number(ageTrimmed);
      if (isNaN(ageNum) || ageNum <= 10 || ageNum >= 100) {
        newErrors.age = "Age must be greater than 10 and less than 100";
      }
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const validationErrors = validateForm({
        ...profileFormData,
        [name]: value,
      });
      setErrors(validationErrors);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrors = validateForm(profileFormData);
    setErrors(validationErrors);
  };

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("profileInfo") || "{}");

    console.log(localData);
    const isEditingParam = searchParams.get("isEditing") === "true";
    const editingId = searchParams.get("id");

    setIsEditing(isEditingParam);

    if (isEditingParam && editingId) {
      dispatch(fetchProfileById(editingId)).then((res) => {
        if (fetchProfileById.fulfilled.match(res)) {
          const data = res.payload;
          console.log(data);
          setProfileFormData({
            name: data.name,
            email: data.email,
            age: data.age,
            id: data.id,
          });
        } else {
          console.error("Failed to fetch profile:", res.payload);
        }
      });
    }
  }, [dispatch, searchParams]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    newState: {
      vertical: "top" | "bottom";
      horizontal: "left" | "center" | "right";
    }
  ) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(profileFormData);
    setTouched({ name: true, email: true, age: true });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      let profileDataToSend;

      if (isEditing) {
        profileDataToSend = { ...profile, ...profileFormData };
      } else {
        profileDataToSend = profileFormData;
      }

      const resultAction = await dispatch(
        saveProfile({ profileData: profileDataToSend, isEditing })
      );

      if (saveProfile.fulfilled.match(resultAction)) {
        const apiMessage =
          resultAction.payload?.message ||
          (isEditing
            ? "Profile updated successfully!"
            : "Profile created successfully!");

        // Save latest form data in localStorage
        localStorage.setItem("profileInfo", JSON.stringify(profileFormData));

        // Navigate to profile page after success
        navigate("/profile-page");

        setSnackbarState({
          ...newState,
          open: true,
          severity: "success",
          message: apiMessage,
        });
      } else {
        throw new Error(resultAction.payload as string);
      }
    } catch (error: any) {
      setSnackbarState({
        ...newState,
        open: true,
        severity: "error",
        message: error.message || "Failed to save profile. Please try again.",
      });
    }
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "1rem",
        }}
      >
        <Card
          sx={{ maxWidth: 445, width: "100%", boxShadow: 3 }}
          component="form"
          onSubmit={(e) =>
            handleSubmit(e, { vertical: "top", horizontal: "right" })
          }
        >
          <CardHeader
            title={isEditing?'Update Profile Form':'Create Profile Form'}
            sx={{ textAlign: "center", fontWeight: "bold" }}
          />
          <CardContent>
            <TextField
              label="Name"
              id="name"
              fullWidth
              name="name"
              value={profileFormData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name ? errors.name || "" : ""}
            />
            <TextField
              label="Email"
              id="email"
              margin="normal"
              fullWidth
              name="email"
              value={profileFormData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email ? errors.email || "" : ""}
            />
            <TextField
              label="Age (optional)"
              id="age"
              type="number"
              fullWidth
              margin="normal"
              name="age"
              value={profileFormData.age}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.age)}
              helperText={errors.age || ""}
              inputProps={{ min: 10, max: 99 }}
            />
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ m: "auto" }}
            >
              {isEditing ? "Update Profile" : "Create Profile"}
            </Button>
          </CardActions>
        </Card>
      </div>
    </>
  );
};

export default ProfileForm;
