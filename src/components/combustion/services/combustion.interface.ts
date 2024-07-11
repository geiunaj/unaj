export interface CreateCombustionProps {
  onClose: () => void;
}

export interface CombustionCollection {
  id: number;
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
  tipo: string;
  tipoEquipo: string;
  consumo: number;
  sede_id: number;
  tipoCombustible_id: number;
  mes_id: number;
  anio_id: number;
}
