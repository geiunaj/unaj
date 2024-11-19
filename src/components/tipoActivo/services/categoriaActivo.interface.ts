export interface CategoriaConsumible {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export interface CategoriaConsumibleRequest {
  nombre: string;
}

interface Meta {
  page: number;
  perPage: number;
  totalRecords: number;
  totalPages: number;
}

export interface CategoriaConsumibleCollectionPaginate {
  data: CategoriaConsumibleCollection[];
  meta: Meta;
}

export interface CategoriaConsumibleCollection {
  id: number;
  nombre: string;
  rn: number;
}

export interface CategoriaConsumibleResource {
  id: number;
  nombre: string;
}

export interface CreateCategoriaConsumibleProps {
  onClose: () => void;
}

export interface UpdateCategoriaConsumibleProps {
  onClose: () => void;
  id: number;
}
