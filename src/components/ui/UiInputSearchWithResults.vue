// src/components/ui/UiSearchWithResults.vue
<template>
  <div class="relative flex items-center w-full max-w-md">
    <div class="absolute left-4 text-xl text-gray-600 dark:text-gray-300">
      <slot name="icon">
      </slot>
    </div>

    <input
      :value="searchTerm"
      @input="handleInput"
      @blur="triggerSearch"
      :placeholder="placeholder"
      type="text"
      :aria-label="placeholder"
      :disabled="disabled"
      class="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      :class="{ 'cursor-not-allowed bg-gray-100 dark:bg-gray-800 opacity-60': disabled }"
    />

    <ul
      v-if="searchResults && searchResults.length > 0 && !disabled"
      class="absolute left-0 top-full mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600 z-10 max-h-60 overflow-y-auto"
    >
      <li
        v-for="result in searchResults"
        :key="getKey(result)"
        class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        @click="seleccionarResultado(result)"
      >
        {{ formatResult(result) }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  placeholder: String,
  label: String,
  searchServiceMethod: {
    type: Function,
    required: true,
  },
  formatResult: {
    type: Function,
    default: (item) => (typeof item === 'object' && item !== null && 'id' in item) ? `ID: ${item.id}` : String(item),
  },
  minSearchLength: {
    type: Number,
    default: 1, // Cambiado a 1 para búsqueda más flexible por ID
  },
  searchDelay: {
    type: Number,
    default: 300,
  },
  resultKey: {
    type: [String, Function],
    default: 'id',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'selected']);

const searchTerm = ref('');
const searchResults = ref([]);
const selectedItem = ref(null);
let searchTimeout = null;

watch(() => props.disabled, (isDisabled) => {
  if (isDisabled) {
    searchTerm.value = '';
    searchResults.value = [];
    clearTimeout(searchTimeout);
  }
});

async function buscar(termino) {
  if (props.disabled) {
    searchResults.value = [];
    return;
  }
  try {
    if (props.searchServiceMethod) {
      const results = await props.searchServiceMethod(termino);
      // Asegurarse de que `results` sea un array, incluso si la API devuelve uno o ninguno.
      searchResults.value = Array.isArray(results) ? results : [];
    } else {
      console.warn('searchServiceMethod prop is not provided to UiSearchWithResults.');
      searchResults.value = [];
    }
  } catch (error) {
    console.error('Error during search:', error);
    searchResults.value = [];
  }
}

const handleInput = (event) => {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  searchTerm.value = event.target.value;
  emit('update:modelValue', searchTerm.value);
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (searchTerm.value.length >= props.minSearchLength) {
      buscar(searchTerm.value);
    } else {
      searchResults.value = [];
    }
  }, props.searchDelay);
};

const triggerSearch = () => {
  if (props.disabled) {
    searchResults.value = [];
    return;
  }
  clearTimeout(searchTimeout);
  if (searchTerm.value.length >= props.minSearchLength) {
    buscar(searchTerm.value);
  } else {
    searchResults.value = [];
  }
};

const seleccionarResultado = (item) => {
  if (props.disabled) return;

  selectedItem.value = item;
  emit('selected', item);
  searchResults.value = [];
  searchTerm.value = props.formatResult(item);
};

const getKey = (item) => {
  return typeof props.resultKey === 'function' ? props.resultKey(item) : item[props.resultKey];
};
</script>

<style scoped>
.z-10 {
  z-index: 10;
}
.top-full {
  top: 100%;
}
.max-h-60 {
  max-height: 15rem; /* 60 * 0.25rem = 15rem */
}
.overflow-y-auto {
  overflow-y: auto;
}
</style>