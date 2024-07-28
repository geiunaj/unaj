export interface FertilizanteCalc {
  tipofertilizanteId: number;
  consumoTotal: number;
  cantidadAporte: number;
  emisionDirecta: number;
  // porcentajeNitrogeno: number;
  totalEmisionesDirectas: number;
  emisionGEI: number;
  anioId: number;
  sedeId: number;
}

export interface FertilizanteCalcRequest {
  sedeId: number;
  anioId: number;
}

export interface FertilizanteCalcResponse {
  id: number;
  consumo: number;
  tipoFertilizante: string;
  unidad: string;
  clase: string;
  porcentajeNitrogeno: number;
  cantidadAporte: number;
  emisionDirecta: number;
  totalEmisionesDirectas: number;
  emisionGEI: number;
}
