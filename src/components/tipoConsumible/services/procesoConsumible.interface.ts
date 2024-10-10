export interface ProcesoConsumible {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProcesoConsumibleRequest {
  nombre: string;
}

interface Meta {
  page: number;
  perPage: number;
  totalRecords: number;
  totalPages: number;
}

export interface ProcesoConsumibleCollectionPaginate {
  data: ProcesoConsumibleCollection[];
  meta: Meta;
}

export interface ProcesoConsumibleCollection {
  id: number;
  nombre: string;
  rn: number;
}

export interface ProcesoConsumibleResource {
  id: number;
  nombre: string;
}

export interface CreateProcesoConsumibleProps {
  onClose: () => void;
}

export interface UpdateProcesoConsumibleProps {
  onClose: () => void;
  id: number;
}
