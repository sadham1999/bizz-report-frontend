import React, { useEffect, useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography, IconButton, Grid, Container, Card, ListItemText, CardContent, OutlinedInput, InputAdornment, Avatar, Checkbox , Chip } from '@mui/material';
import { Email, Phone, Person, Business } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import man from '../assets/man.png';
import config from "../API/Api";

const ClientEditForm = () => {
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    client_code: '',
    client_name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    active: '',
    // sub_clients: [], // Add initial value for sub-clients
  });

  const [clients, setClients] = useState([]); // State for all clients
  const { id } = useParams();

  useEffect(() => {
    // Fetch client data
axios.get(`${config.baseURL}getClient/${id}`)      
.then(response => {
        const clientData = response.data;
        setInitialValues({
          client_code: clientData.client_code || '',
          client_name: clientData.client_name || '',
          contact_person: clientData.contact_person || '',
          phone: clientData.phone || '',
          email: clientData.email || '',
          address: clientData.address || '',
          active: clientData.is_active ? 1 : 0,
          sub_clients: clientData.SubClients.map(subClient => subClient.id) || [], // Update initial values with sub_clients
        });
      })
      .catch(error => {
        console.error('There was an error fetching the client data!', error);
        toast.error('There was an error fetching the client data!');
      });
    
    // Fetch all clients for the sub-client selection from SubclientPasses API
    axios.post(`${config.baseURL}/SubclientPasses`)
      .then(response => {
        setClients(response.data || []); // Set clients with SubclientPasses data
      })
      .catch(error => {
        console.error('There was an error fetching clients data!', error);
        toast.error('There was an error fetching clients data!');
      });
  }, [id]);
  
  
  
  const validationSchema = Yup.object({
    client_code: Yup.string()
      .required('Client Code is required')
      .min(2, 'Client Code must be at least 2 characters')
      .max(16, 'Client Code must be at most 16 characters'),
  
    client_name: Yup.string()
      .required('Client Name is required')
      .min(2, 'Client Name must be at least 2 characters') // Changed from 0 to 3
      .max(100, 'Client Name must be at most 100 characters'),
  
    contact_person: Yup.string()
      .required('Contact Person is required')
      .min(2, 'Contact Person must be at least 2 characters')
      .max(30, 'Contact Person must be at most 30 characters'),
  
      phone: Yup.string()
      .required('Phone is required')
      .matches(/^[0-9+]+$/, 'Phone must contain only numbers')
      .min(8, 'Phone must be at least 8 characters')
      .max(10, 'Phone must be at most 10 characters'),
     // Ensure phone contains numbers only
  
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  
    // address: Yup.string()
    //   .required('Address is required'),
  
    active: Yup.number()
      .required('Active Status is required'),
  
    // subclient_ids: Yup.array()
    //   .of(Yup.number())
  });
  

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
 axios.post(`${config.baseURL}editClient`, {      id: id,
      client_code: values.client_code,
      client_name: values.client_name,
      contact_person: values.contact_person,
      phone: values.phone,
      email: values.email,
      address: values.address,
      active: values.active,
      
    })
      .then(response => {
        console.log(response.data);
        toast.success('Client updated successfully!');
        setTimeout(() => {
navigate('/clients');        
}, 1000);
      })
      .catch(error => {
        console.error('There was an error updating the client!', error);
        toast.error('Error updating client!');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ values, errors, touched, isSubmitting, setFieldValue }) => (
        <Container maxWidth='xl' width={"100%"} sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: 0 }}>
          <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Grid container spacing={4} sx={{ height: '100%' }}>
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Card sx={{ width: '100%', padding: 3, boxShadow: 3, borderRadius: 2, backgroundColor: '#f0f4f8' }}>
                  <CardContent>
                    <Avatar sx={{ width: 100, height: 100, margin: '0 auto 16px', backgroundColor: '#007bff' }} src={man}>C</Avatar>
                    <Grid container spacing={2} sx={{ backgroundColor: '#f0f4f8', marginTop: '20px' }}>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Client Name:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.client_name || 'Client Name'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Client Code:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.client_code || 'Client Code'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Contact Person:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.contact_person || 'Contact Person'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Phone:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.phone || 'Phone'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Email:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', wordBreak: 'break-word' }}>{values.email || 'Email'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold', color: values.active === 1 ? 'green' : 'red' }}>Status:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', color: values.active === 1 ? 'green' : 'red' }}>
                          {values.active === 1 ? 'Active' : values.active === 0 ? 'Inactive' : 'Status'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Address:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', wordWrap: 'break-word', whiteSpace: 'pre-line' }}>{values.address || 'Address'}</Typography>
                      </Grid>
                      
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ marginBottom: 4, textAlign: 'center', backgroundColor: '#007bff', color: 'white', padding: 2, borderRadius: 2 }}>
                    <Typography variant="h3" component="h1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>
                      Edit Client
                    </Typography>
                  </Box>
                  <Card sx={{ padding: 4, boxShadow: 3, borderRadius: 2, backgroundColor: '#f0f4f8' }}>
                    <Form>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="client_code"
                            label="Client Code"
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><Business /></InputAdornment> }}
                            helperText={touched.client_code ? errors.client_code : ''}
                            error={Boolean(touched.client_code && errors.client_code)}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="client_name"
                            label="Client Name"
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><Business /></InputAdornment> }}
                            helperText={touched.client_name ? errors.client_name : ''}
                            error={Boolean(touched.client_name && errors.client_name)}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="contact_person"
                            label="Contact Person"
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
                            helperText={touched.contact_person ? errors.contact_person : ''}
                            error={Boolean(touched.contact_person && errors.contact_person)}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="phone"
                            label="Phone"
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }}
                            helperText={touched.phone ? errors.phone : ''}
                            error={Boolean(touched.phone && errors.phone)}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="email"
                            label="Email"
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
                            helperText={touched.email ? errors.email : ''}
                            error={Boolean(touched.email && errors.email)}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="address"
                            label="Address"
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><Business /></InputAdornment> }}
                            helperText={touched.address ? errors.address : ''}
                            error={Boolean(touched.address && errors.address)}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel id="active">Active Status</InputLabel>
                            <Field
                              as={Select}
                              name="active"
                              labelId="active"
                              label="Active Status"
                              defaultValue={initialValues.active}
                            >
                              <MenuItem value={1}>Active</MenuItem>
                              <MenuItem value={0}>Inactive</MenuItem>
                            </Field>
                          </FormControl>
                        </Grid>
 <Grid container justifyContent="center" spacing={2}>
  <Grid item>
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={isSubmitting}
      size="medium" // Change size to medium
      fullWidth
      sx={{ mt: 4 }}
    >
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </Button>
  </Grid>
  <Grid item>
    <Button
      variant="contained"
      color="secondary"
      disabled={isSubmitting}
      size="medium" // Change size to medium
      fullWidth
      sx={{ mt: 4 }}
      onClick={() => navigate(-1)}
    >
      Back
    </Button>
  </Grid>
</Grid>

                      </Grid>
                    </Form>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <ToastContainer />
        </Container>
      )}
    </Formik>
  );
};

export default ClientEditForm;
