// src/stores/authStore.js
import { defineStore } from 'pinia';
import { authService } from '@/services/authService'; // Asegúrate de que authService esté bien importado

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    // Añadimos un estado para indicar si se requiere cambio de contraseña
    requiresPasswordChange: false, 
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    // Un getter para saber si el usuario está autenticado pero necesita cambiar la contraseña
    isPasswordChangeRequired: (state) => state.isAuthenticated && state.requiresPasswordChange,
  },

  actions: {
    async login(credentials) {
      try {
        const responseData = await authService.login(credentials); // Renombrado a responseData para claridad

        // Lógica para manejar must_change_password del backend
        if (responseData.action_required === 'CHANGE_PASSWORD') {
          // Si se requiere cambio de contraseña, almacenamos el token temporal y el usuario
          // y marcamos el estado 'requiresPasswordChange'
          this.token = responseData.access_token;
          this.user = responseData.user;
          this.requiresPasswordChange = true; // Establecemos la bandera
          localStorage.setItem('token', this.token); // Guardamos el token temporal
          
          // Devolvemos un indicador específico para que el componente sepa qué hacer
          return 'CHANGE_PASSWORD_REQUIRED'; 

        } else {
          // Login exitoso normal
          this.token = responseData.access_token;
          this.user = responseData.user;
          this.requiresPasswordChange = false; // Aseguramos que la bandera esté en false
          localStorage.setItem('token', this.token); // Guardamos el token de acceso completo
          
          // Devolvemos un indicador de éxito normal
          return 'LOGIN_SUCCESS';
        }
      } catch (error) {
        // Propagamos el error para que el componente lo maneje (ej. mostrar toast)
        throw error; 
      }
    },

    async fetchUser() {
      // Esta función debería ser llamada después de un login exitoso (incluyendo el cambio de contraseña forzado)
      // para obtener los datos más recientes del usuario.
      if (!this.token) return; // No intentar si no hay token

      try {
        const data = await authService.getUser();
        console.log('fetch getUser: ', data);
        this.user = data.data.user;
        // Si fetchUser se llama después de un cambio de contraseña,
        // nos aseguramos de que requiresPasswordChange se resetee.
        this.requiresPasswordChange = this.user?.must_change_password === true;

      console.log('FetchUser: User object from backend:', this.user);
      console.log('FetchUser: Updated requiresPasswordChange to:', this.requiresPasswordChange);

      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        // Si hay un error al obtener el usuario (ej. token inválido), limpiamos la sesión
        this.clearAuthData();
        throw error;
      }
    },

    clearAuthData() {
      console.log("AuthStore: Limpiando datos de autenticación del frontend.");
      this.user = null;
      this.token = null;
      this.requiresPasswordChange = false; // Limpiamos también esta bandera
      localStorage.removeItem('token');
    },

    async logout() {
      try {
        await authService.logout();
        console.log("AuthStore: Sesión cerrada en el backend exitosamente.");
      } catch (error) {
        console.warn("AuthService.logout() falló, pero procederemos a limpiar el estado local:", error);
      } finally {
        this.clearAuthData();
      }
    },

    // Nuevo método para manejar el cambio de contraseña forzado desde el frontend
    async forceChangePassword(passwords) {
      try {
        const responseData = await authService.forceChangePassword(passwords); // Llamada al nuevo servicio

        // Si el cambio de contraseña fue exitoso, actualizamos a un token de acceso completo
        this.token = responseData.access_token;
        this.user = responseData.user;
        this.requiresPasswordChange = false; // El usuario ya no necesita cambiar la contraseña
        localStorage.setItem('token', this.token); // Guardamos el nuevo token completo

        return 'PASSWORD_CHANGED_SUCCESS'; // Indicador de éxito

      } catch (error) {
        console.error('Error al forzar cambio de contraseña:', error);
        throw error; // Propagar el error
      }
    }
  }
});