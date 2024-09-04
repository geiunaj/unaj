import {Anio} from "@/components/anio/services/anio.interface";

export interface TipoCombustible {
    id: number;
    nombre: string;
    abreviatura: string;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export interface TipoCombustibleRequest {
    nombre: string;
    abreviatura: string;
    unidad: string;
}

interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

export interface TipoCombustibleCollectionPaginate {
    data: TipoCombustibleCollection[];
    meta: Meta
}

export interface TipoCombustibleCollection {
    id: number;
    nombre: string;
    abreviatura: string;
    unidad: string;
    // valorCalorico: number;
    // factorEmisionCO2: number;
    // factorEmisionCH4: number;
    // factorEmisionN2O: number;
    // anio: Anio;
    created_at: Date;
    updated_at: Date;
}

export interface CreateTipoCombustibleProps {
    onClose: () => void;
}

export interface UpdateTipoCombustibleProps {
    onClose: () => void;
    id: number;
}
