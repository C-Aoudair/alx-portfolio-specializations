import { Box } from "@mui/material";
import UserSection from "./ProfileComponents/userSection";
import SkillsSection from "./ProfileComponents/skillsSection";
import ExperiencesSection from "./ProfileComponents/experiencesSection";

const Profile = () => {


  return (
    <Box sx={{ p: 4, maxWidth: "800px", margin: "auto" }}>
      {/* Profile Section */}
      <UserSection />
      {/* Skills Section */}
      <SkillsSection />
      {/* Experience Section */}
      <ExperiencesSection />
    </Box>
  );
};

export default Profile;
