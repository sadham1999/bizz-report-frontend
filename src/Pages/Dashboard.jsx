import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { appColors } from "../theme";

const dashboardCards = [
  {
    title: "TAT Report",
    count: 145,
    color: appColors.navy,
    icon: <AccessTimeIcon />,
  },
  {
    title: "Daily Report",
    count: 89,
    color: appColors.tealDeep,
    icon: <DescriptionIcon />,
  },
  {
    title: "Weekly Report",
    count: 42,
    color: appColors.teal,
    icon: <CalendarMonthIcon />,
  },
  {
    title: "Amendment Report",
    count: 12,
    color: appColors.warning,
    icon: <EditNoteIcon />,
  },
  {
    title: "Cancel Report",
    count: 5,
    color: appColors.danger,
    icon: <CancelIcon />,
  },
  {
    title: "Pending Report",
    count: 21,
    color: appColors.navySoft,
    icon: <PendingActionsIcon />,
  },
];

function Dashboard() {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        background:
          "radial-gradient(circle at top left, rgba(35, 179, 170, 0.08), transparent 26%), linear-gradient(180deg, #f5f7f8 0%, #ebf0f2 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
          <Avatar
            sx={{
            background: `linear-gradient(135deg, ${appColors.navy} 0%, ${appColors.teal} 100%)`,
            width: 56,
            height: 56,
            boxShadow: "0 12px 24px rgba(15, 23, 42, 0.16)",
          }}
        >
          <DashboardIcon />
        </Avatar>

        <Box>
          <Typography variant="h4" fontWeight="bold">
            Dashboard
          </Typography>

          <Typography color="text.secondary">
            Bizz Report Management Dashboard
          </Typography>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3}>
        {dashboardCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card
              sx={{
                borderRadius: 4,
                color: "#fff",
                background: `linear-gradient(135deg, ${card.color}, ${card.color}CC)`,
                boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
                transition: "0.3s",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.12)",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 18px 38px rgba(15,23,42,0.16)",
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body1">
                      {card.title}
                    </Typography>

                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      mt={1}
                    >
                      {card.count}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      width: 60,
                      height: 60,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6">
                Total Reports
              </Typography>

              <Typography
                variant="h3"
                fontWeight="bold"
                color={appColors.navy}
              >
                314
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6">
                Completed
              </Typography>

              <Typography
                variant="h3"
                fontWeight="bold"
                color={appColors.teal}
              >
                288
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6">
                Pending
              </Typography>

              <Typography
                variant="h3"
                fontWeight="bold"
                color={appColors.warning}
              >
                26
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Reports Table */}
      <Card sx={{ mt: 4, borderRadius: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
          >
            Recent Reports
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Report ID
                  </TableCell>

                  <TableCell>
                    Report Type
                  </TableCell>

                  <TableCell>
                    Date
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>
                    REP001
                  </TableCell>

                  <TableCell>
                    TAT Report
                  </TableCell>

                  <TableCell>
                    22-06-2026
                  </TableCell>

                  <TableCell>
                    <Chip
                      label="Completed"
                      color="success"
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    REP002
                  </TableCell>

                  <TableCell>
                    Daily Report
                  </TableCell>

                  <TableCell>
                    22-06-2026
                  </TableCell>

                  <TableCell>
                    <Chip
                      label="Pending"
                      color="warning"
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    REP003
                  </TableCell>

                  <TableCell>
                    Weekly Report
                  </TableCell>

                  <TableCell>
                    22-06-2026
                  </TableCell>

                  <TableCell>
                    <Chip
                      label="Completed"
                      color="success"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;
