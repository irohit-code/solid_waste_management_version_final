import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/staffpage.css';

const StaffPage = () => {
    const [staffName, setStaffName] = useState('');
    const [citizens, setCitizens] = useState([]);
    const [staff, setStaff] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [showCitizenTable, setShowCitizenTable] = useState(false);
    const [showStaffTable, setShowStaffTable] = useState(false);
    const [showWorkerTable, setShowWorkerTable] = useState(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const tableRef = useRef(null);

    useEffect(() => {
        const fetchStaffDetails = async () => {
            try {
                const storedEmail = localStorage.getItem('email');
                if (!storedEmail) {
                    navigate('/');
                    return;
                }
                const response = await axios.get(`http://localhost:7014/api/staff/${storedEmail}`);
                const { name, contactNumber } = response.data;
                localStorage.setItem('name', name);
                localStorage.setItem('contactNumber', contactNumber);
                setStaffName(name);
            } catch (error) {
                console.error('Error fetching staff details:', error);
                setErrorMessage('Error fetching staff details');
            }
        };

        fetchStaffDetails();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('contactNumber');
        navigate('/');
    };

    const handleViewCitizens = async () => {
        try {
            const response = await axios.get('http://localhost:7014/api/citizens');
            setCitizens(response.data);
            setShowCitizenTable(true);
            setShowStaffTable(false);
            setShowWorkerTable(false);
        } catch (error) {
            console.error('Error fetching citizens:', error);
            setErrorMessage('Error fetching citizens');
        }
    };

    const handleViewStaff = async () => {
        try {
            const response = await axios.get('http://localhost:7014/api/staff');
            setStaff(response.data);
            setShowStaffTable(true);
            setShowCitizenTable(false);
            setShowWorkerTable(false);
        } catch (error) {
            console.error('Error fetching staff:', error);
            setErrorMessage('Error fetching staff');
        }
    };

    const handleViewWorker = async () => {
        try {
            const response = await axios.get('http://localhost:7014/api/get-worker');
            setWorkers(response.data);
            setShowWorkerTable(true);
            setShowCitizenTable(false);
            setShowStaffTable(false);
        } catch (error) {
            console.error('Error fetching workers:', error);
            setErrorMessage('Error fetching workers');
        }
    };

    const handleRegisterWorker = () => {
        navigate('/add-worker');
    };
    const handleAssignWork = () => {
        navigate('/assign-work');
    };

    const handleClickOutside = (event) => {
        if (tableRef.current && !tableRef.current.contains(event.target)) {
            setShowCitizenTable(false);
            setShowStaffTable(false);
            setShowWorkerTable(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <body className='staff-body'>
            <div className="staff-page">
                <div className="profile-section">
                    <span className="welcome-message">Welcome, {staffName}</span>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
                <h2 className="page-heading">Staff Page</h2>
                <p className="head-para">
                    Welcome to the Staff Page! Here you can access various functionalities related to your work.
                </p>
                <section className="duties">
                    <h3 className="duty-heading">Your Key Responsibilities</h3>
                    <p>
                        As an officer overseeing waste collection operations, your role is crucial in ensuring the efficiency and effectiveness of our waste management system. Here are your key responsibilities:
                    </p>
                    <ul className="duty-list">
                        <li>Planning and Coordination</li>
                        <li>Assigning Tasks</li>
                        <li>Monitoring Performance</li>
                        <li>Ensuring Safety</li>
                        <li>Quality Assurance</li>
                    </ul>
                </section>
                <div className="button-container">
                    <button onClick={handleViewCitizens} className="view-button">View Citizens</button>
                    <button onClick={handleViewStaff} className="view-button">View Staff</button>
                    <button onClick={handleViewWorker} className="view-button">View Worker</button>
                    <button onClick={handleRegisterWorker} className="view-button">Register New Worker</button>
                    <button onClick={handleAssignWork} className="view-button">Assign Work</button>
                </div>
                {showCitizenTable && (
                    <div className="table-container citizens-table" ref={tableRef}>
                        <h3 className="table-heading">Citizens</h3>
                        <table className="data-table">
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
                {showStaffTable && (
                    <div className="table-container staff-table" ref={tableRef}>
                        <h3 className="table-heading">Staff</h3>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Contact Number</th>
                                    <th>Working Area</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map(staffMember => (
                                    <tr key={staffMember._id}>
                                        <td>{staffMember.Name}</td>
                                        <td>{staffMember.Email}</td>
                                        <td>{staffMember.ContactNumber}</td>
                                        <td>{staffMember.WorkingArea}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {showWorkerTable && (
                    <div className="table-container workers-table" ref={tableRef}>
                        <h3 className="table-heading">Workers</h3>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Email</th>
                                    <th>Contact Number</th>
                                    <th>Address</th>
                                    <th>Working Area</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workers.map(worker => (
                                    <tr key={worker._id}>
                                        <td>{worker.Name}</td>
                                        <td>{worker.Age}</td>
                                        <td>{worker.Email}</td>
                                        <td>{worker.ContactNumber}</td>
                                        <td>{worker.Address}</td>
                                        <td>{worker.WorkingArea}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
        </body>
    );
};

export default StaffPage;
