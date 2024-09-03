import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Component/JSX/homepage';
import RegisterPage from './Component/JSX/register';
import LoginPage from './Component/JSX/loginpage';
import CitizenDashboard from './Component/JSX/citizenpage';
import RequestGarbagePage from './Component/JSX/requestgarbage';
import HeadDashboard from './Component/JSX/headpage';
import StaffRegister from './Component/JSX/staffregister';
import StaffPage from './Component/JSX/staffpage';
import AddWorker from './Component/JSX/addworker';
import WorkerDashboard from './Component/JSX/workerpage';
import AssignWorkPage from './Component/JSX/assignwork';
import ViewAssignedWork from './Component/JSX/viewassignedwork';
import GetReportPage from './Component/JSX/reportpage';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
          <Route path="/request-garbage" element={<RequestGarbagePage />} />
          <Route path="/head-dashboard" element={<HeadDashboard />} />
          <Route path="/staff-register" element={<StaffRegister />} />
          <Route path="/staff-register" element={<StaffRegister />} />
          <Route path="/staff-dashboard" element={<StaffPage />} />
          <Route path="/add-worker" element={<AddWorker />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/assign-work" element={<AssignWorkPage />} />
          <Route path="/view-assigned-work" element={<ViewAssignedWork />} />
          <Route path="/report-page" element={<GetReportPage />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
