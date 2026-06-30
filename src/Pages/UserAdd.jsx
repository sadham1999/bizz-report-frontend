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
  Grid,
  IconButton,
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
import { TextareaAutosize } from "@mui/base";
import { toast, ToastContainer } from "react-toastify";
import man from "../assets/man.png";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import config from "../API/Api";
import { sidebarGradient } from "../theme";
import { Chip } from "@mui/material";
const UserAddForm = () => {
  const [clients, setClients] = useState([]);
  const [teams, setTeams] = useState([]); // ✅ Ensures teams starts as an empty array
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // Add state for password visibility

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    axios
      .get(`${config.baseURL}teams-dropdown`)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setTeams(response.data);
        } else {
          console.error("Invalid response format:", response.data);
          setTeams([]); // ✅ Set empty array on invalid response
        }
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        toast.error("Error fetching teams!");
        setTeams([]); // ✅ Prevent undefined issues
      });
  }, []);
  const initialValues = {
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
  };

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

    contact_person: Yup.string()
     
      .min(3, "Contact Person must be at least 3 characters")
      .max(16, "Contact Person must be at most 16 characters"),

    phone: Yup.string()
    
      .matches(/^[0-9+]+$/, "Phone must contain only numbers")
      .min(8, "Phone must be at least 8 characters")
      .max(10, "Phone must be at most 10 characters"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    address: Yup.string(),

    role_id: Yup.number().required("Role is required"),

    active: Yup.number().required("Active Status is required"),

    team_ids: Yup.array()
      .min(1, "At least one team is required")
      .required("Team selection is required"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Map selected client IDs to their respective client codes
    // const selectedClientCodes = values.client_code.map((id) => {
    //   const client = clients.find((client) => client.id === id);
    //   return client ? client.client_code : null; // Find the client code
    // });

    // Prepare the payload with client codes
    const payload = {
      ...values,
      team_ids: values.team_ids,
    };

    console.log("Payload being sent:", payload);

    axios
      .post(`${config.baseURL}createUser`, payload) // Send the modified payload
      .then((response) => {
        console.log("Response data:", response.data);
        toast.success("User created successfully!");
        resetForm();
        setTimeout(() => {
          navigate("/user");
        }, 1000);
      })
      .catch((error) => {
        console.error("Error creating user:", error);

        // Check for specific error messages from the server
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          const message = error.response.data.message;

          if (message === "Duplicate user name") {
            toast.error("Duplicate user name.");
          } else {
            // Display other server-provided error messages
            toast.error(message);
          }
        } else {
          // Handle generic errors
          toast.error("Error creating user! Please try again.");
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
    >
      {({ values, errors, touched, isSubmitting, setFieldValue }) => (
        <Container
          maxWidth="lg" // Add maxWidth
          sx={{
            maxWidth: "1200px", // Prevent content overflow
            width: "100%",
            margin: "auto",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background:
              "radial-gradient(circle at top left, rgba(44, 123, 229, 0.08), transparent 26%), linear-gradient(180deg, #f7f9fc 0%, #edf2f8 100%)",
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
                          EMP ID:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ fontFamily: "Montserrat" }}
                        >
                          {values.uen || "EMP ID"}
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
                          sx={{
                            fontFamily: "Montserrat",
                            wordBreak: "break-word",
                          }}
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
                                ? "#1f2d39"
                                : values.role_id === 2
                                ? "#2c7be5"
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
                                ? "#7c3aed"
                                : values.role_id === 2
                                ? "#14b8a6"
                                : values.role_id === 3
                                ? "#2c7be5"
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
                      Add User
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
                                //multiline
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
                                >
                                  Role
                                </InputLabel>
                                <Field
                                  name="role_id"
                                  as={Select}
                                  error={
                                    touched.role_id && Boolean(errors.role_id)
                                  }
                                  input={<OutlinedInput label="Role" />}
                                >
                                  <MenuItem value={1}>Super Admin</MenuItem>
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
                                >
                                  Active Status
                                </InputLabel>
                                <Field
                                  name="active"
                                  as={Select}
                                  error={
                                    touched.active && Boolean(errors.active)
                                  }
                                  input={
                                    <OutlinedInput label="Active Status" />
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

export default UserAddForm;



