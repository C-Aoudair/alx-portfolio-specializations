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

const SkillsSection = ({ user }) => {
  const [skills, setSkills] = useState(user.skills || []);

  const [newSkill, setNewSkill] = useState("");
  const [openSkillForm, setOpenSkillForm] = useState(false);

  const handleOpenSkillForm = () => setOpenSkillForm(true);
  const handleCloseSkillForm = () => {
    setOpenSkillForm(false);
    setNewSkill("");
  }

  const handleAddSkill = async () => {
    if (newSkill.trim()) {
      const response = await fetch("http://localhost:8000/api/add-skill/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access-token')}`,
        },
        body: JSON.stringify({ name: newSkill }),
      });
      
      if (response.ok) {
        const jsonResponse = await response.json();
        const addedSkill = jsonResponse.newSkill;
        setSkills([...skills, addedSkill]);
      } else {
        alert("something goes wrong, try again");
      }
      setNewSkill("");
      handleCloseSkillForm();
    }
  };

  const handleRemoveSkill = async (id) => {
    const response = await fetch(`http://localhost:8000/api/delete-skill/${id}/` , {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('access-token')}`,
      },
    })
    if (response.ok) {
      setSkills(skills.filter((skill) => skill.id !== id));
    } else {
      alert('something went wrong, try again');
    }
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
          {skills.map((skill) => (
            <Grid item key={skill.id}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="body1">{skill.name}</Typography>
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() => handleRemoveSkill(skill.id)}
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
