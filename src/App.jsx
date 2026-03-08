import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./features/auth/login/Login";
import Signup from "./features/auth/signup/Signup";
import MyProject from "./features/team-member/my-project/MyProject";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/team-member/my-project" element={<MyProject />} />
      </Routes>
    </BrowserRouter>
  );
}