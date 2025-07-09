// src/stores/uiStore.js
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    // Estado para controlar si el sidebar está expandido o colapsado
    isSidebarExpanded: true, // Inicia expandido por defecto

    // Objeto para controlar el estado de apertura/cierre de los submenús del sidebar
    // Ejemplo: { 'Recursos Humanos': true, 'Tiempo y Asistencia': false }
    openSidebarMenus: {},
  }),
  actions: {
    /**
     * Alterna el estado de expansión del sidebar.
     */
    toggleSidebar() {
      this.isSidebarExpanded = !this.isSidebarExpanded;
    },

    /**
     * Alterna el estado de un submenú específico.
     * @param {string} menuLabel - La etiqueta del submenú a alternar.
     */
    toggleSubMenu(menuLabel) {
      this.openSidebarMenus[menuLabel] = !this.openSidebarMenus[menuLabel];
    },

    /**
     * Establece el estado de un submenú específico.
     * @param {string} menuLabel - La etiqueta del submenú.
     * @param {boolean} state - El estado deseado (true para abierto, false para cerrado).
     */
    setSubMenuState(menuLabel, state) {
        this.openSidebarMenus[menuLabel] = state;
    },

    /**
     * Inicializa el estado de los submenús basándose en la estructura de navegación.
     * Asegura que todos los submenús potenciales tengan una entrada en `openSidebarMenus`.
     * Se llama al inicio para que el estado de Pinia refleje la estructura completa.
     * @param {Array<Object>} navigationLinks - La estructura completa de los enlaces de navegación.
     */
    initializeSidebarMenus(navigationLinks) {
        navigationLinks.forEach(link => {
            if (link.children && link.children.length > 0) {
                // Si ya existe, mantiene su estado; de lo contrario, lo inicializa a false
                if (this.openSidebarMenus[link.label] === undefined) {
                   this.openSidebarMenus[link.label] = false;
                }
            }
        });
    }
  },
  // Opcional: Persistir el estado del sidebar en localStorage
  persist: true, // Esto requiere `pinia-plugin-persistedstate`
});