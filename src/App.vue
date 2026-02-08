<template>
  <div class="bg-gray-50 overflow-hidden relative">
    <ToastContainer />
    <ModalContainer />
    <LoadingSpinner v-if="isLoadingApp" :message="appLoaderMessage" />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in" appear>
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useGlobalModal } from './composables/useGlobalModal';
import { useGlobalToast } from './composables/useGlobalToast';
import { useInactivityDetector } from './composables/useInactivityDetector';
import { useUiStore } from './stores/uiStore';
import { maintenanceService } from '@/services/maintenanceService';
import { useRouter, useRoute } from 'vue-router';
import { useOnline } from '@vueuse/core';

import ToastContainer from './components/ToastContainer.vue';
import ModalContainer from './components/ModalContainer.vue';
import OfflineNotificationModal from '@/components/modals/OfflineNotificationModal.vue';
import OnlineReconnectedModal from '@/components/modals/OnlineReconnectedModal.vue';
import BackendDownModal from '@/components/modals/BackendDownModal.vue';
import BackendUpModal from '@/components/modals/BackendUpModal.vue';
import MaintenanceWarningModal from '@/components/modals/MaintenanceWarningModal.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { connectivityService } from '@/services/connectivityService';

const $modal = useGlobalModal();
const $toast = useGlobalToast();
const uiStore = useUiStore();

const router = useRouter();
const route = useRoute();
let maintenanceCheckInterval = null;
const isUnderMaintenance = ref(false);

// --- Estados reactivos ---
const isInternetReachable = useOnline();
const isBackendOffline = ref(false);
const isLoadingApp = ref(true);
const appLoaderMessage = ref('Preparando la aplicación...');
// NUEVO: Bandera para evitar que se apilen los modales de mantenimiento
const isMaintenanceModalPending = ref(false);

useInactivityDetector();

let connectivityCheckInterval = null;
let removeInteractionListeners = null;

// --- Funciones de Modales (sin cambios) ---
const showOfflineModal = async () => {
    const result = await $modal?.showModal(
        OfflineNotificationModal,
        {},
        {
            title: 'Estado de la Red',
            closeOnClickOutside: false,
        }
    );
    if (result?.action === 'confirm' && result?.payload?.action === 'continue_offline') {
        $toast.warning('Estás navegando sin conexión. Algunas funciones pueden no estar disponibles.', {
            position: 'top-center', duration: 10000, dismissible: false, showLeftBorder: false, title: 'Sin Conexión a Internet'
        });
    }
};

const showOnlineModal = async () => {
    const result = await $modal?.showModal(
        OnlineReconnectedModal,
        {},
        {
            title: '¡Internet Restablecido!',
            closeOnClickOutside: false,
        }
    );
    if (result?.action === 'confirm' && result?.payload?.action === 'understood') {
        $toast.success('¡Conexión a Internet restablecida!', {
            position: 'top-center', duration: 1000, dismissible: false, showIcon: false, showLeftBorder: false, title: 'Conexión Restablecida',
        });
    }
};

const showBackendDownModal = async () => {
    const result = await $modal?.showModal(
        BackendDownModal,
        {},
        {
            title: 'Servicio No Disponible',
            closeOnClickOutside: false,
        }
    );
    if (result?.action === 'confirm' && result?.payload?.action === 'understood') {
        $toast.warning('No se puede conectar con el servidor. Algunas funciones pueden no estar disponibles, intentalo mas tarde.', {
            position: 'top-center', duration: 10000, dismissible: false, showLeftBorder: false, showIcon: false,
        });
    }
};

const showBackendUpModal = async () => {
    const result = await $modal?.showModal(
        BackendUpModal,
        {},
        {
            title: '¡Servicio Restablecido!',
            closeOnClickOutside: false,
        }
    );
    if (result?.action === 'confirm' && result?.payload?.action === 'understood') {
        $toast.success('La conexión con el servidor ha sido recuperada, puedes continuar usando el sistema con normalidad.', {
            position: 'top-center', duration: 7000, dismissible: false, showLeftBorder: false, title: 'Conexión Restablecida con el servidor',
        });
    }
};

// --- Funciones de servicios ---
const checkBackendStatus = async () => {
    const result = await connectivityService.checkBackendConnectivity();
    isBackendOffline.value = !result;
};

