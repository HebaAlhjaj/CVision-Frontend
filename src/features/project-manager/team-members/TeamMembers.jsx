import React, { useEffect, useState } from "react";
import "./teamMembers.css";
import { getProjectMembers } from "./teamMembers.service";

export default function TeamMembers() {
  const token = localStorage.getItem("token");
  const projectId = localStorage.getItem("project_id");

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMembers = async () => {
    if (!token || !projectId) return;

    try {
      setLoading(true);
      const data = await getProjectMembers(projectId, token);

      if (Array.isArray(data)) {
        setMembers(data);
      } else {
        setMembers([]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  if (loading) return <p>Loading team members...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="team-members-page">
      <h1>Team Members</h1>

      {members.length === 0 ? (
        <p>No team members joined yet.</p>
      ) : (
        <div className="members-list">
          {members.map((member) => (
            <div className="member-card" key={member.user_id}>
              <h3>{member.full_name}</h3>
              <p>{member.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}