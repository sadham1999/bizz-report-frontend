import React, { useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TextField,
  Typography, IconButton, InputAdornment, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Business from '@mui/icons-material/Business';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { HashLoader } from "react-spinners";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import config from "../API/Api";

const columns = [
  { id: 'client_code', label: 'Client Code', minWidth: 170 },
  { id: 'source', label: 'Source', minWidth: 170 },
  { id: 'created_date', label: 'Job In Time', minWidth: 170 },
  { id: 'mawb_obl', label: 'OBL/MAWB', minWidth: 170 },
  { id: 'hawb_hbl', label: 'HBL/HAWB', minWidth: 170 },
  { id: 'forwarder_ref', label: 'Job Number', minWidth: 170 },
  { id: 'permit_approval_date', label: 'Approval Time', minWidth: 170 },
  { id: 'user_comment', label: 'User Comment', minWidth: 170 },
  { id: 'urgent_shipment', label: 'Job Type', minWidth: 170 },
  { id: 'tis_user_name', label: 'TIS User Name', minWidth: 170 },
  { id: 'live_status', label: 'Live Status', minWidth: 170 },
  { id: 'request_type', label: 'Declaration Type', minWidth: 170 },
   { id: 'permit_number', label: 'permit Number', minWidth: 170 },
];

const statusLabels = {
  'OT': { label: 'On-Time', color: '#1F820F' },
  'DLY': { label: 'Delay', color: '#FF7F2A' },
  'RSK': { label: 'Risk', color: '#FF7F2A' },
  'CRT': { label: 'Critical', color: '#FF0A01' },
};

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

const statusLab = {
  'SENT': { label: 'SENT', color: '#1F820F' },
  'IN-HAND': { label: 'IN-HAND', color: '#4D9AFF' },
  'NEW': { label: 'NEW', color: '#FF7F2A' }
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

export default function Delay() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchApiData = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please provide a search value (Job No, MAWB/OBL, or HAWB/HBL or permitnumber)');
      return;
    }

    const token = sessionStorage.getItem("docqBot-access-token");

    try {
      setLoading(true);
      const response = await fetch(`${config.baseURL}job-master/search?search=${encodeURIComponent(searchTerm.trim())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        if (data.length === 0) {
          toast.info('No data found for the provided search criteria');
        }
        setApiData(data.map(item => ({
          ...item,
          created_date: moment(item.created_date).format('YYYY-MM-DD HH:mm:ss'),
          modified_date: moment(item.modified_date).format('YYYY-MM-DD hh:mm:ss A'),
          permit_approval_date: item.permit_approval_date
            ? moment(item.permit_approval_date).format('DD/MM/YYYY : HH:mm:ss')
            : 'N/A',
          job_status: item.job_status ?? 'Unknown',
          status: item.status ?? 'Unknown'
        })));
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch API data:', response.statusText, errorData);
        toast.error(`Error: ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching API data:', error.message);
      toast.error('Error fetching job data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchApiData();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredRows = apiData;

  const handleExport = () => {
    const exportData = filteredRows.map(item => {
      const {
        created_date, modified_date, active, client_id, document_path,
        created_by, modified_by, job_status, urgent_shipment, live_status,
        delay_status, travel_time, Client, ...rest
      } = item;

      const jobStatusLabel = {
        'CRT': 'Critical',
        'OT': 'On-Time',
        'RSK': 'Risk',
        'DLY': 'Delay',
      }[item.job_status] || item.job_status;

      const liveStatusLabel = {
        'NEW': 'New',
        'In hand': 'In hand',
        'HLD': 'In hand',
        'WDN': 'Withdrawn',
        'RDY': 'Send Pending Submission',
        'TRN': 'Send Pending Submission',
        'OUT': 'OutBox',
        'FAL': 'Failed',
        'PND': 'Pending',
        'APR': 'Approved',
        'ERR': 'Error',
        'QRY': 'CA Query',
        'REJ': 'Rejected'
      }[item.live_status] || item.live_status;

      return {
        ...rest,
        created_date,
        modified_date: item.live_status === 'APR' ? modified_date : '_',
        job_status: jobStatusLabel,
        live_status: liveStatusLabel,
      };
    });

    if (exportData.length === 0) {
      toast.error('No data to export based on current filters.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Data');
    XLSX.writeFile(workbook, 'FilteredData.xlsx');

    toast.success('Export successful!');
  };

  return (
    <>
      <ToastContainer />
      {loading && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{ position: 'absolute' }}>
            <HashLoader color="#23b3aa" margin={15} size={100} />
          </div>
        </div>
      )}
      <Paper sx={{ width: '100%', overflow: 'hidden', padding: "20px", fontFamily: 'Montserrat' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/dashboard')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="h2"
              style={{ marginLeft: '10px', fontWeight: 'bold', fontFamily: 'Montserrat' }}
            >
              Global Search
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              size='small'
              label="Search (Job No, OBL/MAWB, HBL/HAWB, permit number)"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ margin: '0 5px', width: '300px' }}
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
                sx: { fontFamily: 'Montserrat' },
              }}
              InputLabelProps={{
                sx: { fontWeight: 'bold', fontFamily: 'Montserrat', fontSize: '0.8rem' },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              style={{ margin: '0 5px', fontFamily: 'Montserrat', padding: '6px 12px' }}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<FileDownloadIcon />}
              onClick={handleExport}
              style={{ margin: '0 5px', fontFamily: 'Montserrat', padding: '6px 12px' }}
            >
              Export
            </Button>
          </div>
        </div>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, backgroundImage: 'linear-gradient(180deg, rgba(13, 19, 24, 0.98) 0%, rgba(20, 28, 35, 0.98) 52%, rgba(28, 38, 47, 0.98) 100%)', fontWeight: 'bold', color: "#FFFFFF", fontFamily: 'Segoe UI, Inter, system-ui, sans-serif' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} style={{ textAlign: 'center' }}>Loading...</TableCell>
                </TableRow>
              ) : filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} style={{ textAlign: 'center' }}>No data available</TableCell>
                </TableRow>
              ) : (
                filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = column.id === 'client_code' ? row.client_code : row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={{ fontFamily: 'Montserrat', whiteSpace: 'nowrap' }}>
                            {column.id === 'job_status' ? (
                              <span style={{ backgroundColor: statusLabels[value]?.color || '#CCCCCC', padding: 5, borderRadius: 5, color: '#FFFFFF', fontWeight: 'bold', fontFamily: 'Montserrat' }}>
                                {statusLabels[value]?.label || 'Unknown'}
                              </span>
                            ) : column.id === 'status' ? (
                              <span style={{ backgroundColor: statusLab[value]?.color || '#CCCCCC', padding: 5, borderRadius: 5, color: '#FFFFFF', fontWeight: 'bold', fontFamily: 'Montserrat' }}>
                                {statusLab[value]?.label || 'Unknown'}
                              </span>
                            ) : column.id === 'live_status' ? (
                              <span style={{ color: liveStatusMap[value]?.color || '#CCCCCC', fontWeight: 'bold', fontFamily: 'Montserrat', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                {liveStatusMap[value]?.label || 'Unknown'}
                              </span>
                            ) : column.id === 'request_type' ? (
                              <span style={{ color: requestTypeMap[value]?.color || '#000000', fontWeight: 'bold', fontFamily: 'Montserrat' }}>
                                {requestTypeMap[value]?.label || value || 'N/A'}
                              </span>
                            ) : column.id === 'modified_date' ? (
                              <span style={{ color: row.live_status === 'APR' ? 'green' : 'inherit' }}>
                                {row.live_status === 'APR' ? value : '_'}
                              </span>
                            ) : column.id === 'urgent_shipment' ? (
                              <span style={{ color: urgentShipmentMap[value]?.color || '#000000', fontWeight: 'bold', fontFamily: 'Montserrat' }}>
                                {urgentShipmentMap[value]?.label || value}
                              </span>
                            ) : (
                              column.format && typeof value === 'number'
                                ? column.format(value)
                                : (value ?? 'N/A')
                            )}
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
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ fontFamily: 'Montserrat' }}
        />
      </Paper>
    </>
  );
}
