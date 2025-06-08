<template>
  <span :class="containerClasses" class="inline-flex items-center relative overflow-hidden">
    <span :class="contentClasses" class="relative z-10 inline-flex items-center rounded-md">
      <div v-if="Icon" :class="iconWrapperClasses">
        <Icon :class="iconClasses" />
      </div>
      {{ text }}
    </span>

    <span :class="triangleClasses" class="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0"></span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Precio',
  },
  color: {
    type: String,
    default: 'red',
    validator(value) {
      return ['gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'].includes(value)
    }
  },
  size: {
    type: String,
    default: 'md',
    validator(value) {
      return ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    }
  },
  icon: {
    type: [Object, Function],
    default: null
  },
})

// Clases base del tag (fondo, texto, ring)
const colorClasses = {
  gray: 'bg-gray-700 text-white ring-gray-700',
  red: 'bg-red-600 text-white ring-red-600',
  yellow: 'bg-yellow-500 text-gray-900 ring-yellow-500',
  green: 'bg-green-600 text-white ring-green-600',
  blue: 'bg-blue-600 text-white ring-blue-600',
  indigo: 'bg-indigo-600 text-white ring-indigo-600',
  purple: 'bg-purple-600 text-white ring-purple-600',
  pink: 'bg-pink-600 text-white ring-pink-600',
}

// Colores del borde del triángulo (debe ser el mismo color del fondo del tag)
// El borde que forma el triángulo es el 'border-l' para un triángulo que apunta a la derecha
const triangleColorClasses = {
  gray: 'border-l-gray-700',
  red: 'border-l-red-600',
  yellow: 'border-l-yellow-500',
  green: 'border-l-green-600',
  blue: 'border-l-blue-600',
  indigo: 'border-l-indigo-600',
  purple: 'border-l-purple-600',
  pink: 'border-l-pink-600',
}

// Tamaño del padding y fuente según el tamaño del tag
// Aumentamos el padding left para que el contenido no sea cubierto por el triángulo
const sizeClasses = {
  xs: 'text-xs px-2 py-0.5 pl-3.5', // Ajuste de padding-left
  sm: 'text-xs px-2.5 py-1 pl-4',   // Ajuste de padding-left
  md: 'text-sm px-3 py-1.5 pl-4.5', // Ajuste de padding-left
  lg: 'text-base px-3.5 py-2 pl-5', // Ajuste de padding-left
  xl: 'text-lg px-4 py-2.5 pl-5.5', // Ajuste de padding-left
}

// Tamaño de icono y margen
const iconSizeClasses = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
}
const iconMarginClasses = {
  xs: 'mr-0.5',
  sm: 'mr-1',
  md: 'mr-1.5',
  lg: 'mr-2',
  xl: 'mr-2.5',
}

// Clases para el tamaño del triángulo
// border-t-[size] border-b-[size] border-l-[size] y border-r-0
// Las dos primeras hacen los lados verticales del triángulo, el tercero hace la punta.
const triangleSizeClasses = {
  xs: 'border-t-[8px] border-b-[8px] border-l-[8px]',
  sm: 'border-t-[10px] border-b-[10px] border-l-[10px]',
  md: 'border-t-[12px] border-b-[12px] border-l-[12px]',
  lg: 'border-t-[14px] border-b-[14px] border-l-[14px]',
  xl: 'border-t-[16px] border-b-[16px] border-l-[16px]',
};


// Clases dinámicas

const containerClasses = computed(() => {
  // El contenedor principal solo define el `inline-flex`, `relative` y `overflow-hidden`
  // El redondeo se lo da el `contentClasses`
  return `inline-flex items-center relative overflow-hidden rounded-md`;
});

const contentClasses = computed(() => {
  const colorClass = colorClasses[props.color] || colorClasses.red;
  const sizeClass = sizeClasses[props.size] || sizeClasses.md;

  // Aplicamos el color de fondo y el ring aquí
  return `${colorClass} ${sizeClass} ring-1 ring-inset`;
});

const triangleClasses = computed(() => {
  const colorClass = triangleColorClasses[props.color] || triangleColorClasses.red;
  const sizeTriangleClass = triangleSizeClasses[props.size] || triangleSizeClasses.md;

  // Clases clave para el triángulo
  // border-t-transparent: borde superior transparente
  // border-b-transparent: borde inferior transparente
  // border-l-[color]: borde izquierdo con el color del tag (esta es la punta del triángulo)
  // border-r-0: sin borde derecho
  return `border-t-transparent border-b-transparent ${colorClass} ${sizeTriangleClass} z-20`;
});

const iconClasses = computed(() => {
  return iconSizeClasses[props.size] || iconSizeClasses.md
})

const iconWrapperClasses = computed(() => {
  return `${iconMarginClasses[props.size] || iconMarginClasses.md}`
})

const Icon = props.icon
</script>

<style scoped>
/* No se necesitan estilos SCOPED complejos con las clases de Tailwind ajustadas */
</style>