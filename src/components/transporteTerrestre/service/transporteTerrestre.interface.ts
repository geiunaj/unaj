import { Anio } from "@/components/anio/services/anio.interface";
import { Mes } from "@/components/mes/services/mes.interface";
import { Sede } from "@/components/sede/services/sede.interface";

export interface CreateTransporteTerrestreProps {
  onClose: () => void;
}

export interface UpdateTransporteTerrestreProps {
  id: number;
  onClose: () => void;
}

// PARA EL INDEX
export interface TransporteTerrestreCollectionItem {
  rn: number;
  id: number;
  fechaSalida: Date;
  fechaRegreso: Date;
  mes: string;
  anio: string;
  sede: Sede;
  numeroPasajeros: number;
  origen: string;
  destino: string;
  isIdaVuelta: boolean;
  motivo: string;
  numeroComprobante: string;
  distancia: number;
  anio_mes: number;
  anio_id: number;
  sede_id: number;
  mes_id: number;
  File: any;
}

export interface TransporteTerrestreCollection {
  data: TransporteTerrestreCollectionItem[];
  meta: Meta;
}

export interface Meta {
  page: number;
  perPage: number;
  totalPages: number;
  totalRecords: number;
}

// PARA EL SHOW
export interface TransporteTerrestreResource {
  id: number;
  unidadContratante: string;
  lugarSalida: string;
  lugarDestino: string;
  monto: number;
  kmRecorrido: number;
  mes_id: number;
  anio_id: number;
  sede_id: number;
  created_at: Date;
  updated_at: Date;
  mes: Mes;
  anio: Anio;
  sede: Sede;
}

// PARA EL STORE Y UPDATE
export interface TransporteTerrestreRequest {
  numeroPasajeros?: number;
  origen: string;
  destino: string;
  isIdaVuelta: boolean;
  fechaSalida?: string;
  fechaRegreso?: string;
  motivo: string;
  numeroComprobante: string;
  distancia: number;
  sede_id: number;
  anio_id: number;
  mes_id: number;
  created_at?: Date;
  updated_at?: Date;
}
