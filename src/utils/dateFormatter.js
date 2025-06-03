// src/utils/dateFormatter.js

export function formatDate(isoDateString) {
    try {
      const date = new Date(isoDateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return date.toLocaleDateString('es-MX', options); // 'es-MX' para formato en español de México
    } catch (error) {
      console.error("Error al formatear la fecha:", error);
      return 'Fecha inválida';
    }
  }