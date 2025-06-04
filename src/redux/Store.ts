import { configureStore } from '@reduxjs/toolkit';
import ProfileReducer from './ProfileSlice'; // adjust path as needed

const Store = configureStore({
  reducer: {
    profile: ProfileReducer,
  },
});

// These are useful types for useSelector and useDispatch
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
