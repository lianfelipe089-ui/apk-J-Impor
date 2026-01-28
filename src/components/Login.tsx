import React, { useState } from 'react';
import { User } from '../types';
import { ArrowRight, Wrench, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@jimports.com' && password === 'admin123') {
      const user: User = { id: '1', name: 'Admin J-Imports', email: 'admin@jimports.com', role: 'admin' };
      localStorage.setItem('jimports_user', JSON.stringify(user));
      onLogin(user);
    } else {
      setError('Acesso negado. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-red/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-white/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md animate-slide">
        <div className="text-center mb-10">
          <div className="inline-flex w-20 h-20 bg-brand-red items-center justify-center rounded-2xl rotate-3 shadow-2xl shadow-brand-red/40 mb-6">
            <Wrench className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-black tracking-tighter italic text-white mb-2">J-IMPORTS</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Rio do Sul • Gestão Interna</p>
        </div>

        <div className="glass p-8 rounded-3xl border border-zinc-800">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1 italic">E-mail Corporativo</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-brand-red transition-all font-medium"
                placeholder="nome@jimports.com"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1 italic">Senha de Acesso</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-brand-red transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-black hover:bg-brand-red hover:text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 uppercase tracking-widest text-sm italic group"
            >
              Autenticar 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
          © J-Imports Rio do Sul | 2024
        </p>
      </div>
    </div>
  );
};

export default Login;