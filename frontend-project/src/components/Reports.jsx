import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [report, setReport] = useState([]);
  const [total, setTotal] = useState(0);
  // Default to today's date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchReport();
  }, [selectedDate]); // Refresh when date changes

  const fetchReport = async () => {
    try {
      // Pass the date as a query parameter
      const res = await axios.get(`/api/reports/daily?date=${selectedDate}`);
      setReport(res.data.data);
      setTotal(res.data.totalRevenue);
    } catch (err) {
      console.error("Error fetching report", err);
    }
  };

  const downloadCSV = () => {
    if (report.length === 0) return alert("No records found for this date.");

    const headers = ["Date", "Plate Number", "Model", "Service", "Mechanic", "Amount"];
    const csvContent = [
      headers.join(','),
      ...report.map(item => [
        `"${item.Date}"`,
        `"${item.PlateNumber}"`,
        `"${item.Model}"`,
        `"${item.ServiceName}"`,
        `"${item.Mechanic}"`,
        item.AmountPaid
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report_${selectedDate}.csv`;
    a.click();
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header Section */}
      <div className="p-6 bg-blue-50 border-b flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-blue-900">Repair Reports</h2>
          <div className="flex items-center mt-2 gap-2">
            <label className="text-sm font-medium text-gray-600">Choose Date:</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={downloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700"
          >
            Download CSV
          </button>
          <div className="text-right border-l pl-4">
            <p className="text-xs text-blue-600 font-semibold uppercase">Total Revenue</p>
            <p className="text-xl font-black text-blue-900">{total.toLocaleString()} Rwf</p>
          </div>
        </div>
      </div>
      
      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4">Date/Time</th>
              <th className="p-4">Plate</th>
              <th className="p-4">Service</th>
              <th className="p-4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {report.length > 0 ? report.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4 text-sm">{item.Date}</td>
                <td className="p-4 font-bold">{item.PlateNumber}</td>
                <td className="p-4">{item.ServiceName}</td>
                <td className="p-4 font-semibold text-green-700">{item.AmountPaid.toLocaleString()} Rwf</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-gray-400">No records found for this date.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;