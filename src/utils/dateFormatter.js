// src/utils/dateFormatter.js

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; // Si necesitas el idioma español

export function formatDate(isoDateString) {
    try {
      const date = new Date(isoDateString);
      //const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
const options = { year: 'numeric', month: 'long', day: 'numeric' };
      console.log("Fecha original:", isoDateString);
      //console.log("Fecha convertida:", date);
      return date.toLocaleDateString('es-MX', options); // 'es-MX' para formato en español de México
    } catch (error) {
      console.error("Error al formatear la fecha:", error);
      return 'Fecha inválida';
    }
  }

//   // src/utils/dateFormatter.js

// export function formatDate(dateString) {
//   if (!dateString) return 'N/A';
//   try {
//     const date = parseISO(dateString);
//     return format(date, 'dd/MM/yyyy', { locale: es });
//   } catch (e) {
//     console.error('Error formatting date:', dateString, e);
//     return dateString; // Fallback to original string
//   }
// }

//funcion para formatear fecha y hora y retonarla en formato dd/MM/yyyy HH:mm
export function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
  } catch (e) {
    console.error('Error formatting date-time:', dateString, e);
    return dateString; // Fallback to original string
  }
}