import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Avatar,
  Box,
  IconButton,
} from '@mui/material';
import { Chat, Search } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = (e) => {
    if (searchTerm) {
      navigate('/search', { state: {searchQuery: searchTerm} });
    }
  };

  return (
    <AppBar sx={{
	    position: 'static',
	zIndex: 100,
    }}
	  >
      <Toolbar style={{ justifyContent: 'space-between' }}>
        {/* App Name */}
        <Typography variant='h6' noWrap>
          <NavLink
            to='/profile'
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            SkillSwap
          </NavLink>
        </Typography>

        {/* Search Field */}
        <Box flexGrow={1} display='flex' justifyContent='center'>
          <InputBase
            placeholder='Search…'
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '0 8px',
              borderRadius: 4,
              color: 'inherit',
              width: '50%'
            }}
          />
          <IconButton onClick={handleSearchClick} color='inherit'>
            <Search />
          </IconButton>
        </Box>

        {/* Right Side Icons */}
        <Box display='flex' alignItems='center'>
          {/* Messages */}
          <NavLink
            to='/messages'
            style={{ color: 'inherit', marginLeft: '16px' }}
            className={({ isActive }) => {
              return isActive ? 'active-link' : '';
            }}
          >
            <Chat sx={{ fontSize: 32 }} />
          </NavLink>

          {/* Profile */}
          <NavLink
            to='/profile'
            style={{ color: 'inherit', marginLeft: '16px' }}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            <Avatar alt='User Profile' sx={{ width: 32, height: 32 }}>
              U
            </Avatar>
          </NavLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
