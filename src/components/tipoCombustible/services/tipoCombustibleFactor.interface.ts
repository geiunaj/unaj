import {Anio} from "@/components/anio/services/anio.interface";

export interface TipoCombustibleFactor {
    id: number;
    nombre: string;
    abreviatura: string;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export interface TipoCombustibleFactorRequest {
    tipoCombustible_id: number;
    valorCalorico: number;
    factorEmisionCO2: number;
    factorEmisionCH4: number;
    factorEmisionN2O: number;
    anio_id: number;
}

interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

export interface TipoCombustibleFactorCollectionPaginate {
    data: TipoCombustibleFactorCollection[];
    meta: Meta
}

export interface TipoCombustibleFactorCollection {
    id: number;
    valorCalorico: number;
    factorEmisionCO2: number;
    factorEmisionCH4: number;
    factorEmisionN2O: number;
    anio_id: number;
    tipoCombustible_id: number;
    anio: string;
    tipoCombustible: string;
}

export interface CreateTipoCombustibleFactorProps {
    onClose: () => void;
}

export interface UpdateTipoCombustibleFactorProps {
    onClose: () => void;
    id: number;
}
