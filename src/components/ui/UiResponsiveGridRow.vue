<template>
    <div :class="gridClasses">
      <slot></slot>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    cols: {
      type: [String, Number, Object], // Puede ser un número, un string ('auto', '1', '2', etc.) o un objeto para breakpoints
      default: 1
    },
    gap: {
      type: [String, Number, Object], // Similar a cols, para el espaciado entre elementos
      default: 4 // Correspondería a gap-4 de Tailwind
    }
  });
  
  const gridClasses = computed(() => {
    const classes = ['grid', `gap-${normalizeValue(props.gap)}`];
  
    // Manejar la prop 'cols' para diferentes breakpoints
    if (typeof props.cols === 'object') {
      for (const breakpoint in props.cols) {
        classes.push(`sm:${prefixColClass(breakpoint, props.cols[breakpoint])}`);
      }
    } else {
      classes.push(`grid-cols-${normalizeValue(props.cols)}`);
    }
  
    return classes;
  });
  
  // Función para normalizar valores (asegurar que sean strings para las clases de Tailwind)
  function normalizeValue(value) {
    return typeof value === 'number' ? String(value) : value;
  }
  
  // Función para prefijar las clases de columna con el breakpoint
  function prefixColClass(breakpoint, cols) {
    return `${breakpoint}:grid-cols-${normalizeValue(cols)}`;
  }

  /**Nota:_ importante! 
   * Para que los dos componentes se coloquen en la misma fila cuando haya suficiente espacio,
   *  debes tenerlos como hijos directos del UiResponsiveGridRow, 
   * sin los div contenedores adicionales.
   */
  </script>
