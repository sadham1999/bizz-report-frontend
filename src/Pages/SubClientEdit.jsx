import React, { useEffect, useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography, IconButton, Grid, Container, Card, ListItemText, CardContent, OutlinedInput, InputAdornment, Avatar } from '@mui/material';
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
    subclient_code: '',
    subclient_name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    active: '',
    // Add initial value for sub-clients
  });

  const [subclients, setsubclients] = useState([]); // State for all clients
  const { id } = useParams();

  useEffect(() => {
    
axios.post(`${config.baseURL}getsubclient/${id}`)      .then(response => {
        const subclientData = response.data;
        setInitialValues({
          subclient_code: subclientData.subclient_code || '',
          subclient_name: subclientData.subclient_name || '',
          contact_person: subclientData.contact_person || '',
          phone: subclientData.phone || '',
          email: subclientData.email || '',
          address: subclientData.address || '',
          active: subclientData.is_active ? 1 : 0,
          // Update initial values with sub_clients
        });
      })
      .catch(error => {
        console.error('There was an error fetching the client data!', error);
        toast.error('There was an error fetching the client data!');
      });

  
  }, []);

  const validationSchema = Yup.object({
    subclient_code: Yup.string()
    .required('Sub-Client Code is required')
    .min(2, 'Subclient code  must be at least 2 characters')
    .max(16, 'Subclient  code  must be at most 16 characters'),
    subclient_name: Yup.string()
    .required('Sub-Client Name is required')
    .min(2, 'Subclient Name  must be at least 2 characters')
    .max(16, 'Subclient Name  must be at most 16 characters'),
    contact_person: Yup.string()
    .required('Contact Person is required')
    .min(2, 'Contact_Person must be at least 2 characters')
    .max(16, 'Contact_Person   must be at most 16 characters'),
    phone: Yup.string()
    .required('Phone is required')
    .matches(/^[0-9+]+$/, 'Phone must contain only numbers')
    .min(8, 'Phone must be at least 8 characters')
    .max(10, 'Phone must be at most 10 characters'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    address: Yup.string().required('Address is required'),
    active: Yup.number().required('Active Status is required'),
    sub_clients: Yup.array().of(Yup.number()), // Validate array of sub-client IDs
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
axios.post(`${config.baseURL}editsubClient`, {      
  id: id,
      subclient_code: values.subclient_code,
     subclient_name: values.subclient_name,
      contact_person: values.contact_person,
      phone: values.phone,
      email: values.email,
      address: values.address,
      active: values.active,
      // Include sub_clients in the request
    })
      .then(response => {
        console.log(response.data);
        toast.success('Client updated successfully!');
        setTimeout(() => {
         navigate('/sub-clients')        
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
                <Card sx={{ width: '100%', padding: 3, boxShadow: 3, borderRadius: 2, backgroundColor: '#f7f9fc' }}>
                  <CardContent>
                    <Avatar sx={{ width: 100, height: 100, margin: '0 auto 16px', backgroundColor: '#1f2d39' }} src={man}>C</Avatar>
                    <Grid container spacing={2} sx={{ backgroundColor: '#f7f9fc', marginTop: '20px' }}>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>SubClient Name:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.subclient_name || 'subClient Name'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>SubClient Code:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.subclient_code || 'subClient Code'}</Typography>
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
                        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.email || 'Email'}</Typography>
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
                  <Box sx={{ marginBottom: 4, textAlign: 'center', backgroundColor: '#1f2d39', color: 'white', padding: 2, borderRadius: 2 }}>
                    <Typography variant="h3" component="h1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>
                      Edit SubClient
                    </Typography>
                  </Box>
                  <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                      <Form>
                        <Box sx={{ flexGrow: 1 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                              <Field
                                name="subclient_code"
                                as={TextField}
                                label="SubClient_Code"
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
                                error={touched.subclient_code && Boolean(errors.subclient_code)}
                                helperText={touched.subclient_code && errors.subclient_code}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <Field
                                name="subclient_name"
                                as={TextField}
                                label="SubClient Name"
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Person />
                                    </InputAdornment>
                                  ),
                                  sx: { fontFamily: 'Montserrat' },
                                }}
                                InputLabelProps={{
                                  sx: { fontWeight: 'bold', fontFamily: 'Montserrat' },
                                }}
                                error={touched.subclient_name && Boolean(errors.subclient_name)}
                                helperText={touched.subclient_name && errors.subclient_name}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <Field
                                name="contact_person"
                                as={TextField}
                                label="Contact Person"
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Person />
                                    </InputAdornment>
                                  ),
                                  sx: { fontFamily: 'Montserrat' },
                                }}
                                InputLabelProps={{
                                  sx: { fontWeight: 'bold', fontFamily: 'Montserrat' },
                                }}
                                error={touched.contact_person && Boolean(errors.contact_person)}
                                helperText={touched.contact_person && errors.contact_person}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <Field
                                name="phone"
                                as={TextField}
                                label="Phone"
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Phone />
                                    </InputAdornment>
                                  ),
                                  sx: { fontFamily: 'Montserrat' },
                                }}
                                InputLabelProps={{
                                  sx: { fontWeight: 'bold', fontFamily: 'Montserrat' },
                                }}
                                error={touched.phone && Boolean(errors.phone)}
                                helperText={touched.phone && errors.phone}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <Field
                                name="email"
                                as={TextField}
                                label="Email"
                                variant="outlined"
                                fullWidth
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
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <Field
                                name="address"
                                as={TextField}
                                label="Address"
                                variant="outlined"
                                fullWidth
                                //multiline
                                minRows={3}
                                InputProps={{
                                  sx: { fontFamily: 'Montserrat' },
                                }}
                                InputLabelProps={{
                                  sx: { fontWeight: 'bold', fontFamily: 'Montserrat' },
                                }}
                                error={touched.address && Boolean(errors.address)}
                                helperText={touched.address && errors.address}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth variant="outlined">
  <InputLabel sx={{ fontWeight: 'bold', fontFamily: 'Montserrat' }}>Active Status</InputLabel>
  <Field
    name="active"
    as={Select}
    label="Active Status"
    input={<OutlinedInput label="Active Status" />}
    error={touched.active && Boolean(errors.active)}
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
                        </Box>
                      </Form>
                    </CardContent>
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
