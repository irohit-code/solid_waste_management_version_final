import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/registerpage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Address: '',
        ContactNumber: '',
        Email: '',
        Password: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateForm = () => {
        let errors = {};
        if (!formData.Name.trim()) {
            errors.Name = 'Name is required';
        } else if (!/^[a-zA-Z\s]*$/.test(formData.Name.trim())) {
            errors.Name = 'Name should only contain letters and spaces';
        }
        if (!formData.Address.trim()) {
            errors.Address = 'Address is required';
        }
        if (!formData.ContactNumber.trim()) {
            errors.ContactNumber = 'Contact Number is required';
        } else if (!/^\d{10}$/.test(formData.ContactNumber.trim())) {
            errors.ContactNumber = 'Contact Number must be a 10-digit number';
        }
        if (!formData.Email.trim()) {
            errors.Email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.Email.trim())) {
            errors.Email = 'Email is invalid';
        }
        if (!formData.Password.trim()) {
            errors.Password = 'Password is required';
        } else if (formData.Password.trim().length < 6) {
            errors.Password = 'Password must be at least 6 characters long';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post('http://localhost:7014/api/citizen/register', formData);
                setMessage(response.data.message);
                setFormData({
                    Name: '',
                    Address: '',
                    ContactNumber: '',
                    Email: '',
                    Password: ''
                });
            } catch (error) {
                setMessage('Registration failed. Please try again.');
            }
        }
    };

    return (
        <body className='reg-body'>
            <div className="register-container">
                <h2>Register (As a Citizen)</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label className='reg-label'>Name:</label>
                        <input type="text" name="Name" value={formData.Name} onChange={handleChange} className='reg-inp' />
                        {errors.Name && <span className="error-message">{errors.Name}</span>}
                    </div>
                    <div className="form-group">
                        <label className='reg-label'>Address:</label>
                        <input className='reg-inp' type="text" name="Address" value={formData.Address} onChange={handleChange} />
                        {errors.Address && <span className="error-message">{errors.Address}</span>}
                    </div>
                    <div className="form-group">
                        <label className='reg-label'>Contact Number:</label>
                        <input className='reg-inp' type="text" name="ContactNumber" value={formData.ContactNumber} onChange={handleChange} />
                        {errors.ContactNumber && <span className="error-message">{errors.ContactNumber}</span>}
                    </div>
                    <div className="form-group">
                        <label className='reg-label'>Email:</label>
                        <input className='reg-inp' type="text" name="Email" value={formData.Email} onChange={handleChange} />
                        {errors.Email && <span className="error-message">{errors.Email}</span>}
                    </div>
                    <div className="form-group">
                        <label className='reg-label'>Password:</label>
                        <input className='reg-inp' type="password" name="Password" value={formData.Password} onChange={handleChange} />
                        {errors.Password && <span className="error-message">{errors.Password}</span>}
                    </div>
                    <button type="submit" className="register-button">Register</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </body>
    );
};

export default RegisterPage;
