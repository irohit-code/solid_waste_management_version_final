import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/viewassignedwork.css'; 

const CompleteWorkForm = ({ selectedWork }) => {
    const [formData, setFormData] = useState({
        workerName: '',
        contactNumber: '',
        requestId: '',
        requestDate: '',
        requestTime: '',
        requestAddress: '',
        bioWasteKg: 0,
        nonBioWasteKg: 0,
        totalWasteKg: 0,
        completedDate: new Date().toISOString().slice(0, 10) 
    });

    useEffect(() => {
        if (selectedWork) {
            setFormData({
                workerName: localStorage.getItem('workerName') || '',
                contactNumber: localStorage.getItem('contactNumber') || '',
                requestId: selectedWork.requestId || '',
                requestDate: selectedWork.requestDate || '',
                requestTime: selectedWork.requestTime || '',
                requestAddress: selectedWork.requestAddress || '',
                bioWasteKg: 0,
                nonBioWasteKg: 0,
                totalWasteKg: 0,
                completedDate: new Date().toISOString().slice(0, 10) 
            });
        }
    }, [selectedWork]);
    

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            totalWasteKg: Number(prevFormData.bioWasteKg) + Number(prevFormData.nonBioWasteKg)
        }));
    }, [formData.bioWasteKg, formData.nonBioWasteKg]);

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:7014/api/complete-work', formData);
            await axios.post(`http://localhost:7014/api/update-request-status/${formData.requestTime}`, { Status: 'Collected' })
            
        } catch (error) {
            console.error('Error completing work:', error);
        }
    };

    return (
        <div className="complete-work-form">
            <h2>Complete Work</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="workerName">Worker Name:</label>
                    <input type="text" id="workerName" name="workerName" value={formData.workerName} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number:</label>
                    <input type="text" id="contactNumber" name="contactNumber" value={formData.contactNumber} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="requestId">Request ID:</label>
                    <input type="text" id="requestId" name="requestId" value={formData.requestId} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="requestDate">Request Date:</label>
                    <input type="text" id="requestDate" name="requestDate" value={formData.requestDate} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="requestTime">Request Time:</label>
                    <input type="text" id="requestTime" name="requestTime" value={formData.requestTime} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="requestAddress">Request Address:</label>
                    <input type="text" id="requestAddress" name="requestAddress" value={formData.requestAddress} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="bioWasteKg">Bio Waste (kg):</label>
                    <input type="number" id="bioWasteKg" name="bioWasteKg" value={formData.bioWasteKg} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="nonBioWasteKg">Non-Bio Waste (kg):</label>
                    <input type="number" id="nonBioWasteKg" name="nonBioWasteKg" value={formData.nonBioWasteKg} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Total Waste (kg): {formData.totalWasteKg}</label>
                </div>
                <div className="form-group">
                    <label htmlFor="completedDate">Completed Date:</label>
                    <input type="date" id="completedDate" name="completedDate" value={formData.completedDate} onChange={handleChange} />
                </div>
                <button type="submit">Complete Work</button>
            </form>
        </div>
    );
};

const ViewAssignedWork = () => {
    const [assignedWork, setAssignedWork] = useState([]);
    const [selectedWork, setSelectedWork] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const workerEmail = localStorage.getItem('email');

        const fetchAssignedWork = async () => {
            try {
                const response = await axios.get(`http://localhost:7014/api/get-assigned-work/${workerEmail}`);
                
                const notCompletedWorks = response.data.filter(work => work.status !== 'Collected');
                
                setAssignedWork(notCompletedWorks);
                setErrorMessage(''); 
            } catch (error) {
                console.error('Error fetching assigned work:', error);
                setErrorMessage('Error fetching assigned work');
            }
        };

        fetchAssignedWork();
    }, []);

    const handleSelectWork = (work) => {
        setSelectedWork({
            ...work,
            workerName: localStorage.getItem('workerName'),
            contactNumber: localStorage.getItem('contactNumber'),
            completedDate: new Date().toISOString().split('T')[0],
            totalWasteKg: Number(work.bioWasteKg) + Number(work.nonBioWasteKg)
        });
    };

    const handleWorkCompleted = (completedWorkId) => {
        // Remove the completed work from the assignedWork state
        const updatedAssignedWork = assignedWork.filter(work => work._id !== completedWorkId);
        setAssignedWork(updatedAssignedWork);
    };

    return (
        <div className="assigned-work-page">
            <h2 className="assigned-work-title">Assigned Work</h2>
            {errorMessage && <p className="assigned-work-error">{errorMessage}</p>}
            <table className="assigned-work-table">
                <thead>
                    <tr>
                        <th className="table-header">Request ID</th>
                        <th className="table-header">Address</th>
                        <th className="table-header">Date</th>
                        <th className="table-header">Time</th>
                        <th className="table-header">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assignedWork.map(work => (
                        <tr key={work._id} className="table-row">
                            <td className="table-data">{work.requestId}</td>
                            <td className="table-data">{work.requestAddress}</td>
                            <td className="table-data">{new Date(work.requestDate).toLocaleDateString()}</td>
                            <td className="table-data">{work.requestTime}</td>
                            <td className="table-data">
                                <button onClick={() => {
                                    handleSelectWork(work);
                                    handleWorkCompleted(work._id); // Remove completed work from state
                                }}>Complete Work</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedWork && <CompleteWorkForm selectedWork={selectedWork} />}
        </div>
    );
};


export default ViewAssignedWork;
