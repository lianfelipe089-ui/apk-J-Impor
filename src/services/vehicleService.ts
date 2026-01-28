
import { Vehicle } from '../types';

// Chave para persistência local robusta
const STORAGE_KEY = 'jimports_vehicles_db';

// Simulação de latência de rede para comportamento de App Profissional
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback para geração de ID caso crypto.randomUUID não esteja disponível
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const vehicleService = {
  async getAll(): Promise<Vehicle[]> {
    try {
      await delay(300); // Simula busca na nuvem
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const vehicles = JSON.parse(data);
      return Array.isArray(vehicles) ? vehicles : [];
    } catch (error) {
      console.error("Erro ao ler banco de dados:", error);
      return [];
    }
  },

  async saveAll(vehicles: Vehicle[]): Promise<boolean> {
    try {
      await delay(500); // Simula sincronização cloud
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
      return true;
    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
      return false;
    }
  },

  async addVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt'>): Promise<boolean> {
    const vehicles = await this.getAll();
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    vehicles.push(newVehicle);
    return this.saveAll(vehicles);
  },

  async updateVehicle(id: string, updatedData: Partial<Vehicle>): Promise<boolean> {
    const vehicles = await this.getAll();
    const index = vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      vehicles[index] = { ...vehicles[index], ...updatedData };
      return this.saveAll(vehicles);
    }
    return false;
  },

  async deleteVehicle(id: string): Promise<boolean> {
    const vehicles = await this.getAll();
    const filtered = vehicles.filter(v => v.id !== id);
    return this.saveAll(filtered);
  }
};
