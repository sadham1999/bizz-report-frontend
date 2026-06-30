import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import FilePresentOutlinedIcon from "@mui/icons-material/FilePresentOutlined";
import config from "../API/Api";
import { appColors, buttonGradient, sidebarGradient } from "../theme";

const loginGradient =
  "linear-gradient(180deg, rgba(15, 28, 31, 0.98) 0%, rgba(21, 40, 44, 0.98) 52%, rgba(34, 60, 64, 0.98) 100%)";

function MetricTile({ label, value, icon }) {
  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.06)",
        px: 1.6,
        py: 1.25,
        minHeight: 72,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            display: "grid",
            placeItems: "center",
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.72)" }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
            {value}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function SignInSide() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "Bizz Report";

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyMargin = body.style.margin;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.margin = "0";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.margin = previousBodyMargin;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${config.baseURL}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const clientCodesArray = Array.isArray(data.client_codes)
        ? data.client_codes
        : [data.client_codes];

      sessionStorage.setItem("client_codes", JSON.stringify(clientCodesArray));
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("subclientcode", JSON.stringify(data.subclient_ids || []));
      sessionStorage.setItem("RoleId", data.role_id);
      sessionStorage.setItem("UserId", data.user_id);
      sessionStorage.setItem("UserName", data.username);
      sessionStorage.setItem("team_ids", data.team_ids);

      toast.success("Login successful");

      setTimeout(() => {
        navigate("/daily-report");
      }, 900);
    } catch (error) {
      toast.error("Username or password is invalid");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background:
          `radial-gradient(circle at top left, ${alpha(appColors.teal, 0.08)}, transparent 26%), radial-gradient(circle at bottom right, ${alpha(appColors.navy, 0.08)}, transparent 28%), linear-gradient(180deg, #f8fbfc 0%, #eef3f5 100%)`,
      }}
    >
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />

      <Box
        sx={{
          height: "100%",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.08fr 0.92fr" },
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            p: { md: 4 },
            color: "#fff",
            backgroundImage: loginGradient,
            borderRight: "1px solid rgba(255,255,255,0.08)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.03) 25%, transparent 25%) 0 0 / 22px 22px, linear-gradient(135deg, transparent 75%, rgba(255,255,255,0.03) 75%) 0 0 / 22px 22px",
              opacity: 0.45,
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                }}
              >
                BR
              </Box>
              <Box>
                <Typography sx={{ fontSize: "1.9rem", fontWeight: 900, lineHeight: 1 }}>
                  Bizz Report
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 0.4 }}>
                  Secure reporting and analytics workspace
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: { md: "2.45rem" },
                fontWeight: 900,
                lineHeight: 1.05,
                maxWidth: 640,
                mb: 1.75,
              }}
            >
              Focused reporting for a calm, professional workflow.
            </Typography>

            <Typography
              sx={{
                maxWidth: 640,
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.65,
                fontSize: "1.02rem",
                mb: 3,
              }}
            >
              Sign in to review reports, manage operational data, and keep your team aligned with
              a simple, polished interface.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 1.5,
                maxWidth: 700,
              }}
            >
              <MetricTile label="Reports" value="128" icon={<AnalyticsOutlinedIcon sx={{ fontSize: 18 }} />} />
              <MetricTile label="Teams" value="24" icon={<ShieldOutlinedIcon sx={{ fontSize: 18 }} />} />
              <MetricTile label="Files" value="4.2K" icon={<FilePresentOutlinedIcon sx={{ fontSize: 18 }} />} />
            </Box>
          </Box>

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              mt: 4,
              maxWidth: 760,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.05)",
              p: 2.25,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.8 }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: "1rem" }}>Monthly summary</Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.68)", fontSize: "0.85rem" }}>
                  Operational activity at a glance
                </Typography>
              </Box>
              <TableChartOutlinedIcon sx={{ color: "rgba(255,255,255,0.72)" }} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "end", gap: 1.1, height: 150 }}>
              {[44, 62, 50, 78, 66, 88, 72].map((height, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    height: `${height}%`,
                    minHeight: 26,
                    background:
                      index % 2 === 0
                        ? "linear-gradient(180deg, rgba(110,231,183,0.9) 0%, rgba(16,185,129,0.9) 100%)"
                        : "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.16) 100%)",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, sm: 3, md: 4 },
            minHeight: 0,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 460,
              p: { xs: 2.5, sm: 3.25, md: 4 },
              backgroundColor: "rgba(255,255,255,0.92)",
              border: `1px solid ${alpha(appColors.border, 0.85)}`,
              borderRadius: 0,
              boxShadow: "0 22px 52px rgba(15, 23, 42, 0.10)",
            }}
          >
            <Typography sx={{ color: appColors.tealDeep, fontWeight: 800, letterSpacing: "0.16em", mb: 1 }}>
              BIZZ REPORT
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.08, mb: 1.25 }}>
              Sign in to continue
            </Typography>

            <Typography sx={{ color: appColors.textMuted, lineHeight: 1.6, mb: 3 }}>
              Access dashboards, reports, and administrative tools from one secure workspace.
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                margin="normal"
                required
                label="User Name"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineRoundedIcon sx={{ color: appColors.textMuted }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mt: 0,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                    backgroundColor: "#fff",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: appColors.border,
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: appColors.tealDeep,
                  },
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                required
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: appColors.textMuted }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                    backgroundColor: "#fff",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: appColors.border,
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: appColors.tealDeep,
                  },
                }}
              />

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mt: 0.5 }}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                  sx={{
                    m: 0,
                    "& .MuiFormControlLabel-label": {
                      color: appColors.text,
                      fontSize: "0.92rem",
                    },
                  }}
                />

                <Link
                  href="#"
                  variant="body2"
                  onClick={() => navigate("/forget-pass")}
                  sx={{ color: appColors.tealDeep, fontWeight: 700, whiteSpace: "nowrap" }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.45,
                  borderRadius: 0,
                  backgroundImage: buttonGradient,
                  color: "#fff",
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(135deg, #047857 0%, #059669 58%, #34d399 100%)",
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default SignInSide;

