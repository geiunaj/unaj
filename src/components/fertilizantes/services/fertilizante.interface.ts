import { Sede } from "@/components/sede/services/sede.interface";
import { Anio } from "@prisma/client";

export interface CreateFertilizanteProps {
  onClose: () => void;
}

export interface UpdateFertilizanteProps {
  id: number;
  onClose: () => void;
}

//PARA EL INDEX
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

//PARA EL SHOW
export interface fertilizanteResource {
  id: number;
  cantidad: number;
  is_ficha: boolean;
  ficha_id: number;
  clase: string;
  tipoFertilizante: string;
  porcentajeNit: number;
  tipoFertilizante_id: number;
  anio_id: number;
  sede_id: number;
  created_at: Date;
  updated_at: Date;
  anio: Anio;
  sede: Sede;
}

export interface FertilizanteRequest {
  tipoFertilizante_id: number;
  cantidad: number;
  is_ficha?: boolean;
  ficha_id?: number;
  sede_id: number;
  anio_id: number;
}
