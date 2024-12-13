export interface TransporteAereoFactor {
  id: number;
  factor1600: number;
  factor1600_3700: number;
  factor3700: number;
  anio_id: number;
  anio: string;
  fuente?: string;
  link?: string;
}

export interface TransporteAereoFactorRequest {
  factor1600: number;
  factor1600_3700: number;
  factor3700: number;
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

export interface TransporteAereoFactorCollectionPaginate {
  data: TransporteAereoFactorCollection[];
  meta: Meta;
}

export interface TransporteAereoFactorCollection {
  id: number;
  factor1600: number;
  factor1600_3700: number;
  factor3700: number;
  anio_id: number;
  anio: string;
  fuente?: string;
  link?: string;
}

export interface CreateTransporteAereoFactorProps {
  onClose: () => void;
}

export interface UpdateTransporteAereoFactorProps {
  onClose: () => void;
  id: number;
}
