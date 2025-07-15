<template>
    <form @submit.prevent="handleSubmit">
      <div v-if="$slots.title">
        <slot name="title"></slot>
      </div>
      <h2 v-else-if="title" class="text-xl font-bold mb-2">{{ title }}</h2>
  
      <div v-if="$slots.description">
        <slot name="description"></slot>
      </div>
      <p v-else-if="description" class="text-gray-600 mb-4">{{ description }}</p>
  
      <!-- Campos dinámicos -->
      <div :class="gridClass">
        <div
          v-for="(field, index) in props.fields"
          :key="index"
          class="mb-4"
        >
          <label :for="field.model" class="block text-gray-700 text-sm font-bold mb-2">
            {{ field.label }}
          </label>
  
          <!-- Validar al cambiar el valor del campo -->
          <component
            :is="resolveComponent(field.type)"
            v-model="formData[field.model]"
            v-bind="field.props"
            :id="field.model"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            @blur="validateField(field)"
            @input="validateField(field)"
          />
  
          <p v-if="errors[field.model]" class="text-red-500 text-xs italic">{{ errors[field.model] }}</p>
        </div>
      </div>
  
      <slot name="actions">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :disabled="hasErrors"
        >
          Guardar
        </button>
      </slot>
    </form>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  
  // Importación de los componentes
  import UiInputText from '../ui/UiInputText.vue';
  import UiInputPassword from '../ui/UiInputPassword.vue';
  import UiInputNumber from '../ui/UiInputNumber.vue';
  import UiInputDatepicker from '../ui/UiInputDatepicker.vue';
  import UiInputFile from '../ui/UiInputFile.vue';
  import UiInputUrl from '../ui/UiInputUrl.vue';
  import UiInputSearch from '../ui/UiInputSearch.vue';
  import UiTextArea from '../ui/UiTextArea.vue';
  import UiSelect from '../ui/UiSelect.vue';
  import UiCheckbox from '../ui/UiCheckbox.vue';
  import UiRadioButton from '../ui/UiRadioButton.vue';
  import UiSwitch from '../ui/UiSwitch.vue';
  import UiInputEmail from '../ui/UiInputEmail.vue'
  
  // Props
  const props = defineProps({
    fields: {
      type: Array,
      required: true
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    isGrid: {
      type: Boolean,
      default: true
    }
  });
  
  // Emitters
  const emit = defineEmits(['submit', 'update:modelValue']);
  
  // Data y validaciones
  const formData = ref({ ...props.modelValue });
  const errors = ref({});
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);
  
  // Watch para actualizaciones en el modelo
  watch(formData, (newFormData) => {
    emit('update:modelValue', newFormData);
  });
  
  // Resolver el tipo de componente
  const resolveComponent = (type) => {
    switch (type) {
      case 'text': return UiInputText;
      case 'password': return UiInputPassword;
      case 'number': return UiInputNumber;
      case 'date': return UiInputDatepicker;
      case 'file': return UiInputFile;
      case 'url': return UiInputUrl;
      case 'search': return UiInputSearch;
      case 'email': return UiInputEmail;
      case 'textarea': return UiTextArea;
      case 'select': return UiSelect;
      case 'checkbox': return UiCheckbox;
      case 'radio': return UiRadioButton;
      case 'switch': return UiSwitch;
      default: console.warn(`Tipo de campo no soportado: ${type}`); return 'input';
    }
  };
  
  // Clases para grid/bloques
  const gridClass = computed(() => {
    return props.isGrid
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
      : '';
  });
  
  // Validar campos
  const validateField = (field) => {
    errors.value[field.model] = ''; // Limpiar errores previos cuando se modifique el campo
    if (field.rules) {
      for (const rule of field.rules) {
        if (rule === 'required' && !formData.value[field.model]) {
          errors.value[field.model] = 'Este campo es requerido.';
          break;
        } else if (rule === 'email' && formData.value[field.model] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value[field.model])) {
          errors.value[field.model] = 'Por favor, introduce un correo electrónico válido.';
          break;
        } else if (rule.startsWith('min:') && formData.value[field.model]) {
          const minLength = parseInt(rule.split(':')[1]);
          if (formData.value[field.model].length < minLength) {
            errors.value[field.model] = `Este campo debe tener al menos ${minLength} caracteres.`;
            break;
          }
        }
      }
    }
  };
  
  // Manejo del submit
  const handleSubmit = () => {
    // Validar todos los campos antes de enviar
    props.fields.forEach(field => validateField(field));
  
    if (!hasErrors.value) {
      emit('submit', formData.value);
    } else {
      console.log('El formulario tiene errores. Por favor, revísalos.');
    }
  };
  </script>
  
  <style scoped>
  /* Aquí puedes agregar estilos adicionales si lo necesitas */
  </style>
  