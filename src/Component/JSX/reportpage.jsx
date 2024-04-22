import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../CSS/reportpage.css';

const ReportPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const tableRef = useRef(null);

  const fetchReportData = async () => {
    try {
      const response = await axios.get(`http://localhost:7014/api/get-report?startDate=${startDate}&endDate=${endDate}`);
      setReportData(response.data);
      setError(null);
      setShowTable(true);
    } catch (error) {
      setError('Error fetching report data');
      setShowTable(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e) => {
    if (tableRef.current && !tableRef.current.contains(e.target)) {
      setShowTable(false);
    }
  };

  return (
    <div className="report-page-container">
      <h2>Generate Report</h2>
      <form onSubmit={(e) => e.preventDefault()} className="report-form">
        <div className="form-group">
          <label htmlFor="startDate" className="form-label">Start Date:</label>
          <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="endDate" className="form-label">End Date:</label>
          <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-input" required />
        </div>
        <button type="button" onClick={fetchReportData} className="submit-button">Get Report</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      
      {showTable && (
        <div className="report-table" ref={tableRef}>
          <h3 className="report-header">Report</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th className="table-header">Worker Name</th>
                <th className="table-header">Total Bio Waste</th>
                <th className="table-header">Total Non Bio Waste</th>
                <th className="table-header">Total Waste</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((workerReport, index) => (
                <tr key={index}>
                  <td className="table-data">{workerReport._id}</td>
                  <td className="table-data">{workerReport.totalBioWaste}</td>
                  <td className="table-data">{workerReport.totalNonBioWaste}</td>
                  <td className="table-data">{workerReport.totalWaste}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
