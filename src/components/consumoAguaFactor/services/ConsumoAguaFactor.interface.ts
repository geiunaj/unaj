export interface ConsumoAguaFactor {
  id: number;
  factor: number;
  anio_id: number;
  anio: string;
  fuente?: string;
  link?: string;
}

export interface ConsumoAguaFactorRequest {
  factor: number;
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

export interface ConsumoAguaFactorCollectionPaginate {
  data: ConsumoAguaFactorCollection[];
  meta: Meta;
}

export interface ConsumoAguaFactorCollection {
  id: number;
  factor: number;
  anio_id: number;
  anio: string;
  fuente?: string;
  link?: string;
}

export interface CreateConsumoAguaFactorProps {
  onClose: () => void;
}

export interface UpdateConsumoAguaFactorProps {
  onClose: () => void;
  id: number;
}
