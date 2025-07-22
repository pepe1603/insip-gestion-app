<template>
  <div id="app" class="bg-blue-50">
    <ToastContainer />
    <ModalContainer />

    <router-view v-slot="{ Component }">
      <transition 
        name="fade" 
        mode="out-in" 
        appear 
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useGlobalModal } from './composables/useGlobalModal';
import { useGlobalToast } from './composables/useGlobalToast'; // Asegúrate de que este archivo está actualizado
import { useInactivityDetector } from './composables/useInactivityDetector'; // <-- ¡Importamos el composable de inactividad!

import ToastContainer from './components/ToastContainer.vue';
import ModalContainer from './components/ModalContainer.vue';
import OfflineNotificationModal from './components/modals/OfflineNotificationModal.vue';
import OnlineReconnectedModal from './components/modals/OnlineReconnectedModal.vue';

const $modal = useGlobalModal();
const $toast = useGlobalToast();

const isOffline = ref(false);
const currentOfflineModalId = ref(null);
const currentOnlineModalId = ref(null);

// --- Usa el detector de inactividad ---
// Simplemente llamamos al composable. Toda la lógica de setup y cleanup está dentro de él.
useInactivityDetector(); 

// --- Manejadores de eventos de red ---
const handleOnline = () => {
  isOffline.value = false;
  console.log('¡Conexión a Internet recuperada!');
  // Opcional: Podrías añadir un toast aquí para indicar la recuperación inicial si el modal no fuera suficiente.
  // Por ejemplo: $toast.info('Conexión a internet recuperada. Procesando...');
};

const handleOffline = () => {
  isOffline.value = true;
  console.log('¡Sin conexión a Internet!');
  // Opcional: Mostrar un toast de advertencia de inmediato.
  // Ejemplo: $toast.warning('Has perdido la conexión a internet. Intentando reconectar...', { dismissible: false, duration: 0, showLeftBorder: true });
};

onMounted(() => {
  isOffline.value = !navigator.onLine;
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
});

onUnmounted(() => {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
  // Aseguramos que cualquier modal de red se cierre al desmontar App.vue
  if (currentOfflineModalId.value) {
    $modal?.hideModal(currentOfflineModalId.value);
  }
  if (currentOnlineModalId.value) {
    $modal?.hideModal(currentOnlineModalId.value);
  }
});

// --- Observar el estado de 'isOffline' y mostrar/ocultar modales ---
watch(isOffline, async (newVal, oldVal) => {
  if (newVal === true && oldVal === false) {
    // La conexión se acaba de perder
    if (currentOnlineModalId.value) {
      $modal?.hideModal(currentOnlineModalId.value);
      currentOnlineModalId.value = null;
    }
    
    // Muestra el modal de "sin conexión" y espera la acción del usuario
    const result = await $modal?.showModal(
      OfflineNotificationModal,
      {}, 
      { 
        title: 'Estado de la Red', 
        closeOnClickOutside: false, // Bloquea el clic fuera del modal
      }
    );
    currentOfflineModalId.value = result.id; // Almacena el ID del modal de offline

    // Aquí manejamos el resultado cuando el usuario hace clic en "Continuar sin conexión"
    if (result?.action === 'confirm' && result?.payload?.action === 'continue_offline') {
      console.log('Usuario eligió continuar navegando sin conexión.');
      // Ahora puedes usar el nuevo tipo 'warning' para una notificación más sutil
      $toast.warning(
        'Estás navegando sin conexión. Algunas funciones pueden no estar disponibles.',
        {
          position: 'top-center',
          duration: 10000, // Un poco más largo para este aviso importante
          dismissible: true, // Permite al usuario cerrar si lo desea
          showLeftBorder: true // Mantener el borde de advertencia
        }
      );
    } else {
      console.log('Modal de offline cerrado por otra razón (ej. conexión recuperada antes de decidir).');
      // Si el modal de offline se cierra por recuperación de conexión (sin acción del usuario),
      // no mostramos el toast de "continuar sin conexión".
    }

  } else if (newVal === false && oldVal === true) {
    // La conexión se acaba de recuperar
    if (currentOfflineModalId.value) {
      $modal?.hideModal(currentOfflineModalId.value); // Cierra el modal de offline automáticamente
      currentOfflineModalId.value = null;
    }
    
    // Muestra el modal de "conectado de nuevo" y espera la acción del usuario
    const result = await $modal?.showModal(
      OnlineReconnectedModal,
      {},
      { 
        title: '¡Internet Restablecido!', 
        closeOnClickOutside: false // Bloquea el clic fuera hasta que pulse "Entendido"
      }
    );
    currentOnlineModalId.value = result.id;
    
    // El resultado de la promesa se resolverá cuando el usuario presione "Entendido"
    if (result?.action === 'confirm' && result?.payload?.action === 'understood') {
      console.log('Usuario entendió que la conexión se restableció.');
      // Usaremos los nuevos tipos de toast y sus opciones aquí
      $toast.success(
        '¡Genial! Tu conexión a internet ha vuelto y está lista.', 
        { 
          position: 'top-center', 
          duration: 7000, // Duración predeterminada (7s) del servicio
          dismissible: true, // Se puede cerrar
          showLeftBorder: true, // Con borde izquierdo
          title: 'Conexión Restablecida'
        }
      );

      // Ejemplo de uso de los nuevos tipos de toast si los tienes configurados:
      // $toast.purplePower('¡Funciones avanzadas disponibles de nuevo!', { position: 'bottom-center' });
      // $toast.highlight('Sincronización de datos iniciada.', { dismissible: false, duration: 5000 });
      // $toast.ghost('Actualización en segundo plano completada.', { showLeftBorder: false });

    } else {
      console.log('Modal de conexión recuperada cerrado por otra razón.');
    }
    currentOnlineModalId.value = null;
  }
});
</script>

<style>
/* Estilos existentes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

body.transitioning * {
  pointer-events: none;
  user-select: none;
}
</style>