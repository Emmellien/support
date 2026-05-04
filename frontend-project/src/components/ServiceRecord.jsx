import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceRecord = () => {
  // Data States
  const [records, setRecords] = useState([]);
  const [services, setServices] = useState([]);
  const [cars, setCars] = useState([]);
  
  // UI Control States
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ 
    PlateNumber: '', 
    ServiceCode: '', 
    AmountPaid: '', 
    Notes: '' 
  });

  // Auth Header
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  // 1. Initial Data Load
  useEffect(() => {
    fetchData();
  }, [page]); // Re-fetch when page changes

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRecs, resServs, resCars] = await Promise.all([
        axios.get(`/api/records/reports?page=${page}&limit=5`, config),
        axios.get('/api/services', config),
        axios.get('/api/records/cars/list', config)
      ]);
      
      // Update states with backend response
      setRecords(resRecs.data.data);
      setTotalPages(resRecs.data.totalPages);
      setServices(resServs.data);
      setCars(resCars.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Service Selection (Auto-fill price)
  const handleServiceChange = (e) => {
    const code = e.target.value;
    const selected = services.find(s => s.ServiceCode == code);
    setFormData({
      ...formData,
      ServiceCode: code,
      AmountPaid: selected ? selected.ServicePrice : ''
    });
  };

  // 3. Create or Update Record
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE: PUT Request
        await axios.put(`/api/records/${editingId}`, formData, config);
        alert("Record updated successfully!");
      } else {
        // CREATE: POST Request
        await axios.post('/api/records/checkout', formData, config);
        alert("Checkout transaction completed!");
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert("Error: " + (err.response?.data?.details || "Operation failed"));
    }
  };

  // 4. Delete Record
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record and its payment?")) {
      try {
        await axios.delete(`/api/records/${id}`, config);
        fetchData();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  // 5. Generate and Print Bill (Receipt)
  const handlePrint = async (id) => {
    try {
      const res = await axios.get(`/api/records/bill/${id}`, config);
      const b = res.data;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head><title>Receipt - ${b.PlateNumber}</title></head>
          <body style="font-family: Arial; padding: 40px; border: 1px solid #eee; max-width: 400px; margin: auto;">
            <h2 style="text-align: center;">SMARTPARK CRPMS</h2>
            <p style="text-align: center;">Official Service Receipt</p>
            <hr/>
            <p><strong>Rec No:</strong> SR-${b.RecordNumber}</p>
            <p><strong>Date:</strong> ${new Date(b.ServiceDate).toLocaleString()}</p>
            <p><strong>Plate:</strong> ${b.PlateNumber}</p>
            <p><strong>Model:</strong> ${b.Model}</p>
            <p><strong>Service:</strong> ${b.ServiceName}</p>
            <div style="background: #000; color: #fff; padding: 10px; margin-top: 20px;">
              <h3 style="margin: 0; text-align: right;">Total: ${Number(b.AmountPaid).toLocaleString()} Rwf</h3>
            </div>
            <p style="margin-top: 20px;"><strong>Cashier:</strong> ${b.Cashier}</p>
            <p style="text-align: center; font-size: 10px; margin-top: 40px;">Thank you for your visit!</p>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      alert("Could not generate bill");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ PlateNumber: '', ServiceCode: '', AmountPaid: '', Notes: '' });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8 bg-gray-50 min-h-screen">
      
      {/* --- FORM SECTION --- */}
      <div className="lg:w-1/3">
        <div className={`p-8 rounded-3xl shadow-2xl transition-all border-t-8 ${editingId ? 'bg-amber-50 border-amber-500' : 'bg-white border-blue-600'}`}>
          <h2 className="text-2xl font-black text-gray-800 mb-6">
            {editingId ? '🛠️ EDIT RECORD' : '🧾 NEW CHECKOUT'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Vehicle Plate</label>
              <select 
                disabled={!!editingId}
                className="w-full mt-1 p-3 border rounded-xl bg-gray-50 outline-none focus:border-blue-500"
                value={formData.PlateNumber}
                onChange={(e) => setFormData({...formData, PlateNumber: e.target.value})}
                required
              >
                <option value="">-- Choose Plate --</option>
                {cars.map(c => <option key={c.PlateNumber} value={c.PlateNumber}>{c.PlateNumber}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Service Provided</label>
              <select 
                className="w-full mt-1 p-3 border rounded-xl bg-gray-50 outline-none focus:border-blue-500"
                value={formData.ServiceCode}
                onChange={handleServiceChange}
                required
              >
                <option value="">-- Select Service --</option>
                {services.map(s => <option key={s.ServiceCode} value={s.ServiceCode}>{s.ServiceName}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Amount (Rwf)</label>
              <input 
                type="number" 
                disabled={!!editingId}
                className="w-full mt-1 p-3 border rounded-xl bg-gray-50 outline-none"
                value={formData.AmountPaid}
                onChange={(e) => setFormData({...formData, AmountPaid: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Mechanical Notes</label>
              <textarea 
                className="w-full mt-1 p-3 border rounded-xl bg-gray-50 outline-none h-24"
                value={formData.Notes}
                onChange={(e) => setFormData({...formData, Notes: e.target.value})}
                placeholder="Details of the repair..."
              />
            </div>

            <button className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transform transition active:scale-95 ${editingId ? 'bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {editingId ? 'SAVE UPDATE' : 'COMPLETE & PAY'}
            </button>
            
            {editingId && (
              <button type="button" onClick={resetForm} className="w-full text-gray-400 text-sm font-bold hover:underline">
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>

      {/* --- TABLE & PAGINATION SECTION --- */}
      <div className="lg:w-2/3 space-y-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gray-800 p-6 flex justify-between items-center text-white">
            <h3 className="font-bold tracking-widest uppercase">Service Logs</h3>
            <span className="text-xs bg-blue-500 px-2 py-1 rounded">Page {page}</span>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-400 border-b">
                <th className="p-4 uppercase">Car Plate</th>
                <th className="p-4 uppercase">Service</th>
                <th className="p-4 uppercase">Total Price</th>
                <th className="p-4 text-center uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="4" className="p-10 text-center italic text-gray-400">Loading records...</td></tr>
              ) : records.map((r) => (
                <tr key={r.RecordNumber} className="hover:bg-blue-50 transition">
                  <td className="p-4">
                    <div className="font-black text-gray-700">{r.PlateNumber}</div>
                    <div className="text-[10px] text-gray-400">{new Date(r.ServiceDate).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{r.ServiceName}</td>
                  <td className="p-4 font-black text-emerald-600">{Number(r.AmountPaid).toLocaleString()} Rwf</td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2">
                      <button onClick={() => {setEditingId(r.RecordNumber); setFormData({PlateNumber: r.PlateNumber, ServiceCode: r.ServiceCode, Notes: r.Notes, AmountPaid: r.AmountPaid})}} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">Edit</button>
                      <button onClick={() => handlePrint(r.RecordNumber)} className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold">Bill</button>
                      <button onClick={() => handleDelete(r.RecordNumber)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)} 
            className="px-6 py-2 bg-gray-100 text-gray-500 rounded-xl font-bold disabled:opacity-20 transition hover:bg-gray-200"
          >
            PREVIOUS
          </button>
          
          <div className="text-gray-400 text-sm font-bold">
            PAGE <span className="text-blue-600">{page}</span> / {totalPages}
          </div>

          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)} 
            className="px-6 py-2 bg-gray-100 text-gray-500 rounded-xl font-bold disabled:opacity-20 transition hover:bg-gray-200"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRecord;