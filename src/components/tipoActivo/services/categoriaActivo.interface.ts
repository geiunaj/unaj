export interface CategoriaActivo {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export interface CategoriaActivoRequest {
  nombre: string;
  grupoActivoId: number;
}

interface Meta {
  page: number;
  perPage: number;
  totalRecords: number;
  totalPages: number;
}

export interface CategoriaActivoCollectionPaginate {
  data: CategoriaActivoCollection[];
  meta: Meta;
}

export interface CategoriaActivoCollection {
  id: number;
  nombre: string;
  rn: number;
}

export interface CategoriaActivoResource {
  id: number;
  nombre: string;
}

export interface CreateCategoriaActivoProps {
  onClose: () => void;
}

export interface UpdateCategoriaActivoProps {
  onClose: () => void;
  id: number;
}
