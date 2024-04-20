import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/assignwork.css'; 

const AssignWork = () => {
  const [requests, setRequests] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:7014/api/get-requests');
        setRequests(response.data.filter(request => request.Status === 'Not Collected' && request.AssignedStatus === 'Not Assigned'));
      } catch (error) {
        console.error('Error fetching requests:', error);
        setErrorMessage('Error fetching requests');
      }
    };

    const fetchWorkers = async () => {
      try {
        const response = await axios.get('http://localhost:7014/api/get-worker');
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
      const response = await axios.post('http://localhost:7014/api/assign-work', {
        selectedRequests,
        selectedWorker
      });
      if (response.data.success) {
        setSuccessMessage('Work assigned successfully');
        setSelectedRequests([]);
        setSelectedWorker('');

        const updatedRequests = requests.filter(request => !selectedRequests.includes(request._id));
        setRequests(updatedRequests);
      } else {
        setErrorMessage('Failed to assign work');
      }
    } catch (error) {
      console.error('Error assigning work:', error);
      setErrorMessage('Error assigning work');
    }
  };

  const handleRequestSelection = (requestId) => {
    const index = selectedRequests.indexOf(requestId);
    if (index === -1) {
      setSelectedRequests([...selectedRequests, requestId]);
    } else {
      const updatedSelection = [...selectedRequests];
      updatedSelection.splice(index, 1);
      setSelectedRequests(updatedSelection);
    }
  };

  return (
    <div className="assign-work-container">
      <h2 className="assign-work-title">Assign Work</h2>
      {errorMessage && <p className="assign-work-error">{errorMessage}</p>}
      {successMessage && <p className="assign-work-success">{successMessage}</p>}
      <div className="request-list-container">
        <h3 className="request-list-title">Requests:</h3>
        <table className="request-table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Date</th>
              <th>Time</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request._id}>
                <td>{request.Address}</td>
                <td>{new Date(request.Date).toLocaleDateString()}</td>
                <td>{request.Time}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRequests.includes(request._id)}
                    onChange={() => handleRequestSelection(request._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="workers-list-container">
        <h3 className="workers-list-title">Workers:</h3>
        <select className="workers-list-select" value={selectedWorker} onChange={(e) => setSelectedWorker(e.target.value)}>
          <option value="">Select Worker</option>
          {workers.map(worker => (
            <option key={worker._id} value={worker._id}>
              {worker.Name} - {worker.WorkingArea} - {worker.ContactNumber}
            </option>
          ))}
        </select>
      </div>
      <button className="assign-work-button" onClick={handleAssignWork}>Assign Work</button>
    </div>
  );
};

export default AssignWork;
