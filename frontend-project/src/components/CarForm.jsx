import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarForm = () => {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    PlateNumber: '',
    type: '',
    Model: '',
    ManufacturingYear: '',
    DriverPhone: '',
    MechanicName: ''
  });

  // Fetch cars on load
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get('/api/cars');
      setCars(res.data);
    } catch (err) {
      console.error("Failed to fetch cars", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/cars', formData);
      alert("Car Registered Successfully!");
      setFormData({ PlateNumber: '', type: '', Model: '', ManufacturingYear: '', DriverPhone: '', MechanicName: '' });
      fetchCars(); // Refresh the list
    } catch (err) {
      alert("Error adding car: " + err.response?.data?.error);
    }
  };

  const handleDelete = async (plate) => {
    if (window.confirm(`Are you sure you want to delete car ${plate}?`)) {
      try {
        await axios.delete(`/api/cars/${plate}`);
        fetchCars();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. INSERT FORM */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center">
          <span className="bg-blue-600 text-white p-2 rounded-lg mr-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          </span>
          Vehicle Registration
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Plate Number</label>
            <input required type="text" placeholder="e.g. RAE 123 A" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition"
              value={formData.PlateNumber} onChange={(e) => setFormData({...formData, PlateNumber: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Vehicle Type</label>
            <select required className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition"
              value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
              <option value="">Select Type</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Pickup">Pickup</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Model / Brand</label>
            <input required type="text" placeholder="e.g. Toyota Hilux" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition"
              value={formData.Model} onChange={(e) => setFormData({...formData, Model: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Year</label>
            <input type="number" placeholder="2024" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition"
              value={formData.ManufacturingYear} onChange={(e) => setFormData({...formData, ManufacturingYear: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Driver Phone</label>
            <input required type="text" placeholder="078..." className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition"
              value={formData.DriverPhone} onChange={(e) => setFormData({...formData, DriverPhone: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Assigned Mechanic</label>
            <input type="text" placeholder="Mechanic Name" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition"
              value={formData.MechanicName} onChange={(e) => setFormData({...formData, MechanicName: e.target.value})} />
          </div>

          <button className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all transform active:scale-95">
            Add Vehicle to System
          </button>
        </form>
      </div>

      {/* 2. RETRIEVE TABLE */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden max-w-6xl mx-auto">
        <div className="bg-slate-900 p-6 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Registered Fleet</h3>
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
            {cars.length} Vehicles
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Plate</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Type</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Model</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Phone</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cars.map((car) => (
                <tr key={car.PlateNumber} className="hover:bg-blue-50/50 transition">
                  <td className="p-4 font-black text-blue-700">{car.PlateNumber}</td>
                  <td className="p-4 text-slate-600">{car.type}</td>
                  <td className="p-4 text-slate-600">{car.Model}</td>
                  <td className="p-4 text-slate-600">{car.DriverPhone}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(car.PlateNumber)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cars.length === 0 && (
            <div className="p-10 text-center text-slate-400 italic">No vehicles found. Start by adding one above.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarForm;