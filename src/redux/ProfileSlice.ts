import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/profile";

export const fetchProfile = createAsyncThunk(
  "profile/fetchAllProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch profiles"
      );
    }
  }
);

export const fetchProfileById = createAsyncThunk(
  "profile/fetchProfileById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  }
);

export const saveProfile = createAsyncThunk(
  "profile/saveProfile",
  async (
    { profileData, isEditing }: { profileData: any; isEditing: boolean },
    { rejectWithValue }
  ) => {
    try {
      if (isEditing) {
        const response = await axios.put(
          `${API_URL}/${profileData.id}`,
          profileData
        );
        return response.data;
      } else {
        const response = await axios.post(API_URL, profileData);
        return response.data;
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to save profile");
    }
  }
);

interface Profile {
  id?: string;
  name: string;
  email: string;
  age: string;
}

interface ProfileState {
  profiles: Profile[];
  selectedProfile: Profile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProfileState = {
  profiles: [],
  selectedProfile: null,
  status: "idle",
  error: null,
};

const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      state.selectedProfile = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.profiles = action.payload;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder.addCase(fetchProfileById.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchProfileById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedProfile = action.payload;
    });
    builder.addCase(fetchProfileById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder.addCase(saveProfile.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(saveProfile.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedProfile = action.payload;
    });
    builder.addCase(saveProfile.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export const { clearProfile } = ProfileSlice.actions;
export default ProfileSlice.reducer;
