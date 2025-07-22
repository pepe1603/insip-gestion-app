// src/stores/uiStore.js
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isSidebarExpanded: true,
    openSidebarMenus: {},
    hasUserInteracted: false,
    areAlertSoundsMuted: false,
    currentLanguage: 'es', // Valor por defecto
    // NUEVO: Estado para el tema actual de la aplicación (light/dark)
    currentTheme: 'light', // Valor por defecto: 'light'
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarExpanded = !this.isSidebarExpanded;
    },
    toggleSubMenu(menuLabel) {
      this.openSidebarMenus[menuLabel] = !this.openSidebarMenus[menuLabel];
    },
    setSubMenuState(menuLabel, state) {
      this.openSidebarMenus[menuLabel] = state;
    },
    initializeSidebarMenus(navigationLinks) {
      navigationLinks.forEach(link => {
        if (link.children && link.children.length > 0) {
          if (this.openSidebarMenus[link.label] === undefined) {
            this.openSidebarMenus[link.label] = false;
          }
        }
      });
    },
    setUserInteracted() {
      if (!this.hasUserInteracted) {
        this.hasUserInteracted = true;
        console.log('UI Store: Primera interacción del usuario detectada.');
      }
    },
    toggleAlertSoundsMute() {
      this.areAlertSoundsMuted = !this.areAlertSoundsMuted;
      console.log(`UI Store: Sonidos de alerta ${this.areAlertSoundsMuted ? 'silenciados' : 'activados'}.`);
    },
    setAlertSoundsMuteState(state) {
      this.areAlertSoundsMuted = state;
      console.log(`UI Store: Sonidos de alerta establecidos a ${this.areAlertSoundsMuted ? 'silenciados' : 'activados'}.`);
    },
    setLanguage(lang) {
      this.currentLanguage = lang;
      console.log(`UI Store: Idioma cambiado a ${lang}.`);
    },
    // NUEVO: Acción para cambiar el tema
    setTheme(theme) {
      if (['light', 'dark'].includes(theme)) {
        this.currentTheme = theme;
        console.log(`UI Store: Tema cambiado a ${theme}.`);
      } else {
        console.warn(`UI Store: Intento de establecer tema inválido: ${theme}. Se permite 'light' o 'dark'.`);
      }
    },
    // NUEVO: Acción para alternar el tema (útil para un botón rápido)
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      console.log(`UI Store: Tema alternado a ${this.currentTheme}.`);
    }
  },
  persist: true,
});