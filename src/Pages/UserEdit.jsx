import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
  IconButton,
  Grid,
  Container,
  Card,
  ListItemText,
  CardContent,
  OutlinedInput,
  InputAdornment,
  Avatar,
} from "@mui/material";
import {
  Email,
  Lock,
  Phone,
  Person,
  Business,
  Home,
} from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import man from "../assets/man.png";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import config from "../API/Api";
import { sidebarGradient } from "../theme";
import { Chip } from '@mui/material';
import ClientEditForm from "./SubClientEdit";

const UserEditForm = () => {
  const [teams, setTeams] = useState([]); // Initialize teams state
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [initialValues, setInitialValues] = useState({
    user_name: "",
    password: "",
    uen: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    role_id: "",
    active: "",
    team_ids: [],
  });

  useEffect(() => {
    // Fetch teams data
    axios
      .get(`${config.baseURL}teams-dropdown`)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setTeams(response.data);
          console.log("Teams data:", response.data); // Debugging log
        } else {
          console.error("Invalid response format:", response.data);
          setTeams([]); // Set empty array on invalid response
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the teams data!", error);
        toast.error("There was an error fetching the teams data!");
      });

    // Fetch user data
    axios
      .get(`${config.baseURL}getUser/${id}`)
      .then((response) => {
        const userData = response.data;
        const initialTeamIds = userData.teams
          ? userData.teams.map((team) => team.id)
          : [];

        setInitialValues({
          user_name: userData.user_name || "",
          password: userData.password || "",
          uen: userData.uen || "",
          contact_person: userData.contact_person || "",
          phone: userData.phone || "",
          email: userData.email || "",
          address: userData.address || "",
          role_id: userData.role_id || "",
          active: userData.is_active ? 1 : 0,
          team_ids: initialTeamIds,
        });
        console.log("User data:", userData); // Debugging log
      })
      .catch((error) => {
        console.error("There was an error fetching the user data!", error);
        toast.error("There was an error fetching the user data!");
      });
  }, [id]);

  const validationSchema = Yup.object({
    user_name: Yup.string()
      .required("User Name is required")
      .min(0, "User Name must be at least 0 characters")
      .max(16, "User Name must be at most 16 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(5, "Password must be at least 5 characters")
      .max(20, "Password must be at most 20 characters"),
    uen: Yup.string()
      .required("EMP ID is required")
      .min(4, "EMP ID must be at least 4 characters")
      .max(8, "EMP ID must be at most 8 characters"),
    // contact_person: Yup.string()
    //   .required("Contact Person is required")
    //   .min(3, "Contact Person must be at least 3 characters")
    //   .max(16, "Contact Person must be at most 16 characters"),
    // phone: Yup.string()
    //   .required('Phone is required')
    //   .matches(/^\+?[0-9]+$/, 'Phone must start with + (optional) and contain only numbers')
    //   .min(8, 'Phone must be at least 8 characters')
    //   .max(10, 'Phone must be at most 10 characters'),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    // address: Yup.string().required("Address is required"),
    role_id: Yup.number().required("Role is required"),
    active: Yup.number().required("Active Status is required"),
    team_ids: Yup.array()
      .min(1, "At least one team is required")
      .required("Team selection is required"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const filteredTeamIds = values.team_ids.filter((teamId) => teamId !== null);

    axios
      .post(`${config.baseURL}editUser`, {
        id: id,
        user_name: values.user_name,
        password: values.password,
        uen: values.uen,
        contact_person: values.contact_person,
        phone: values.phone,
        email: values.email,
        address: values.address,
        active: values.active,
        role_id: values.role_id,
        team_ids: filteredTeamIds,
      })
      .then((response) => {
        console.log("Response data:", response.data);
        toast.success("User updated successfully!");
        setTimeout(() => {
          navigate("/user");
        }, 1000);
        resetForm(); // Clear the form after successful submission
      })
      .catch((error) => {
        console.error("There was an error updating the user!", error);

        // Handle specific error messages from the server
        if (error.response && error.response.data && error.response.data.message) {
          const message = error.response.data.message;

          if (message === "Duplicate user name") {
            toast.error("Duplicate user name.");
          } else {
            // Display other server-provided error messages
            toast.error(message);
          }
        } else {
          // Handle generic errors
          toast.error("Error updating user! Please try again.");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, isSubmitting, setFieldValue }) => (
        <Container
          maxWidth="lg" // Add maxWidth
          sx={{
            maxWidth: '1200px', // Prevent content overflow
            width: '100%',
            margin: 'auto',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background:
              'radial-gradient(circle at top left, rgba(44, 123, 229, 0.08), transparent 26%), linear-gradient(180deg, #f7f9fc 0%, #edf2f8 100%)',
            padding: 0,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Grid container spacing={4} sx={{ height: "100%" }}>
              <Grid
                item
                xs={12}
                md={4}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Card
                  sx={{
                    width: "100%",
                    padding: 3,
                    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.10)",
                    borderRadius: 3,
                    backgroundColor: "#ffffff",
                    border: "1px solid #d8e2ee",
                  }}
                >
                  <CardContent>
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        margin: "0 auto 16px",
                        backgroundColor: "#1f2d39",
                        boxShadow: "0 12px 24px rgba(15, 23, 42, 0.16)",
                      }}
                      src={man}
                    >
                      U
                    </Avatar>
                    <Grid
                      container
                      spacing={2}
                      sx={{ backgroundColor: "transparent", marginTop: "20px" }}
                    >
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ fontFamily: "Montserrat", fontWeight: "bold" }}
                        >
                          User Name:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ fontFamily: "Montserrat" }}
                        >
                          {values.user_name || "User Name"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ fontFamily: "Montserrat", fontWeight: "bold" }}
                        >
                          UEN Number:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ fontFamily: "Montserrat" }}
                        >
                          {values.uen || "UEN Number"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "Montserrat",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Contact Person:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ fontFamily: "Montserrat" }}
                        >
                          {values.contact_person || "Contact Person"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ fontFamily: "Montserrat", fontWeight: "bold" }}
                        >
                          Phone:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ fontFamily: "Montserrat" }}
                        >
                          {values.phone || "Phone"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ fontFamily: "Montserrat", fontWeight: "bold" }}
                        >
                          Email:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ fontFamily: "Montserrat", wordBreak: 'break-word' }}
                        >
                          {values.email || "Email"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                            sx={{
                              fontFamily: "Montserrat",
                              fontWeight: "bold",
                              color:
                              values.role_id === 1
                                ? "#1f2d39"  // Super Admin
                                : values.role_id === 2
                                ? "#14b8a6"   // Admin
                                : values.role_id === 3
                                ? "#2c7be5"    // User
                                : "inherit",
                          }}
                        >
                          Role:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "Montserrat",
                            color:
                              values.role_id === 1
                                ? "#7c3aed"  // Super Admin
                                : values.role_id === 2
                                ? "#14b8a6"   // Admin
                                : values.role_id === 3
                                ? "#2c7be5"    // User
                                : "inherit",
                          }}
                        >
                          {values.role_id === 1
                            ? "Super Admin"
                            : values.role_id === 2
                            ? "Admin"
                            : values.role_id === 3
                            ? "User"
                            : "Role"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "Montserrat",
                            fontWeight: "bold",
                            color: values.active === 1 ? "green" : "red",
                          }}
                        >
                          Status:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "Montserrat",
                            color: values.active === 1 ? "green" : "red",
                          }}
                        >
                          {values.active === 1
                            ? "Active"
                            : values.active === 0
                            ? "Inactive"
                            : "Status"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ fontFamily: "Montserrat", fontWeight: "bold" }}
                        >
                          Address:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "Montserrat",
                            wordWrap: "break-word",
                            whiteSpace: "pre-line",
                          }}
                        >
                          {values.address || "Address"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
  <Typography
    variant="body1"
    sx={{ fontFamily: "Montserrat", fontWeight: "bold" }}
  >
    Teams:
  </Typography>
</Grid>
<Grid item xs={6}>
  {values.team_ids.length > 0 ? (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
      {values.team_ids
        .map((id) =>
          teams.find((team) => team.id === id)?.team_name
        )
        .filter(Boolean)
        .map((teamName, index) => (
          <Chip
            key={index}
            label={teamName}
            size="small"
            sx={{
              margin: "2px",
              backgroundColor: "#eff6ff",
              color: "#1f2d39",
              fontWeight: 700,
            }}
          />
        ))}
    </div>
  ) : (
    <Typography
      variant="body1"
      sx={{ fontFamily: "Montserrat" }}
    >
      No Team Selected
    </Typography>
  )}
</Grid>

                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid
                item
                xs={12}
                md={8}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      marginBottom: 4,
                      textAlign: "center",
                      backgroundImage: sidebarGradient,
                      color: "white",
                      padding: 2,
                      borderRadius: 3,
                      boxShadow: "0 12px 24px rgba(23, 50, 77, 0.18)",
                    }}
                  >
                    <Typography
                      variant="h3"
                      component="h1"
                      sx={{ fontFamily: "Montserrat", fontWeight: "bold" }}
                    >
                      Edit User
                    </Typography>
                  </Box>
                  <Card sx={{ padding: 3, boxShadow: "0 12px 32px rgba(15, 23, 42, 0.10)", borderRadius: 3, border: "1px solid #d8e2ee" }}>
                    <CardContent>
                      <Form>
                        <Box sx={{ flexGrow: 1 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                              <Field
                                name="user_name"
                                as={TextField}
                                label="User Name"
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Person />
                                    </InputAdornment>
                                  ),
                                  sx: { fontFamily: "Montserrat" },
                                }}
                                InputLabelProps={{
                                  sx: {
                                    fontWeight: "bold",
                                    fontFamily: "Montserrat",
                                  },
                                }}
                                error={
                                  touched.user_name && Boolean(errors.user_name)
                                }
                                helperText={
                                  touched.user_name && errors.user_name
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <Field
                                name="password"
                                as={TextField}
                                label="Password"
                                variant="outlined"
                                fullWidth
                                type={showPassword ? "text" : "password"}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Lock />
                                    </InputAdornment>
                                  ),
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                      >
                                        {showPassword ? (
                                          <VisibilityOff />
                                        ) : (
                                          <Visibility />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                  sx: { fontFamily: "Montserrat" },
                                }}
                                InputLabelProps={{
                                  sx: {
                                    fontWeight: "bold",
                                    fontFamily: "Montserrat",
                                  },
                                }}
                                error={
                                  touched.password && Boolean(errors.password)
                                }
                                helperText={touched.password && errors.password}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <Field
                                name="uen"
                                as={TextField}
                                label="EMP ID"
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Business />
                                    </InputAdornment>
                                  ),
                                  sx: { fontFamily: "Montserrat" },
                                }}
                                InputLabelProps={{
                                  sx: {
                                    fontWeight: "bold",
                                    fontFamily: "Montserrat",
                                  },
                                }}
                                error={touched.uen && Boolean(errors.uen)}
                                helperText={touched.uen && errors.uen}
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
                                  sx: { fontFamily: "Montserrat" },
                                }}
                                InputLabelProps={{
                                  sx: {
                                    fontWeight: "bold",
                                    fontFamily: "Montserrat",
                                  },
                                }}
                                error={
                                  touched.contact_person &&
                                  Boolean(errors.contact_person)
                                }
                                helperText={
                                  touched.contact_person &&
                                  errors.contact_person
                                }
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
                                  sx: { fontFamily: "Montserrat" },
                                }}
                                InputLabelProps={{
                                  sx: {
                                    fontWeight: "bold",
                                    fontFamily: "Montserrat",
                                  },
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
                                  sx: { fontFamily: "Montserrat" },
                                }}
                                InputLabelProps={{
                                  sx: {
                                    fontWeight: "bold",
                                    fontFamily: "Montserrat",
                                  },
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
                                multiline
                                minRows={3}
                                InputProps={{
                                  sx: { fontFamily: "Montserrat" },
                                }}
                                InputLabelProps={{
                                  sx: {
                                    fontWeight: "bold",
                                    fontFamily: "Montserrat",
                                  },
                                }}
                                error={
                                  touched.address && Boolean(errors.address)
                                }
                                helperText={touched.address && errors.address}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <FormControl fullWidth>
                                <InputLabel
                                  sx={{
                                    fontWeight: "bold",
                                    fontFamily: "Montserrat",
                                  }}
                                  id="role-select-label"
                                >
                                  Role
                                </InputLabel>
                                <Field
                                  name="role_id"
                                  as={Select}
                                  labelId="role-select-label"
                                  input={<OutlinedInput label="Role" />}
                                  error={
                                    touched.role_id && Boolean(errors.role_id)
                                  }
                                >
                                  <MenuItem value={1}>SuperAdmin</MenuItem>
                                  <MenuItem value={2}>Admin</MenuItem>
                                  <MenuItem value={3}>User</MenuItem>
                                </Field>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <FormControl fullWidth>
                                <InputLabel
                                  sx={{
                                    fontWeight: "bold",
                                    fontFamily: "Montserrat",
                                  }}
                                  id="active-status-label"
                                >
                                  Active Status
                                </InputLabel>
                                <Field
                                  name="active"
                                  as={Select}
                                  labelId="active-status-label"
                                  input={
                                    <OutlinedInput label="Active Status" />
                                  }
                                  error={
                                    touched.active && Boolean(errors.active)
                                  }
                                >
                                  <MenuItem value={1}>Active</MenuItem>
                                  <MenuItem value={0}>Inactive</MenuItem>
                                </Field>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
  <FormControl fullWidth>
    <InputLabel>Teams</InputLabel>
    <Select
      multiple
      value={values.team_ids}
      onChange={(event) =>
        setFieldValue("team_ids", event.target.value)
      }
      renderValue={(selected) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {selected.map((id) => {
            const teamName = teams.find((team) => team.id === id)?.team_name || "Unknown";
            return (
              <Chip
                key={id}
                label={teamName}
              />
            );
          })}
        </div>
      )}
      error={touched.team_ids && Boolean(errors.team_ids)}
    >
      {Array.isArray(teams) && teams.length > 0 ? (
        teams.map((team) => (
          <MenuItem key={team.id} value={team.id}>
            <Checkbox checked={values.team_ids.includes(team.id)} />
            <ListItemText primary={team.team_name} />
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No Teams Available</MenuItem>
      )}
    </Select>
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
                  sx={{ mt: 4, borderRadius: 2, px: 4, py: 1.2 }}
                >
                                  {isSubmitting ? "Submitting..." : "Submit"}
                                </Button>
                              </Grid>
                              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={isSubmitting}
                  size="medium" // Change size to medium
                  fullWidth
                  sx={{ mt: 4, borderRadius: 2, px: 4, py: 1.2 }}
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

export default UserEditForm;



