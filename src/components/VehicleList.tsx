
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  Edit2, 
  Trash2, 
  Plus, 
  Car, 
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Vehicle } from '../types';
import { vehicleService } from '../services/vehicleService';

const VehicleList: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadVehicles = async () => {
    const data = await vehicleService.getAll();
    setVehicles(data);
    setLoading(false);
  };

  useEffect(() => {
    loadVehicles();
    const interval = setInterval(loadVehicles, 15000); // Atualiza a cada 15s para simular tempo real
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Confirmar exclusão definitiva do registro na nuvem?')) {
      setLoading(true);
      await vehicleService.deleteVehicle(id);
      await loadVehicles();
    }
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => 
      v.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vehicles, searchTerm]);

  const getServiceBadge = (type: string) => {
    const styles: Record<string, string> = {
      revisao: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
      diagnostico: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
      manutencao: 'text-brand-red border-brand-red/30 bg-brand-red/10',
      eletrica: 'text-purple-400 border-purple-400/30 bg-purple-400/10'
    };
    return styles[type] || 'text-zinc-400 border-zinc-400/30 bg-zinc-400/10';
  };

  return (
    <div className="animate-slide">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase italic text-white">Frota <span className="text-brand-red">Compartilhada</span></h2>
          <p className="text-zinc-500 font-medium italic flex items-center gap-2">
            {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            Sincronizado com J-Imports Rio do Sul
          </p>
        </div>
        <Link 
          to="/registro" 
          className="bg-brand-red hover:bg-brand-darkRed text-white font-black py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-red/20 uppercase tracking-widest text-sm italic"
        >
          <Plus size={18} />
          Registrar Veículo
        </Link>
      </div>

      <div className="glass p-4 rounded-2xl border-zinc-800/50 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por placa, cliente ou modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-all"
          />
        </div>
      </div>

      {loading && vehicles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="glass p-5 rounded-2xl border-zinc-800/30 animate-pulse h-48"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.length > 0 ? filteredVehicles.map(v => (
            <div key={v.id} className="glass p-5 rounded-2xl border-zinc-800/30 hover:border-zinc-700 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-brand-red">
                    <Car size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white leading-tight uppercase tracking-tighter italic">{v.brand} {v.model}</h4>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 mt-1 inline-block">
                      {v.plate}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-tighter ${getServiceBadge(v.serviceType)}`}>
                  {v.serviceType}
                </span>
              </div>
              
              <div className="space-y-1 mb-6 border-l-2 border-brand-red/30 pl-3">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Cliente</span>
                  <span className="font-semibold text-zinc-200">{v.clientName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Ano/KM</span>
                  <span className="font-mono text-zinc-300">{v.year} • {v.mileage} KM</span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-zinc-800 pt-4">
                <button 
                  onClick={() => navigate(`/editar/${v.id}`)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                >
                  <Edit2 size={14} /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(v.id)}
                  className="flex-1 bg-brand-red/5 hover:bg-brand-red/15 text-brand-red py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                >
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center glass rounded-3xl border-dashed border-zinc-800">
              <AlertCircle size={48} className="text-zinc-800 mb-4" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs italic">Nenhum registro em nuvem</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleList;
