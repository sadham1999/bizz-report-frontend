import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography, Button,
  Grid, FormControl, Select, MenuItem, InputAdornment, TablePagination, Collapse, IconButton,
  Checkbox, ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import moment from 'moment';
import { HashLoader } from "react-spinners";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ScheduleIcon from '@mui/icons-material/Schedule'; // ⏱️ Icon for new button
import config from "../API/Api";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import TimerIcon from "@mui/icons-material/Timer";
import dayjs from "dayjs";
const BIZZ_COLORS = {
  dark: "#0f172a",
  navy: "#1e3a8a",
  blue: "#2563eb",
  lightBlue: "#dbeafe",
};


const columns = [
  { id: 'sn', label: 'S.No', minWidth: 80, align: 'center' },
  { id: 'client_code', label: 'Client Code', minWidth: 170, align: 'left' },
  { id: 'source', label: 'Source', minWidth: 170, align: 'left' },
  { id: 'created_date', label: 'Job Received Time', minWidth: 170, align: 'left' },
  { id: 'ior_eor', label: 'IOR/EOR', minWidth: 170, align: 'left' },
  { id: 'mawb_obl', label: 'OBL/MAWB', minWidth: 170, align: 'left' },
  { id: 'hawb_hbl', label: 'HBL/HAWB', minWidth: 170, align: 'left' },
  { id: 'forwarder_ref', label: 'Job Number', minWidth: 170, align: 'left' },
  { id: 'permit_approval_date', label: 'Approval Time', minWidth: 170, align: 'left' },
  { id: 'user_comment', label: 'Failure Reasons', minWidth: 170, align: 'left' },
  { id: 'urgent_shipment', label: 'Job Type', minWidth: 170, align: 'center' },
  { id: 'tis_user_name', label: 'TIS User Name', minWidth: 170, align: 'left' },
  { id: 'live_status', label: 'Live Status', minWidth: 170, align: 'center' },
  { id: 'request_type', label: 'Declaration Type', minWidth: 170, align: 'center' },
  { id: 'permit_number', label: 'Permit Number', minWidth: 170, align: 'left' },
  { id: 'lead_time_status', label: 'Lead Status', minWidth: 170, align: 'center' },
  { id: 'lead_time', label: 'Lead Time', minWidth: 170, align: 'right' },
  { id: 'tat_range', label: 'TAT Range', minWidth: 170, align: 'center' },
  { id: 'failure_ownership', label: 'Failure Ownership', minWidth: 170, align: 'left' },
  { id: 'query_sent_time', label: 'Query Sent Time', minWidth: 170, align: 'left' },
];
const liveStatusMap = {
  'Unassigned': { label: 'Unassigned', color: '#FF5733' },
  'Assigned': { label: 'Assigned', color: "#0000FF" },
  'Draft': { label: 'Draft', color: '#E88B00' },
  'Withdrawn': { label: 'Withdrawn', color: "#808000" },
  'Sent': { label: 'Sent', color: '#FF33A6' },
  'Failed': { label: 'Failed', color: '#F91F1F' },
  'Pending': { label: 'Pending', color: '#900C3F' },
  'Approved': { label: 'Approved', color: '#008000' },
  'Error': { label: 'Error', color: '#900C3F' },
  'CA Query': { label: 'CA Query', color: '#860ECC' },
  'Rejected': { label: 'Rejected', color: '#CC0E27' },
  'MARKED AS PROCESSED': { label: 'MARKED AS PROCESSED', color: '#CC0E27' },
  'APR': { label: 'Approved', color: '#008000' }
};
const requestTypeMap = {
  'DEC': { label: 'Declaration', color: '#008000' },
  'AME': { label: 'Amended', color: '#A52A2A' },
  'CNL': { label: 'Cancelled', color: '#FF0000' }
};
const urgentShipmentMap = {
  'N': { label: 'Normal', color: '#1F820F' },
  'Y': { label: 'Urgent', color: '#FF0A01' },
};
const LeadTimeStatus = {
  'Pass': { label: 'Pass', color: '#1F820F' },
  'Fail': { label: 'Fail', color: '#FF0A01' }
};

const TatRangeColors = {
  "0–1 hr": { label: "0–1 hr", color: "#00B050" },       // bright green
  "1–2 hrs": { label: "1–2 hrs", color: "#92D050" },     // lime green
  "2–4 hrs": { label: "2–4 hrs", color: "#FFC000" },     // amber
  "4–8 hrs": { label: "4–8 hrs", color: "#FF9900" },     // orange
  ">8 hrs": { label: ">8 hrs", color: "#FF0000" },        // red
  "N/A": { label: "N/A", color: "#CCCCCC" }              // gray fallback
};

