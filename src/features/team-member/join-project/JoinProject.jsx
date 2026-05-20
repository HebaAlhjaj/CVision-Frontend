import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function JoinProject() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const joinProject = async () => {
      try {
        const query = new URLSearchParams(location.search);
        const inviteToken = query.get("token");

        console.log("INVITE TOKEN:", inviteToken);

        if (!inviteToken) {
          throw new Error("Invite token is missing");
        }

        const authToken = localStorage.getItem("token");

        if (!authToken) {
          navigate("/login", { replace: true });
          return;
        }

        const res = await fetch("http://127.0.0.1:8000/projects/join", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            token: inviteToken,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.detail || "Failed to join project");
        }

        console.log("JOIN RESPONSE:", data);

        alert("Joined successfully");

        navigate("/team-member/my-project", { replace: true });
      } catch (err) {
        console.error(err);
        alert(err?.message || "Failed to join project");
      }
    };

    joinProject();
  }, [location.search, navigate]);

  return <div>Joining project...</div>;
}