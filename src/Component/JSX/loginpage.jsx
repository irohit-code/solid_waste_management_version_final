import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/loginpage.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        Email: '',
        Password: '',
        role: 'Citizen'
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.Email || !formData.Password) {
                setErrorMessage('Please enter both email and password.');
                return;
            }

            if (!validateEmail(formData.Email)) {
                setErrorMessage('Please enter a valid email address.');
                return;
            }

            const response = await axios.post('http://localhost:7014/api/login', formData);
            if (response.status === 200) {
                localStorage.setItem('email', formData.Email);

                switch (formData.role) {
                    case 'Citizen':
                        navigate('/citizen-dashboard');
                        break;
                    case 'Head':
                        navigate('/head-dashboard');
                        break;
                    case 'Staff':
                        navigate('/staff-dashboard');
                        break;
                    case 'Worker':
                        navigate('/worker-dashboard');
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            console.error('Login Error:', error);
            setErrorMessage('Invalid email or password. Please try again.');
        }
    };

    return (
        <body className='login-body'>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="input-group">
                        <label>Email:</label>
                        <input type="email" name="Email" value={formData.Email} onChange={handleChange} placeholder="Enter your email" />
                    </div>
                    <div className="input-group">
                        <label>Password:</label>
                        <input type="password" name="Password" value={formData.Password} onChange={handleChange} placeholder="Enter your password" />
                    </div>
                    <div className="input-group">
                        <label>Role:</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="Citizen">Citizen</option>
                            <option value="Head">Head</option>
                            <option value="Staff">Staff</option>
                            <option value="Worker">Worker</option>
                        </select>
                    </div>
                    <button type="submit" className="loginn-button">Login</button>
                </form>
            </div>
        </body>
    );
};

export default LoginPage;
