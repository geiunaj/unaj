export interface GPW {
  id: number;
  nombre: string;
  formula: string;
  valor: number;
  created_at: Date;
  updated_at: Date;
}

export interface GPWRequest {
  nombre: string;
  formula: string;
  valor: number;
}

export interface GPWCollection {
  id: number;
  nombre: string;
  formula: string;
  valor: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateGPWProps {
  onClose: () => void;
}

export interface UpdateGPWProps {
  onClose: () => void;
  id: number;
}
