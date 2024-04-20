import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignWorkPage = () => {
  const [requests, setRequests] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:7014/api/requests');
        setRequests(response.data.filter(request => request.status === 'Not Collected' && request.assignedStatus === 'Not Assigned'));
      } catch (error) {
        console.error('Error fetching requests:', error);
        setErrorMessage('Error fetching requests');
      }
    };

    const fetchWorkers = async () => {
      try {
        const response = await axios.get('http://localhost:7014/api/workers');
        setWorkers(response.data);
      } catch (error) {
        console.error('Error fetching workers:', error);
        setErrorMessage('Error fetching workers');
      }
    };

    fetchRequests();
    fetchWorkers();
  }, []);

  const handleAssignWork = async () => {
    try {
      await axios.put('http://localhost:7014/api/requests/assign', {
        requests: selectedRequests,
        worker: selectedWorker
      });
      // Update UI or show success message
    } catch (error) {
      console.error('Error assigning work:', error);
      setErrorMessage('Error assigning work');
    }
  };

  const handleRequestSelect = requestId => {
    setSelectedRequests(prevSelected => {
      if (prevSelected.includes(requestId)) {
        return prevSelected.filter(id => id !== requestId);
      } else {
        return [...prevSelected, requestId];
      }
    });
  };

  return (
    <div>
      <h1>Assign Work</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <h2>Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Request ID</th>
            {/* Add more headers as needed */}
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request._id}>
              <td>{request._id}</td>
              {/* Add more columns as needed */}
              <td><input type="checkbox" onChange={() => handleRequestSelect(request._id)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Workers</h2>
      <select value={selectedWorker} onChange={e => setSelectedWorker(e.target.value)}>
        <option value="">Select Worker</option>
        {workers.map(worker => (
          <option key={worker._id} value={worker.email}>{worker.name}</option>
        ))}
      </select>
      <button onClick={handleAssignWork}>Assign Work</button>
    </div>
  );
};

export default AssignWorkPage;
