import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/staffregister.css';

const StaffRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    Gender: '',
    Age: '',
    Address: '',
    WorkingArea: '',
    ContactNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.Name.trim()) {
      errors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]*$/.test(formData.Name.trim())) {
      errors.name = 'Name should only contain letters and spaces';
    }

    if (!formData.Email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email.trim())) {
      errors.email = 'Invalid email address';
    }

    if (!formData.Password) {
      errors.password = 'Password is required';
    } else if (formData.Password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (formData.Password !== formData.ConfirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.Gender) {
      errors.gender = 'Gender is required';
    }

    if (!formData.Age) {
      errors.age = 'Age is required';
    } else if (isNaN(formData.Age)) {
      errors.age = 'Age must be a number';
    }

    if (!formData.Address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.WorkingArea.trim()) {
      errors.workingArea = 'Working area is required';
    }

    if (!formData.ContactNumber.trim()) {
      errors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.ContactNumber.trim())) {
      errors.contactNumber = 'Contact number must be a 10-digit number';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:7014/api/staff/register', formData);
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        navigate('/head-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error registering staff:', error);
    }
  };

  return (
    <div className="staff-registration-form">
      <h2>Staff Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="Name" value={formData.Name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="Email" value={formData.Email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="Password" value={formData.Password} onChange={handleChange} />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input type="password" name="ConfirmPassword" value={formData.ConfirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select name="Gender" value={formData.Gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input type="text" name="Age" value={formData.Age} onChange={handleChange} />
          {errors.age && <span className="error">{errors.age}</span>}
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input type="text" name="Address" value={formData.Address} onChange={handleChange} />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>
        <div className="form-group">
          <label>Working Area:</label>
          <input type="text" name="WorkingArea" value={formData.WorkingArea} onChange={handleChange} />
          {errors.workingArea && <span className="error">{errors.workingArea}</span>}
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input type="text" name="ContactNumber" value={formData.ContactNumber} onChange={handleChange} />
          {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}
        </div>
        <button type="submit">Register</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default StaffRegister;
