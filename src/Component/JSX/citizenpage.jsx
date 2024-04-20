import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/citizenpage.css';

const CitizenDashboard = () => {
    const [citizenName, setCitizenName] = useState('');
    const [requests, setRequests] = useState([]);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const tableRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCitizenDetails = async () => {
            try {
                const storedEmail = localStorage.getItem('email');
                if (!storedEmail) {
                    navigate('/');
                    return;
                }
                const response = await axios.get(`http://localhost:7014/api/citizen/${storedEmail}`);
                const { name, contactNumber, address } = response.data;
                localStorage.setItem('name', name);
                localStorage.setItem('contactNumber', contactNumber);
                localStorage.setItem('address', address);
                setCitizenName(name);
            } catch (error) {
                console.error('Error fetching citizen details:', error);
            }
        };

        fetchCitizenDetails();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('contactNumber');
        localStorage.removeItem('address');
        navigate('/');
    };

    const handleServiceMenu = async (option) => {
        switch (option) {
            case 'Request':
                navigate('/request-garbage');
                break;
            case 'View History':
                try {
                    const storedEmail = localStorage.getItem('email');
                    const response = await axios.get(`http://localhost:7014/api/findrequests/${storedEmail}`);
                    setRequests(response.data);
                    setIsTableVisible(true);
                } catch (error) {
                    console.error('Error fetching request history:', error);
                }
                break;
            case 'Report':
                break;
            default:
                break;
        }
    };

    const handleClickOutside = (event) => {
        if (tableRef.current && !tableRef.current.contains(event.target)) {
            setIsTableVisible(false);
        }
    };

    useEffect(() => {
        document.body.addEventListener('click', handleClickOutside);
        return () => {
            document.body.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="citizen-dashboard">
            <div className="profile-section">
                <span className='citi-span'>Welcome, {citizenName}</span>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <div className="dashboard-content">
                <p className='citi-para'>We're delighted to have you here as an active participant in our community's waste management efforts. This page serves as a hub for residents like you to access essential information, resources, and services aimed at promoting responsible waste disposal practices and fostering a cleaner, greener environment for all.</p>
                <p className='citi-para'>By working together, we can make a significant impact on the health and beauty of our neighborhoods while safeguarding the planet for future generations. Thank you for joining us on this journey toward a more sustainable future!</p>
                <p className='citi-para'>Let's roll up our sleeves and make a difference together!</p>
                <div className="info-section">
                    <h2>Information and Resources</h2>
                    <ul>
                        <li><a href="https://www.rd.com/article/how-to-recycle/">Recycling 101: How Recycling Works</a></li>
                        <li><a href="https://northhillbottledepot.ca/why-is-recycling-important-10-benefits-of-recycling/">Benefits of Recycling</a></li>
                        <li><a href="https://mashable.com/article/beginners-guide-to-composting/">Beginner's Guide to Composting</a></li>
                        <li><a href="https://www.iberdrola.com/sustainability/how-to-reduce-plastic-use/">Simple Ways to Reduce Plastic Waste</a></li>
                        <li><a href="https://www.youtube.com/watch?v=_6xlNyWPpB8">TED-Ed: The Journey of a Plastic Bottle</a></li>
                        <li><a href="https://www.youtube.com/watch?v=U0kXkWXSXRA">National Geographic: Recycling Explained</a></li>
                        <li><a href="https://www.neefusa.org/education/resources-educators">NEEF Resources for Educators</a></li>
                        <li><a href="https://www.parents.com/fun/arts-crafts/kid/recycled-crafts-for-kids/">Recycling Crafts for Kids</a></li>
                    </ul>
                </div>
                <div className="service-menu">
                    <h2>Service Menu</h2>
                    <button onClick={() => handleServiceMenu('Request')}>Request Pickup</button>
                    <button onClick={() => handleServiceMenu('View History')}>View Request History</button>

                </div>
                {isTableVisible && requests.length > 0 && (
                    <div className="request-history" ref={tableRef}>
                        <h2>Request History</h2>
                        <table className="citizen-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Assigned Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(request => (
                                    <tr key={request._id}>
                                        <td>{new Date(request.Date).toLocaleDateString()}</td>
                                        <td>{request.Time}</td>
                                        <td>{request.Status}</td>
                                        <td>{request.AssignedStatus}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CitizenDashboard;
