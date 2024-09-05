export interface CreateElectricidadProps {
    onClose: () => void;
}

export interface UpdateElectricidadProps {
    id: number;
    onClose: () => void;
}

//PARA EL INDEX
// export interface electricidadCollection {
//     id: number;
//     area: string;
//     numeroSuministro: string;
//     consumo: number;
//     mes: string;
//     anio: number;
//     sede: string;
// }

export interface electricidadCollection {
    data: electricidadCollectionItem[];
    meta: Meta;
}

export interface electricidadCollectionItem {
    id: number;
    numeroSuministro: string;
    consumo: number;
    area: string;
    sede: string;
    anio: string;
    mes: string;
    rn: number;
}

export interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}


//PARA EL SHOW
export interface electricidadResource {
    id: number;
    areaId: number;
    numeroSuministro: string;
    consumo: number;
    mes_id: number;
    anio_id: number;
    sede_id: number;
    created_at: Date;
    updated_at: Date;
    area: ResponseResource;
    mes: ResponseResource;
    anio: ResponseResource;
    sede: Sede;
}

interface ResponseResource {
    id: number;
    nombre: string;
    created_at: Date;
    updated_at: Date;
}

interface Sede {
    id: number;
    name: string;
}

export interface electricidadRequest {
    area_id: number;
    numeroSuministro: string;
    consumo: number;
    mes_id: number;
    anio_id: number;
}









