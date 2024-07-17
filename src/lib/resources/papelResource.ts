type tipoPapel = {
  id: number;
  nombre: string;
  gramaje: number;  
  unidad_paquete: string;
  is_certificado: boolean;
  is_reciclable: boolean;
  porcentaje_reciclado: number;
  nombre_certificado: string;
  created_at: Date;
  updated_at: Date;
};

type Anio = {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
};

type Sede = {
  id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
};

type ConsumoPapel = {
  id: number;
  cantidad_paquete: number;  
  nombre: string;
  anio_id: number;
  sede_id: number;
  comentario?: string; 
  gramaje: number;
  unidad_paquete: string;
  is_reciclable: boolean;
  is_certificado: boolean;
  porcentaje_reciclado: number;
  nombre_certificado: string;
  created_at: Date;
  updated_at: Date;
  tipoPapel?: tipoPapel;
  anio?: Anio;
  sede?: Sede;
};

export function formatConsumoPapel(consumoPapel: any): ConsumoPapel {
  const {
    id,
    cantidad_paquete,
    comentario,
    anio_id,
    sede_id,
    created_at,
    updated_at,
    tipoPapel,
    anio,
    sede,
  } = consumoPapel;

  return {
    id,
    nombre: tipoPapel?.nombre ?? "",
    cantidad_paquete,
    comentario: comentario ?? null,
    anio_id,
    sede_id,
    created_at,
    updated_at,
    gramaje: tipoPapel?.gramaje ?? 0,
    unidad_paquete: tipoPapel?.unidad_paquete ?? "",
    is_certificado: tipoPapel?.is_certificado ?? false,
    is_reciclable: tipoPapel?.is_reciclable ?? false,
    porcentaje_reciclado: tipoPapel?.porcentaje_reciclado ?? 0,
    nombre_certificado: tipoPapel?.nombre_certificado ?? "",
    anio: anio?.nombre ?? "",
    sede: sede?.name ?? "",
  };
}
