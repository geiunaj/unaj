export interface Combustion {
    id: number;
    sede: string;
    type_combustion: string;
    type_fuel: string;
    unit: string;
    month: string;
    consumption_month: number;
}

export interface Sede{
    id: number;
    name: string;
}