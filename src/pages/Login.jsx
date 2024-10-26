import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, IconButton, InputAdornment } from '@mui/material';
import { Lock as LockIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { login } from '../services/allApi'; // This function will handle API calls
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({ email: '', password: '' });
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result && result.message === 'Login successful') {
        localStorage.setItem('groceryadmin', JSON.stringify(result)); // Store the entire response

        if (result.is_superuser) {
          navigate('/'); // Navigate to the dashboard for superuser
        } else {
          navigate('/'); // For non-superuser, can customize if needed
        }
      } else {
        setErrors({ email: 'Invalid credentials', password: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ email: 'Invalid Username or Password', password: 'Invalid Password or Username' });
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Container component="main" maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, p: 3 }}>
          <LockIcon sx={{ m: 1, fontSize: 60 }} />
          <Typography component="h1" variant="h5">Admin Login</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText={errors.email}
              error={!!errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText={errors.password}
              error={!!errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign In'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;
