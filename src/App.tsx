import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { User } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VehicleRegistration from './components/VehicleRegistration';
import VehicleList from './components/VehicleList';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('jimports_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jimports_user');
    setUser(null);
    setIsSidebarOpen(false);
  };

  const SidebarItem: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return (
      <Link 
        to={to} 
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
          isActive 
            ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' 
            : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
        }`}
      >
        {icon}
        <span className="font-bold uppercase tracking-widest text-[11px] italic">{label}</span>
      </Link>
    );
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white flex overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-zinc-900 z-50 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-red flex items-center justify-center rounded-lg">
              <span className="font-black italic text-sm">J</span>
            </div>
            <h1 className="font-black tracking-tighter text-xl italic">J-IMPORTS</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-brand-red">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-0 z-40 bg-zinc-950 border-r border-zinc-900 w-72 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col p-6">
            <div className="mb-10 hidden lg:flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-red flex items-center justify-center rounded-xl rotate-2 shadow-lg shadow-brand-red/30">
                <span className="font-black italic text-xl">JI</span>
              </div>
              <div>
                <h1 className="font-black tracking-tighter text-2xl italic leading-none">J-IMPORTS</h1>
                <p className="text-[9px] text-zinc-500 tracking-[0.3em] uppercase font-bold mt-1">Rio do Sul • SC</p>
              </div>
            </div>

            <nav className="flex-1 space-y-2 mt-16 lg:mt-0">
              <p className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.3em] px-4 mb-4">Gestão Interna</p>
              <SidebarItem to="/" icon={<LayoutDashboard size={18} />} label="Painel Geral" />
              <SidebarItem to="/registro" icon={<PlusCircle size={18} />} label="Nova Entrada" />
              <SidebarItem to="/veiculos" icon={<List size={18} />} label="Frota Atual" />
              
              <div className="pt-8">
                <p className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.3em] px-4 mb-4">Usuário</p>
                <SidebarItem to="/perfil" icon={<UserIcon size={18} />} label="Meu Perfil" />
                {user.role === 'admin' && (
                   <SidebarItem to="/admin" icon={<ShieldCheck size={18} />} label="Admin Cloud" />
                )}
              </div>
            </nav>

            <div className="mt-auto border-t border-zinc-900 pt-6">
              <div className="flex items-center gap-3 px-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-brand-red">
                  <UserIcon size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-black italic uppercase tracking-tighter truncate">{user.name}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-zinc-500 hover:text-brand-red hover:bg-brand-red/5 transition-all duration-300 border border-transparent hover:border-brand-red/20"
              >
                <LogOut size={18} />
                <span className="font-bold uppercase tracking-widest text-[11px] italic">Encerrar Sessão</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen pt-16 lg:pt-0 overflow-y-auto bg-black relative">
          <div className="p-4 lg:p-10 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/registro" element={<VehicleRegistration />} />
              <Route path="/editar/:id" element={<VehicleRegistration />} />
              <Route path="/veiculos" element={<VehicleList />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;