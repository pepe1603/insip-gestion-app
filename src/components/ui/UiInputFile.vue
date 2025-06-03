<template>
    <div class="w-full cursor-pointer">
      <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ label }}
      </label>
      <div class="relative flex border overflow-hidden rounded-lg bg-gray-50">
        <!-- Estilo del botón de input -->
        <input
          :id="id"
          type="file"
          :accept="accept"
          :required="required"
          @change="handleFileChange"
          class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <!-- El estilo del botón de selección dentro del input -->
        <button
          type="button"
          class="inline-flex items-center cursor-pointer justify-center text-xs md:text-sm rounded-br-lg rounded-tr-lg bg-indigo-700 hover:bg-indigo-800 border-none outline-none text-white p-2 font-semibold"
        >
          Seleccionar archivo
        </button>
        <!-- Si se selecciona un archivo, se muestra el nombre -->
        <span v-if="fileName" class="flex-1 ml-4 text-xs md:text-sm text-gray-900 align-bottom my-auto dark:text-white">
          {{ fileName }}
        </span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // Definimos las propiedades que recibirá el componente
  const props = defineProps({
    id: String,
    label: String,
    accept: {
      type: String,
      default: '*/*'
    },
    modelValue: Array,
    required: Boolean,
  })
  
  // Definimos el emit para emitir los cambios
  const emit = defineEmits(['update:modelValue'])
  
  const fileName = ref('')
  
  // Función para manejar los cambios cuando se selecciona un archivo
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0] // Solo tomamos el primer archivo
    if (selectedFile) {
      fileName.value = selectedFile.name
      // Emitir el archivo seleccionado (en un array para que coincida con modelValue)
      emit('update:modelValue', [selectedFile])
    }
  }
  </script>
  
  <style scoped>
  /* Los estilos del componente UiInputFile se mantienen igual que los que me proporcionaste */
  </style>
  