// plugins/toastPlugin.js
import { useToastService } from '../services/toastService';

export default {
  install(app) {
    const toastService = useToastService();
    app.config.globalProperties.$toast = toastService;
  },
};
