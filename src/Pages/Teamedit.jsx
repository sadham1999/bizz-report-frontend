import React, { useEffect, useState } from 'react';
import {
  TextField, Button, MenuItem, Select, InputLabel, FormControl, Box,
  Typography, Grid, Container, Card, CardContent, OutlinedInput,
  InputAdornment, Checkbox, ListItemText, Chip, Avatar
} from '@mui/material';
import { Business } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../API/Api';
import man from "../assets/man.png";

const TeamEditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    team_name: '',
    is_active: true,
    client_codes: [],
  });

  useEffect(() => {
    fetchClients();
    fetchTeamById();
  }, []);

  const fetchClients = async () => {
  try {
    const response = await axios.get(`${config.baseURL}clientPasses`);

    setClients(response.data || []);
  } catch (error) {
    console.error("Error fetching clients:", error);
    toast.error("Error fetching clients");
  }
};

  const fetchTeamById = async () => {
    try {
      const response = await axios.get(`${config.baseURL}teams/${id}`);
      const team = response.data;

      // Convert Clients array to client_codes array
      const clientCodes = Array.isArray(team.Clients)
        ? team.Clients.map((client) => client.client_code)
        : [];

      setFormData({
        team_name: team.team_name || '',
        is_active: Boolean(team.is_active),
        client_codes: clientCodes,
      });
    } catch (error) {
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'is_active' ? value === 'true' : value,
    }));
  };

  const handleClientCodeChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      client_codes: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`${config.baseURL}teams/${id}`, formData);
      toast.success('Team updated successfully');
      setTimeout(() => {
navigate('/teams');      
}, 1000);
    } catch (error) {
      toast.error('Failed to update team');
    }
  };

  if (loading) return <Typography textAlign="center">Loading...</Typography>;

  return (
    <Container maxWidth="xl" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
      <ToastContainer />
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={4}>

          {/* Left Preview */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', padding: 3, boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
               <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        margin: "0 auto 16px",
                        backgroundColor: "#007bff",
                      }}
                      src={man}
                    >
                      U
                    </Avatar>
                <Grid container spacing={2} sx={{ backgroundColor: '#f0f4f8', padding: 2 }}>
                  <Grid item xs={6}><Typography fontWeight="bold">Team Name:</Typography></Grid>
                  <Grid item xs={6}><Typography>{formData.team_name}</Typography></Grid>
                  <Grid item xs={6}><Typography fontWeight="bold">Client Codes:</Typography></Grid>
                  <Grid item xs={6}><Typography>{formData.client_codes.join(', ')}</Typography></Grid>
                  <Grid item xs={6}><Typography fontWeight="bold">Status:</Typography></Grid>
                  <Grid item xs={6}>
                    <Typography color={formData.is_active ? 'green' : 'red'}>
                      {formData.is_active ? 'Active' : 'Inactive'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Form */}
          <Grid item xs={12} md={6}>
            <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ mb: 4, textAlign: 'center', backgroundColor: '#007bff', color: 'white', p: 2, borderRadius: 2 }}>
                  <Typography variant="h4" fontWeight="bold">Edit Team</Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="team_name"
                      label="Team Name"
                      value={formData.team_name}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Active Status</InputLabel>
                      <Select
                        name="is_active"
                        value={formData.is_active.toString()}
                        onChange={handleChange}
                        input={<OutlinedInput label="Active Status" />}
                      >
                        <MenuItem value="true">Active</MenuItem>
                        <MenuItem value="false">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Clients</InputLabel>
                      <Select
                        name="client_codes"
                        multiple
                        value={formData.client_codes}
                        onChange={handleClientCodeChange}
                        input={<OutlinedInput label="Clients" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        {clients.map((client) => (
                          <MenuItem key={client.client_code} value={client.client_code}>
                            <Checkbox checked={formData.client_codes.includes(client.client_code)} />
                            <ListItemText primary={client.client_code} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
  <Button
    variant="contained"
    sx={{
      backgroundColor: '#007bff',
      color: '#fff',
      borderRadius: '8px',
      paddingX: 4,
      fontWeight: 'bold',
      '&:hover': { backgroundColor: '#0056b3' }
    }}
    onClick={handleSubmit}
  >
  UPDATE
  </Button>
  <Button
    variant="contained"
    sx={{
      backgroundColor: '#9c27b0',
      color: '#fff',
      borderRadius: '8px',
      paddingX: 4,
      fontWeight: 'bold',
      '&:hover': { backgroundColor: '#7b1fa2' }
    }}
    onClick={() => navigate('/team')}
  >
    BACK
  </Button>
</Grid>

                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>
    </Container>
  );
};

export default TeamEditForm;
