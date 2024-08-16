import React, { useState } from 'react';
import {
  Avatar, Box, Typography, Button, IconButton, Grid, TextField, Card, CardContent, Rating,
  List, ListItem, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';

const Profile = () => {
  // Fake data for now
  const [username, setUsername] = useState('John Doe');
  const [rating] = useState(4.5);
  const [profileImage] = useState(null); // This can be a URL or null
  const [skills, setSkills] = useState(['JavaScript', 'React', 'Node.js']);
  const [experiences, setExperiences] = useState([
    { id: 1, title: 'Frontend Developer', description: 'Worked on several React projects.', years: '2019-2022' },
    { id: 2, title: 'Backend Developer', description: 'Built REST APIs using Node.js.', years: '2016-2019' },
  ]);

  const [openSettings, setOpenSettings] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [openSkillForm, setOpenSkillForm] = useState(false);
  const [newExperience, setNewExperience] = useState({ title: '', description: '', years: '' });
  const [openExperienceForm, setOpenExperienceForm] = useState(false);

  // Functions to handle dialogs and forms
  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);

  const handleOpenSkillForm = () => setOpenSkillForm(true);
  const handleCloseSkillForm = () => setOpenSkillForm(false);

  const handleOpenExperienceForm = () => setOpenExperienceForm(true);
  const handleCloseExperienceForm = () => setOpenExperienceForm(false);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
      handleCloseSkillForm();
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddExperience = () => {
    const { title, description, years } = newExperience;
    if (title && description && years) {
      setExperiences([...experiences, { id: experiences.length + 1, title, description, years }]);
      setNewExperience({ title: '', description: '', years: '' });
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
    <Box sx={{ p: 4, maxWidth: '800px', margin: 'auto' }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3 }} src={profileImage}>
              {profileImage ? null : username.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4">{username}</Typography>
              <Rating value={rating} readOnly precision={0.5} />
            </Box>
            <IconButton color="primary" onClick={handleOpenSettings} sx={{ ml: 'auto' }}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Skills</Typography>
            <IconButton color="primary" onClick={handleOpenSkillForm}>
              <AddIcon />
            </IconButton>
          </Box>
          <Grid container spacing={1}>
            {skills.map((skill, index) => (
              <Grid item key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1">{skill}</Typography>
                  <IconButton color="secondary" size="small" onClick={() => handleRemoveSkill(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                  <IconButton color="primary" onClick={() => handleEditExperience(exp.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteExperience(exp.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Settings and Edit Profile Dialog */}
      <Dialog open={openSettings} onClose={handleCloseSettings}>
        <DialogTitle>Settings & Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            defaultValue="johndoe@example.com"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings} color="primary">Cancel</Button>
          <Button onClick={handleCloseSettings} color="primary" variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

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
          <Button onClick={handleCloseSkillForm} color="primary">Cancel</Button>
          <Button onClick={handleAddSkill} color="primary" variant="contained">Add Skill</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Experience Dialog */}
      <Dialog open={openExperienceForm} onClose={handleCloseExperienceForm}>
        <DialogTitle>{newExperience.id ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Experience Title"
            variant="outlined"
            value={newExperience.title}
            onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={newExperience.description}
            onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Years"
            variant="outlined"
            value={newExperience.years}
            onChange={(e) => setNewExperience({ ...newExperience, years: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExperienceForm} color="primary">Cancel</Button>
          <Button onClick={handleAddExperience} color="primary" variant="contained">
            {newExperience.id ? 'Save Changes' : 'Add Experience'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
