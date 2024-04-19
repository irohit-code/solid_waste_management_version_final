import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/requestgarbage.css';

const RequestGarbagePage = () => {
    const [formData, setFormData] = useState({
        CitizenName: '',
        ContactNumber: '',
        Address: '',
        Email: '',
        Date: '',
        Time: ''
    });
    const [errors, setErrors] = useState({});
    const [warning, setWarning] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            axios.get(`http://localhost:7014/api/citizen/${storedEmail}`)
                .then(response => {
                    const { name, contactNumber, address } = response.data;
                    setFormData(prevState => ({
                        ...prevState,
                        CitizenName: name,
                        ContactNumber: contactNumber,
                        Address: address,
                        Email: storedEmail
                    }));
                })
                .catch(error => console.error('Error fetching citizen information:', error));
        }
    }, []);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7); 
        const maxDateString = maxDate.toISOString().split('T')[0];
        document.getElementById('date-input').setAttribute('min', today);
        document.getElementById('date-input').setAttribute('max', maxDateString);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const selectedTime = new Date(`1970-01-01T${formData.Time}`);
            const hours = selectedTime.getHours() % 12 || 12;
            const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
            const ampm = selectedTime.getHours() >= 12 ? 'PM' : 'AM';
            const formattedTime = `${hours}:${minutes} ${ampm}`;
            const updatedFormData = { ...formData, Time: formattedTime };
    
            axios.post('http://localhost:7014/api/request-garbage', updatedFormData)
                .then(response => {
                    setSuccessMessage('Request submitted successfully!');
                    setTimeout(() => {
                        navigate('/citizen-dashboard');
                    }, 2000);
                })
                .catch(error => {
                    console.error('Error submitting request:', error);
                    setErrors({ general: 'An error occurred. Please try again later.' });
                    setTimeout(() => {
                        setErrors({});
                    }, 2000);
                });
        }
    };
    

    const validateForm = () => {
        let errors = {};
        const currentDate = new Date();
        const selectedDate = new Date(formData.Date);
        const selectedTime = new Date(`1970-01-01T${formData.Time}`);

        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
        if (selectedDate > maxDate) {
            setWarning('Please select a date within the next week');
            setTimeout(() => {
                setWarning('');
            }, 3000);
        }

        if (selectedDate < currentDate) {
            errors.Date = 'Date cannot be in the past';
        }

        if (selectedTime.getHours() < 7 || selectedTime.getHours() > 18) {
            errors.Time = 'Time must be between 7:00 AM and 6:00 PM';
        }

        if (!formData.Date) {
            errors.Date = 'Date is required';
        }
        if (!formData.Time) {
            errors.Time = 'Time is required';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0 && !warning;
    };

    return (
        <body className='gar-body'>
            <div className="request-garbage-container">
                <h2>Request Garbage Pickup</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Citizen Name:</label>
                        <input type="text" name="CitizenName" value={formData.CitizenName} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Contact Number:</label>
                        <input type="text" name="ContactNumber" value={formData.ContactNumber} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Address:</label>
                        <input type="text" name="Address" value={formData.Address} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="Email" value={formData.Email} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input id="date-input" type="date" name="Date" value={formData.Date} onChange={handleChange} />
                        {errors.Date && <span className="error">{errors.Date}</span>}
                    </div>
                    <div className="form-group">
                        <label>Time:</label>
                        <input type="time" name="Time" value={formData.Time} onChange={handleChange} />
                        {errors.Time && <span className="error">{errors.Time}</span>}
                        {warning && <span className="warning">{warning}</span>}
                    </div>
                    <button type="submit" className="submit-button-gar">Submit Request</button>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errors.general && <p className="error">{errors.general}</p>}
                </form>
            </div>
        </body>
    );
};

export default RequestGarbagePage;
