import React from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate , useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// App.js
import './App.css';

import ResponsiveAppBar from './components/appbar';

// ...rest of your App.js code


// Layout and Pages
import Protect from './Protect';
import Sidebar from './components/Sidebar';
import Dashboard from './Pages/Dashboard';
import SignIn from './Pages/SignIn';
import ForgetPassword from './Pages/ForgetPassword';
import NewSubmit from './Pages/NewSubmit';
import NotFound from './components/NotFound';
import User from './Pages/UserList';
import Client from './Pages/Client';
import AddUser from './Pages/UserAdd';
import EditUser from './Pages/UserEdit';
import AddClient from './Pages/ClientAdd';
import EditClient from './Pages/ClientEdit';
import SubClient from './Pages/SubClient';
import AddSubClient from './Pages/SubClientAdd';
import EditSubClient from './Pages/SubClientEdit';

// Job Tracker Imports
import JobtrackerUrgent from './Pages/Jobtracker Urgent';

// Normal Jobs Imports
import Critical from './jobs normal/Critical';
import Delay from './jobs normal/Delay';
import Risk from './jobs normal/Risk';
import Ontime from './jobs normal/Ontime';

// File Process Imports
import Pending from './jobs normal/fileProcess/Pending';
import Query from './jobs normal/fileProcess/Query';
import Error from './jobs normal/fileProcess/Error';
import Rejected from './jobs normal/fileProcess/Rejected';

// Urgent Jobs Imports
import OnTimeUrgent from './jobs Urgent/Ontime';
import DelayUrgent from './jobs Urgent/Delay';
import RiskUrgent from './jobs Urgent/Risk';
import CriticalUrgent from './jobs Urgent/Critical';
import ErrorUrgent from './jobs Urgent/fileProcess/Error';
import PendingUrgent from './jobs Urgent/fileProcess/Pending';
import QueryUrgent from './jobs Urgent/fileProcess/Query';
import RejectedUrgent from './jobs Urgent/fileProcess/Rejected';



// Job Process Imports
import ApprovedNormal from './jobs normal/jobProcess/Approved';
import DelayedAboveNormal from './jobs normal/jobProcess/DelayedAbove';
import DelayedOneNormal from './jobs normal/jobProcess/DelayedOne';
import DelayedTwoNormal from './jobs normal/jobProcess/DelayedTwo';
import DelayedThreeNormal from './jobs normal/jobProcess/DelayedThree';
import OnTimeN from './jobs normal/jobProcess/OnTime';

import ApprovedUrgent from './jobs Urgent/jobProcess/Approved';
import DelayedAboveUrgent from './jobs Urgent/jobProcess/DelayedAbove';
import DelayedOneUrgent from './jobs Urgent/jobProcess/DelayedOne';
import DelayedTwoUrgent from './jobs Urgent/jobProcess/DelayedTwo';
import DelayedThreeUrgent from './jobs Urgent/jobProcess/DelayedThree';
import OnTimeU from './jobs Urgent/jobProcess/OnTime';

// Job Status Imports
import CriticalSendNormal from './jobs normal/jobStatus/Critical/send';
import CriticalInhandNormal from './jobs normal/jobStatus/Critical/Inhand';
import CriticalNewNormal from './jobs normal/jobStatus/Critical/new';
import RiskSendNormal from './jobs normal/jobStatus/Risk/send';
import RiskInhandNormal from './jobs normal/jobStatus/Risk/Inhand';
import RiskNewNormal from './jobs normal/jobStatus/Risk/new';
import DelaySendNormal from './jobs normal/jobStatus/Delay/send';
import DelayInhandNormal from './jobs normal/jobStatus/Delay/Inhand';
import DelayNewNormal from './jobs normal/jobStatus/Delay/new';
import OntimeSendNormal from './jobs normal/jobStatus/ontime/send';
import OntimeInhandNormal from './jobs normal/jobStatus/ontime/Inhand';
import OntimeNewNormal from './jobs normal/jobStatus/ontime/new';

