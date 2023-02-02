import './style/Login.css';
import React, {useState} from "react";
import MapPage from './MapPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mappage" element={<MapPage />} />
        <Route path="*" element={<Navigate to="/login"/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
