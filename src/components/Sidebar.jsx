import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

//import logo from "../assets/logo-sass.png";
import "../sidebar.css";

import TimerIcon from "@mui/icons-material/Timer";
import TodayIcon from "@mui/icons-material/Today";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import AccountTreeIcon from "@mui/icons-material/AccountTree";



const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedIsOpen = sessionStorage.getItem("sidebarOpen");
    setIsOpen(savedIsOpen ? JSON.parse(savedIsOpen) : false);
  }, []);

  const toggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    sessionStorage.setItem("sidebarOpen", JSON.stringify(newIsOpen));
  };

  const handleLogoutClick = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const menuItem = [
    {
      path: "/tat-report",
      icon: <TimerIcon />,
      name: "TAT Report",
    },
    {
      path: "/daily-report",
      icon: <TodayIcon />,
      name: "Daily Report",
    },
    // {
    //   path: "/weekly-report",
    //   icon: <DateRangeIcon />,
    //   name: "Weekly Report",
    // },
    {
      path: "/amendment-report",
      icon: <EditNoteIcon />,
      name: "Amendment Report",
    },
    {
      path: "/cancel-report",
      icon: <CancelScheduleSendIcon />,
      name: "Cancel Report",
    },
    {
      path: "/pending-report",
      icon: <PendingActionsIcon />,
      name: "Pending Report",
    },

     {
    path: "/users",
    icon: <PeopleAltIcon />,
    name: "User",
  },
  
{
  path: "/clients",
  icon: <BusinessIcon />,
  name: "Client",
},
{
  path: "/teams",
  icon: <GroupsIcon />,
  name: "Team",
},
{
  path: "/sub-clients",
  icon: <AccountTreeIcon />,
  name: "Sub Client",
},

{
  path: "/employee-master",
  icon: <BadgeIcon />,
  name: "Employee Master",
}
  ];

  return (
    <div className="container">
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
       <div className="top_section">
  <div className="bars" onClick={toggle}>
    <MenuIcon />
  </div>
</div>

        <div className="menu-list">
          {menuItem.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={({ isActive }) =>
                isActive ? "link active" : "link"
              }
            >
              <div className="icon">{item.icon}</div>
              <div className="tooltip">{item.name}</div>

              {isOpen && <div className="link_text">{item.name}</div>}
            </NavLink>
          ))}
        </div>

        <div className="logout-section">
          <div className="logout-card" onClick={handleLogoutClick}>
            <div className="logout-icon">
              <LogoutIcon />
            </div>

          {isOpen && <span className="logout-text">Logout</span>}

          {!isOpen && <div className="tooltip">Logout</div>}
          </div>
        </div>
      </div>

      <main>{children}</main>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Logout</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>

          <Button onClick={handleLogout} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;