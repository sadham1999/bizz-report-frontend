import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { appColors } from "../theme";

// Function to map RoleId to role names
const getRoleName = (roleId) => {
  switch (roleId) {
    case "1":
      return "SuperAdmin";
    case "2":
      return "Admin";
    case "3":
      return "User";
    default:
      return "User";
  }
};

function ResponsiveAppBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const userName = sessionStorage.getItem("UserName") || "Guest";
  const roleId = sessionStorage.getItem("RoleId") || "3";
  const userImage =
    sessionStorage.getItem("Img") || "/static/images/avatar/placeholder.jpg";

  const roleName = getRoleName(roleId);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 2,
        backdropFilter: "blur(14px)",
        backgroundImage: `linear-gradient(135deg, ${appColors.navyDeep} 0%, ${appColors.navy} 52%, ${appColors.navySoft} 100%)`,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.22)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 72 }}>
          {/* Project Name */}
          <Typography
            variant="h6"
            noWrap
            component="div"
              sx={{
                flexGrow: 1,
                display: "flex",
                fontFamily: theme.typography.fontFamily,
                fontWeight: 800,
                letterSpacing: ".1rem",
                color: "#f8fafc",
                textDecoration: "none",
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
              }}
            >
            BIZZ REPORT
          </Typography>

          {/* User Info */}
          <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.25,
                py: 0.75,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
              }}
          >
            <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="body1"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: "#f8fafc",
                  lineHeight: 1.2,
                }}
              >
                Hi, {userName}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "rgba(248, 250, 252, 0.72)",
                  fontSize: "0.78rem",
                  fontStyle: "italic",
                }}
              >
                {roleName}
              </Typography>
            </Box>

            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="User Avatar"
                  src={userImage}
                sx={{
                  width: 38,
                  height: 38,
                  border: "2px solid rgba(255,255,255,0.85)",
                  boxShadow: "0 10px 18px rgba(15,23,42,0.28)",
                }}
                />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 3,
                  border: `1px solid ${appColors.border}`,
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)",
                  overflow: "hidden",
                },
              }}
            >
              <MenuItem
                onClick={handleLogout}
                sx={{ py: 1.25, px: 2, color: theme.palette.text.primary }}
              >
                <Typography sx={{ textAlign: "center", fontWeight: 600 }}>
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
