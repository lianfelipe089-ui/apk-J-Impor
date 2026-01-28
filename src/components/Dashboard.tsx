import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  ClipboardList, 
  ChevronRight, 
  Activity,
  Wrench,
  ShieldCheck,
  MapPin,
  RefreshCw,
  Clock
} from 'lucide-react';
import { User, Vehicle } from '../types';
import { vehicleService } from '../services/vehicleService';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [stats, setStats] = useState({ total: 0, today: 0, revision: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const vehicles = await vehicleService.getAll();
    const today = new Date().toLocaleDateString('pt-BR');
    
    setStats({
      total: vehicles.length,
      today: vehicles.filter(v => new Date(v.createdAt).toLocaleDateString('pt-BR') === today).length,
      revision: vehicles.filter(v => v.serviceType === 'revisao').length
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Sincroniza a cada 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-slide pb-10">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-brand-red"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">J-Imports • Rio do Sul</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white italic uppercase">Operação <span className="text-brand-red">Cloud</span></h2>
          <p className="text-zinc-500 font-medium text-sm">Olá, {user.name.split(' ')[0]}. Sistema sincronizado em tempo real.</p>
        </div>
        
        <button 
          onClick={fetchData}
          className="flex items-center gap-3 bg-zinc-900/50 px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-colors"
        >
          {loading ? (
            <RefreshCw size={14} className="text-brand-red animate-spin" />
          ) : (
            <Clock size={14} className="text-green-500" />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
            {loading ? 'Sincronizando...' : 'Dados Atualizados'}
          </span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <Link to="/registro" className="group glass p-8 rounded-3xl hover:border-brand-red/50 transition-all duration-300">
          <div className="w-14 h-14 bg-brand-red rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-brand-red/20 group-hover:scale-105 transition-transform">
            <Plus className="text-white" size={28} />
          </div>
          <h3 className="text-2xl font-black mb-1 italic uppercase tracking-tighter text-white">Novo Registro</h3>
          <p className="text-zinc-500 text-sm mb-6 leading-tight">Cadastrar entrada de veículo na oficina.</p>
          <div className="flex items-center gap-2 text-brand-red font-bold text-[10px] uppercase tracking-widest italic">
            Acessar Formulário <ChevronRight size={14} />
          </div>
        </Link>

        <Link to="/veiculos" className="group glass p-8 rounded-3xl hover:border-zinc-500 transition-all duration-300">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-red transition-all">
            <ClipboardList className="text-white" size={28} />
          </div>
          <h3 className="text-2xl font-black mb-1 italic uppercase tracking-tighter text-white">Lista de Frota</h3>
          <p className="text-zinc-500 text-sm mb-6 leading-tight">Ver e gerenciar todos os serviços ativos.</p>
          <div className="flex items-center gap-2 text-white group-hover:text-brand-red font-bold text-[10px] uppercase tracking-widest italic transition-colors">
            Ver Todos <ChevronRight size={14} />
          </div>
        </Link>

        <div className="bg-gradient-to-br from-brand-red to-brand-darkRed p-8 rounded-3xl flex flex-col justify-between shadow-2xl shadow-brand-red/30 relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] opacity-10">
            <Activity size={180} />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Status Global</h3>
            <p className="text-white/60 text-[9px] font-black uppercase tracking-widest">Base de Dados Unificada</p>
          </div>
          <div className="mt-8 relative z-10">
            <span className="text-7xl font-black text-white block leading-none tracking-tighter">
              {loading ? '--' : stats.total}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50 italic">Veículos em Sistema</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Hoje', val: stats.today, icon: Activity, color: 'text-blue-500' },
          { label: 'Revisões', val: stats.revision, icon: Wrench, color: 'text-orange-500' },
          { label: 'SLA', val: '100%', icon: ShieldCheck, color: 'text-green-500' },
          { label: 'Unidade', val: 'Rio do Sul', icon: MapPin, color: 'text-brand-red' },
        ].map((item, i) => (
          <div key={i} className="glass px-5 py-4 rounded-2xl border-zinc-800/50 flex items-center gap-4">
            <div className={`p-2.5 rounded-xl bg-black/40 ${item.color}`}>
              <item.icon size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">{item.label}</p>
              <p className="text-lg font-black italic uppercase tracking-tighter text-white">{item.val}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;