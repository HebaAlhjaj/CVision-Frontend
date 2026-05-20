import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./features/auth/login/Login";
import Signup from "./features/auth/signup/Signup";

import TeamMemberLayout from "./features/team-member/TeamMemberLayout";
import MyProject from "./features/team-member/my-project/MyProject";
import UploadCV from "./features/team-member/upload-cv/UploadCV";
import MySkills from "./features/team-member/my-skills/MySkills";

import ProjectManagerLayout from "./features/project-manager/ProjectManagerLayout";
import PMMyProject from "./features/project-manager/my-project/MyProject";
import ProjectDetails from "./features/project-manager/project-details/ProjectDetails";
import TeamMembers from "./features/project-manager/team-members/TeamMembers";
import RoleMatch from "./features/project-manager/role-match/RoleMatch";
import SkillGaps from "./features/project-manager/skill-gaps/SkillGaps";
import JoinProject from "./features/team-member/join-project/JoinProject";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/team-member" element={<TeamMemberLayout />}>
          <Route index element={<Navigate to="my-project" replace />} />
          <Route path="my-project" element={<MyProject />} />
          <Route path="upload-cv" element={<UploadCV />} />
          <Route path="my-skills" element={<MySkills />} />
        </Route>

        <Route path="/project-manager" element={<ProjectManagerLayout />}>
          <Route index element={<Navigate to="my-project" replace />} />
          <Route path="my-project" element={<PMMyProject />} />
         <Route path="project-details" element={<ProjectDetails />} />
          <Route path="team-members" element={<TeamMembers />} />
          <Route path="role-match" element={<RoleMatch />} />
          <Route path="skill-gaps" element={<SkillGaps />} />
        </Route>

        <Route path="/join-project" element={<JoinProject />} />
      </Routes>
    </BrowserRouter>
  );
}