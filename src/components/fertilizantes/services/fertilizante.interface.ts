export interface CreateFertilizanteProps {
    onClose: () => void;
  }

  export interface FertilizanteRequest {
    fertilizanteTipo: string;
    fertilizante: string;
    cantidadFertilizante: number;
    porcentajeN: number;
    is_ficha: boolean;
    ficha?: string;
    sede_id: number;
  }
  
  export interface FertilizanteCollection {
    id: number;
    tipoid: number;
    fertilizante: string;
    cantidadFertilizante: number;
    porcentajeN: number;
    // is_ficha: boolean;
    ficha: number;
    sede: string;
  }
