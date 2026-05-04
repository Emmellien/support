import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ ServiceName: '', ServicePrice: '' });

  const fetchServices = async () => {
    const res = await axios.get('/api/services');
    setServices(res.data);
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/services', formData);
    alert("Service Added Successfully");
    setFormData({ ServiceName: '', ServicePrice: '' });
    fetchServices();
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-600 h-fit">
        <h3 className="text-lg font-bold mb-4">Add Repair Service</h3>
        <input 
          type="text" placeholder="Service Name (e.g. Oil Change)" 
          className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          value={formData.ServiceName}
          onChange={(e) => setFormData({...formData, ServiceName: e.target.value})}
          required
        />
        <input 
          type="number" placeholder="Price (Rwf)" 
          className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
          value={formData.ServicePrice}
          onChange={(e) => setFormData({...formData, ServicePrice: e.target.value})}
          required
        />
        <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition">
          Save Service
        </button>
      </form>

      <div className="md:col-span-2 bg-white rounded-xl shadow-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Service Name</th>
              <th className="p-4 text-right">Price (Rwf)</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {services.map(s => (
              <tr key={s.ServiceCode} className="hover:bg-blue-50/30">
                <td className="p-4 text-gray-500">#{s.ServiceCode}</td>
                <td className="p-4 font-semibold">{s.ServiceName}</td>
                <td className="p-4 text-right font-mono text-blue-700">{Number(s.ServicePrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;