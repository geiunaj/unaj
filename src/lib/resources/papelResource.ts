// lib/resources/combustibleResource.ts
type tipoPapel = {
  id: number;
  nombre: string;
  grameje: number;
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
  canidad: number;
  tipoPapel_id: number;
  anio_id: number;
  sede_id: number;
  comentario: string;
  created_at: Date;
  updated_at: Date;
  tipoPapel?: tipoPapel;
  anio?: Anio;
  sede?: Sede;
};

export function formattedConsumoPapel(consumoPapel: any) {
  const {
    created_at,
    updated_at,
    tipoPapel,
    anio,
    sede,
    canidad,
    comentario,
    ...rest
  } = consumoPapel;

  return {
    ...rest,
    updated_at: undefined,
    canidad: Number(canidad.toFixed(2)),
    tipoPapel_id: undefined,
    anio_id: undefined,
    sede_id: undefined,
    anio: Number(anio?.nombre),
    tipoPapel: tipoPapel?.nombre,
    gramaje: tipoPapel?.grameje,
    unidad_paquete: tipoPapel?.unidad_paquete,
    is_certificado: tipoPapel?.is_certificado,
    is_reciclable: tipoPapel?.is_reciclable,
    porcentaje_reciclado: tipoPapel?.porcentaje_reciclado,
    nombre_certificado: tipoPapel?.nombre_certificado,
    sede: sede?.name,
    // tipoCombustible: tipoCombustible
    //   ? {
    //       ...tipoCombustible,
    //       created_at: undefined,
    //       updated_at: undefined,
    //     }
    //   : null,
    // mes: mes
    //   ? {
    //       ...mes,
    //       created_at: undefined,
    //       updated_at: undefined,
    //     }
    //   : null,
    // anio: anio
    //   ? {
    //       ...anio,
    //       created_at: undefined,
    //       updated_at: undefined,
    //     }
    //   : null,
    // sede: sede
    //   ? {
    //       ...sede,
    //       created_at: undefined,
    //       updated_at: undefined,
    //     }
    //   : null,
  };
}
