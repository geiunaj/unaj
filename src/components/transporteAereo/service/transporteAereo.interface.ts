import {Anio} from "@/components/anio/services/anio.interface";
import {Mes} from "@/components/mes/services/mes.interface";
import {Sede} from "@/components/sede/services/sede.interface";


export interface CreateTransporteAereoProps {
    onClose: () => void;
}


export interface UpdateTransporteAereoProps {
    id: number;
    onClose: () => void;
}

// PARA EL INDEX
export interface TransporteAereoCollectionItem {
    rn: number;
    id: number;
    kmRecorrido: number;
    fechaSalida: Date | null;
    fechaRegreso: Date | null;
    mes: string;
    anio: string;
    sede: string;
    numeroPasajeros: number | null;
    origen: string;
    destino: string;
    isIdaVuelta: boolean;
    distanciaTramo: number;
    anio_mes: number;
    anio_id: number;
    sede_id: number;
    mes_id: number;
}

export interface TransporteAereoCollection {
    data: TransporteAereoCollectionItem[];
    meta: Meta;
}

export interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}


// PARA EL SHOW
export interface TransporteAereoResource {
    id: number;
    unidadContratante: string;
    lugarSalida: string;
    lugarDestino: string;
    monto: number;
    kmRecorrido: number;
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
export interface TransporteAereoRequest {
    numeroPasajeros?: number;
    origen: string;
    destino: string;
    isIdaVuelta: boolean;
    fechaSalida?: string;
    fechaRegreso?: string;
    distanciaTramo: number;
    kmRecorrido: number;
    sede_id: number;
    anio_id: number;
    mes_id: number;
    created_at?: Date;
    updated_at?: Date;
}
