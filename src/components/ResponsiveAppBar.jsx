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
    window.location.href = "/login";
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, #0f172a, #1e3a8a, #2563eb)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Project Name */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: "flex",
              fontFamily: "Arial, sans-serif",
              fontWeight: 800,
              letterSpacing: ".12rem",
              color: "#fff",
              textDecoration: "none",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            BIZZ REPORT
          </Typography>

          {/* User Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="body1"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.2,
                }}
              >
                Hi, {userName}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#dbeafe",
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
                    border: "2px solid #fff",
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
            >
              <MenuItem onClick={handleLogout}>
                <Typography sx={{ textAlign: "center" }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;