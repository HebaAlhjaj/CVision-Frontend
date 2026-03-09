import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./features/auth/login/Login";
import Signup from "./features/auth/signup/Signup";

import TeamMemberLayout from "./features/team-member/TeamMemberLayout";
import MyProject from "./features/team-member/my-project/MyProject";
import UploadCV from "./features/team-member/upload-cv/UploadCV";
import MySkills from "./features/team-member/my-skills/MySkills";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/team-member"
          element={<TeamMemberLayout />}
        >
          <Route index element={<Navigate to="my-project" replace />} />
          <Route path="my-project" element={<MyProject />} />
          <Route path="upload-cv" element={<UploadCV />} />
          <Route path="my-skills" element={<MySkills />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}