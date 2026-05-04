import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Settings, 
  ClipboardList, 
  BarChart3, 
  LogOut, 
  UserCircle 
} from 'lucide-react';

// Import your components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CarForm from './components/CarForm';
import Services from './components/Services';
import ServiceRecord from './components/ServiceRecord';
import Reports from './components/Reports';

// 1. Sidebar Component
const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Car Management', path: '/car', icon: Car },
    { name: 'Services', path: '/services', icon: Settings },
    { name: 'Service Records', path: '/records', icon: ClipboardList },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-20">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Car size={20} className="text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight">SmartPark</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => { localStorage.clear(); window.location.href = "/"; }}
          className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

// 2. Header Component
const Header = () => {
  const username = localStorage.getItem('username') || 'User';
  
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h2 className="text-slate-400 text-sm font-medium">System / Overview</h2>
        <p className="text-slate-800 font-bold text-lg">Welcome back, {username}!</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-900 leading-none">{username}</p>
          <p className="text-xs text-blue-600 font-medium">Administrator</p>
        </div>
        <div className="bg-slate-100 p-2 rounded-full text-slate-600">
          <UserCircle size={28} />
        </div>
      </div>
    </header>
  );
};

// 3. Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" />;
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* All Business Pages wrapped in the same Protected Layout */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/car" element={<ProtectedRoute><CarForm /></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute><ServiceRecord /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;