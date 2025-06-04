import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";
import ProfileForm from "./components/ProfileForm";
import Profile from "./components/Profile";
import NotFoundPage from "./components/NotFoundPage";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/profile-form" replace />}
          ></Route>
          <Route
            path="/profile-form"
            element={<ProfileForm></ProfileForm>}
          ></Route>
          <Route path="/profile-page" element={<Profile></Profile>}></Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