export default function Delay() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobType, setJobType] = useState('All');
  const [tatStatus, setTatStatus] = useState('All');
 const [startDate, setStartDate] = useState(dayjs("2026-06-01"));
const [endDate, setEndDate] = useState(dayjs("2026-06-30"));
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openAdvancedFilters, setOpenAdvancedFilters] = useState(false);
  const [source, setSource] = useState('All');
  const [selectedClientCodes, setSelectedClientCodes] = useState([]);
  const [tatTime, setTatTime] = useState('');
  const [clientCodes, setClientCodes] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0); // in seconds



  // Fetch client codes from API
  useEffect(() => {
    const fetchClientCodes = async () => {
      try {
        const token = sessionStorage.getItem("docqBot-access-token");
        const storedTeamIds = sessionStorage.getItem("team_ids");
        const teamIds = storedTeamIds ? storedTeamIds.split(",").map(id => parseInt(id, 10)) : [];

        let url = `${config.baseURL}clientPasses`;
        if (teamIds.length > 0) {
          url += `?team_ids=${teamIds.join(",")}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });


        if (response.ok) {
          const result = await response.json();
          setClientCodes(result);
          // Default select all client codes
          setSelectedClientCodes(result.map(client => client.client_code));
          // Trigger data loaded after client codes are set
          setDataLoaded(true);
        } else {
          toast.error('Failed to fetch client codes.');
        }
      } catch (error) {
        toast.error('Error fetching client codes.');
      }
    };

    fetchClientCodes();
  }, []);

  // 🔹 Trigger backend scheduler (disabled for 2 hours after run)
  const handleTriggerScheduler = async () => {
    try {
      setTriggering(true);
      const token = sessionStorage.getItem("docqBot-access-token");
      const response = await fetch(`${config.baseURL}run-leadtime-scheduler`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || "Scheduler triggered successfully!");
        await checkSchedulerStatus();
      } else if (response.status === 429) {
        const errorData = await response.json();
        toast.warning(errorData.message || "Scheduler locked. Try again later.");

        const match = errorData.message?.match(/after (.*)$/);
        if (match) {
          const nextTime = moment(match[1], "DD-MM-YYYY HH:mm");
          const diff = nextTime.diff(moment(), "seconds");
          if (diff > 0) {
            const expiry = Date.now() + diff * 1000;
            localStorage.setItem("schedulerLockExpiry", expiry);
            setIsLocked(true);
            setRemainingTime(diff);
          }
        }
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to trigger scheduler.");
      }
    } catch (error) {
      toast.error("Error triggering scheduler.");
    } finally {
      setTriggering(false);
    }
  };

  // 🔹 Check scheduler lock status from backend
  const checkSchedulerStatus = async () => {
    try {
      const token = sessionStorage.getItem("docqBot-access-token");
      const response = await fetch(`${config.baseURL}scheduler-status`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.locked) {
          setIsLocked(true);
          setRemainingTime(data.remainingMinutes * 60);
        } else {
          setIsLocked(false);
          setRemainingTime(0);
        }
      } else {
        console.warn("Failed to fetch scheduler status");
      }
    } catch (err) {
      console.error("Error checking scheduler status:", err);
    }
  };

const fetchApiData = async () => {
  setLoading(true);

  try {
    const params = new URLSearchParams();

    params.append("page", page + 1);
    params.append("limit", rowsPerPage);
    params.append("start_date", dayjs(startDate).format("YYYY-MM-DD"));
    params.append("end_date", dayjs(endDate).format("YYYY-MM-DD"));

    const response = await fetch(
      `http://localhost:8052/api/getall?${params.toString()}`
    );

    if (!response.ok) {
      toast.error(`Error: ${response.status}`);
      return;
    }

    const result = await response.json();

    setApiData(
      result.data.map((item, index) => ({
        ...item,
        sn: page * rowsPerPage + index + 1,
        created_date: item.created_date
          ? moment(item.created_date).format("YYYY-MM-DD HH:mm:ss")
          : "N/A",
        permit_approval_date: item.permit_approval_date
          ? moment(item.permit_approval_date).format("DD/MM/YYYY HH:mm:ss")
          : "N/A",
        query_sent_time: item.query_sent_time
          ? moment(item.query_sent_time).format("YYYY-MM-DD HH:mm:ss")
          : "N/A",
        lead_time: item.lead_time || "N/A",
      }))
    );

    setTotalItems(result.totalItems || 0);
    setTotalPages(result.totalPages || 0);
  } catch (error) {
    console.error("TAT fetch error:", error);
    toast.error("Error fetching TAT data");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
  fetchApiData();
}, [page, rowsPerPage, startDate, endDate, triggerFetch]);
  const handleSearch = () => {
    setPage(0);
    setTriggerFetch(prev => prev + 1);
  };
  const handleJobTypeChange = (event) => {
    setJobType(event.target.value);
  };
  const handleTatStatusChange = (event) => {
    setTatStatus(event.target.value);
  };
  const handleSourceChange = (event) => {
    setSource(event.target.value);
  };
  const handleSelectedClientCodesChange = (event) => {
    const value = event.target.value;
    // ✅ Handle select-all toggle logic inside onChange
    if (value.includes('all')) {
      if (selectedClientCodes.length === clientCodes.length) {
        // Deselect all
        setSelectedClientCodes([]);
      } else {
        // Select all
        setSelectedClientCodes(clientCodes.map((c) => c.client_code));
      }
      return;
    }
    // Normal case
    setSelectedClientCodes(value);
  };
  const handleTatTimeChange = (event) => {
    setTatTime(event.target.value);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleExport = async () => {
  try {
    setExporting(true);

    const params = new URLSearchParams();

    if (jobType !== "All") {
      params.append("urgent_shipment", jobType === "Urgent" ? "Y" : "N");
    }

    if (tatStatus !== "All") {
      params.append("lead_time_status", tatStatus);
    }

    if (tatTime) {
      params.append("tat_time", tatTime);
    }

    params.append("start_date", startDate.format("YYYY-MM-DD"));
    params.append("end_date", endDate.format("YYYY-MM-DD"));

    if (selectedClientCodes.length > 0 && selectedClientCodes.length < clientCodes.length) {
      params.append("client_code", selectedClientCodes.join(","));
    }

    const storedTeamIds = sessionStorage.getItem("team_ids");
    const teamIds = storedTeamIds
      ? storedTeamIds.split(",").map((id) => parseInt(id, 10))
      : [];

    if (teamIds.length > 0) {
      params.append("team_ids", teamIds.join(","));
    }

    const url = `http://localhost:8052/api/jobs-export?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      toast.error(`Export failed: ${response.status}`);
      return;
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "TatReport.xlsx";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(downloadUrl);

    toast.success("Export successful!");
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Error exporting data");
  } finally {
    setExporting(false);
  }
};
  const toggleAdvancedFilters = () => {
    setOpenAdvancedFilters(!openAdvancedFilters);
  };
  const resetAdvancedFilters = () => {
    setJobType('All');
    setTatStatus('All');
    setSource('All');
    setSelectedClientCodes(clientCodes.map(client => client.client_code)); // Always full list
    setTatTime('');
  };
  const handleApplyFilters = () => {
    setPage(0);
    setTriggerFetch(prev => prev + 1);
  };


  // 🔹 Fetch scheduler status from backend every 1 minute
  useEffect(() => {
    checkSchedulerStatus();
    const interval = setInterval(checkSchedulerStatus, 60000); // poll every 1 minute
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isLocked || remainingTime <= 0) return;
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsLocked(false);
          setRemainingTime(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked, remainingTime]);



  return (
    <>
      <ToastContainer />
      {loading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <HashLoader color="#0016C6" margin={15} size={100} />
        </div>
      )}
      <Paper sx={{ width: '100%', overflow: 'hidden', padding: "20px", fontFamily: 'Montserrat' }}>
       <Paper
  elevation={0}
  sx={{
    mb: 3,
    p: { xs: 2, md: 3 },
    borderRadius: "18px",
  backgroundColor: BIZZ_COLORS.navy,    color: "#fff",
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
          <TimerIcon />
        </Box>

        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: "0.02em",
            }}
          >
            TAT Report
          </Typography>

          {/* <Typography
            variant="body2"
            sx={{
              color: BIZZ_COLORS.lightBlue,
              mt: 0.3,
            }}
          >
            Track turnaround time, lead status and export job report
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
          background: "rgba(255,255,255,0.16)",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
      />
    </Grid>
  </Grid>
</Paper>
        <Grid
          container
          spacing={1.5}
          alignItems="center"
          sx={{
            mb: 3,
            mt: 1,
            flexWrap: 'nowrap', // ✅ keeps everything in one line
            overflowX: 'auto',  // ✅ allows horizontal scroll on smaller screens
          }}
        >
          {/* 🔍 Search Field */}
          <Grid item sx={{ flex: '1 1 20%' }}>
            <TextField
              size="small"
              fullWidth
              variant="outlined"
              label="Advanced Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              inputProps={{ maxLength: 40 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { fontFamily: 'Montserrat' },
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: 'Montserrat',
                  fontWeight: 600,
                },
              }}
            />
          </Grid>

       <LocalizationProvider dateAdapter={AdapterDayjs}>

  {/* 📅 Start Date */}
  <Grid item sx={{ flex: '0 0 13%' }}>
    <DatePicker
      label="Start Date"
      value={startDate}
      disableFuture
      format="DD/MM/YYYY"
onChange={(date) => setStartDate(date)}      slotProps={{
        textField: {
          size: "small",
          fullWidth: true,
        },
      }}
    />
  </Grid>

  {/* 📅 End Date */}
  <Grid item sx={{ flex: '0 0 13%' }}>
    <DatePicker
      label="End Date"
      value={endDate}
      disableFuture
      format="DD/MM/YYYY"
onChange={(date) => setEndDate(date)}      slotProps={{
        textField: {
          size: "small",
          fullWidth: true,
        },
      }}
    />
  </Grid>

</LocalizationProvider>

          {/* ⚙️ Advanced Filters Button */}
          <Grid item sx={{ flex: '0 0 12%' }}>
            <Button
              variant="outlined"
              size="medium"
              fullWidth
              onClick={toggleAdvancedFilters}
              startIcon={openAdvancedFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{
                fontFamily: 'Montserrat',
                height: '40px',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              Advanced Filters
            </Button>
          </Grid>

          {/* ⏱️ Run Scheduler Button */}
          <Grid item sx={{ flex: '0 0 12%' }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={
                triggering ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  <ScheduleIcon />
                )
              }
              onClick={handleTriggerScheduler}
              disabled={triggering || isLocked}
              sx={{
                fontFamily: 'Montserrat',
                height: '40px',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                backgroundColor: isLocked ? '#8c8c8c' : '#01377D',
                '&:hover': { backgroundColor: isLocked ? '#8c8c8c' : '#012a5e' },
                whiteSpace: 'nowrap',
              }}
            >
              {isLocked
                ? `Locked ${Math.floor(remainingTime / 60)}m ${remainingTime % 60}s`
                : triggering
                  ? 'Running...'
                  : 'Run Scheduler'}
            </Button>
          </Grid>

          {/* 📥 Export Excel Button */}
          <Grid item sx={{ flex: '0 0 12%' }}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={
                exporting ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  <FileDownloadIcon />
                )
              }
              onClick={handleExport}
              disabled={exporting || loading}
              sx={{
                fontFamily: 'Montserrat',
                height: '40px',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                backgroundColor: '#1F820F',
                '&:hover': { backgroundColor: '#146B10' },
                whiteSpace: 'nowrap',
              }}
            >
              {exporting ? 'Exporting…' : 'Export Excel'}
            </Button>
          </Grid>
        </Grid>


        <Collapse in={openAdvancedFilters}>
          <Grid container spacing={1} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Grid item xs={12} sm={6} md={2}>
              <Typography sx={{ fontWeight: 'bold', fontFamily: 'Montserrat', fontSize: '0.75rem' }}>Job Type</Typography>
              <FormControl fullWidth size="small">
                <Select value={jobType} onChange={handleJobTypeChange} sx={{ fontFamily: 'Montserrat' }}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography sx={{ fontWeight: 'bold', fontFamily: 'Montserrat', fontSize: '0.75rem' }}>TAT Status</Typography>
              <FormControl fullWidth size="small">
                <Select value={tatStatus} onChange={handleTatStatusChange} sx={{ fontFamily: 'Montserrat' }}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Pass">Pass</MenuItem>
                  <MenuItem value="Fail">Fail</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography sx={{ fontWeight: 'bold', fontFamily: 'Montserrat', fontSize: '0.75rem' }}>Source</Typography>
              <FormControl fullWidth size="small">
                <Select value={source} onChange={handleSourceChange} sx={{ fontFamily: 'Montserrat' }}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="EDI">EDI</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography sx={{ fontWeight: 'bold', fontFamily: 'Montserrat', fontSize: '0.75rem' }}>
                Client Codes
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  multiple
                  displayEmpty
                  value={selectedClientCodes}
                  onChange={handleSelectedClientCodesChange}
                  renderValue={(selected) => {
                    if (selected.length === 0) return 'None';
                    if (selected.length === clientCodes.length) return 'All';
                    return selected.join(', ');
                  }}
                  sx={{ fontFamily: 'Montserrat' }}
                >
                  <MenuItem value="all">
                    <Checkbox
                      checked={selectedClientCodes.length === clientCodes.length}
                      indeterminate={
                        selectedClientCodes.length > 0 &&
                        selectedClientCodes.length < clientCodes.length
                      }
                    />
                    <ListItemText primary="Select All" />
                  </MenuItem>

                  {clientCodes.map((client) => (
                    <MenuItem key={client.id} value={client.client_code}>
                      <Checkbox checked={selectedClientCodes.includes(client.client_code)} />
                      <ListItemText primary={client.client_code} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography
                sx={{ fontWeight: 'bold', fontFamily: 'Montserrat', fontSize: '0.75rem' }}
              >
                TAT Time
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={tatTime}
                  onChange={handleTatTimeChange}
                  displayEmpty
                  sx={{ fontFamily: 'Montserrat' }}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="0-1">0–1 hr</MenuItem>
                  <MenuItem value="1-2">1–2 hrs</MenuItem>
                  <MenuItem value="2-3">2–3 hrs</MenuItem>
                  <MenuItem value="3-4">3–4 hrs</MenuItem>
                  <MenuItem value="4+">4+ hrs</MenuItem>
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1}>
              {/* <Button
                variant="outlined"
                onClick={resetAdvancedFilters}
                sx={{ fontFamily: 'Montserrat', height: '40px', textTransform: 'none' }}
              >
                Reset
              </Button> */}
              <Button
                variant="contained"
                onClick={handleApplyFilters}
                sx={{ fontFamily: 'Montserrat', height: '40px', textTransform: 'none' }}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </Collapse>
        {/* Table */}
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 1, mb: 1 }}>
          <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>
            Total Records: {totalItems}
          </Typography>
        </Grid>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: '#01377D',
                      fontWeight: 'bold',
                      color: "#FFFFFF",
                      fontFamily: 'Montserrat',
                      whiteSpace: "nowrap",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>                                                                                         
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={columns.length} align="center">Loading...</TableCell></TableRow>
              ) : apiData.length === 0 ? (
                <TableRow><TableCell colSpan={columns.length} align="center">No data available</TableCell></TableRow>
              ) : (
                apiData.map((row, index) => (
                  <TableRow hover key={index} >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align} 
                          style={{
                            fontFamily: 'Montserrat',
                            whiteSpace: 'nowrap',
                            padding: '8px 16px' // Enhanced padding for better design
                          }}
                        >
                          {column.id === 'sn'
                            ? value
                            : column.id === 'lead_time_status'
                              ? (
                                <span style={{
                                  backgroundColor: LeadTimeStatus[value]?.color || '#CCCCCC',
                                  padding: '4px 8px',
                                  borderRadius: 4,
                                  color: '#FFF',
                                  fontWeight: 'bold',
                                  fontSize: '0.875rem'
                                }}>
                                  {LeadTimeStatus[value]?.label || value || 'N/A'}
                                </span>
                              )

                              : column.id === 'urgent_shipment'
                                ? (
                                  <span style={{ color: urgentShipmentMap[value]?.color, fontWeight: 'bold' }}>
                                    {urgentShipmentMap[value]?.label || value}
                                  </span>
                                )
                                : column.id === 'live_status'
                                  ? (
                                    <span style={{ color: liveStatusMap[value]?.color, fontWeight: 'bold' }}>
                                      {liveStatusMap[value]?.label || value}
                                    </span>
                                  )
                                  : column.id === 'request_type'
                                    ? (
                                      <span style={{ color: requestTypeMap[value]?.color, fontWeight: 'bold' }}>
                                        {requestTypeMap[value]?.label || value}
                                      </span>
                                    )
                                    : column.id === 'lead_time_status'
                                      ? (
                                        <span style={{
                                          backgroundColor: LeadTimeStatus[value]?.color || '#CCCCCC',
                                          padding: '4px 8px', // Adjusted padding for better design
                                          borderRadius: 4,
                                          color: '#FFF',
                                          fontWeight: 'bold',
                                          fontSize: '0.875rem' // Slightly smaller font for badges
                                        }}>
                                          {LeadTimeStatus[value]?.label || value || 'N/A'}
                                        </span>
                                      )
                                      : (value ?? 'N/A')

                          }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ fontFamily: 'Montserrat' }}
        />
        {/* Summary */}

      </Paper>
    </>
  );
}