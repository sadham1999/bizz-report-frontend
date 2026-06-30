import React, { useState, useEffect, useRef } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TextField, Typography, IconButton,
  InputAdornment, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Pagination, Grid, Chip, Divider,
  CircularProgress
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BadgeIcon from "@mui/icons-material/Badge";

import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ClimbingBoxLoader } from "react-spinners";
import config from "../API/Api";
import { buttonGradient, sidebarGradient } from "../theme";

const BIZZ_COLORS = {
  navy: "#1f2d39",
  blue: "#10b981",
  border: "#e2e8f0",
  bg: "#f8fafc",
  text: "#1e293b",
};

const columns = [
  { id: "sno", label: "S.No", minWidth: 70 },
  { id: "emp_code", label: "Employee Code", minWidth: 150 },
  { id: "declarant_name", label: "Declarant Name", minWidth: 220 },
  { id: "is_active", label: "Status", minWidth: 120 },
  { id: "actions", label: "Actions", minWidth: 150 },
];

const statusLabels = {
  1: { label: "Active", color: "#16a34a" },
  2: { label: "Inactive", color: "#dc2626" },
};

const EmployeeMaster = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiData, setApiData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [empCode, setEmpCode] = useState("");
  const [declarantName, setDeclarantName] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
const [totalPages, setTotalPages] = useState(0);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async (search = "", pageNo = 0, limit = rowsPerPage) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${config.baseURL}employee?search=${search}&page=${pageNo + 1}&limit=${limit}`
      );

      if (response.ok) {
        const data = await response.json();
setApiData(data.data || []);
setTotalCount(data.totalItems || 0);
setTotalPages(data.totalPages || 0);      } else {
        toast.error("Failed to fetch employees");
      }
    } catch (error) {
      toast.error("Error fetching employees");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchApiData(searchTerm, newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const limit = +event.target.value;
    setRowsPerPage(limit);
    setPage(0);
    fetchApiData(searchTerm, 0, limit);
  };

  const filteredRows = apiData || [];

  const handleEdit = (row) => {
    setEditEmployeeId(row.id);
    setEmpCode(row.emp_code);
    setDeclarantName(row.declarant_name);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (id) => {
    setEmployeeIdToDelete(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEmployeeIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${config.baseURL}employee/${employeeIdToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Employee deleted successfully");
        fetchApiData();
      } else {
        toast.error("Failed to delete employee");
      }
    } catch (error) {
      toast.error("Error deleting employee");
    } finally {
      handleCloseDialog();
    }
  };

  const handleOpenModal = () => {
    setEmpCode("");
    setDeclarantName("");
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setEmpCode("");
    setDeclarantName("");
  };

  const handleAddEmployee = async () => {
    try {
      const response = await fetch(`${config.baseURL}employee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emp_code: empCode, declarant_name: declarantName, shift: "Morning" }),
      });

      if (response.ok) {
        toast.success("Employee added successfully");
        setOpenAddModal(false);
        setEmpCode("");
        setDeclarantName("");
        fetchApiData();
      }
    } catch (error) {
      toast.error("Error adding employee");
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      const response = await fetch(`${config.baseURL}employee/${editEmployeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emp_code: empCode, declarant_name: declarantName, shift: "Morning" }),
      });

      if (response.ok) {
        toast.success("Employee updated successfully");
        setOpenEditModal(false);
        setEmpCode("");
        setDeclarantName("");
        setEditEmployeeId(null);
        fetchApiData();
      } else {
        toast.error("Failed to update employee");
      }
    } catch (error) {
      toast.error("Error updating employee");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    event.target.value = null;

    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      toast.error("Invalid file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadLoading(true);

      const response = await fetch(`${config.baseURL}employee/bulk-upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Upload successful");
        fetchApiData();
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Upload error");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setDownloadLoading(true);

      const response = await fetch(`${config.baseURL}employee/download`);

      if (!response.ok) throw new Error();

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "employees.xlsx";
      a.click();

      window.URL.revokeObjectURL(url);
      toast.success("Excel downloaded");
    } catch (error) {
      toast.error("Download failed");
    } finally {
      setDownloadLoading(false);
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

  const renderTableCell = (column, value, row, index) => {
    if (column.id === "sno") {
      return <TableCell key={column.id}>{index + 1 + page * rowsPerPage}</TableCell>;
    }

    if (column.id === "is_active") {
      const status = statusLabels[value] || { label: "Unknown", color: "#64748b" };

      return (
        <TableCell key={column.id}>
          <span
            style={{
              backgroundColor: status.color,
              padding: "5px 10px",
              borderRadius: 20,
              color: "#fff",
              fontWeight: "bold",
              fontSize: "0.75rem",
            }}
          >
            {status.label}
          </span>
        </TableCell>
      );
    }

    if (column.id === "actions") {
      return (
        <TableCell key={column.id}>
          {sessionStorage.getItem("RoleId") !== "2" ? (
            <>
              <IconButton onClick={() => handleEdit(row)} sx={{ color: BIZZ_COLORS.blue }}>
                <EditIcon />
              </IconButton>

              <IconButton onClick={() => handleDeleteClick(row.id)} sx={{ color: "#dc2626" }}>
                <DeleteIcon />
              </IconButton>
            </>
          ) : (
            <Typography variant="body2">No Actions Allowed</Typography>
          )}
        </TableCell>
      );
    }

    return <TableCell key={column.id}>{value || "N/A"}</TableCell>;
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
          <ClimbingBoxLoader color="#23b3aa" size={20} />
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
                  <BadgeIcon />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Employee Master
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
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
      sx={{ background: "#f1f5f9", "&:hover": { background: "#e2e8f0" } }}
    >
      <ArrowBackIcon />
    </IconButton>
  </Grid>

  <Grid item xs>
    <Typography variant="h6" sx={{ fontWeight: 800, color: BIZZ_COLORS.text }}>
      Employees
    </Typography>
  </Grid>

  <Grid item>
    <Button
      variant="contained"
      onClick={handleOpenModal}
      sx={{
        height: 40,
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
      Add Employee
    </Button>
  </Grid>

  <Grid item>
    <Button
      variant="contained"
      onClick={handleUploadClick}
      disabled={uploadLoading}
      startIcon={
        uploadLoading ? (
          <CircularProgress size={18} sx={{ color: "#fff" }} />
        ) : (
          <UploadFileIcon />
        )
      }
      sx={{
        height: 40,
        borderRadius: "10px",
        textTransform: "none",
        fontWeight: 800,
        backgroundImage: buttonGradient,
      }}
    >
      {uploadLoading ? "Uploading..." : "Upload Excel"}
    </Button>

    <input
      type="file"
      accept=".xlsx,.xls"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: "none" }}
    />
  </Grid>

  <Grid item>
    <Button
      variant="contained"
      onClick={handleDownloadExcel}
      disabled={downloadLoading}
      startIcon={
        downloadLoading ? (
          <CircularProgress size={18} sx={{ color: "#fff" }} />
        ) : (
          <DownloadIcon />
        )
      }
      sx={{
        height: 40,
        borderRadius: "10px",
        textTransform: "none",
        fontWeight: 800,
        backgroundColor: "#059669",
      }}
    >
      {downloadLoading ? "Exporting..." : "Export Excel"}
    </Button>
  </Grid>

  <Grid item xs={12} md={3}>
    <TextField
      size="small"
      label="Search"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setPage(0);
          fetchApiData(searchTerm, 0, rowsPerPage);
        }
      }}
      sx={fieldSx}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PersonIcon />
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
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        minWidth: column.minWidth,
                        backgroundImage:
                          sidebarGradient,
                        color: "#fff",
                        fontWeight: 800,
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
                    <TableCell colSpan={columns.length} align="center" sx={{ fontWeight: 800 }}>
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row, index) => (
                    <TableRow hover key={row.id || index}>
                      {columns.map((column) => renderTableCell(column, row[column.id], row, index))}
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
            count={totalPages}            
            page={page + 1}
            onChange={(event, value) => {
              setPage(value - 1);
              fetchApiData(searchTerm, value - 1, rowsPerPage);
            }}
            color="primary"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
               </Paper>

        <Dialog
          open={openAddModal}
          onClose={handleCloseAddModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Employee</DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Employee Code"
              value={empCode}
              onChange={(e) => setEmpCode(e.target.value)}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Declarant Name"
              value={declarantName}
              onChange={(e) => setDeclarantName(e.target.value)}
              margin="normal"
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseAddModal}>Cancel</Button>

            <Button variant="contained" onClick={handleAddEmployee}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
  open={openEditModal}
  onClose={() => setOpenEditModal(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Edit Employee</DialogTitle>

  <DialogContent>
    <TextField
      fullWidth
      label="Employee Code"
      value={empCode}
      onChange={(e) => setEmpCode(e.target.value)}
      margin="normal"
    />

    <TextField
      fullWidth
      label="Declarant Name"
      value={declarantName}
      onChange={(e) => setDeclarantName(e.target.value)}
      margin="normal"
    />
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenEditModal(false)}>
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleUpdateEmployee}
    >
      Update
    </Button>
  </DialogActions>
</Dialog>

      </Box>
    </>
  );
};

export default EmployeeMaster;



