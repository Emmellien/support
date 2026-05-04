import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [report, setReport] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchDailyReport = async () => {
      try {
        const res = await axios.get('/api/reports/daily');
        setReport(res.data.data);
        setTotal(res.data.totalRevenue);
      } catch (err) {
        console.error("Error fetching report", err);
      }
    };
    fetchDailyReport();
  }, []);

  const handlePrint = (item) => {
    const billWindow = window.open('', '_blank');
    billWindow.document.write(`
      <html>
        <head><title>Bill - ${item.PlateNumber}</title></head>
        <body style="font-family: sans-serif; padding: 40px;">
          <h1 style="color: #1e40af;">SmartPark CRPMS - INVOICE</h1>
          <hr/>
          <p><strong>Date:</strong> ${item.Date}</p>
          <p><strong>Plate Number:</strong> ${item.PlateNumber}</p>
          <p><strong>Service:</strong> ${item.ServiceName}</p>
          <p><strong>Amount Paid:</strong> ${item.AmountPaid} Rwf</p>
          <p><strong>Issued by:</strong> ${item.Mechanic}</p>
          <br/>
          <p><em>Thank you for choosing SmartPark!</em></p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    billWindow.document.close();
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 bg-blue-50 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-900">Daily Repair Report</h2>
        <div className="text-right">
          <p className="text-sm text-blue-600 font-semibold uppercase">Total Revenue Today</p>
          <p className="text-2xl font-black text-blue-900">{total.toLocaleString()} Rwf</p>
        </div>
      </div>
      
      <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-4">Date/Time</th>
            <th className="p-4">Plate Number</th>
            <th className="p-4">Service</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {report.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              <td className="p-4 text-sm">{item.Date}</td>
              <td className="p-4 font-bold">{item.PlateNumber}</td>
              <td className="p-4">{item.ServiceName}</td>
              <td className="p-4 font-semibold text-green-700">{item.AmountPaid.toLocaleString()} Rwf</td>
              <td className="p-4">
                <button 
                  onClick={() => handlePrint(item)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Print Bill
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;