// CAMBIOS CLAVE EN LA FUNCIÓN DE MANTENIMIENTO
const checkMaintenanceStatus = async () => {
    if (!isInternetReachable.value) {
        console.log('Sin conexión: omitiendo verificación de mantenimiento');
        return;
    }
    try {
        const result = await maintenanceService.isInMaintenance();
        if (result) {
            isUnderMaintenance.value = true;
            const alreadyWarned = sessionStorage.getItem('maintenance_modal_shown');
            
            if (route.name !== 'Maintenance') {
                 // Evita la condición de carrera
                if (!alreadyWarned && !isMaintenanceModalPending.value) {
                    isMaintenanceModalPending.value = true; // Bloquea nuevas llamadas
                    const modalResult = await $modal.showModal(
                        MaintenanceWarningModal, {},
                        { title: 'Mantenimiento Activo', closeOnClickOutside: false }
                    );
                    sessionStorage.setItem('maintenance_modal_shown', 'true');
                    isMaintenanceModalPending.value = false; // Desbloquea
                    if (modalResult?.action === 'confirm' && modalResult?.payload?.go_to_maintenance) {
                        router.replace({ name: 'Maintenance' });
                    }
                } else if (alreadyWarned) {
                     // Si ya se mostró el modal en una sesión anterior, redirige directamente
                     router.replace({ name: 'Maintenance' });
                }
            }
        } else {
            isUnderMaintenance.value = false;
            sessionStorage.removeItem('maintenance_modal_shown');
            if (route.name === 'Maintenance') {
                router.replace({ name: 'Home' });
            }
        }
    } catch (error) {
        console.error('Error al verificar estado de mantenimiento:', error);
    }
};

// --- Ciclo de vida ---
onMounted(async () => {
    const handleFirstUserInteraction = () => {
        uiStore.setUserInteracted();
        removeInteractionListeners();
    };
    const addInteractionListeners = () => {
        window.addEventListener('click', handleFirstUserInteraction);
        window.addEventListener('keydown', handleFirstUserInteraction);
        window.addEventListener('scroll', handleFirstUserInteraction);
        window.addEventListener('mousemove', handleFirstUserInteraction);
    };
    removeInteractionListeners = () => {
        window.removeEventListener('click', handleFirstUserInteraction);
        window.removeEventListener('keydown', handleFirstUserInteraction);
        window.removeEventListener('scroll', handleFirstUserInteraction);
        window.removeEventListener('mousemove', handleFirstUserInteraction);
    };
    addInteractionListeners();

    try {
        appLoaderMessage.value = 'Iniciando servicios...';
        await new Promise(resolve => setTimeout(resolve, 800));
        await checkBackendStatus();
        connectivityCheckInterval = setInterval(checkBackendStatus, 5000);
        appLoaderMessage.value = 'Cargando configuraciones...';
        await new Promise(resolve => setTimeout(resolve, 800));
        await checkMaintenanceStatus();
        maintenanceCheckInterval = setInterval(() => {
            if (isInternetReachable.value) {
                checkMaintenanceStatus();
            }
        }, 5000);
        console.log('Inicialización de la aplicación completada.');
    } catch (error) {
        console.error('Error durante la inicialización de la aplicación:', error);
        appLoaderMessage.value = 'Error al cargar la aplicación.';
    } finally {
        isLoadingApp.value = false;
    }
});

onUnmounted(() => {
    if (removeInteractionListeners) {
        removeInteractionListeners();
    }
    if (connectivityCheckInterval) {
        clearInterval(connectivityCheckInterval);
    }
    if (maintenanceCheckInterval) {
        clearInterval(maintenanceCheckInterval);
    }
    if ($modal?.currentOfflineModalId.value) {
        $modal.hideModal($modal.currentOfflineModalId.value);
    }
    if ($modal?.currentOnlineModalId.value) {
        $modal.hideModal($modal.currentOnlineModalId.value);
    }
});

// --- Watchers ---
watch(isInternetReachable, (online, oldOnline) => {
    console.log(`Conectividad de red cambió: de ${oldOnline} a ${online}`);
    if (oldOnline !== undefined) {
        if (online) {
            showOnlineModal();
        } else {
            showOfflineModal();
        }
    }
});

watch(isBackendOffline, (newVal, oldVal) => {
    console.log(`Estado del backend cambió: de ${oldVal} a ${newVal}`);
    if (oldVal !== undefined) {
        if (newVal === true && oldVal === false) {
            showBackendDownModal();
        } else if (newVal === false && oldVal === true) {
            showBackendUpModal();
        }
    }
});

watch(() => uiStore.currentTheme, (newTheme) => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(newTheme);
}, { immediate: true });
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

body.light {
  background-color: #f9fafb;
  color: #1f2937;
}

body.dark {
  background-color: #111827;
  color: #f9fafb;
}

body.transitioning * {
  pointer-events: none;
  user-select: none;
}
</style>