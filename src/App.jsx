import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./features/auth/login/Login";
import Signup from "./features/auth/signup/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}