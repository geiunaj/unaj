import {Anio} from "@/components/anio/services/anio.interface";
import {Mes} from "@/components/mes/services/mes.interface";
import {Sede} from "@/components/sede/services/sede.interface";


export interface CreateTaxiProps {
    onClose: () => void;
}


export interface UpdateTaxiProps {
    id: number;
    onClose: () => void;
}

// PARA EL INDEX
export interface TaxiCollectionItem {
    id: number;
    unidadContratante: string;
    lugarSalida: string;
    lugarDestino: string;
    montoGastado: number;
    sede: string;
    anio: number;
    mes: string;
}

export interface TaxiCollection {
    data: TaxiCollectionItem[];
    meta: Meta;
}

export interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}


// PARA EL SHOW
export interface TaxiResource {
    id: number;
    unidadContratante: string;
    lugarSalida: string;
    lugarDestino: string;
    monto: number;
    mes_id: number;
    anio_id: number;
    sede_id: number;
    created_at: Date;
    updated_at: Date;
    mes: Mes;
    anio: Anio;
    sede: Sede;
}


// PARA EL STORE Y UPDATE
export interface TaxiRequest {
    unidadContratante: string;
    lugarSalida: string;
    lugarDestino: string;
    montoGastado: number;
    sede_id: number;
    anio_id: number;
    mes_id: number;
    created_at?: Date;
    updated_at?: Date;
}
