export interface TipoCombustible {
  id: number;
  nombre: string;
  abreviatura: string;
  unidad: string;
  created_at: Date;
  updated_at: Date;
}

export interface TipoCombustibleRequest {
  nombre: string;
  abreviatura: string;
  unidad: string;
  valorCalorico: number;
  factorEmisionCO2: number;
  factorEmisionCH4: number;
  factorEmisionN2O: number;
}

export interface TipoCombustibleCollection {
  id: number;
  nombre: string;
  abreviatura: string;
  unidad: string;
  valorCalorico: number;
  factorEmisionCO2: number;
  factorEmisionCH4: number;
  factorEmisionN2O: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTipoCombustibleProps {
  onClose: () => void;
}

export interface UpdateTipoCombustibleProps {
  onClose: () => void;
  id: number;
}
