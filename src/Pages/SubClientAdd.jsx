import React, { useEffect } from 'react';
import {
  TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography, Grid, Avatar, Card, CardContent, InputAdornment , Container
} from '@mui/material';
import { Email, Phone, Person, Business } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import man from '../assets/man.png';
import { useNavigate } from 'react-router-dom';
import config from "../API/Api";

const SubClientAddForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch clients or other necessary data if needed
  }, []);

  const initialValues = {
    subclient_code: '',
    subclient_name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    active: '', // Make sure initial value matches the schema
  };

  const validationSchema = Yup.object({
    subclient_code: Yup.string()
      .required('Sub-Client Code is required')
      .min(2, 'Sub-Client Code must be at least 2 characters')
      .max(16, 'Sub-Client Code must be at most 16 characters'),
    
    subclient_name: Yup.string()
      .required('Sub-Client Name is required')
      .min(2, 'Sub-Client Name must be at least 2 characters')
      .max(16, 'Sub-Client Name must be at most 16 characters'),
    
    contact_person: Yup.string()
      .required('Contact Person is required')
      .min(2, 'Contact Person must be at least 2 characters')
      .max(16, 'Contact Person must be at most 16 characters'),
    
      phone: Yup.string()
      .required('Phone is required')
      .matches(/^[0-9+]+$/, 'Phone must contain only numbers')
      .min(8, 'Phone must be at least 8 characters')
      .max(10, 'Phone must be at most 10 characters'),
    
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    
    address: Yup.string()
      .required('Address is required'),
    
    active: Yup.number()
      .required('Active Status is required'),
  });
  
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
   axios.post(`${config.baseURL}createsubClient`, values)      
   .then(response => {
        toast.success('Sub Client created successfully!');
        resetForm();
        setTimeout(() => navigate('/sub-clients'), 1000);
      })
      .catch(error => {
        console.error('Error creating client:', error.response?.data || error.message);
        toast.error(`Error creating client: ${error.response?.data?.message || error.message}`);
      })
      .finally(() => setSubmitting(false));
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Container maxWidth='xl' width={"100%"} sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: 0 }}>
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ width: '100%', padding: 3, boxShadow: 3, borderRadius: 2, backgroundColor: '#f7f9fc' }}>
                <CardContent>
                  <Avatar sx={{ width: 100, height: 100, margin: '0 auto 16px', backgroundColor: '#1f2d39' }} src={man}>C</Avatar>
                  <Grid container spacing={2}>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>SubClient Name:</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.subclient_name || 'SubClient Name'}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>SubClient Code:</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.subclient_code || 'Sub-Client Code'}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Contact Person:</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.contact_person || 'Contact Person'}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Phone:</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.phone || 'Phone'}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Email:</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>{values.email || 'Email'}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold', color: values.active === 1 ? 'green' : 'red' }}>Status:</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat', color: values.active === 1 ? 'green' : 'red' }}>
                      {values.active === 1 ? 'Active' : values.active === 0 ? 'Inactive' : 'Status'}
                    </Typography></Grid>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Address:</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body1" sx={{ fontFamily: 'Montserrat', wordWrap: 'break-word', whiteSpace: 'pre-line' }}>{values.address || 'Address'}</Typography></Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ marginBottom: 4, textAlign: 'center', backgroundColor: '#1f2d39', color: 'white', padding: 2, borderRadius: 2 }}>
                  <Typography variant="h3" component="h1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Add Sub-Client</Typography>
                </Box>
                <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Field
                            name="subclient_code"
                            as={TextField}
                            label="SubClient Code"
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
                        <Grid item xs={4}>
                          <Field
                            name="address"
                            as={TextField}
                            label="Address"
                            variant="outlined"
                            fullWidth
                            //multiline
                            rows={4}
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
                          <FormControl fullWidth>
                            <InputLabel id="active-label">Status</InputLabel>
                            <Field
                              name="active"
                              as={Select}
                              labelId="active-label"
                              label="Status"
                              value={values.active}
                              onChange={e => setFieldValue('active', e.target.value)}
                              InputProps={{
                                sx: { fontFamily: 'Montserrat' },
                              }}
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
                    </Form>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
          <ToastContainer />
        </Box>
        </Container>
      )}
    </Formik>
  );
};

export default SubClientAddForm;

