import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const ExperiencesSection = () => {
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    title: "",
    description: "",
    years: "",
  });
  const [openExperienceForm, setOpenExperienceForm] = useState(false);

  const handleOpenExperienceForm = () => setOpenExperienceForm(true);
  const handleCloseExperienceForm = () => setOpenExperienceForm(false);

  const handleAddExperience = () => {
    const { title, description, years } = newExperience;
    if (title && description && years) {
      setExperiences([
        ...experiences,
        { id: experiences.length + 1, title, description, years },
      ]);
      setNewExperience({ title: "", description: "", years: "" });
      handleCloseExperienceForm();
    }
  };

  const handleEditExperience = (id) => {
    const exp = experiences.find((exp) => exp.id === id);
    setNewExperience(exp);
    handleOpenExperienceForm();
    handleDeleteExperience(id);
  };

  const handleDeleteExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
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
          <Typography variant="h5">Experience</Typography>
          <IconButton color="primary" onClick={handleOpenExperienceForm}>
            <AddIcon />
          </IconButton>
        </Box>
        <List>
          {experiences.map((exp) => (
            <React.Fragment key={exp.id}>
              <ListItem>
                <ListItemText
                  primary={exp.title}
                  secondary={`${exp.description} (${exp.years})`}
                />
                <IconButton
                  color="primary"
                  onClick={() => handleEditExperience(exp.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleDeleteExperience(exp.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </CardContent>
      {/* Add/Edit Experience Dialog */}
      <Dialog open={openExperienceForm} onClose={handleCloseExperienceForm}>
        <DialogTitle>
          {newExperience.id ? "Edit Experience" : "Add New Experience"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Experience Title"
            variant="outlined"
            value={newExperience.title}
            onChange={(e) =>
              setNewExperience({ ...newExperience, title: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={newExperience.description}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                description: e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Years"
            variant="outlined"
            value={newExperience.years}
            onChange={(e) =>
              setNewExperience({ ...newExperience, years: e.target.value })
            }
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExperienceForm} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAddExperience}
            color="primary"
            variant="contained"
          >
            {newExperience.id ? "Save Changes" : "Add Experience"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ExperiencesSection;
