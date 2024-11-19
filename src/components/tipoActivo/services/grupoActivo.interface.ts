export interface GrupoActivo {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export interface GrupoActivoRequest {
  nombre: string;
}

interface Meta {
  page: number;
  perPage: number;
  totalRecords: number;
  totalPages: number;
}

export interface GrupoActivoCollectionPaginate {
  data: GrupoActivoCollection[];
  meta: Meta;
}

export interface GrupoActivoCollection {
  id: number;
  nombre: string;
  rn: number;
}

export interface GrupoActivoResource {
  id: number;
  nombre: string;
}

export interface CreateGrupoActivoProps {
  onClose: () => void;
}

export interface UpdateGrupoActivoProps {
  onClose: () => void;
  id: number;
}
