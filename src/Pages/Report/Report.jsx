import React, { useState, useEffect } from 'react';
import {
  Paper, Grid, Typography, Button,
  FormControl, Select, MenuItem,
  TextField, CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from "../../API/Api";

/* ======================================================
   REPORT DEFINITIONS
====================================================== */

const REPORT_TYPES = [
  // { label: "All", value: "All" },
  { label: 'Daily Report', value: 'daily' },
  { label: 'Amendment', value: 'amendment' },
  { label: 'Cancel', value: 'amendment_cancel' },
  // { label: 'Mail Box Report', value: 'mailbox' },
  { label: 'Pending Report', value: 'pending' },
];

const COMMON_FILTERS = (teams) => [
  {
    name: 'team',
    label: 'Team',
    type: 'select',
    options: teams,
  },
  { name: 'shipment_mode', label: 'Shipment Mode', type: 'select', options: ['All', 'Air', 'Sea', 'Road'] },
  { name: 'message_type', label: 'Message Type', type: 'select', options: ['All', 'IMPORT', 'EXPORT'] },
];

const REPORT_FILTERS = {
  daily: [
    // { name: 'declarant_name', label: 'Declarant Name', type: 'select', options: ['John', 'Priya', 'Ali'] },
    // { name: 'employee_no', label: 'Employee No', type: 'text' },
    {
      name: 'shift',
      label: 'Shift',
      type: 'select',
      options: [
         { label: 'All', value: 'All' }, 
        { label: 'Day', value: '1' },
        { label: 'Evening', value: '2' },
        { label: 'Night', value: '3' },
        { label: 'Leave', value: 'L' },
      ],
    },
  ],

  amendment: [
    { name: 'permit_no', label: 'Permit Number', type: 'text' },
    { name: 'first_approve_date', label: 'First Approval Date', type: 'date' },
    // { name: 'amendment_field', label: 'Amendment Field', type: 'text' },
    // { name: 'amendment_approval', label: 'Amendment Approval', type: 'select', options: ['Yes', 'No'] },
  ],

  amendment_cancel: [
    { name: 'permit_no', label: 'Permit Number', type: 'text' },
    { name: 'first_approve_date', label: 'First Approval Date', type: 'date' },
    // { name: 'cancel_date', label: 'Cancelled Date', type: 'date' },
    // { name: 'cancel_reason', label: 'Cancelled Reason', type: 'text' },
   {
  name: 'ownership',
  label: 'Ownership',
  type: 'select',
  options: ['All', 'TNETS', 'Customer'],
},
  ],

  mailbox: [
    { name: 'mailbox', label: 'Mailbox', type: 'text' },
    { name: 'mailbox_name', label: 'Mailbox Name', type: 'select', options: ['CA', 'OGA', 'Customs'] },
    { name: 'ownership', label: 'Ownership', type: 'select', options: ['Client', 'Internal'] },
    { name: 'shift', label: 'Shift', type: 'select', options: ['1', '2', '3', 'L'] },
  ],

  pending: [
    { name: 'submission_date', label: 'Submission Date', type: 'date' },
    { name: 'lead_time', label: 'Lead Time', type: 'text' },
    { name: 'mawbd', label: 'MAWBD', type: 'text' },
    { name: 'hawbd', label: 'HAWBD', type: 'text' },
    { name: 'eta', label: 'ETA', type: 'date' },
    { name: 'etd', label: 'ETD', type: 'date' },
    { name: 'action_status', label: 'Action Status', type: 'select', options: ['Pending', 'In Progress'] },
    { name: 'mailbox_owner', label: 'Mailbox Owner', type: 'select', options: ['Team A', 'Team B'] },
  ],
};

/* ======================================================
   COMPONENT
====================================================== */

export default function ReportModule() {
const [reportType, setReportType] = useState('daily');
  const [startDate, setStartDate] = useState(moment().startOf('day'));
  const [endDate, setEndDate] = useState(moment().endOf('day'));
  const [filters, setFilters] = useState({});
  const [teams, setTeams] = useState([]);
  const [triggering, setTriggering] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    setFilters({});
  }, [reportType]);

  const activeFilters = [
    ...COMMON_FILTERS(teams),
    ...(REPORT_FILTERS[reportType] || []),
  ];

  const updateFilter = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  /* ================= SCHEDULER ================= */

  const checkSchedulerStatus = async () => {
    try {
      const token = sessionStorage.getItem("docqBot-access-token");
      const res = await fetch(`${config.baseURL}scheduler-statuss`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIsLocked(data.locked);
        setRemainingTime((data.remainingMinutes || 0) * 60);
      }
    } catch {}
  };

  useEffect(() => {
    checkSchedulerStatus();
    const interval = setInterval(checkSchedulerStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLocked || remainingTime <= 0) return;
    const timer = setInterval(() => {
      setRemainingTime(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isLocked, remainingTime]);

  const handleTriggerScheduler = async () => {
    try {
      setTriggering(true);
      const token = sessionStorage.getItem("docqBot-access-token");
      const res = await fetch(`${config.baseURL}run-leadtime-schedulers`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Scheduler triggered");
        checkSchedulerStatus();
      } else {
        toast.error("Scheduler failed");
      }
    } catch {
      toast.error("Scheduler error");
    } finally {
      setTriggering(false);
    }
  };

  /* ================= EXPORT ================= */

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append('start_date', startDate.format('YYYY-MM-DD'));
    params.append('end_date', endDate.format('YYYY-MM-DD'));

    if (filters.team && filters.team !== 'All') {
      params.append('team_ids', filters.team);
    }
    if (filters.shipment_mode && filters.shipment_mode !== 'All') {
      params.append('mode_type', filters.shipment_mode);
    }
    if (filters.message_type && filters.message_type !== 'All') {
      params.append('msg_type', filters.message_type);
    }

    // Report-specific params
    if (reportType === 'daily') {
      if (filters.mawbd) params.append('mawb_obl', filters.mawbd);
      if (filters.hawbd) params.append('hawb_hbl', filters.hawbd);
    }
    if (reportType === 'amendment') {
      if (filters.permit_no) params.append('permit_number', filters.permit_no);
      if (filters.first_approve_date) params.append('first_approval_date', moment(filters.first_approve_date).format('YYYY-MM-DD'));
    }
    if (reportType === 'amendment_cancel') {
      if (filters.permit_no) params.append('permit_number', filters.permit_no);
      if (filters.first_approve_date) params.append('first_approval_date', moment(filters.first_approve_date).format('YYYY-MM-DD'));
    }
    if (reportType === 'pending') {
      if (filters.permit_no) params.append('permit_number', filters.permit_no);
      if (filters.first_approve_date) params.append('first_approval_date', moment(filters.first_approve_date).format('YYYY-MM-DD'));
    }

    return params;
  };

 const getExportUrl = () => {
  const params = buildQueryParams();

  if (reportType === "All") {
    return `${config.baseURL}all-reports/download?${params.toString()}`;
  }

  switch (reportType) {
    case 'daily':
      return `${config.baseURL}jobs/reports/weekly-client?${params.toString()}`;
    case 'amendment':
      return `${config.baseURL}ame/download-excel?${params.toString()}`;
    case 'amendment_cancel':
      return `${config.baseURL}cnl/download-excel?${params.toString()}`;
    case 'pending':
      return `${config.baseURL}pnd/download-excel?${params.toString()}`;
    case 'mailbox':
      return `${config.baseURL}dummy/mailbox-export?${params.toString()}`;
    default:
      return '';
  }
};

  const handleExport = async () => {
    try {
      setExporting(true);
      const token = sessionStorage.getItem("docqBot-access-token");
      const url = getExportUrl();

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error("Export failed");
        return;
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get('content-disposition');
      let filename = `${reportType}_report.xlsx`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success("Export successful");
    } catch (error) {
      console.error(error);
      toast.error("Export error");
    } finally {
      setExporting(false);
    }
  };

  /* ================= RENDER FIELD ================= */

  const renderField = (field) => {
    if (field.type === 'text') {
      return (
        <TextField
          size="small"
          fullWidth
          value={filters[field.name] || ''}
          onChange={(e) => updateFilter(field.name, e.target.value)}
        />
      );
    }
if (field.type === 'select') {

  const optionsWithAll =
    field.options.includes('All')
      ? field.options
      : ['All', ...field.options];

  return (
    <FormControl fullWidth size="small">
      <Select
        value={filters[field.name] ?? 'All'}
        onChange={(e) => updateFilter(field.name, e.target.value)}
      >
        {optionsWithAll.map((opt) =>
          typeof opt === 'string' ? (
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

    if (field.type === 'date') {
      return (
        <DatePicker
          value={filters[field.name] || null}
          onChange={(d) => updateFilter(field.name, d)}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
      );
    }

    return null;
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = sessionStorage.getItem("docqBot-access-token");
        const res = await fetch(
          `${config.baseURL}/teams-dropdown`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch teams");

        const data = await res.json();

        const teamOptions = [
          { label: "All", value: "All" },
          ...data.map(team => ({
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

  /* ================= RENDER ================= */

  return (
    <>
      <ToastContainer />

      <Paper sx={{ width: '100%', p: 2, fontFamily: 'Montserrat' }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Report Module
        </Typography>

        {/* TOP BAR */}
        <Grid
          container
          spacing={1.5}
          alignItems="center"
          sx={{ flexWrap: 'nowrap', overflowX: 'auto' }}
        >
          <Grid item sx={{ flex: '0 0 18%' }}>
            <FormControl fullWidth size="small">
              <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                {REPORT_TYPES.map(r => (
                  <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

       <Grid item sx={{ flex: "0 0 13%" }}>
  <DatePicker
    label="Start Date"
    value={startDate}
    format="DD/MM/YYYY"
    maxDate={moment()}
    onChange={(d) => setStartDate(moment(d).startOf("day"))}
    slotProps={{ textField: { size: "small", fullWidth: true } }}
  />
</Grid>

<Grid item sx={{ flex: "0 0 13%" }}>
  <DatePicker
    label="End Date"
    value={endDate}
    format="DD/MM/YYYY"
    maxDate={moment()}
    onChange={(d) => setEndDate(moment(d).endOf("day"))}
    slotProps={{ textField: { size: "small", fullWidth: true } }}
  />
</Grid>

          <Grid item sx={{ flex: '0 0 12%' }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={triggering ? <CircularProgress size={18} /> : <ScheduleIcon />}
              disabled={triggering || isLocked}
              onClick={handleTriggerScheduler}
              sx={{
                height: 40,
                whiteSpace: 'nowrap',
                backgroundColor: isLocked ? '#8c8c8c' : '#01377D',
                '&:hover': { backgroundColor: isLocked ? '#8c8c8c' : '#012a5e' },
              }}
            >
              {isLocked
                ? `Locked ${Math.floor(remainingTime / 60)}m ${remainingTime % 60}s`
                : 'Run Scheduler'}
            </Button>
          </Grid>

          <Grid item sx={{ flex: '0 0 12%' }}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={exporting ? <CircularProgress size={18} /> : <FileDownloadIcon />}
              disabled={exporting}
              onClick={handleExport}
              sx={{ height: 40, whiteSpace: 'nowrap' }}
            >
              Export
            </Button>
          </Grid>
        </Grid>

        {/* ADVANCED FILTERS — ALWAYS VISIBLE */}
        <Grid
          container
          spacing={2}
          sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}
        >
          {activeFilters.map(field => (
            <Grid item xs={12} sm={6} md={3} key={field.name}>
              <Typography fontSize="0.75rem" fontWeight="bold">
                {field.label}
              </Typography>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </>
  );
}
