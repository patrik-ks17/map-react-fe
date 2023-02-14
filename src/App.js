import React from "react";
import MapPage from "./pages/map/MapPage";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/login/RegisterPage";
import Profile from "./pages/profile/Profile";
import AdminPage from "./pages/admin/AdminPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAlert } from "react-alert";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const userType = window.localStorage.getItem("userType");
  const alert = useAlert();

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/login"
            element={isLoggedIn === "true" ? <HomePage /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isLoggedIn === "true" ? <HomePage /> : <RegisterPage />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/admin"
            element={
              userType === "admin" ? (
                <AdminPage />
              ) : (
                <HomePage />
              )
            }
          />
          {/* <Route path="/chat" element={<ChatPage />} /> */}
          <Route path="/map" element={<MapPage />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
