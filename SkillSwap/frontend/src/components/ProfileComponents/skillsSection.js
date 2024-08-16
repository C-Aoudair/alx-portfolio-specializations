import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  TextField,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);

  const [newSkill, setNewSkill] = useState("");
  const [openSkillForm, setOpenSkillForm] = useState(false);

  const handleOpenSkillForm = () => setOpenSkillForm(true);
  const handleCloseSkillForm = () => setOpenSkillForm(false);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      fetch("https://localhost:8000/api/add-skill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skill: newSkill }),
      })
        .then((Response) => Response.json())
        .then((data) => {
          setSkills([...skills, data]);
          setNewSkill("");
          handleCloseSkillForm();
        })
        .catch((error) => {
          alert("An error occurred. Please try again later.");
          handleCloseSkillForm();
        });
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5">Skills</Typography>
          <IconButton color="primary" onClick={handleOpenSkillForm}>
            <AddIcon />
          </IconButton>
        </Box>
        <Grid container spacing={1}>
          {skills.map((skill, index) => (
            <Grid item key={index}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="body1">{skill}</Typography>
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() => handleRemoveSkill(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>

      {/* Add Skill Dialog */}
      <Dialog open={openSkillForm} onClose={handleCloseSkillForm}>
        <DialogTitle>Add New Skill</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Skill Name"
            variant="outlined"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSkillForm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddSkill} color="primary" variant="contained">
            Add Skill
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SkillsSection;
