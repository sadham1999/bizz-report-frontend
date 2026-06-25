import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <Box className="page_404" sx={{ padding: '40px 0', backgroundColor: '#fff', fontFamily: 'Arvo, serif' }}>
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" className="four_zero_four_bg" sx={{ height: '400px', backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)', backgroundPosition: 'center' }}>
                    
                </Box>
                <Box textAlign="center" className="contant_box_404" sx={{ marginTop: '-50px' }}>
                    <Typography variant="h3" className="h2" sx={{ fontSize: '80px' }}>404 Look like you're lost</Typography>
                    <Typography sx={{ margin: '20px 0' }}>The page you are looking for is not available!</Typography>
                    <Button component={Link} to="/dashboard" variant="contained" color="primary" className="link_404" sx={{ backgroundColor: '#39ac31', color: '#fff' }}>Go to Home</Button>
                </Box>
            </Container>
        </Box>
    );
}

export default NotFound;
