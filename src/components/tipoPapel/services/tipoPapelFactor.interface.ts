export interface PapelFactorRequest {
  factor: number;
  tipoPapelId: number;
  anioId: number;
  fuente?: string;
  link?: string;
}

interface Meta {
  page: number;
  perPage: number;
  totalRecords: number;
  totalPages: number;
}

export interface PapelFactorCollectionPaginate {
  data: PapelFactorCollection[];
  meta: Meta;
}

export interface PapelFactorCollection {
  id: number;
  factor: number;
  tipoPapelId: number;
  anioId: number;
  anio: string;
  tipoPapel: string;
  fuente?: string;
  link?: string;
}

export interface PapelFactorResource {
  id: number;
  clase: string;
  nombre: string;
  porcentajeNitrogeno: number;
  unidad: string;
  fuente?: string;
  link?: string;
}

export interface CreatePapelFactorProps {
  onClose: () => void;
}

export interface UpdatePapelFactorProps {
  onClose: () => void;
  id: number;
}
