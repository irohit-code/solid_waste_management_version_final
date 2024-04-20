// HeadDashboard.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/headpage.css';

const HeadDashboard = () => {
  const [headName, setHeadName] = useState('');
  const [staffMembers, setStaffMembers] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [showCitizens, setShowCitizens] = useState(false);
  const [showStaffMembers, setShowStaffMembers] = useState(false);
  const navigate = useNavigate();
  const citizensListRef = useRef(null);
  const staffMembersListRef = useRef(null);

  useEffect(() => {
    const fetchHeadName = async () => {
      try {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
          navigate('/');
          return;
        }
        const response = await axios.get(`http://localhost:7014/api/head/${storedEmail}`);
        setHeadName(response.data.Name);
      } catch (error) {
        console.error('Error fetching head name:', error);
      }
    };

    fetchHeadName();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('email');
    navigate('/');
  };

  const handleViewCitizens = async () => {
    try {
      const response = await axios.get('http://localhost:7014/api/citizens');
      setCitizens(response.data);
      setShowCitizens(true);
      setShowStaffMembers(false);
    } catch (error) {
      console.error('Error fetching citizens:', error);
    }
  };

  const handleViewStaffMembers = async () => {
    try {
      const response = await axios.get('http://localhost:7014/api/staff');
      setStaffMembers(response.data);
      setShowStaffMembers(true);
      setShowCitizens(false);
    } catch (error) {
      console.error('Error fetching staff members:', error);
    }
  };

  const handleOutsideClick = (event) => {
    if (citizensListRef.current && !citizensListRef.current.contains(event.target)) {
      setShowCitizens(false);
    }
    if (staffMembersListRef.current && !staffMembersListRef.current.contains(event.target)) {
      setShowStaffMembers(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleAddNewStaff = () => {
    navigate('/staff-register');
  };

  const handleGetReport = () => {
    navigate('/report-page');
  };

  return (
    <div className="head-dashboard">
      <div className="profile-section">
        <strong><span>Welcome, {headName}</span></strong>
        <button className='head-logout' onClick={handleLogout}><strong>Logout</strong></button>
      </div>
      <h2>Head Dashboard</h2>
      <p className="head-para">
        Welcome to the Head Dashboard! As the head of the waste management system, 
        you have access to various functionalities to manage staff members and view 
        citizen information.
      </p>
      <h3>Citizens' Engagement</h3>
      <p>
        Explore the level of citizen engagement in waste management activities. 
        Discover proactive residents participating in recycling programs, waste segregation 
        initiatives, and community cleanup campaigns. By understanding citizens' involvement, 
        you can tailor outreach strategies and enhance community participation.
      </p>
      <h3>New Staff Recruitment</h3>
      <p>
        Facilitate the expansion of your waste management team by adding new staff members 
        to the workforce. Streamline the recruitment process through the Head Dashboard, 
        ensuring seamless integration of qualified personnel into essential roles within 
        the organization.
      </p>

      <div className="action-buttons">
        <button onClick={handleViewCitizens}><strong>VIEW CITIZENS</strong></button>
        <button onClick={handleViewStaffMembers}><strong>VIEW STAFF</strong></button>
        <button onClick={handleAddNewStaff}><strong>ADD NEW STAFF</strong></button>
        <button onClick={handleGetReport}><strong>GET REPORT</strong></button>
      </div>
      {showCitizens && (
        <div className="citizens-list" ref={citizensListRef}>
          <table className="head-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {citizens.map(citizen => (
                <tr key={citizen._id}>
                  <td>{citizen.Name}</td>
                  <td>{citizen.Email}</td>
                  <td>{citizen.ContactNumber}</td>
                  <td>{citizen.Address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showStaffMembers && (
        <div className="staff-members-list" ref={staffMembersListRef}>
          <table className="head-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Address</th>
                <th>Working Area</th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map(staff => (
                <tr key={staff._id}>
                  <td>{staff.Name}</td>
                  <td>{staff.Email}</td>
                  <td>{staff.ContactNumber}</td>
                  <td>{staff.Address}</td>
                  <td>{staff.WorkingArea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HeadDashboard;
