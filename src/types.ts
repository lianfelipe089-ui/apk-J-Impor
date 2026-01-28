
export type ServiceType = 'manutencao' | 'revisao' | 'diagnostico' | 'eletrica' | 'outro';

export interface Vehicle {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  brand: string;
  model: string;
  year: string;
  plate: string;
  mileage: string;
  serviceType: ServiceType;
  observations: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
}
