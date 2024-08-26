import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import UserSection from "./ProfileComponents/userSection";
import SkillsSection from "./ProfileComponents/skillsSection";
import ExperiencesSection from "./ProfileComponents/experiencesSection";

const Profile = ({ user }) => {
  const location = useLocation();
  const state = location.state;

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
