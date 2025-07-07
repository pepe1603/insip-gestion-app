// src/services/modalService.js
import { ref, markRaw } from 'vue';

const activeModals = ref({});
let modalIdCounter = 0;

export function useModalService() {

  const showModal = (component, props = {}, options = {}) => {
    // Retorna una Promesa que se resolverá cuando el modal se cierre (y su acción sea determinada)
    return new Promise((resolve) => {
      modalIdCounter++;
      const id = modalIdCounter;

      activeModals.value[id] = {
        id,
        component: markRaw(component),
        props: {
          ...props, // Mantenemos las props originales
          // INYECTAMOS FUNCIONES QUE EL COMPONENTE INTERNO DEL MODAL PUEDE LLAMAR
          // Estas funciones SETEAN LA ACCIÓN FINAL Y SOLICITAN EL CIERRE.
          // La PROMESA se resolverá LUEGO, cuando el modal termine de ocultarse.
          __onConfirm: (payload) => {
            // Almacena la acción y el payload para resolver la promesa más tarde
            activeModals.value[id]._actionResult = { action: 'confirm', payload };
            hideModal(id); // Solicita que el modal se oculte
          },
          __onCancel: (payload) => {
            activeModals.value[id]._actionResult = { action: 'cancel', payload };
            hideModal(id);
          },
          __onClose: (payload) => { // Para cerrar sin acción específica (ej. InfoMessageModal)
            activeModals.value[id]._actionResult = { action: 'close', payload };
            hideModal(id);
          }
        },
        options,
        show: true, // El modal es visible inicialmente
        _resolver: resolve, // Guardamos la función resolve de la promesa original aquí
        _actionResult: null, // Para almacenar el resultado de la acción (confirm/cancel/close)
      };
    });
  };

  const hideModal = (id) => {
    const modalToHide = activeModals.value[id];

    if (modalToHide) {
      // Si el modal no tiene un resultado de acción definido (ej. cerrado por ESC o clic fuera)
      // establecemos un resultado por defecto de 'close'
      if (!modalToHide._actionResult) {
        modalToHide._actionResult = { action: 'close' };
      }

      // Inicia la transición de salida visual del modal
      modalToHide.show = false;

      // Esperamos a que la transición visual termine
      setTimeout(() => {
        // Resolvemos la promesa SOLO DESPUÉS de que el modal haya desaparecido visualmente
        if (modalToHide._resolver) {
          modalToHide._resolver({
            id: modalToHide.id,
            ...modalToHide._actionResult // Incluye action y payload
          });
          modalToHide._resolver = null; // Prevenir resolución múltiple
        }

        // Eliminamos el modal del estado `activeModals`
        delete activeModals.value[id];
      }, 300); // Este tiempo debe coincidir con la duración de la transición `leave` en UiModal.vue
    }
  };

  const hideAllModals = () => {
    Object.values(activeModals.value).forEach(modal => {
      // Aseguramos un resultado de 'close' si no se definió una acción específica
      if (!modal._actionResult) {
        modal._actionResult = { action: 'close' };
      }
      modal.show = false; // Inicia la transición de salida

      // No resolvemos aquí individualmente, ya que la lógica setTimeout manejará eso por cada modal
      // Lo mejor es que la promesa de cada modal se resuelva cuando SU hideModal individual lo limpie.
    });

    // Limpiamos el objeto `activeModals` después de la transición de todos
    // Esto es un poco delicado si los modales tienen diferentes tiempos de cierre.
    // Una alternativa más segura es que cada `hideModal` individual se encargue de su limpieza.
    // Para simplificar, si se asume que todos se cierran en 300ms:
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