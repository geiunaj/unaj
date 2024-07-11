export interface CreateFertilizanteProps {
    onClose: () => void;
  }


  // export interface TipoFertilizanteRequest {
  //   clase: string;
  //   nombre: string;
  //   porcentajeNitrogeno: number;
  // }

  export interface FertilizanteRequest {
    tipoFertilizante_id: number;
    cantidad: number;
    is_ficha?: boolean;
    ficha_id?: number;
    sede_id: number;
    anio_id: number;
  }
  
  // export interface FertilizanteCollection {
  //   id: number;
  //   tipoFertilizante: string;
  //   claseFertilizante: string;
  //   fertilizante: string;
  //   cantidadFertilizante: number;
  //   porcentajeN: number;
  //   anio_id:string,
  //   ficha?: number;
  //   sede_id: string;
  // }

  export interface fertilizanteCollection {
    id:               number;
    cantidad:         number;
    is_ficha:         boolean;
    ficha_id:         number;
    anio:             number;
    sede:             string;
    tipoFertilizante: string;
    clase:            string;
    porcentajeNitrogeno: number;
}
