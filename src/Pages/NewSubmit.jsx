import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from "../API/Api";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  InputAdornment
} from '@mui/material';
import { Lock, VpnKey } from '@mui/icons-material';
import forgetImage from './newsubmit.jpg'; // Ensure you have this image in your project

function NewSubmit() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${config.baseURL}resetpassword`, {
        otp,
        password,
        confirmPassword
      });
      
      if (response.data.message === 'Password reset successful') {
        toast.success('Password reset successful!');
        setTimeout(() => {
          navigate('/'); // Navigate to the login page or any other page
        }, 1000);
      } else {
        toast.error('Failed to reset password. Please check the OTP or try again.');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            sx={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
            alt="Reset Password"
            src={forgetImage}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 4, boxShadow: 3, borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontFamily: 'Montserrat', fontWeight: 'bold', color: '#333' }}
              >
                Reset Password
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ fontFamily: 'Montserrat', color: '#666' }}
              >
                Enter the OTP and your new password.
              </Typography>
              <TextField
                label="OTP"
                variant="outlined"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey />
                    </InputAdornment>
                  ),
                  sx: { fontFamily: 'Montserrat' },
                }}
                InputLabelProps={{
                  sx: { fontWeight: 'bold', fontFamily: 'Montserrat' },
                }}
              />
              <TextField
                label="New Password"
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  sx: { fontFamily: 'Montserrat' },
                }}
                InputLabelProps={{
                  sx: { fontWeight: 'bold', fontFamily: 'Montserrat' },
                }}
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  sx: { fontFamily: 'Montserrat' },
                }}
                InputLabelProps={{
                  sx: { fontWeight: 'bold', fontFamily: 'Montserrat' },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                sx={{
                  mt: 2,
                  fontFamily: 'Lato',
                  backgroundColor: '#007bff',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#0056b3',
                  },
                  padding: '10px 0',
                }}
              >
                Reset Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
}

export default NewSubmit;
