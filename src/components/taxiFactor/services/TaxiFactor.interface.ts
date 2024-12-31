export interface TaxiFactor {
  id: number;
  factor: number;
  anio_id: number;
  anio: string;
  fuente?: string;
  link?: string;
}

export interface TaxiFactorRequest {
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

export interface TaxiFactorCollectionPaginate {
  data: TaxiFactorCollection[];
  meta: Meta;
}

export interface TaxiFactorCollection {
  id: number;
  factor: number;
  anio_id: number;
  anio: string;
  fuente?: string;
  link?: string;
}

export interface CreateTaxiFactorProps {
  onClose: () => void;
}

export interface UpdateTaxiFactorProps {
  onClose: () => void;
  id: number;
}
