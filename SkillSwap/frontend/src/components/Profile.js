import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import UserSection from "./ProfileComponents/userSection";
import SkillsSection from "./ProfileComponents/skillsSection";
import ExperiencesSection from "./ProfileComponents/experiencesSection";

const Profile = () => {
  const location = useLocation();
  const state = location.state;

  let user = null;

  if (state) {
    user = state.user;
  } else {
    fetch("http://localhost:8000/api/profile/1")
      .then((response) => response.json())
      .then((data) => {
        user = data;
      });
  }

  return (
    <Box sx={{ p: 4, maxWidth: "800px", margin: "auto" }}>
      {/* Profile Section */}
      <UserSection user={user} />
      {/* Skills Section */}
      <SkillsSection user={user} />
      {/* Experience Section */}
      <ExperiencesSection user={user} />
    </Box>
  );
};

export default Profile;
