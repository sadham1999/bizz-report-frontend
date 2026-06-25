import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Img from '../assets/background.jpeg';
import logo from '../assets/logo-sass.png';
import config from '../API/Api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#01377D',
    },
    secondary: {
      main: '#01377D',
    },
    background: {
      default: '#F7F8FC',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    h5: {
      fontWeight: 600,
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
});

function SignInSide() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch(`${config.baseURL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
  
      // Store client codes and other session data
      const clientCodesArray = Array.isArray(data.client_codes) ? data.client_codes : [data.client_codes];
      sessionStorage.setItem('client_codes', JSON.stringify(clientCodesArray)); // Store client_codes
  
      sessionStorage.setItem('token', data.token);
      // sessionStorage.setItem('clientid', JSON.stringify(data.client_ids || []));
      sessionStorage.setItem('subclientcode', JSON.stringify(data.subclient_ids || []));
      sessionStorage.setItem('RoleId', data.role_id);
      sessionStorage.setItem('UserId', data.user_id);
      sessionStorage.setItem('UserName', data.username);
      sessionStorage.setItem('team_ids', data.team_ids);
  
      toast.success('Login successful');
  
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast.error('Username or password is invalid');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        component="main"
        sx={{
          height: '99vh',
          backgroundImage: `url(${Img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <CssBaseline />
        <ToastContainer />
        <Grid item xs={12} sm={10} md={3.5}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '10px',
              boxSizing: 'border-box',
              borderRadius : '20%'
            }}
          >
            <Avatar sx={{ m: -3, bgcolor: 'transparent', width: 180, height: 180 }}>
              <img src={logo} alt="Customs360 Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
            </Avatar>
            <Typography component="h1" variant="h4" sx={{ mt: 5, fontWeight: 'bold', lineHeight: '0' }}>
              Job Tracker - Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '80%' }}>
              <TextField
                size="medium"
                margin="normal"
                required
                fullWidth
                id="username"
                label="User Name"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
              <TextField
                size="medium"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  mb: 2,
                  width: '100%',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" onClick={() => navigate('/forget-pass')} sx={{ color: theme.palette.primary.main }}>
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignInSide;
