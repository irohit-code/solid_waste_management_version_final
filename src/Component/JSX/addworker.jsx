import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/addworker.css'; 

const AddWorker = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [workingArea, setWorkingArea] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Perform client-side validation
      if (!name || !age || !email || !password || !contactNumber || !address || !workingArea) {
        setError('All fields are required');
        setTimeout(() => setError(''), 2000);
        return;
      }

      if (!isNaN(name)) {
        setError('Name should not contain numbers');
        setTimeout(() => setError(''), 2000);
        return;
      }

      if (isNaN(age) || parseInt(age) < 18) {
        setError('Age should be a number and greater than or equal to 18');
        setTimeout(() => setError(''), 2000);
        return;
      }

      await axios.post('http://localhost:7014/api/add-workers', {
        Name: name,
        Age: parseInt(age),
        Email: email,
        Password: password,
        ContactNumber: contactNumber,
        Address: address,
        WorkingArea: workingArea
      });

      setSuccess('Worker added successfully');
      setTimeout(() => {
        setSuccess('');
        navigate('/staff-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error adding worker:', error);
      setError('Failed to add worker');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div className="add-worker-container">
      <h2>Add Worker</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Working Area:</label>
          <input type="text" value={workingArea} onChange={(e) => setWorkingArea(e.target.value)} />
        </div>
        <button type="submit">Add Worker</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default AddWorker;
