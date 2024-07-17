export interface ConsumoPapelRequest {
  tipoPapel_id: number;
  cantidad_paquete: number;
  sede_id: number;
  anio_id: number;
  comentario?: string;
}

export interface CollectionConsumoPapel {
    id: number;
    cantidad_paquete: number;
    sede: string;
    anio: number;
    tipoPapel: string;
    gramaje: number;
    nombre_certificado: string;
    porcentaje_reciclado: number;
    unidad_paquete: string;


    }
