import { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

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

        await axios.post(
          "http://127.0.0.1:8000/projects/join",
          { token: inviteToken },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

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