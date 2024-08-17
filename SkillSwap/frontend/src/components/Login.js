import { useState } from 'react';
import { Button, TextField, Link, Grid, Box } from '@mui/material';
import AuthLayout from './AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password criteria:
    // at least 8 characters.
    // contains a number and a special character
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async (e) => {
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

    if (valid) {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        navigate('/profile', { state: {user: data}, replace: true});
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <AuthLayout title='Log in to SkillSwap'>
      <Box component='form' onSubmit={handleLogin} sx={{ mt: 1 }}>
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          label='Email Address'
          autoComplete='email'
          autoFocus
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
          autoComplete='current-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          sx={{ mt: 3, mb: 2 }}
        >
          Log In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href='#' variant='body2'>
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href='/signup' variant='body2'>
              Don't have an account? Sign Up
            </Link>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};

export default Login;
