import * as tempo from 'tempojs';

export function formatFullTempo(isoDateString, formatPattern = 'YYYY-MM-DD HH:mm') {
  try {
    const date = new Date(isoDateString);
    return tempo.format(date, formatPattern);
  } catch (error) {
    console.error("Error al formatear la fecha con Tempo.js (completo):", error);
    return 'Fecha/Hora inválida';
  }
}

export function formatTimeTempo(isoDateString, formatPattern = 'HH:mm:ss') {
  try {
    const date = new Date(isoDateString);
    return tempo.format(date, formatPattern);
  } catch (error) {
    console.error("Error al formatear la hora con Tempo.js (HH:mm:ss):", error);
    return 'Hora inválida';
  }
}