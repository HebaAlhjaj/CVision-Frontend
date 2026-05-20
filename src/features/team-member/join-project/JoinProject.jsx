import { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function JoinProject() {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  useEffect(() => {
    const joinProject = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const inviteToken = queryParams.get("token");

        const authToken = localStorage.getItem("token");

        console.log("PROJECT SLUG:", slug);
        console.log("INVITE TOKEN:", inviteToken);

        if (!inviteToken) {
          throw new Error("Invite token is missing from URL");
        }

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
          throw new Error(data?.detail || data?.message || "Failed to join project");
        }

        console.log("JOIN RESPONSE:", data);

        navigate("/team-member/my-project", { replace: true });
      } catch (error) {
        console.log(error);
        alert(error?.message || "Failed to join project");
      }
    };

    joinProject();
  }, [location.search, navigate, slug]);

  return <div>Joining project...</div>;
}