import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Link, Grid, Box } from '@mui/material';
import AuthLayout from './AuthLayout';

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Passwor criteria:
    // at least 8 characters.
    // contains a number and a special character
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError(
        'Password must be at least 8 characters long \
        and include a number and a special character'
      );
      valid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (valid) {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.status === 201) {
        const data = await response.json();
        console.log(data);
        navigate('/profile', { state: {user: data}, replace: true});
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  }

  return (
    <AuthLayout title='Sign Up for SkillSwap'>
      <Box component='form' onSubmit={handleSignup} sx={{ mt: 1 }}>
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          label='Username'
          autoComplete='username'
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          label='Email Address'
          autoComplete='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          label='Password'
          type='password'
          autoComplete='new-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
        />
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          label='Confirm Password'
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Grid container justifyContent='flex-end'>
          <Grid item>
            <Link href='/login' variant='body2'>
              Already have an account? Log In
            </Link>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
}

export default Signup;
