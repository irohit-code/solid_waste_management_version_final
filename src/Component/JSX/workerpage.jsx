import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/workerpage.css';

const WorkerDashboard = () => {
    const [workerName, setWorkerName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            navigate('/');
            return;
        }
        const fetchWorkerDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:7014/api/worker/${storedEmail}`);
                const { name, contactNumber } = response.data;
                localStorage.setItem('workerName', name);
                localStorage.setItem('contactNumber', contactNumber);
                setWorkerName(name);
                setContactNumber(contactNumber);
            } catch (error) {
                console.error('Error fetching worker details:', error);
                setErrorMessage('Error fetching worker details');
            }
        };
        fetchWorkerDetails();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('workerName');
        localStorage.removeItem('contactNumber');
        navigate('/');
    };

    const handleViewAssignedWorks = () => {
        navigate('/view-assigned-work');
    };

    const handleViewCompletedWorks = () => {
        navigate('/view-completed-work');
    };

    return (
        <div className="worker-dashboard">
            <div className="header">
                <h2 className="welcome-message">Welcome, {workerName}</h2>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="button-container">
                <button className="view-button" onClick={handleViewAssignedWorks}>View Assigned Works</button>
                <button className="view-button" onClick={handleViewCompletedWorks}>View Completed Works</button>
            </div>
            <div className="content-container">
                <div className="content-section">
                    <h3 className="section-heading">Importance Of Your Role</h3>
                    <p className="section-text">
                        The role of the Solid Waste Management Worker is crucial in maintaining a clean and healthy environment. Proper waste collection and disposal help prevent the spread of diseases, reduce pollution, and conserve natural resources. By collecting waste efficiently and effectively, the worker contributes to the overall sustainability of the community.
                    </p>
                </div>
                <div className="content-section">
                    <h3 className="section-heading">Responsibilities</h3>
                    <ol className="section-list">
                        <li>Collection of Municipal Solid Waste: This involves collecting waste from households, commercial establishments, and public places using various types of vehicles and equipment.</li>
                        <li>Transportation of Waste: After collection, the waste is transported to transfer stations or disposal facilities.</li>
                        <li>Maintenance of Equipment: Sanitation workers are responsible for maintaining the vehicles and equipment used in waste collection and disposal.</li>
                        <li>Cleaning of Public Spaces: This includes cleaning streets, parks, and public toilets.</li>
                        <li>Education and Awareness: Sanitation workers may also be involved in educating the public about waste management and promoting recycling and composting.</li>
                    </ol>
                </div>
                <div className="content-section">
                    <h3 className="section-heading">Safety Measures</h3>
                    <ol className="section-list">
                        <li>Personal Protective Equipment (PPE): Workers should wear appropriate PPE, such as gloves, safety shoes, safety glasses, and high-visibility clothing, to protect themselves from injury and exposure to hazardous materials.</li>
                        <li>Proper Lifting Techniques: Workers should use proper lifting techniques to avoid back injuries and other musculoskeletal disorders. This includes using mechanical aids, such as dollies and carts, and lifting objects close to the body.</li>
                        <li>Hazard Communication: Workers should be familiar with the hazardous materials they handle and the safety precautions required. This includes reading and understanding safety data sheets (SDS), using proper labeling and signage, and following safe handling and disposal procedures.</li>
                        <li>Electrical Safety: Workers should be aware of the electrical hazards associated with waste collection and disposal. This includes using ground fault circuit interrupters (GFCI) and avoiding contact with overhead power lines.</li>
                        <li>Fire Safety: Workers should be familiar with the fire hazards associated with waste collection and disposal. This includes using fire-resistant clothing and equipment, keeping ignition sources away from flammable materials, and following proper fire extinguisher procedures.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;
