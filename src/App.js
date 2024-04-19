import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Component/JSX/homepage';
import RegisterPage from './Component/JSX/register';
import LoginPage from './Component/JSX/loginpage';
import CitizenDashboard from './Component/JSX/citizenpage';
import RequestGarbagePage from './Component/JSX/requestgarbage';



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




        </Routes>
      </div>
    </Router>
  );
};

export default App;
