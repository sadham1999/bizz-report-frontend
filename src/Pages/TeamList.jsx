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
import Business from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";

import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import { ClimbingBoxLoader } from "react-spinners";
import config from "../API/Api";

const BIZZ_COLORS = {
  navy: "#1f2d39",
  blue: "#23b3aa",
  border: "#e2e8f0",
  bg: "#f8fafc",
  text: "#1e293b",
};

const columns = [
  { id: "sno", label: "S.No", minWidth: 70 },
  { id: "team_name", label: "Team Name", minWidth: 200 },
  { id: "is_active", label: "Status", minWidth: 120 },
  { id: "actions", label: "Actions", minWidth: 150 },
];

const statusLabels = {
  true: { label: "Active", color: "#16a34a" },
  false: { label: "Inactive", color: "#dc2626" },
};

const TeamList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiData, setApiData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
      const url = `${config.baseURL}teams?page=${
        currentPage + 1
      }&limit=${limit}&search=${encodeURIComponent(search)}`;

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();

        setApiData(data.data || []);
        setTotalCount(data.totalItems || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        toast.error("Failed to fetch team data");
      }
    } catch (error) {
      toast.error("Error fetching team data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
   navigate(`/edit-team/${id}`);
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
      const response = await fetch(`${config.baseURL}teams/${userIdToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.info("Team deleted successfully");
        fetchApiData();
      } else {
        toast.error("Failed to delete team");
      }
    } catch (error) {
      toast.error("Error deleting team");
    } finally {
      handleCloseDialog();
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(apiData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Teams");
    XLSX.writeFile(workbook, "TeamList.xlsx");
  };

  const handleOpenModal = () => navigate("/add-team");

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
      return (
        <TableCell key={column.id}>{index + 1 + page * rowsPerPage}</TableCell>
      );
    }

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

    return (
      <TableCell key={column.id} sx={{ whiteSpace: "nowrap" }}>
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
              "linear-gradient(180deg, rgba(13, 19, 24, 0.98) 0%, rgba(20, 28, 35, 0.98) 52%, rgba(28, 38, 47, 0.98) 100%)",
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
                  <GroupsIcon />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Team List
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
                Teams
              </Typography>
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenModal}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 800,
                  backgroundImage:
                    "linear-gradient(180deg, rgba(13, 19, 24, 0.98) 0%, rgba(20, 28, 35, 0.98) 52%, rgba(28, 38, 47, 0.98) 100%)",
                }}
              >
                Create Team
              </Button>
            </Grid>

            <Grid item>
              <Button
                variant="contained"
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
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        minWidth: column.minWidth,
                        backgroundImage:
                          "linear-gradient(180deg, rgba(13, 19, 24, 0.98) 0%, rgba(20, 28, 35, 0.98) 52%, rgba(28, 38, 47, 0.98) 100%)",
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
                {apiData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ fontWeight: 800 }}>
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  apiData.map((row, index) => (
                    <TableRow hover key={row.id}>
                      {columns.map((column) =>
                        renderTableCell(column, row[column.id], row, index)
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
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => {
              setPage(newPage);
              fetchApiData(searchTerm, newPage, rowsPerPage);
            }}
            onRowsPerPageChange={(event) => {
              const newLimit = +event.target.value;
              setRowsPerPage(newLimit);
              setPage(0);
              fetchApiData(searchTerm, 0, newLimit);
            }}
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
              backgroundImage:
                "linear-gradient(180deg, rgba(13, 19, 24, 0.98) 0%, rgba(20, 28, 35, 0.98) 52%, rgba(28, 38, 47, 0.98) 100%)",
              color: "#fff",
              fontWeight: 800,
            }}
          >
            Confirm Delete
          </DialogTitle>

          <DialogContent sx={{ mt: 2 }}>
            <DialogContentText>
              Are you sure you want to delete this team?
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

export default TeamList;
