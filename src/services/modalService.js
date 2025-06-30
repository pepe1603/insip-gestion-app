// src/services/modalService.js
import { ref, markRaw } from 'vue';

const activeModals = ref({});
let modalIdCounter = 0;

export function useModalService() {

  /**
   * Muestra un nuevo modal y devuelve una Promesa que se resuelve
   * cuando el modal emite 'confirm', 'cancel', o 'close',
   * permitiendo esperar el resultado del modal.
   * @param {object} component El componente Vue que se renderizará dentro del modal.
   * @param {object} [props={}] Las props que se pasarán al componente.
   * @param {object} [options={}] Opciones adicionales para el modal (ej. title).
   * @returns {Promise<Object>} Una promesa que se resuelve con { id, action: 'confirm'|'cancel'|'close', payload? }.
   */
  const showModal = (component, props = {}, options = {}) => {
    return new Promise((resolve) => { // ¡Ahora devuelve una Promesa!
      modalIdCounter++;
      const id = modalIdCounter;

      activeModals.value[id] = {
        id,
        component: markRaw(component),
        props: {
          ...props, // Mantenemos las props originales
          // INYECTAMOS FUNCIONES DE RESOLUCIÓN PARA EL COMPONENTE INTERNO DEL MODAL
          // Estas funciones son llamadas por el componente del modal cuando hay una acción
          __onConfirm: (payload) => {
            resolve({ id, action: 'confirm', payload });
            hideModal(id);
          },
          __onCancel: (payload) => {
            resolve({ id, action: 'cancel', payload });
            hideModal(id);
          },
          __onClose: () => { // Para cerrar sin acción específica
            resolve({ id, action: 'close' });
            hideModal(id);
          }
        },
        options,
        show: true,
      };
    });
  };

  const hideModal = (id) => {
    if (activeModals.value[id]) {
      // Si el modal está siendo cerrado por hideModal (y no por una acción interna),
      // asegurarnos de resolver la promesa si no se resolvió antes.
      // Esto es crucial si el usuario cierra el modal con ESC o clic fuera.
      // Puedes añadir aquí una lógica para resolver como 'close' por defecto
      // si aún no se ha resuelto la promesa.
      // activeModals.value[id].props.__onClose(); // Esto podría causar problemas si ya se resolvió
      // Mejor: el UiModal manejará el `emit('close')` y el `ModalContainer`
      // llamará a hideModal. Si no se llamó `__onConfirm` o `__onCancel`,
      // la promesa quedará pendiente, a menos que UiModal también llame a __onClose.

      activeModals.value[id].show = false;

      setTimeout(() => {
        delete activeModals.value[id];
      }, 300);
    }
  };

  const hideAllModals = () => {
    Object.values(activeModals.value).forEach(modal => {
      // Llamar a __onClose para resolver todas las promesas pendientes antes de cerrar
      // if (modal.props.__onClose) modal.props.__onClose();
      modal.show = false;
    });

    setTimeout(() => {
      activeModals.value = {};
    }, 300);
  };

  return {
    activeModals,
    showModal,
    hideModal,
    hideAllModals,
  };
}