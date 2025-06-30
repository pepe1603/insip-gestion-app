// src/plugins/modalPlugin.js
import { useModalService } from '../services/modalService';

export default {
  // El método `install` es el punto de entrada de cualquier plugin de Vue.
  // Recibe la instancia de la aplicación Vue (app) como argumento.
  install(app) {
    // Instanciamos nuestro servicio de modales.
    // Esto asegura que haya una única instancia del servicio compartida en toda la aplicación.
    const modalService = useModalService();

    // Inyectamos el servicio de modales en las propiedades globales de la aplicación.
    // Esto lo hace accesible a todos los componentes a través de `app.config.globalProperties.$modal`.
    // Por convención, se usa `$modal` para evitar conflictos con propiedades existentes.
    app.config.globalProperties.$modal = modalService;
        // 💡 Esto permite usar el modal incluso fuera del contexto Vue (como en api.js o stores)
    window.__global_modal__ = modalService;
  },
};