export interface ConsumoPapelRequest {
  tipoPapel_id: number;
  cantidad_paquete: number;
  comentario?: string;
  anio_id: number;
  mes_id: number;
  sede_id: number;
}

export interface ConsumoPapelResource {
  id: number;
  tipoPapel_id: number;
  cantidad_paquete: number;
  peso: number;
  comentario: string;
  anio_id: number;
  mes_id: number;
  sede_id: number;
  created_at: Date;
  updated_at: Date;
  tipoPapel: TipoPapel;
  sede: Sede;
  anio: Anio;
}

export interface TipoPapel {
  id: number;
  nombre: string;
  area: number;
  gramaje: number;
  hojas: number;
  created_at: Date;
  updated_at: Date;
}

export interface Anio {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export interface Sede {
  id: number;
  name: string;
}

export interface CollectionConsumoPapel {
  data: ConsumoPapelCollectionItem[];
  meta: Meta;
}

export interface ConsumoPapelCollectionItem {
  rn: number;
  id: number;
  nombre: string;
  cantidad_paquete: number;
  comentario: string;
  anio_id: number;
  sede_id: number;
  gramaje: number;
  anio: string;
  sede: string;
  tipoPapel_id: number;
  peso: number;
  mes_id: number;
  created_at: Date;
  updated_at: Date;
  File: any;
}

export interface Meta {
  page: number;
  perPage: number;
  totalPages: number;
  totalRecords: number;
}

export interface CreateConsumoPapelProps {
  onClose: () => void;
}

export interface UpdateConsumoPapelProps {
  onClose: () => void;
  id: number;
}
