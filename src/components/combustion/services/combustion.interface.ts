export interface AddFromProps {
  onClose: () => void;
}

export interface CombustionCollection {
  id: number;
  nombre: string;
  tipo: string;
  tipoEquipo: string;
  consumo: number;
  mes: string;
  anio: number;
  tipoCombustible: string;
  unidad: string;
  sede: string;
}

export interface CombustionRequest {
  nombre: string;
  tipo: string;
  tipoEquipo: string;
  consumo: number;
  tipoCombustibleId: number;
  mesId: number;
  anioId: number;
  sedeId: number;
}
