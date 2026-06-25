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
  InputAdornment,
} from '@mui/material';
import { Email } from '@mui/icons-material';
import forgetImage from './forget.jpg'; // Ensure you have this image in your project

function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${config.baseURL}forgotpassword`, { email });
  
      if (response.data.message === 'OTP sent to your email') {
        toast.success('OTP sent successfully!');

        // Delay navigation
        setTimeout(() => {
          navigate('/new-submit'); // Navigate to the new-submit page
        }, 1000);
      } else {
        toast.error('Email not found or server error.');
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
            alt="Forget Password"
            src={forgetImage}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              padding: 4,
              backgroundColor: '#f9f9f9',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px',
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontFamily: 'Montserrat', fontWeight: 'bold', color: '#333' }}
            >
              Forgot Your Password?
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ fontFamily: 'Montserrat', color: '#666' }}
            >
              Enter your email address to receive an OTP.
            </Typography>
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
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
              RESET PASSWORD
            </Button>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
}

export default ForgetPassword;
