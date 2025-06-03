// composables/useGlobalToast.js
import { getCurrentInstance } from 'vue';

export const useGlobalToast = () => {
  const instance = getCurrentInstance();
  return instance?.appContext.config.globalProperties.$toast;
};
