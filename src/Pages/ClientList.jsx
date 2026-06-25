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
  Pagination,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BusinessIcon from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";

import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { HashLoader } from "react-spinners";
import config from "../API/Api";

const BIZZ_COLORS = {
  navy: "#1e3a8a",
  blue: "#2563eb",
  border: "#e2e8f0",
  bg: "#f8fafc",
  text: "#1e293b",
};

const columns = [
  { id: "client_code", label: "Client Code", minWidth: 170 },
  { id: "client_name", label: "Client Name", minWidth: 170 },
  { id: "contact_person", label: "Contact Person", minWidth: 170 },
  { id: "phone", label: "Phone", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 200 },
  { id: "address", label: "Address", minWidth: 200 },
  { id: "is_active", label: "Status", minWidth: 130 },
  { id: "actions", label: "Actions", minWidth: 130 },
];

const statusLabels = {
  true: { label: "Active", color: "#16a34a" },
  false: { label: "Inactive", color: "#dc2626" },
  null: { label: "Inactive", color: "#dc2626" },
};

const ClientList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiData, setApiData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async (
    search = searchTerm,
    currentPage = page,
    limit = rowsPerPage
  ) => {
    setLoading(true);

    try {
      const url = `${config.baseURL}getAllClients?search=${encodeURIComponent(
        search
      )}&limit=${limit}&page=${currentPage + 1}`;

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setApiData(data.data || []);
        setTotalCount(data.totalItems || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        toast.error("Failed to fetch client data");
      }
    } catch (error) {
      toast.error("Error fetching client data");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = +event.target.value;
    setRowsPerPage(newLimit);
    setPage(0);
    fetchApiData(searchTerm, 0, newLimit);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchApiData(searchTerm, newPage, rowsPerPage);
  };

  const handleEdit = (id) => {
navigate(`/edit-client/${id}`);  };

  const handleDeleteClick = (id) => {
    setClientIdToDelete(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setClientIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${config.baseURL}deleteClient/${clientIdToDelete}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setApiData(apiData.filter((client) => client.id !== clientIdToDelete));
        toast.info("Client deleted successfully");
        fetchApiData();
      } else {
        toast.error("Failed to delete client");
      }
    } catch (error) {
      toast.error("Error deleting client");
    } finally {
      handleCloseDialog();
    }
  };

 const handleExport = async () => {
  try {
    const response = await fetch(
      `${config.baseURL}exportClientsExcel`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      toast.error("Failed to export Excel");
      return;
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `ClientList_${new Date()
      .toISOString()
      .split("T")[0]}.xlsx`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

    toast.success("Excel downloaded successfully");
  } catch (error) {
    console.error("Export Error:", error);
    toast.error("Error downloading Excel");
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

  const renderTableCell = (column, value, row) => {
    if (column.id === "is_active") {
      const status = statusLabels[value];

      return (
        <TableCell key={column.id}>
          <span
            style={{
              backgroundColor: status?.color || "#dc2626",
              padding: "5px 10px",
              borderRadius: 20,
              color: "#fff",
              fontWeight: "bold",
              fontSize: "0.75rem",
            }}
          >
            {status?.label || "Inactive"}
          </span>
        </TableCell>
      );
    }

    if (column.id === "actions") {
      return (
        <TableCell key={column.id}>
          {sessionStorage.getItem("RoleId") !== "2" ? (
            <>
              <IconButton onClick={() => handleEdit(row.id)} sx={{ color: BIZZ_COLORS.blue }}>
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
      <TableCell key={column.id} sx={{ whiteSpace: "nowrap", fontSize: "0.85rem" }}>
        {value || "N/A"}
      </TableCell>
    );
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
          <HashLoader color="#2563eb" size={90} />
        </div>
      )}

      <Box sx={{ width: "100%", minHeight: "100%", background: BIZZ_COLORS.bg }}>
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: { xs: 2, md: 3 },
            borderRadius: "18px",
            backgroundColor: BIZZ_COLORS.navy,
            color: "#fff",
            boxShadow: "0 10px 28px rgba(15, 23, 42, 0.22)",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "14px",
                    background: "rgba(255,255,255,0.16)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <GroupsIcon />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Client List
                </Typography>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}
            >
              <Chip
                label="BIZZ REPORT"
                sx={{
                  color: "#fff",
                  fontWeight: 700,
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
                Clients
              </Typography>
            </Grid>

            {sessionStorage.getItem("RoleId") !== "2" && (
              <>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/add-client")}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 800,
                      backgroundColor: BIZZ_COLORS.navy,
                    }}
                  >
                    Add Client
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
                      backgroundColor: "#059669",
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                      <BusinessIcon />
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
                        backgroundColor: BIZZ_COLORS.navy,
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
                {apiData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ fontWeight: 800 }}>
                      No clients found
                    </TableCell>
                  </TableRow>
                ) : (
                  apiData.map((row, index) => (
                    <TableRow hover key={index}>
                      {columns.map((column) => renderTableCell(column, row[column.id], row))}
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
              const newPage = value - 1;
              setPage(newPage);
              fetchApiData(searchTerm, newPage, rowsPerPage);
            }}
            color="primary"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle
            sx={{
              backgroundColor: BIZZ_COLORS.navy,
              color: "#fff",
              fontWeight: 800,
            }}
          >
            Confirm Delete
          </DialogTitle>

          <DialogContent sx={{ mt: 2 }}>
            <DialogContentText>
              Are you sure you want to delete this client?
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
                backgroundColor: "#dc2626",
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default ClientList;