import CriticalSendUrgent from './jobs Urgent/jobStatus/Critical/send';
import CriticalInhandUrgent from './jobs Urgent/jobStatus/Critical/Inhand';
import CriticalNewUrgent from './jobs Urgent/jobStatus/Critical/new';
import RiskSendUrgent from './jobs Urgent/jobStatus/Risk/send';
import RiskInhandUrgent from './jobs Urgent/jobStatus/Risk/Inhand';
import RiskNewUrgent from './jobs Urgent/jobStatus/Risk/new';
import DelaySendUrgent from './jobs Urgent/jobStatus/Delay/send';
import DelayInhandUrgent from './jobs Urgent/jobStatus/Delay/Inhand';
import DelayNewUrgent from './jobs Urgent/jobStatus/Delay/new';
import OntimeSendUrgent from './jobs Urgent/jobStatus/ontime/send';
import OntimeInhandUrgent from './jobs Urgent/jobStatus/ontime/Inhand';
import OntimeNewUrgent from './jobs Urgent/jobStatus/ontime/new';

const AppBarHandler = () => {
    const location = useLocation();
    const excludedRoutes = ['/', '/forget-pass', '/new-submit'];
  
    // Check if the current path is in the excludedRoutes array
    const shouldShowAppBar = !excludedRoutes.includes(location.pathname);
  
    return shouldShowAppBar ? <ResponsiveAppBar /> : null;
  };

