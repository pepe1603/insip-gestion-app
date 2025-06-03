<template>
    <div class="flew-wrap flex items-center gap-3" :id="containerId">
      <slot></slot>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import Sortable from 'sortablejs'; // Importa SortableJS
  
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    animation: {
      type: Number,
      default: 150,
    },
    handle: {
      type: String,
      default: null, // Selector CSS para el elemento que actuará como "asa" de arrastre
    },
    group: {
      type: [String, Object],
      default: null, // Permite arrastrar entre diferentes listas
    },
    sort: {
      type: Boolean,
      default: true, // Permite ordenar dentro de la lista
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    setData: {
      type: Function,
      default: null, // Función para personalizar los datos transferidos en el drag
    },
    onAdd: {
      type: Function,
      default: null,
    },
    onUpdate: {
      type: Function,
      default: null, // Se llama al reordenar un elemento
    },
    onRemove: {
      type: Function,
      default: null,
    },
    onMove: {
      type: Function,
      default: null,
    },
    onClone: {
      type: Function,
      default: null,
    },
    onStart: {
      type: Function,
      default: null,
    },
    onEnd: {
      type: Function,
      default: null,
    },
  });
  
  const containerId = ref(`sortable-list-${Math.random().toString(36).substring(2, 15)}`);
  const sortableInstance = ref(null);
  
  onMounted(() => {
    const el = document.getElementById(containerId.value);
    if (el) {
      sortableInstance.value = Sortable.create(el, {
        animation: props.animation,
        handle: props.handle,
        group: props.group,
        sort: props.sort,
        disabled: props.disabled,
        setData: props.setData,
        onAdd: props.onAdd,
        onUpdate: props.onUpdate,
        onRemove: props.onRemove,
        onMove: props.onMove,
        onClone: props.onClone,
        onStart: props.onStart,
        onEnd: props.onEnd,
      });
    }
  });
  
  onUnmounted(() => {
    if (sortableInstance.value) {
      sortableInstance.value.destroy();
    }
  });
  </script>
  
  <style scoped>
  /*
    Estilos básicos para el contenedor.
    Puedes personalizarlos según tus necesidades.
  */
  .flew-wrap {
    display: flex;
    flex-wrap: wrap;
  }
  </style>