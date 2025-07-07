// plugins/toastPlugin.js
import { useToastService } from '../services/toastService';

export default {
  install(app) {
    const toastService = useToastService();
    app.config.globalProperties.$toast = toastService;
    // ¡Añade esto para el acceso global fuera de componentes Vue!
    window.__global_toast__ = toastService;
  },
};