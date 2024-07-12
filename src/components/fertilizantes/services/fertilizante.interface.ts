export interface CreateFertilizanteProps {
  onClose: () => void;
}

export interface FertilizanteRequest {
  tipoFertilizante_id: number;
  cantidad: number;
  is_ficha?: boolean;
  ficha_id?: number;
  sede_id: number;
  anio_id: number;
}

export interface fertilizanteCollection {
  id: number;
  cantidad: number;
  is_ficha: boolean;
  ficha_id: number;
  anio: number;
  sede: string;
  clase: string;
  tipoFertilizante: string;
  porcentajeNit: number;
}
