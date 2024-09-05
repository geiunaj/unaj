
export interface FactorEmisionSEIN {
    id: number;
    factorCO2: number;
    factorCH4: number;
    factorN2O: number;
    anio_id: number;
    created_at: Date;
    updated_at: Date;
    // anio: Anio; // Relación con el año
}

export interface FactorEmisionSEINRequest {
    factorCO2: number;
    factorCH4: number;
    factorN2O: number;
    anioId: number; 
}

interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

export interface FactorEmisionSEINCollectionPaginate {
    data: FactorEmisionSEINCollection[];
    meta: Meta;
}

export interface FactorEmisionSEINCollection {
    id: number;
    factorCO2: number;
    factorCH4: number;
    factorN2O: number;
    anio_id: number;
    anio: string; 
}

export interface CreateFactorEmisionSEINProps {
    onClose: () => void;
}

export interface UpdateFactorEmisionSEINProps {
    onClose: () => void;
    id: number;
}
