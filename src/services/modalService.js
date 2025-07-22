// src/services/modalService.js
import { ref, markRaw } from 'vue';

const activeModals = ref({});
let modalIdCounter = 0;

const currentOfflineModalId = ref(null);
const currentOnlineModalId = ref(null);

export function useModalService() {
    const showModal = (component, props = {}, options = {}) => {
        return new Promise((resolve) => {
            const componentName = component.name;

            console.log('Attempting to show modal:', componentName, 'Current offline ID:', currentOfflineModalId.value, 'Current online ID:', currentOnlineModalId.value);

            if (componentName === 'OfflineNotificationModal') {
                if (currentOfflineModalId.value) {
                    console.warn("Offline modal is already open. Preventing new instance.");
                    resolve({ action: 'duplicate', id: currentOfflineModalId.value });
                    return;
                }
                if (currentOnlineModalId.value) {
                    forceHideModal(currentOnlineModalId.value, 'connection_lost_preempt');
                }
            } else if (componentName === 'OnlineReconnectedModal') {
                if (currentOnlineModalId.value) {
                    console.warn("Online modal is already open. Preventing new instance.");
                    resolve({ action: 'duplicate', id: currentOnlineModalId.value });
                    return;
                }
                if (currentOfflineModalId.value) {
                    forceHideModal(currentOfflineModalId.value, 'connection_restored_preempt');
                }
            }

            modalIdCounter++;
            const id = modalIdCounter;

            if (componentName === 'OfflineNotificationModal') {
                currentOfflineModalId.value = id;
            } else if (componentName === 'OnlineReconnectedModal') {
                currentOnlineModalId.value = id;
            }

            activeModals.value[id] = {
                id,
                component: markRaw(component),
                props: {
                    ...props,
                    modalId: id, // <--- ¡Asegúrate de que esta línea esté aquí!
                    __onConfirm: (resultFromModal) => { // Renombro 'payload' a 'resultFromModal' para mayor claridad
                        activeModals.value[id]._actionResult = resultFromModal; // <--- ¡CAMBIO CLAVE! Asigna el objeto completo
                        hideModal(id);
                    },
                    __onCancel: (resultFromModal) => {
                        activeModals.value[id]._actionResult = resultFromModal; // <--- ¡CAMBIO CLAVE!
                        hideModal(id);
                    },
                    __onClose: (resultFromModal) => {
                        activeModals.value[id]._actionResult = resultFromModal; // <--- ¡CAMBIO CLAVE!
                        hideModal(id);
                    }
                },
                options,
                show: true,
                _resolver: resolve,
                _actionResult: null,
            };
        });
    };

    const hideModal = (id) => {
        const modalToHide = activeModals.value[id];

        if (modalToHide) {
            if (!modalToHide._actionResult) {
                modalToHide._actionResult = { id: modalToHide.id, action: 'close' }; // Asegura que 'id' esté aquí también
            }

            console.log('Hiding modal with ID:', id, 'Component name:', modalToHide.component.name);
            modalToHide.show = false;

            const componentName = modalToHide.component.name;
            if (componentName === 'OfflineNotificationModal' && currentOfflineModalId.value === id) {
                currentOfflineModalId.value = null;
            } else if (componentName === 'OnlineReconnectedModal' && currentOnlineModalId.value === id) {
                currentOnlineModalId.value = null;
            }

            setTimeout(() => {
                if (modalToHide._resolver) {
                    // El _resolver ya recibe el _actionResult completo, no es necesario desestructurar
                    modalToHide._resolver(modalToHide._actionResult); // <--- ¡CAMBIO CLAVE! Pasa el objeto completo
                    modalToHide._resolver = null;
                }
                delete activeModals.value[id];
            }, 300);
        }
    };

    const forceHideModal = (id, action = 'programmatic_close', payload = null) => {
        const modalToHide = activeModals.value[id];
        console.log('Force hiding modal with ID:', id, 'Action:', action);
        if (modalToHide) {
            // Asegura que el resultado forzado también tenga el ID
            modalToHide._actionResult = { id: id, action, payload }; // <--- Asegura que 'id' esté aquí
            hideModal(id);
        }
    };

    const hideAllModals = () => {
        Object.values(activeModals.value).forEach(modal => {
            if (!modal._actionResult) {
                modal._actionResult = { id: modal.id, action: 'close' }; // Asegura que 'id' esté aquí
            }
            modal.show = false;

            const componentName = modal.component.name;
            if (componentName === 'OfflineNotificationModal' && currentOfflineModalId.value === modal.id) {
                currentOfflineModalId.value = null;
            } else if (componentName === 'OnlineReconnectedModal' && currentOnlineModalId.value === modal.id) {
                currentOnlineModalId.value = null;
            }
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
        forceHideModal,
        currentOfflineModalId,
        currentOnlineModalId
    };
}