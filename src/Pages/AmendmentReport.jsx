import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EditNoteIcon from "@mui/icons-material/EditNote";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import config from "../API/Api";

const BIZZ_COLORS = {
  dark: "#0f172a",
  navy: "#1f2d39",
  blue: "#23b3aa",
  lightBlue: "#dbeafe",
  border: "#e2e8f0",
  bg: "#f8fafc",
  text: "#1e293b",
};

const COMMON_FILTERS = (teams) => [
  {
    name: "team",
    label: "Team",
    type: "select",
    options: teams,
  },
  {
    name: "shipment_mode",
    label: "Shipment Mode",
    type: "select",
    options: ["All", "Air", "Sea", "Road"],
  },
  {
    name: "message_type",
    label: "Message Type",
    type: "select",
    options: ["All", "IMPORT", "EXPORT"],
  },
  {
    name: "permit_no",
    label: "Permit Number",
    type: "text",
  },
  {
    name: "first_approve_date",
    label: "First Approval Date",
    type: "date",
  },
];

export default function AmendmentReport() {
  const [startDate, setStartDate] = useState(moment().startOf("day"));
  const [endDate, setEndDate] = useState(moment().endOf("day"));
  const [filters, setFilters] = useState({});
  const [teams, setTeams] = useState([]);
  const [triggering, setTriggering] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const API_BASE = config.baseURL.endsWith("/")
    ? config.baseURL
    : `${config.baseURL}/`;

  const activeFilters = COMMON_FILTERS(teams);

  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const selectSx = {
    borderRadius: "10px",
    backgroundColor: "#fff",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: BIZZ_COLORS.border,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: BIZZ_COLORS.blue,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: BIZZ_COLORS.blue,
    },
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#fff",
      "& fieldset": {
        borderColor: BIZZ_COLORS.border,
      },
      "&:hover fieldset": {
        borderColor: BIZZ_COLORS.blue,
      },
      "&.Mui-focused fieldset": {
        borderColor: BIZZ_COLORS.blue,
      },
    },
  };

  const checkSchedulerStatus = async () => {
    try {
      const token = sessionStorage.getItem("docqBot-access-token");

      const res = await fetch(`${API_BASE}scheduler-statuss`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setIsLocked(data.locked);
        setRemainingTime((data.remainingMinutes || 0) * 60);
      }
    } catch (error) {
      console.error("Scheduler status error:", error);
    }
  };

  useEffect(() => {
    checkSchedulerStatus();

    const interval = setInterval(checkSchedulerStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLocked || remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, remainingTime]);

  const handleTriggerScheduler = async () => {
    try {
      setTriggering(true);

      const token = sessionStorage.getItem("docqBot-access-token");

      const res = await fetch(`${API_BASE}run-leadtime-schedulers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Scheduler triggered successfully");
        checkSchedulerStatus();
      } else {
        toast.error("Scheduler failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Scheduler error");
    } finally {
      setTriggering(false);
    }
  };

  const buildQueryParams = () => {
  const params = new URLSearchParams();

  params.append("start_date", startDate.format("YYYY-MM-DD"));
  params.append("end_date", endDate.format("YYYY-MM-DD"));

  if (filters.team && filters.team !== "All") {
    params.append("team_ids", filters.team);
  }

  if (filters.shipment_mode && filters.shipment_mode !== "All") {
    const modeMap = {
      Air: "AIR",
      Sea: "SEA",
      Road: "ROAD",
    };

    params.append("mode_type", modeMap[filters.shipment_mode] || filters.shipment_mode);
  }

  if (filters.message_type && filters.message_type !== "All") {
    params.append("msg_type", filters.message_type);
  }

  if (filters.permit_no) {
    params.append("permit_number", filters.permit_no);
  }

  if (filters.first_approve_date) {
    params.append(
      "first_approval_date",
      moment(filters.first_approve_date).format("YYYY-MM-DD")
    );
  }

  return params;
};

 const handleExport = async () => {
  try {
    setExporting(true);

    const params = buildQueryParams();

    const url = `http://localhost:8052/api/ame/download-excel?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
    });

    if (!res.ok) {
      toast.error(`Export failed: ${res.status}`);
      return;
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "AmendmentReport.xlsx";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(downloadUrl);

    toast.success("Export successful");
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Export error");
  } finally {
    setExporting(false);
  }
};

  const renderField = (field) => {
    if (field.type === "text") {
      return (
        <TextField
          size="small"
          fullWidth
          value={filters[field.name] || ""}
          onChange={(e) => updateFilter(field.name, e.target.value)}
          sx={textFieldSx}
        />
      );
    }

    if (field.type === "select") {
      const hasAll = field.options.some((opt) =>
        typeof opt === "string" ? opt === "All" : opt.value === "All"
      );

      const optionsWithAll = hasAll
        ? field.options
        : ["All", ...field.options];

      return (
        <FormControl fullWidth size="small">
          <Select
            value={filters[field.name] ?? "All"}
            onChange={(e) => updateFilter(field.name, e.target.value)}
            sx={selectSx}
          >
            {optionsWithAll.map((opt) =>
              typeof opt === "string" ? (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ) : (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      );
    }

    if (field.type === "date") {
      return (
        <DatePicker
          value={filters[field.name] || null}
          format="DD/MM/YYYY"
          maxDate={moment()}
          onChange={(d) => updateFilter(field.name, d)}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              sx: textFieldSx,
            },
          }}
        />
      );
    }

    return null;
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = sessionStorage.getItem("docqBot-access-token");

        const res = await fetch(`${API_BASE}teams-dropdown`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch teams");
        }

        const data = await res.json();

        const teamOptions = [
          { label: "All", value: "All" },
          ...data.map((team) => ({
            label: team.team_name,
            value: team.id,
          })),
        ];

        setTeams(teamOptions);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load teams");
      }
    };

    fetchTeams();
  }, []);

  return (
    <>
      <ToastContainer />

      <Box
        sx={{
          width: "100%",
          minHeight: "100%",
          background: BIZZ_COLORS.bg,
        }}
      >
        {/* Header Card */}
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
                  <EditNoteIcon />
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: "0.02em",
                    }}
                  >
                    Amendment Report
                  </Typography>

                  {/* <Typography
                    variant="body2"
                    sx={{
                      color: BIZZ_COLORS.lightBlue,
                      mt: 0.3,
                    }}
                  >
                    Generate and export amendment job tracker report
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

        {/* Filter / Action Card */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            p: { xs: 2, md: 3 },
            borderRadius: "18px",
            border: `1px solid ${BIZZ_COLORS.border}`,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            background: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterAltIcon sx={{ color: BIZZ_COLORS.blue }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: BIZZ_COLORS.text,
                }}
              >
                Report Filters
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              Select filters and export the amendment report
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Date and Buttons */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Typography fontSize="0.78rem" fontWeight={700} color="#475569" mb={0.7}>
                Start Date
              </Typography>

              <DatePicker
                value={startDate}
                format="DD/MM/YYYY"
                maxDate={moment()}
                onChange={(d) => setStartDate(moment(d).startOf("day"))}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: textFieldSx,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography fontSize="0.78rem" fontWeight={700} color="#475569" mb={0.7}>
                End Date
              </Typography>

              <DatePicker
                value={endDate}
                format="DD/MM/YYYY"
                maxDate={moment()}
                onChange={(d) => setEndDate(moment(d).endOf("day"))}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: textFieldSx,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography fontSize="0.78rem" fontWeight={700} color="transparent" mb={0.7}>
                Run
              </Typography>

              <Button
                fullWidth
                variant="contained"
                startIcon={
                  triggering ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <ScheduleIcon />
                  )
                }
                disabled={triggering || isLocked}
                onClick={handleTriggerScheduler}
                sx={{
                  height: 40,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  backgroundImage:
                    "linear-gradient(180deg, rgba(13, 19, 24, 0.98) 0%, rgba(20, 28, 35, 0.98) 52%, rgba(28, 38, 47, 0.98) 100%)",
                  boxShadow: "0 6px 14px rgba(37, 99, 235, 0.25)",
                  "&:hover": {
                    background: isLocked
                      ? "#94a3b8"
                      : `linear-gradient(90deg, ${BIZZ_COLORS.navy}, ${BIZZ_COLORS.blue})`,
                  },
                }}
              >
                {isLocked
                  ? `Locked ${Math.floor(remainingTime / 60)}m ${remainingTime % 60}s`
                  : "Run Scheduler"}
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography fontSize="0.78rem" fontWeight={700} color="transparent" mb={0.7}>
                Export
              </Typography>

              <Button
                fullWidth
                variant="contained"
                startIcon={
                  exporting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <FileDownloadIcon />
                  )
                }
                disabled={exporting}
                onClick={handleExport}
                sx={{
                  height: 40,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  background: "linear-gradient(90deg, #059669, #10b981)",
                  boxShadow: "0 6px 14px rgba(16, 185, 129, 0.25)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #047857, #059669)",
                  },
                }}
              >
                Export
              </Button>
            </Grid>
          </Grid>

          {/* Advanced Filters */}
          <Box
            sx={{
              mt: 3,
              p: { xs: 2, md: 2.5 },
              borderRadius: "16px",
              background: "#f8fafc",
              border: `1px solid ${BIZZ_COLORS.border}`,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                color: BIZZ_COLORS.text,
                mb: 2,
              }}
            >
              Advanced Filters
            </Typography>

            <Grid container spacing={2}>
              {activeFilters.map((field) => (
                <Grid item xs={12} sm={6} md={3} key={field.name}>
                  <Typography fontSize="0.78rem" fontWeight={700} color="#475569" mb={0.7}>
                    {field.label}
                  </Typography>

                  {renderField(field)}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
