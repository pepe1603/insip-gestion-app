<template>
  <div class="w-auto">
    <div class="lg:max-w-2xl 2xl:max-w-4xl border border-slate-100 rounded-lg hover:shadow">
      <div class="bg-slate-200 border-b border-b-slate-200 space-y-1 px-4 py-2">
        <h2 class="text-xl font-bold">{{ title }}</h2>
        <p v-if="subtitle" class="text-sm text-gray-800">{{ subtitle }}</p>
        <p v-else class="text-sm text-gray-800">Evita dejar campos vacíos para evitar errores</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-4 space-y-6">
        <div v-if="loading" class="text-center py-4 text-gray-500">Cargando datos...</div>
        <div v-else-if="error" class="text-red-500 py-4 text-center">Error: {{ error.message || error }}</div>
        <div v-else>
          <div v-for="(field, index) in fields" :key="index" class="mb-4">
            <UiInputText
              v-if="field.type === 'text'"
              :id="field.model"
              :label="field.label"
              :placeholder="field.placeholder"
              v-model="formData[field.model]"
              :required="field.required"
            />
            <UiTextarea
              v-if="field.type === 'textarea'"
              :id="field.model"
              :label="field.label"
              :placeholder="field.placeholder"
              v-model="formData[field.model]"
              :rows="field.rows || 3"
              :required="field.required"
            />
            <UiInputEmail
              v-if="field.type === 'email'"
              :id="field.model"
              :label="field.label"
              :placeholder="field.placeholder"
              v-model="formData[field.model]"
              :required="field.required"
            />
            <UiInputNumber
              v-if="field.type === 'number'"
              :id="field.model"
              :label="field.label"
              :placeholder="field.placeholder"
              v-model="formData[field.model]"
              :required="field.required"
            />
            <UiInputPassword
              v-if="field.type === 'password'"
              :id="field.model"
              :label="field.label"
              :placeholder="field.placeholder"
              v-model="formData[field.model]"
              :required="field.required"
            />
            <UiInputUrl
              v-if="field.type === 'url'"
              :id="field.model"
              :label="field.label"
              :placeholder="field.placeholder"
              v-model="formData[field.model]"
              :required="field.required"
            />
            <UiInputRange
              v-if="field.type === 'range'"
              :id="field.model"
              :label="field.label"
              v-model="formData[field.model]"
              :min="field.min"
              :max="field.max"
              :step="field.step"
              :disabled="field.disabled"
            />
            <UiInputSearch
              v-if="field.type === 'search'"
              :placeholder="field.placeholder"
              v-model="formData[field.model]"
            />
            <UiSelect
              v-if="field.type === 'select'"
              :id="field.model"
              :label="field.label"
              v-model="formData[field.model]"
              :options="field.options"
              :required="field.required"
              :placeholder="field.placeholder"
            />
            <UiCheckbox
              v-if="field.type === 'checkbox'"
              :id="field.model"
              :label="field.label"
              v-model="formData[field.model]"
              :value="field.value"
            />
            <UiRadioButton
              v-if="field.type === 'radio'"
              :id="field.model"
              :label="field.label"
              v-model="formData[field.model]"
              :value="field.value"
            />
            <UiSwitch
              v-if="field.type === 'switch'"
              :id="field.model"
              :label="field.label"
              v-model="formData[field.model]"
              :disabled="field.disabled"
            />
            <UiDatepicker
              v-if="field.type === 'date'"
              :id="field.model"
              :label="field.label"
              v-model="formData[field.model]"
              :placeholder="field.placeholder"
              :format="field.format"
              :required="field.required"
            />
            <UiInputFile
              v-if="field.type === 'file'"
              :id="field.model"
              :label="field.label"
              @update:modelValue="handleFileUpload(field.model, $event)"
              :accept="field.accept"
              :required="field.required"
            />
            <UiInputTime
              v-if="field.type === 'time'"
              :id="field.model"
              :label="field.label"
              :placeholder="field.placeholder"
              v-model="formData[field.model]"
              :required="field.required"
            />
            <template v-else-if="field.type === 'slot'">
              <slot :name="field.name" :initialValues="formData"></slot>
            </template>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-12">
          <UiButton variant="neutral" @click="$emit('cancel')">
            Cancelar
          </UiButton>

          <UiButton
            type="submit"
            variant="primary"
          >
            {{ saveButtonText }}
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import UiInputText from '../ui/UiInputText.vue';
import UiTextarea from '../ui/UiTextArea.vue';
import UiButton from '../ui/UiButton.vue';
import UiInputEmail from '../ui/UiInputEmail.vue';
import UiInputNumber from '../ui/UiInputNumber.vue';
import UiInputPassword from '../ui/UiInputPassword.vue';
import UiInputUrl from '../ui/UiInputUrl.vue';
import UiInputRange from '../ui/UiInputRange.vue';
import UiInputSearch from '../ui/UiInputSearch.vue';
import UiSelect from '../ui/UiSelect.vue';
import UiCheckbox from '../ui/UiCheckbox.vue';
import UiRadioButton from '../ui/UiRadioButton.vue';
import UiSwitch from '../ui/UiSwitch.vue';
import UiDatepicker from '../ui/UiInputDatepicker.vue';
import UiInputFile from '../ui/UiInputFile.vue';
import UiInputTime from '../ui/UiInputTime.vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: null,
  },
  fields: {
    type: Array,
    required: true,
  },
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  saveButtonText: {
    type: String,
    default: 'Guardar',
  },
  // Propiedades opcionales para manejar estados de carga y error a nivel de formulario
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: [Object, String],
    default: null,
  },
});

const emit = defineEmits(['submit-form', 'cancel']);

const formData = ref({});

// Inicializar el formulario con los valores iniciales (para edición)
watch(() => props.initialValues, (newValues) => {
  formData.value = { ...newValues };
}, { immediate: true });

const handleSubmit = () => {
  emit('submit-form', formData.value);
};

const handleFileUpload = (model, files) => {
  formData.value[model] = files; // Almacena el array de archivos
};
</script>

<style scoped>
/* Estilos específicos del componente si los hay */
</style>