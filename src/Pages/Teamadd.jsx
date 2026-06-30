import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Grid,
  IconButton,
  Container,
  Card,
  CardContent,
  OutlinedInput,
  InputAdornment,
  Checkbox,
  ListItemText,
  Chip,
  Avatar,
} from '@mui/material';
import { Business } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import config from "../API/Api";
import man from "../assets/man.png";

const TeamAddForm = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
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

  const initialValues = {
    team_name: '',
    is_active: true,
    client_codes: [],
  };

  const validationSchema = Yup.object({
    team_name: Yup.string()
      .required('Team Name is required')
      .min(2, 'Team Name must be at least 2 characters')
      .max(100, 'Team Name must be at most 100 characters'),
    client_codes: Yup.array()
      .min(1, 'At least one client must be selected'),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    axios.post(`${config.baseURL}teams`, values)
      .then(response => {
        toast.success(response.data.message || 'Team created successfully!');
        resetForm();
        setTimeout(() => {
          navigate('/team');
        }, 1000);
      })
      .catch(error => {
        console.error('Error creating team:', error);
        toast.error('Error creating team! Please try again.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, errors, touched, isSubmitting }) => (
        <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={4}>
              
              {/* Left Column - Card Preview */}
              <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card sx={{ width: '100%', padding: 3, boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                   <Avatar
                                         sx={{
                                           width: 100,
                                           height: 100,
                                           margin: "0 auto 16px",
                                           backgroundColor: "#1f2d39",
                                         }}
                                         src={man}
                                       >
                                         U
                                       </Avatar>
                    <Grid container spacing={2} sx={{ backgroundColor: '#f7f9fc', padding: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Team Name:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.team_name || 'Team Name'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Client Code:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.client_codes.join(', ') || 'Client Code'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Status:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', color: values.is_active ? 'green' : 'red' }}>
                          {values.is_active ? 'Active' : 'Inactive'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Column - Form */}
              <Grid item xs={12} md={6}>
                <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ marginBottom: 4, textAlign: 'center', backgroundColor: '#1f2d39', color: 'white', padding: 2, borderRadius: 2 }}>
                      <Typography variant="h4" component="h1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>
                        Add Team
                      </Typography>
                    </Box>

                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Field
                            name="team_name"
                            as={TextField}
                            label="Team Name"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Business />
                                </InputAdornment>
                              ),
                              sx: { fontFamily: 'Montserrat' },
                            }}
                            InputLabelProps={{
                              sx: { fontWeight: 'bold', fontFamily: 'Montserrat' },
                            }}
                            error={touched.team_name && Boolean(errors.team_name)}
                            helperText={touched.team_name && errors.team_name}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel id="is_active-label">Active Status</InputLabel>
                            <Field
                              name="is_active"
                              as={Select}
                              label="Active Status"
                              input={<OutlinedInput label="Active Status" />}
                            >
                              <MenuItem value={true}>Active</MenuItem>
                              <MenuItem value={false}>Inactive</MenuItem>
                            </Field>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel id="client_codes-label">Clients</InputLabel>
                            <Field
                              name="client_codes"
                              as={Select}
                              multiple
                              label="Clients"
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
                                  <Checkbox checked={values.client_codes.includes(client.client_code)} />
                                  <ListItemText primary={client.client_code} />
                                </MenuItem>
                              ))}
                            </Field>
                          </FormControl>
                        </Grid>

                        <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                          <Grid item>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="secondary"
                              disabled={isSubmitting}
                              onClick={() => navigate(-1)}
                            >
                              Back
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Form>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>
          </Box>
          <ToastContainer />
        </Container>
      )}
    </Formik>
  );
};

export default TeamAddForm;

