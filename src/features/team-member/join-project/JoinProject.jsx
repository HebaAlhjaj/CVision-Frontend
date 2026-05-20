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

        if (!res.ok) {
          throw new Error("Failed to join project");
        }

        navigate("/team-member/my-project", { replace: true });
      } catch (error) {
        console.log(error);
        alert("Failed to join project");
      }
    };

    joinProject();
  }, [location.search, navigate, slug]);

  return <div>Joining project...</div>;
}