const App = () => {

    const isRouteEnabled = (allowedRoles) => {
        const roleId = sessionStorage.getItem('RoleId');
        return allowedRoles.includes(parseInt(roleId));
    };
    
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Router>
            <AppBarHandler />
                <Routes>
                    <Route element={<Protect />}>
                    {isRouteEnabled([3]) ? (
                        <>
                            <Route path="/dashboard" element={<Sidebar><Dashboard /></Sidebar>} />
                            <Route path="/Urgent-job" element={<Sidebar><JobtrackerUrgent /></Sidebar>} />
                            <Route path="/critical-normal" element={<Sidebar><Critical /></Sidebar>} />
                            <Route path="/delay-normal" element={<Sidebar><Delay /></Sidebar>} />
                            <Route path="/risk-normal" element={<Sidebar><Risk /></Sidebar>} />
                            <Route path="/On-Time-Normal" element={<Sidebar><Ontime /></Sidebar>} />
                            <Route path="/pending-normal" element={<Sidebar><Pending /></Sidebar>} />
                            <Route path="/Urgent-job" element={<Sidebar><JobtrackerUrgent /></Sidebar>} />
                            <Route path="/On-Time-Urgent" element={<Sidebar><OnTimeUrgent /></Sidebar>} />
                            <Route path="/pending-Urgent" element={<Sidebar><PendingUrgent /></Sidebar>} />
                            <Route path="/Rejected-Urgent" element={<Sidebar><Rejected /></Sidebar>} />
                            <Route path="/delay-urgent" element={<Sidebar><DelayUrgent /></Sidebar>} />
                            <Route path="/Error-Urgent" element={<Sidebar><ErrorUrgent /></Sidebar>} />
                            <Route path="/risk-urgent" element={<Sidebar><RiskUrgent /></Sidebar>} />
                            <Route path="/Query-Urgent" element={<Sidebar><QueryUrgent /></Sidebar>} />
                            <Route path="/critical-urgent" element={<Sidebar><CriticalUrgent /></Sidebar>} />
                            <Route path="/Approved-Normal" element={<Sidebar><ApprovedNormal /></Sidebar>} />
                            <Route path="/DelayedBy3HrAbove-Normal" element={<Sidebar><DelayedAboveNormal /></Sidebar>} />
                            <Route path="/DelayedBy1Hr-Normal" element={<Sidebar><DelayedOneNormal /></Sidebar>} />
                            <Route path="/DelayedBy2Hr-Normal" element={<Sidebar><DelayedTwoNormal /></Sidebar>} />
                            <Route path="/DelayedBy3Hr-Normal" element={<Sidebar><DelayedThreeNormal /></Sidebar>} />
                            <Route path="/OnTime-Normal" element={<Sidebar><OnTimeN /></Sidebar>} />
                            <Route path="/approved-urgent" element={<Sidebar><ApprovedUrgent /></Sidebar>} />
                            <Route path="/DelayedBy3HrAbove-Urgent" element={<Sidebar><DelayedAboveUrgent /></Sidebar>} />
                            <Route path="/DelayedBy1Hr-Urgent" element={<Sidebar><DelayedOneUrgent /></Sidebar>} />
                            <Route path="/DelayedBy2Hr-Urgent" element={<Sidebar><DelayedTwoUrgent /></Sidebar>} />
                            <Route path="/DelayedBy3Hr-Urgent" element={<Sidebar><DelayedThreeUrgent /></Sidebar>} />
                            <Route path="/OnTime-Urgent" element={<Sidebar><OnTimeU /></Sidebar>} />
                            <Route path="/On-TimeN" element={<Sidebar><OnTimeN /></Sidebar>} />
                            <Route path="/critical-send-normal" element={<Sidebar><CriticalSendNormal /></Sidebar>} />
                            <Route path="/Critical-In-hand-Normal" element={<Sidebar><CriticalInhandNormal /></Sidebar>} />
                            <Route path="/critical-new-normal" element={<Sidebar><CriticalNewNormal /></Sidebar>} />
                            <Route path="/Risk-Send-Normal" element={<Sidebar><RiskSendNormal /></Sidebar>} />
                            <Route path="/Risk-In-hand-Normal" element={<Sidebar><RiskInhandNormal /></Sidebar>} />
                            <Route path="/risk-new-normal" element={<Sidebar><RiskNewNormal /></Sidebar>} />
                            <Route path="/delay-send-normal" element={<Sidebar><DelaySendNormal /></Sidebar>} />
                            <Route path="/Delay-In-hand-Normal" element={<Sidebar><DelayInhandNormal /></Sidebar>} />
                            <Route path="/delay-new-normal" element={<Sidebar><DelayNewNormal /></Sidebar>} />
                            <Route path="/On-time-Send-Normal" element={<Sidebar><OntimeSendNormal /></Sidebar>} />
                            <Route path="/On-time-In-hand-Normal" element={<Sidebar><OntimeInhandNormal /></Sidebar>} />
                            <Route path="/On-time-New-Normal" element={<Sidebar><OntimeNewNormal /></Sidebar>} />
                            <Route path="/critical-send-urgent" element={<Sidebar><CriticalSendUrgent /></Sidebar>} />
                            <Route path="/critical-inhand-urgent" element={<Sidebar><CriticalInhandUrgent /></Sidebar>} />
                            <Route path="/critical-new-urgent" element={<Sidebar><CriticalNewUrgent /></Sidebar>} />
                            <Route path="/risk-send-urgent" element={<Sidebar><RiskSendUrgent /></Sidebar>} />
                            <Route path="/risk-inhand-urgent" element={<Sidebar><RiskInhandUrgent /></Sidebar>} />
                            <Route path="/risk-new-urgent" element={<Sidebar><RiskNewUrgent /></Sidebar>} />
                            <Route path="/delay-send-urgent" element={<Sidebar><DelaySendUrgent /></Sidebar>} />
                            <Route path="/delay-inhand-urgent" element={<Sidebar><DelayInhandUrgent /></Sidebar>} />
                            <Route path="/delay-new-urgent" element={<Sidebar><DelayNewUrgent /></Sidebar>} />
                            <Route path="/ontime-send-urgent" element={<Sidebar><OntimeSendUrgent /></Sidebar>} />
                            <Route path="/ontime-inhand-urgent" element={<Sidebar><OntimeInhandUrgent /></Sidebar>} />
                            <Route path="/ontime-new-urgent" element={<Sidebar><OntimeNewUrgent /></Sidebar>} />
                            <Route path="/Query-Normal" element={<Sidebar><Query /></Sidebar>} />
                            <Route path="/Error-Normal" element={<Sidebar><Error /></Sidebar>} />
                            <Route path="/Rejected-Normal" element={<Sidebar><Rejected /></Sidebar>} />
                            </>
                        ) : (
                            <Route path="*" element={<NotFound />} />
                        )}

{isRouteEnabled([2]) ? (
    <>
                            <Route path="/dashboard" element={<Sidebar><Dashboard /></Sidebar>} />
                            <Route path="/user" element={<Sidebar><User /></Sidebar>} />
                            <Route path="/client" element={<Sidebar><Client /></Sidebar>} />
                            <Route path="/subclient" element={<Sidebar><SubClient /></Sidebar>} />
                          
                            <Route path="/critical-normal" element={<Sidebar><Critical /></Sidebar>} />
                            <Route path="/delay-normal" element={<Sidebar><Delay /></Sidebar>} />
                            <Route path="/risk-normal" element={<Sidebar><Risk /></Sidebar>} />
                            <Route path="/On-Time-Normal" element={<Sidebar><Ontime /></Sidebar>} />
                            <Route path="/pending-normal" element={<Sidebar><Pending /></Sidebar>} />
                            <Route path="/Urgent-job" element={<Sidebar><JobtrackerUrgent /></Sidebar>} />
                            <Route path="/On-Time-Urgent" element={<Sidebar><OnTimeUrgent /></Sidebar>} />
                            <Route path="/pending-Urgent" element={<Sidebar><PendingUrgent /></Sidebar>} />
                            <Route path="/Rejected-Urgent" element={<Sidebar><Rejected /></Sidebar>} />
                            <Route path="/delay-urgent" element={<Sidebar><DelayUrgent /></Sidebar>} />
                            <Route path="/Error-Urgent" element={<Sidebar><ErrorUrgent /></Sidebar>} />
                            <Route path="/risk-urgent" element={<Sidebar><RiskUrgent /></Sidebar>} />
                            <Route path="/Query-Urgent" element={<Sidebar><QueryUrgent /></Sidebar>} />
                            <Route path="/critical-urgent" element={<Sidebar><CriticalUrgent /></Sidebar>} />
                            <Route path="/Approved-Normal" element={<Sidebar><ApprovedNormal /></Sidebar>} />
                            <Route path="/DelayedBy3HrAbove-Normal" element={<Sidebar><DelayedAboveNormal /></Sidebar>} />
                            <Route path="/DelayedBy1Hr-Normal" element={<Sidebar><DelayedOneNormal /></Sidebar>} />
                            <Route path="/DelayedBy2Hr-Normal" element={<Sidebar><DelayedTwoNormal /></Sidebar>} />
                            <Route path="/DelayedBy3Hr-Normal" element={<Sidebar><DelayedThreeNormal /></Sidebar>} />
                            <Route path="//OnTime-Normal" element={<Sidebar><OnTimeN /></Sidebar>} />
                            <Route path="/approved-urgent" element={<Sidebar><ApprovedUrgent /></Sidebar>} />
                            <Route path="/DelayedBy3HrAbove-Urgent" element={<Sidebar><DelayedAboveUrgent /></Sidebar>} />
                            <Route path="/DelayedBy1Hr-Urgent" element={<Sidebar><DelayedOneUrgent /></Sidebar>} />
                            <Route path="/DelayedBy2Hr-Urgent" element={<Sidebar><DelayedTwoUrgent /></Sidebar>} />
                            <Route path="/DelayedBy3Hr-Urgent" element={<Sidebar><DelayedThreeUrgent /></Sidebar>} />
                            <Route path="/OnTime-Urgent" element={<Sidebar><OnTimeU /></Sidebar>} />
                            <Route path="/On-TimeN" element={<Sidebar><OnTimeN /></Sidebar>} />
                            <Route path="/critical-send-normal" element={<Sidebar><CriticalSendNormal /></Sidebar>} />
                            <Route path="/Critical-In-hand-Normal" element={<Sidebar><CriticalInhandNormal /></Sidebar>} />
                            <Route path="/critical-new-normal" element={<Sidebar><CriticalNewNormal /></Sidebar>} />
                            <Route path="/Risk-Send-Normal" element={<Sidebar><RiskSendNormal /></Sidebar>} />
                            <Route path="/Risk-In-hand-Normal" element={<Sidebar><RiskInhandNormal /></Sidebar>} />
                            <Route path="/risk-new-normal" element={<Sidebar><RiskNewNormal /></Sidebar>} />
                            <Route path="/delay-send-normal" element={<Sidebar><DelaySendNormal /></Sidebar>} />
                            <Route path="/Delay-In-hand-Normal" element={<Sidebar><DelayInhandNormal /></Sidebar>} />
                            <Route path="/delay-new-normal" element={<Sidebar><DelayNewNormal /></Sidebar>} />
                            <Route path="/On-time-Send-Normal" element={<Sidebar><OntimeSendNormal /></Sidebar>} />
                            <Route path="/On-time-In-hand-Normal" element={<Sidebar><OntimeInhandNormal /></Sidebar>} />
                            <Route path="/On-time-New-Normal" element={<Sidebar><OntimeNewNormal /></Sidebar>} />
                            <Route path="/critical-send-urgent" element={<Sidebar><CriticalSendUrgent /></Sidebar>} />
                            <Route path="/critical-inhand-urgent" element={<Sidebar><CriticalInhandUrgent /></Sidebar>} />
                            <Route path="/critical-new-urgent" element={<Sidebar><CriticalNewUrgent /></Sidebar>} />
                            <Route path="/risk-send-urgent" element={<Sidebar><RiskSendUrgent /></Sidebar>} />
                            <Route path="/risk-inhand-urgent" element={<Sidebar><RiskInhandUrgent /></Sidebar>} />
                            <Route path="/risk-new-urgent" element={<Sidebar><RiskNewUrgent /></Sidebar>} />
                            <Route path="/delay-send-urgent" element={<Sidebar><DelaySendUrgent /></Sidebar>} />
                            <Route path="/delay-inhand-urgent" element={<Sidebar><DelayInhandUrgent /></Sidebar>} />
                            <Route path="/delay-new-urgent" element={<Sidebar><DelayNewUrgent /></Sidebar>} />
                            <Route path="/ontime-send-urgent" element={<Sidebar><OntimeSendUrgent /></Sidebar>} />
                            <Route path="/ontime-inhand-urgent" element={<Sidebar><OntimeInhandUrgent /></Sidebar>} />
                            <Route path="/ontime-new-urgent" element={<Sidebar><OntimeNewUrgent /></Sidebar>} />
                            <Route path="/Query-Normal" element={<Sidebar><Query /></Sidebar>} />
                            <Route path="/Error-Normal" element={<Sidebar><Error /></Sidebar>} />
                            <Route path="/Rejected-Normal" element={<Sidebar><Rejected /></Sidebar>} />
                            </>
                        ) : (
                            <Route path="*" element={<NotFound />} />
                        )}

{isRouteEnabled([1]) ? (
    <>
                             <Route path="/dashboard" element={<Sidebar><Dashboard /></Sidebar>} />
                            <Route path="/user" element={<Sidebar><User /></Sidebar>} />
                            <Route path="/user" element={<Sidebar><User /></Sidebar>} />
                            <Route path="/client" element={<Sidebar><Client /></Sidebar>} />
                            <Route path="/subclient" element={<Sidebar><SubClient /></Sidebar>} />
                          
                            <Route path="/critical-normal" element={<Sidebar><Critical /></Sidebar>} />
                            <Route path="/delay-normal" element={<Sidebar><Delay /></Sidebar>} />
                            <Route path="/risk-normal" element={<Sidebar><Risk /></Sidebar>} />
                            <Route path="/On-Time-Normal" element={<Sidebar><Ontime /></Sidebar>} />
                            <Route path="/pending-normal" element={<Sidebar><Pending /></Sidebar>} />
                            <Route path="/Urgent-job" element={<Sidebar><JobtrackerUrgent /></Sidebar>} />
                            <Route path="/On-Time-Urgent" element={<Sidebar><OnTimeUrgent /></Sidebar>} />
                            <Route path="/pending-Urgent" element={<Sidebar><PendingUrgent /></Sidebar>} />
                            <Route path="/Rejected-Urgent" element={<Sidebar><Rejected /></Sidebar>} />
                            <Route path="/delay-urgent" element={<Sidebar><DelayUrgent /></Sidebar>} />
                            <Route path="/Error-Urgent" element={<Sidebar><ErrorUrgent /></Sidebar>} />
                            <Route path="/risk-urgent" element={<Sidebar><RiskUrgent /></Sidebar>} />
                            <Route path="/Query-Urgent" element={<Sidebar><QueryUrgent /></Sidebar>} />
                            <Route path="/critical-urgent" element={<Sidebar><CriticalUrgent /></Sidebar>} />
                            <Route path="/Approved-Normal" element={<Sidebar><ApprovedNormal /></Sidebar>} />
                            <Route path="/DelayedBy3HrAbove-Normal" element={<Sidebar><DelayedAboveNormal /></Sidebar>} />
                            <Route path="/DelayedBy1Hr-Normal" element={<Sidebar><DelayedOneNormal /></Sidebar>} />
                            <Route path="/DelayedBy2Hr-Normal" element={<Sidebar><DelayedTwoNormal /></Sidebar>} />
                            <Route path="/DelayedBy3Hr-Normal" element={<Sidebar><DelayedThreeNormal /></Sidebar>} />
                            <Route path="//OnTime-Normal" element={<Sidebar><OnTimeN /></Sidebar>} />
                            <Route path="/approved-urgent" element={<Sidebar><ApprovedUrgent /></Sidebar>} />
                            <Route path="/DelayedBy3HrAbove-Urgent" element={<Sidebar><DelayedAboveUrgent /></Sidebar>} />
                            <Route path="/DelayedBy1Hr-Urgent" element={<Sidebar><DelayedOneUrgent /></Sidebar>} />
                            <Route path="/DelayedBy2Hr-Urgent" element={<Sidebar><DelayedTwoUrgent /></Sidebar>} />
                            <Route path="/DelayedBy3Hr-Urgent" element={<Sidebar><DelayedThreeUrgent /></Sidebar>} />
                            <Route path="/OnTime-Urgent" element={<Sidebar><OnTimeU /></Sidebar>} />
                            <Route path="/On-TimeN" element={<Sidebar><OnTimeN /></Sidebar>} />
                            <Route path="/critical-send-normal" element={<Sidebar><CriticalSendNormal /></Sidebar>} />
                            <Route path="/Critical-In-hand-Normal" element={<Sidebar><CriticalInhandNormal /></Sidebar>} />
                            <Route path="/critical-new-normal" element={<Sidebar><CriticalNewNormal /></Sidebar>} />
                            <Route path="/Risk-Send-Normal" element={<Sidebar><RiskSendNormal /></Sidebar>} />
                            <Route path="/Risk-In-hand-Normal" element={<Sidebar><RiskInhandNormal /></Sidebar>} />
                            <Route path="/risk-new-normal" element={<Sidebar><RiskNewNormal /></Sidebar>} />
                            <Route path="/delay-send-normal" element={<Sidebar><DelaySendNormal /></Sidebar>} />
                            <Route path="/Delay-In-hand-Normal" element={<Sidebar><DelayInhandNormal /></Sidebar>} />
                            <Route path="/delay-new-normal" element={<Sidebar><DelayNewNormal /></Sidebar>} />
                            <Route path="/On-time-Send-Normal" element={<Sidebar><OntimeSendNormal /></Sidebar>} />
                            <Route path="/On-time-In-hand-Normal" element={<Sidebar><OntimeInhandNormal /></Sidebar>} />
                            <Route path="/On-time-New-Normal" element={<Sidebar><OntimeNewNormal /></Sidebar>} />
                            <Route path="/critical-send-urgent" element={<Sidebar><CriticalSendUrgent /></Sidebar>} />
                            <Route path="/critical-inhand-urgent" element={<Sidebar><CriticalInhandUrgent /></Sidebar>} />
                            <Route path="/critical-new-urgent" element={<Sidebar><CriticalNewUrgent /></Sidebar>} />
                            <Route path="/risk-send-urgent" element={<Sidebar><RiskSendUrgent /></Sidebar>} />
                            <Route path="/risk-inhand-urgent" element={<Sidebar><RiskInhandUrgent /></Sidebar>} />
                            <Route path="/risk-new-urgent" element={<Sidebar><RiskNewUrgent /></Sidebar>} />
                            <Route path="/delay-send-urgent" element={<Sidebar><DelaySendUrgent /></Sidebar>} />
                            <Route path="/delay-inhand-urgent" element={<Sidebar><DelayInhandUrgent /></Sidebar>} />
                            <Route path="/delay-new-urgent" element={<Sidebar><DelayNewUrgent /></Sidebar>} />
                            <Route path="/ontime-send-urgent" element={<Sidebar><OntimeSendUrgent /></Sidebar>} />
                            <Route path="/ontime-inhand-urgent" element={<Sidebar><OntimeInhandUrgent /></Sidebar>} />
                            <Route path="/ontime-new-urgent" element={<Sidebar><OntimeNewUrgent /></Sidebar>} />
                            <Route path="/Query-Normal" element={<Sidebar><Query /></Sidebar>} />
                            <Route path="/Error-Normal" element={<Sidebar><Error /></Sidebar>} />
                            <Route path="/Rejected-Normal" element={<Sidebar><Rejected /></Sidebar>} />
                            <Route path="/Add-user" element={<Sidebar><AddUser /></Sidebar>} />
                            <Route path="/Edit-user/:id" element={<Sidebar><EditUser /></Sidebar>} />
                            <Route path="/Add-Client" element={<Sidebar><AddClient /></Sidebar>} />
                            <Route path="/Add-SubClient" element={<Sidebar><AddSubClient /></Sidebar>} />
                            <Route path="/Edit-SubClient/:id" element={<Sidebar><EditSubClient /></Sidebar>} />
                            <Route path="/Edit-Client/:id" element={<Sidebar><EditClient /></Sidebar>} />
                            </>
                        ) : (
                            <Route path="*" element={<NotFound />} />

                        )}
                        
                       
                    </Route>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/forget-pass" element={<ForgetPassword />} />
                    <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
                    <Route path="/new-submit" element={<NewSubmit />}/>
                </Routes>
            </Router>
        </LocalizationProvider>
    );
};

export default App;
