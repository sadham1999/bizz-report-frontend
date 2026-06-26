import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import Sidebar from "./components/Sidebar";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Protect from "./Protect";

import DailyReport from "./Pages/DailyReport";
//import WeeklyReport from "./Pages/WeeklyReport";
import TatReport from "./Pages/TatReport";
import AmendmentReport from "./Pages/AmendmentReport";
import CancelReport from "./Pages/CancelReport";
import PendingReport from "./Pages/PendingReport";
import UserList from "./Pages/UserList";
import TeamList from "./Pages/TeamList";
import ClientList from "./Pages/ClientList";
import ClientAddForm from "./Pages/ClientAdd";
import ClientEditForm from "./Pages/ClientEdit";

import TeamAddForm from "./Pages/TeamAdd";
import TeamEditForm from "./Pages/TeamEdit";
import EmployeeMaster from "./Pages/EmployeeMaster";
import SubClientList from "./Pages/SubClientList";
import SubClientAddForm from "./Pages/SubClientAdd";
import SubClientEditForm from "./Pages/SubClientEdit";
import SignInSide from "./Pages/SignIn";
//import Dashboard from "./Pages/Dashboard";

function AppRoutes() {
  const location = useLocation();
  const showChrome = location.pathname !== "/login";

  return (
    <>
      {showChrome && <ResponsiveAppBar />}

      <Routes>
        <Route path="/login" element={<SignInSide />} />

        <Route element={<Protect />}>
          <Route
            path="/"
            element={
              <Sidebar>
                <DailyReport />
              </Sidebar>
            }
          />
          <Route
            path="/tat-report"
            element={
              <Sidebar>
                <TatReport />
              </Sidebar>
            }
          />
          <Route
            path="/daily-report"
            element={
              <Sidebar>
                <DailyReport />
              </Sidebar>
            }
          />
          <Route
            path="/amendment-report"
            element={
              <Sidebar>
                <AmendmentReport />
              </Sidebar>
            }
          />
          <Route
            path="/cancel-report"
            element={
              <Sidebar>
                <CancelReport />
              </Sidebar>
            }
          />
          <Route
            path="/pending-report"
            element={
              <Sidebar>
                <PendingReport />
              </Sidebar>
            }
          />
          <Route
            path="/users"
            element={
              <Sidebar>
                <UserList />
              </Sidebar>
            }
          />
          <Route
            path="/teams"
            element={
              <Sidebar>
                <TeamList />
              </Sidebar>
            }
          />
          <Route
            path="/add-team"
            element={
              <Sidebar>
                <TeamAddForm />
              </Sidebar>
            }
          />
          <Route
            path="/edit-team/:id"
            element={
              <Sidebar>
                <TeamEditForm />
              </Sidebar>
            }
          />
          <Route
            path="/sub-clients"
            element={
              <Sidebar>
                <SubClientList />
              </Sidebar>
            }
          />
          <Route
            path="/add-subclient"
            element={
              <Sidebar>
                <SubClientAddForm />
              </Sidebar>
            }
          />
          <Route
            path="/edit-subclient/:id"
            element={
              <Sidebar>
                <SubClientEditForm />
              </Sidebar>
            }
          />
          <Route
            path="/employee-master"
            element={
              <Sidebar>
                <EmployeeMaster />
              </Sidebar>
            }
          />
          <Route
            path="/clients"
            element={
              <Sidebar>
                <ClientList />
              </Sidebar>
            }
          />
          <Route
            path="/add-client"
            element={
              <Sidebar>
                <ClientAddForm />
              </Sidebar>
            }
          />
          <Route
            path="/edit-client/:id"
            element={
              <Sidebar>
                <ClientEditForm />
              </Sidebar>
            }
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to={sessionStorage.getItem("token") ? "/daily-report" : "/login"} replace />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Router>
        <AppRoutes />
      </Router>
    </LocalizationProvider>
  );
}

export default App;
