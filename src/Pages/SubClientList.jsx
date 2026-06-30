import React, { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TextField, Typography,
  IconButton, InputAdornment, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Grid, Chip,
  Divider, Pagination
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BusinessIcon from "@mui/icons-material/Business";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import config from "../API/Api";
import { sidebarGradient } from "../theme";

const BIZZ_COLORS = {
  navy: "#1f2d39",
  blue: "#10b981",
  border: "#e2e8f0",
  bg: "#f8fafc",
  text: "#1e293b",
};

const columns = [
  { id: "subclient_code", label: "Sub-Client Code", minWidth: 170 },
  { id: "subclient_name", label: "Sub-Client Name", minWidth: 170 },
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

export default function SubClientList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiData, setApiData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [subClientIdToDelete, setSubClientIdToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      const response = await fetch(`${config.baseURL}getAllSubClients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
       const data = await response.json();
console.log("SubClient API Response:", data);

const rows = Array.isArray(data)
  ? data
  : data.data || data.subclients || data.result || [];

setApiData(rows);
      } else {
        toast.error("Failed to fetch sub clients");
      }
    } catch (error) {
      toast.error("Error fetching sub clients");
    }
  };

  const filteredRows = apiData.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEdit = (id) => {
navigate(`/edit-subclient/${id}`);  
};

  const handleDeleteClick = (id) => {
    setSubClientIdToDelete(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSubClientIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${config.baseURL}deleteSubClientById/${subClientIdToDelete}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        toast.info("Sub Client deleted successfully");
        fetchApiData();
      } else {
        toast.error("Failed to delete Sub Client");
      }
    } catch (error) {
      toast.error("Error deleting Sub Client");
    } finally {
      handleCloseDialog();
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(apiData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SubClients");
    XLSX.writeFile(workbook, "SubClientList.xlsx");
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
                  <AccountTreeIcon />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Sub Client List
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
                Sub Clients
              </Typography>
            </Grid>

            {sessionStorage.getItem("RoleId") !== "2" && (
              <>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/add-subclient")}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 800,
                      backgroundImage:
                        sidebarGradient,
                    }}
                  >
                    Add Sub Client
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
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                      No sub clients found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow hover key={index}>
                        {columns.map((column) =>
                          renderTableCell(column, row[column.id], row)
                        )}
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(+event.target.value);
              setPage(0);
            }}
          />

          <Pagination
            count={Math.ceil(filteredRows.length / rowsPerPage)}
            page={page + 1}
            onChange={(event, value) => setPage(value - 1)}
            color="primary"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle
          sx={{
              backgroundImage:
                sidebarGradient,
              color: "#fff",
              fontWeight: 800,
          }}
          >
            Confirm Delete
          </DialogTitle>

          <DialogContent sx={{ mt: 2 }}>
            <DialogContentText>
              Are you sure you want to delete this Sub Client?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog} variant="outlined" size="small">
              No
            </Button>

            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              size="small"
              sx={{ backgroundColor: "#dc2626" }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}



