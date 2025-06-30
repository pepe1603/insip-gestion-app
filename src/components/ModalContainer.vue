<script setup>
import { computed } from 'vue';
import { useModalService } from '../services/modalService'; // Importamos nuestro servicio de modales
import UiModal from './ui/modal/UiModal.vue'; // Importamos el componente base de modal

// Obtenemos el estado de los modales activos y la función para cerrarlos
const { activeModals, hideModal } = useModalService();

// Creamos un computed property para obtener un array de los modales activos
// Esto es útil porque v-for funciona mejor con arrays.
const modalsToRender = computed(() => Object.values(activeModals.value));

// Función que se llamará cuando un UiModal emita su evento 'close'
const handleClose = (id) => {
  hideModal(id); // Llamamos a la función de nuestro servicio para cerrar el modal por su ID
};
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-50">
    <UiModal
      v-for="modal in modalsToRender"
      :key="modal.id"
      :show="modal.show"           :title="modal.options.title"  :close-on-click-outside="modal.options.closeOnClickOutside"
      @close="() => handleClose(modal.id)" >
      <component
        :is="modal.component"
        v-bind="modal.props"         @close="() => handleClose(modal.id)" />
    </UiModal>
  </div>
</template>

<style scoped>
/* No se necesitan estilos con scope aquí, ya que UiModal y las clases de Tailwind
   manejan la mayor parte del estilo y posicionamiento. */
</style>