
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Car, User, FileText, Loader2 } from 'lucide-react';
import { Vehicle } from '../types';
import { vehicleService } from '../services/vehicleService';

const VehicleRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  const [formData, setFormData] = useState<Omit<Vehicle, 'id' | 'createdAt'>>({
    clientName: '',
    phone: '',
    email: '',
    brand: '',
    model: '',
    year: '',
    plate: '',
    mileage: '',
    serviceType: 'manutencao',
    observations: ''
  });

  useEffect(() => {
    if (isEditing) {
      const loadVehicleData = async () => {
        setFetching(true);
        const vehicles = await vehicleService.getAll();
        const vehicle = vehicles.find(v => v.id === id);
        if (vehicle) {
          const { id: _, createdAt: __, ...data } = vehicle;
          setFormData(data);
        } else {
          alert('Veículo não encontrado ou excluído.');
          navigate('/veiculos');
        }
        setFetching(false);
      };
      loadVehicleData();
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    let isSuccess = false;

    try {
      if (isEditing) {
        isSuccess = await vehicleService.updateVehicle(id!, formData);
      } else {
        isSuccess = await vehicleService.addVehicle(formData);
      }

      if (isSuccess) {
        navigate('/veiculos');
      } else {
        throw new Error('Falha na persistência');
      }
    } catch (error) {
      alert('Erro crítico ao salvar as informações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-brand-red mb-4" size={40} />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] italic">Carregando registro...</p>
      </div>
    );
  }

  return (
    <div className="animate-slide pb-10">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase italic text-white">
            {isEditing ? 'Editar' : 'Novo'} <span className="text-brand-red">Registro</span>
          </h2>
          <p className="text-zinc-500 font-medium text-xs">Unidade Rio do Sul • Sincronização Ativa</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sessão Cliente */}
          <div className="glass p-6 rounded-2xl border-zinc-800/50 space-y-4">
            <div className="flex items-center gap-2 text-brand-red mb-2">
              <User size={18} />
              <h3 className="font-bold uppercase tracking-widest text-[10px]">Dados do Cliente</h3>
            </div>
            <div>
              <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Nome Completo</label>
              <input 
                type="text" name="clientName" required value={formData.clientName} onChange={handleChange}
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-red transition-all"
                placeholder="Ex: João Silva"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">WhatsApp</label>
                <input 
                  type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-red"
                  placeholder="(47) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">E-mail</label>
                <input 
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-red"
                  placeholder="cliente@email.com"
                />
              </div>
            </div>
          </div>

          {/* Sessão Veículo */}
          <div className="glass p-6 rounded-2xl border-zinc-800/50 space-y-4">
            <div className="flex items-center gap-2 text-brand-red mb-2">
              <Car size={18} />
              <h3 className="font-bold uppercase tracking-widest text-[10px]">Dados do Veículo</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Marca</label>
                <input 
                  type="text" name="brand" required value={formData.brand} onChange={handleChange}
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Modelo</label>
                <input 
                  type="text" name="model" required value={formData.model} onChange={handleChange}
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Ano</label>
                <input 
                  type="text" name="year" required value={formData.year} onChange={handleChange}
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-red"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Placa</label>
                <input 
                  type="text" name="plate" required value={formData.plate} onChange={handleChange}
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-red font-mono uppercase"
                  placeholder="BRA2E19"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sessão Serviço */}
        <div className="glass p-6 rounded-2xl border-zinc-800/50 space-y-4">
          <div className="flex items-center gap-2 text-brand-red mb-2">
            <FileText size={18} />
            <h3 className="font-bold uppercase tracking-widest text-[10px]">Ordem de Serviço</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">KM Atual</label>
              <input 
                type="text" name="mileage" required value={formData.mileage} onChange={handleChange}
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-red"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Tipo de Serviço</label>
              <select 
                name="serviceType" value={formData.serviceType} onChange={handleChange}
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-red appearance-none"
              >
                <option value="manutencao">Manutenção Geral</option>
                <option value="revisao">Revisão Periódica</option>
                <option value="diagnostico">Diagnóstico</option>
                <option value="eletrica">Elétrica</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Observações Técnicas</label>
            <textarea 
              name="observations" rows={4} value={formData.observations} onChange={handleChange}
              className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-red resize-none text-sm"
              placeholder="Descreva o serviço a ser realizado..."
            ></textarea>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-brand-red hover:bg-brand-darkRed text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-brand-red/20 uppercase tracking-widest italic disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          {loading ? 'Sincronizando...' : isEditing ? 'Confirmar Alterações' : 'Finalizar Registro'}
        </button>
      </form>
    </div>
  );
};

export default VehicleRegistration;
