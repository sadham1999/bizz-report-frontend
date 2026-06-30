import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Chip,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Business from "@mui/icons-material/Business";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { HashLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";

import config from "../API/Api";
import { buttonGradient, sidebarGradient } from "../theme";

const BIZZ_COLORS = {
  dark: "#17212b",
  navy: "#1f2d39",
  blue: "#10b981",
  lightBlue: "#dbeafe",
  border: "#e2e8f0",
  bg: "#f8fafc",
  text: "#1e293b",
};

const columns = [
  { id: "user_name", label: "User Name", minWidth: 170 },
  { id: "contact_person", label: "Contact Person", minWidth: 170 },
  { id: "phone", label: "Phone", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 200 },
  { id: "address", label: "Address", minWidth: 200 },
  { id: "is_active", label: "Status", minWidth: 130 },
  { id: "role_id", label: "Role", minWidth: 130 },
  { id: "actions", label: "Actions", minWidth: 130 },
];

export default function UserList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiData, setApiData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    fetchApiData("", 0, rowsPerPage);
  }, []);

  const fetchApiData = async (
    search = searchTerm,
    currentPage = page,
    limit = rowsPerPage
  ) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${config.baseURL}getAllUsers?limit=${limit}&page=${
          currentPage + 1
        }&search=${encodeURIComponent(search)}`
      );

      if (response.ok) {
        const result = await response.json();
        setApiData(result.data || []);
        setTotalCount(result.totalItems || result.total || result.totalCount || 0);
      } else {
        console.error("Failed to fetch API data");
      }
    } catch (error) {
      console.error("Error fetching API data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchApiData(searchTerm, newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = +event.target.value;
    setRowsPerPage(newLimit);
    setPage(0);
    fetchApiData(searchTerm, 0, newLimit);
  };

  const filteredRows = apiData;

  const handleEdit = (id) => {
    navigate(`/Edit-user/${id}`);
  };

  const handleDeleteClick = (id) => {
    setUserIdToDelete(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUserIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${config.baseURL}deleteUser/${userIdToDelete}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setApiData(apiData.filter((user) => user.id !== userIdToDelete));
        toast.info("User deleted successfully");
        fetchApiData();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.info("Error deleting user:", error);
    } finally {
      handleCloseDialog();
    }
  };

  const statusLabels = {
    true: { label: "Active", color: "#16a34a" },
    false: { label: "Inactive", color: "#dc2626" },
    null: { label: "Inactive", color: "#dc2626" },
  };

  const roleLabels = {
    1: { label: "SuperAdmin", color: "#7c3aed" },
    2: { label: "Admin", color: "#059669" },
    3: { label: "User", color: "#23b3aa" },
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${config.baseURL}exportUsersExcel`, {
        method: "GET",
      });

      if (!response.ok) {
        toast.error("Failed to export users");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "UserList.xlsx";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Users exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error exporting users");
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#fff",
      "& fieldset": { borderColor: BIZZ_COLORS.border },
      "&:hover fieldset": { borderColor: BIZZ_COLORS.blue },
      "&.Mui-focused fieldset": { borderColor: BIZZ_COLORS.blue },
    },
  };

  return (
    <>
      <ToastContainer />

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HashLoader color="#23b3aa" size={90} />
        </div>
      )}

      <Box sx={{ width: "100%", minHeight: "100%", background: BIZZ_COLORS.bg }}>
        <Paper
        elevation={0}
        sx={{
        mb: 3,
        p: { xs: 1.5, md: 2 },
        borderRadius: "18px",
        backgroundImage:
          sidebarGradient,
        color: "#fff",
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.22)",
        border: "1px solid rgba(255,255,255,0.08)",
        }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.16)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PeopleAltIcon />
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    User List
                  </Typography>
                  {/* <Typography variant="body2" sx={{ color: BIZZ_COLORS.lightBlue }}>
                    Manage application users, roles and status
                  </Typography> */}
                </Box>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <Chip
                label="BIZZ REPORT"
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  height: 28,
                  "& .MuiChip-label": { px: 1.5 },
                  background: "rgba(255,255,255,0.16)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            overflow: "hidden",
            p: { xs: 2, md: 3 },
            borderRadius: "18px",
            border: `1px solid ${BIZZ_COLORS.border}`,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            background: "#fff",
          }}
        >
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item>
              <IconButton
                onClick={() => navigate("/daily-report")}
                sx={{
                  background: "#f1f5f9",
                  "&:hover": { background: "#e2e8f0" },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>

            <Grid item xs>
              <Typography variant="h6" sx={{ fontWeight: 800, color: BIZZ_COLORS.text }}>
                Users
              </Typography>
            </Grid>

            {sessionStorage.getItem("RoleId") !== "2" && (
              <>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/Add-user")}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 800,
                      color: "#ffffff",
                      backgroundImage: "none",
                      backgroundColor: "#111111",
                      "&:hover": {
                        backgroundImage: "none",
                        backgroundColor: "#000000",
                      },
                    }}
                  >
                    Add User
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExport}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 800,
                      background: "linear-gradient(90deg, #059669, #10b981)",
                    }}
                  >
                    Export
                  </Button>
                </Grid>
              </>
            )}

            <Grid item xs={12} md={3}>
              <TextField
                size="small"
                label="Search"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setPage(0);
                    fetchApiData(e.target.value, 0, rowsPerPage);
                  }
                }}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          <TableContainer
            sx={{
              maxHeight: 500,
              borderRadius: "14px",
              border: `1px solid ${BIZZ_COLORS.border}`,
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                   <TableCell
                   key={column.id}
                   align={column.align}
                   sx={{
                  minWidth: column.minWidth,
                  backgroundImage:
                    sidebarGradient,
                  fontWeight: 800,
                  color: "#fff",
                  whiteSpace: "nowrap",
               }}
                 >
  {column.label}
</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = row[column.id];

                        if (column.id === "is_active") {
                          const status = statusLabels[value];
                          return (
                            <TableCell key={column.id}>
                              <span
                                style={{
                                  backgroundColor: status?.color,
                                  padding: "5px 10px",
                                  borderRadius: 20,
                                  color: "#FFFFFF",
                                  fontWeight: "bold",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {status?.label}
                              </span>
                            </TableCell>
                          );
                        }

                        if (column.id === "role_id") {
                          const role = roleLabels[value];
                          return (
                            <TableCell key={column.id}>
                              <span
                                style={{
                                  backgroundColor: role?.color,
                                  padding: "5px 10px",
                                  borderRadius: 20,
                                  color: "#FFFFFF",
                                  fontWeight: "bold",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {role?.label || "Unknown"}
                              </span>
                            </TableCell>
                          );
                        }

                        if (column.id === "actions") {
                          return (
                            <TableCell key={column.id}>
                              {sessionStorage.getItem("RoleId") !== "2" ? (
                                <>
                                  <IconButton
                                    onClick={() => handleEdit(row.id)}
                                    sx={{ color: BIZZ_COLORS.blue }}
                                  >
                                    <EditIcon />
                                  </IconButton>

                                  <IconButton
                                    onClick={() => handleDeleteClick(row.id)}
                                    sx={{ color: "#dc2626" }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <Typography variant="body2">No Actions Allowed</Typography>
                              )}
                            </TableCell>
                          );
                        }

                        if (column.id === "address") {
                          return (
                            <TableCell key={column.id}>
                              <TextField
                                multiline
                                value={value || ""}
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                  readOnly: true,
                                  style: {
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    resize: "both",
                                    fontSize: "12px",
                                    height: "50px",
                                    width: "150px",
                                  },
                                }}
                                sx={fieldSx}
                              />
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell
                            key={column.id}
                            sx={{
                              whiteSpace: "nowrap",
                              fontSize: "0.85rem",
                            }}
                          >
                            {value || "N/A"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Pagination
            count={Math.ceil(totalCount / rowsPerPage)}
            page={page + 1}
            onChange={(event, value) => {
              const newPage = value - 1;
              setPage(newPage);
              fetchApiData(searchTerm, newPage, rowsPerPage);
            }}
            color="primary"
            sx={{
              my: 2,
              display: "flex",
              justifyContent: "center",
            }}
          />
        </Paper>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
            backgroundColor: BIZZ_COLORS.blue,              fontWeight: 800,
            }}
          >
            Confirm Delete
          </DialogTitle>

          <DialogContent sx={{ mt: 2 }}>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this user?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              size="small"
              sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700 }}
            >
              No
            </Button>

            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              size="small"
              autoFocus
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 700,
                background: "#dc2626",
                "&:hover": { background: "#b91c1c" },
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}



