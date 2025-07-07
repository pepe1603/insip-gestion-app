// src/stores/passwordReset.js
import { defineStore } from 'pinia';

export const usePasswordResetStore = defineStore('passwordReset', {
  state: () => ({
    email: null,
    verificationCode: null,
    // Puedes añadir más estados si los necesitas, como un indicador de carga o errores específicos del flujo.
  }),
  actions: {
    /**
     * Guarda el email del usuario en el store.
     * @param {string} newEmail - El correo electrónico del usuario.
     */
    setEmail(newEmail) {
      this.email = newEmail;
    },

    /**
     * Guarda el código de verificación recibido.
     * @param {string} code - El código alfanumérico de 6 dígitos.
     */
    setVerificationCode(code) {
      this.verificationCode = code;
    },

    /**
     * Limpia todo el estado relacionado con el proceso de recuperación de contraseña.
     * Esto es crucial al iniciar un nuevo flujo o al finalizarlo.
     */
    clearState() {
      this.email = null;
      this.verificationCode = null;
    }
  },
  // Opcional: getters si necesitas computar algún dato del estado
  getters: {
    // Por ejemplo, para verificar si el email ya está en el store
    hasEmail: (state) => !!state.email,
  },
});