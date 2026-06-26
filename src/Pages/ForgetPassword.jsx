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
    <Container
      maxWidth="lg"
      sx={{
        minHeight: '100vh',
        py: 4,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            sx={{
              width: '100%',
              minHeight: { xs: 260, md: 520 },
              objectFit: 'cover',
              borderRadius: '24px',
              boxShadow: '0 18px 48px rgba(15, 23, 42, 0.18)',
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
              minHeight: { xs: 'auto', md: 520 },
              padding: { xs: 3, md: 5 },
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(246,249,252,0.96) 100%)',
              border: '1px solid rgba(216, 226, 238, 0.9)',
              boxShadow: '0 18px 50px rgba(15, 23, 42, 0.12)',
              borderRadius: '24px',
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontFamily: 'Montserrat', fontWeight: 800, color: '#102033', letterSpacing: '-0.03em' }}
            >
              Forgot Your Password?
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ fontFamily: 'Montserrat', color: '#5e6b7d', mb: 2 }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
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
                padding: '12px 0',
                borderRadius: '12px',
                backgroundImage: 'linear-gradient(180deg, rgba(13, 19, 24, 0.98) 0%, rgba(20, 28, 35, 0.98) 52%, rgba(28, 38, 47, 0.98) 100%)',
                boxShadow: '0 12px 24px rgba(23, 50, 77, 0.18)',
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
