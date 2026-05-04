import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, Settings, FileText, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalServices: 0,
    todayRevenue: 0,
    recentRecords: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch your existing endpoints to aggregate data
        const [cars, reports] = await Promise.all([
          axios.get('http://localhost:5000/api/cars', { headers }),
          axios.get(`http://localhost:5000/api/reports/daily`, { headers })
        ]);

        setStats({
          totalCars: cars.data.length || 0,
          totalServices: reports.data.count || 0,
          todayRevenue: reports.data.totalRevenue || 0,
          recentRecords: reports.data.data.slice(0, 5) // Last 5 activities
        });
      } catch (err) {
        console.error("Error fetching dashboard stats", err);
      }
    };
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-slate-800 mt-1">{value}</p>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>
        <p className="text-slate-500">Welcome back to the SmartPark Management System.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Registered Cars" 
          value={stats.totalCars} 
          icon={Car} 
          color="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Services Today" 
          value={stats.totalServices} 
          icon={Settings} 
          color="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Today's Revenue" 
          value={`${stats.todayRevenue.toLocaleString()} Rwf`} 
          icon={DollarSign} 
          color="bg-emerald-100 text-emerald-600" 
        />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Recent Service Activity</h2>
          <TrendingUp size={20} className="text-slate-400" />
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Plate Number</th>
              <th className="p-4">Service</th>
              <th className="p-4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {stats.recentRecords.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700">{item.PlateNumber}</td>
                <td className="p-4 text-slate-600">{item.ServiceName}</td>
                <td className="p-4 text-emerald-600 font-semibold">{item.AmountPaid} Rwf</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;