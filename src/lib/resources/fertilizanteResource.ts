import {number} from "zod";

type TipoFertilizante = {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    created_at: Date;
    updated_at: Date;
};

type Sede = {
    id: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
};

// type Fertilizante = {
//   id: number;
//   name: string;
//   type_fertilizer: string;
//   cantidadFertilizante: number;
//   porcentajeN: number;
//   sede_id: number;
//   created_at: Date;
//   updated_at: Date;
//   sede?: Sede;
//   typeFertilizante?: TipoFertilizante;
// };

export function formaFertilizante(fertilizante: any) {
    const {created_at, updated_at, tipoFertilizante, anio, sede, is_ficha, ...rest} =
        fertilizante;

    return {
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        anio_id: undefined,
        sede_id: number,
        tipoFertilizante_id: undefined,
        anio: Number(anio?.nombre),
        sede: sede?.name,
        is_ficha: is_ficha ? "Si" : "No",
        clase: tipoFertilizante?.clase,
        tipoFertilizante: tipoFertilizante?.nombre,
        porcentajeNit: tipoFertilizante?.porcentajeNitrogeno,
    };
}
