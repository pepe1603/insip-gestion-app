<template>
  <div class="w-full space-y-4">
    <UiInputPassword
      :id="passwordId"
      :label="passwordLabel"
      :placeholder="passwordPlaceholder"
      :modelValue="localPassword"
      :required="passwordRequired"
      @update:modelValue="updatePassword"
    />

    <UiInputPassword
      :id="confirmPasswordId"
      :label="confirmPasswordLabel"
      :placeholder="confirmPasswordPlaceholder"
      :modelValue="localConfirmPassword"
      :required="confirmPasswordRequired"
      @update:modelValue="updateConfirmPassword"
    />

    <p v-if="!localPassword && !passwordError" class="text-gray-500 text-xs italic">
      La contraseña debe tener al menos {{ minLength }} caracteres.
    </p>

    <p v-if="passwordError && localPassword" class="text-red-500 text-xs italic">
      {{ formattedPasswordErrorMessage }}
    </p>
    <p v-if="confirmPasswordError && localConfirmPassword" class="text-red-500 text-xs italic">
      {{ confirmPasswordErrorMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import UiInputPassword from './UiInputPassword.vue'; // Asegúrate de la ruta correcta

const props = defineProps({
  passwordId: {
    type: String,
    default: 'password'
  },
  passwordLabel: {
    type: String,
    default: 'Contraseña'
  },
  passwordPlaceholder: {
    type: String,
    default: 'Ingresa tu contraseña'
  },
  passwordRequired: {
    type: Boolean,
    default: false
  },
  confirmPasswordId: {
    type: String,
    default: 'confirmPassword'
  },
  confirmPasswordLabel: {
    type: String,
    default: 'Confirmar Contraseña'
  },
  confirmPasswordPlaceholder: {
    type: String,
    default: 'Confirma tu contraseña'
  },
  confirmPasswordRequired: {
    type: Boolean,
    default: false
  },
  minLength: {
    type: Number,
    default: 6
  },
  passwordValue: {
    type: String,
    default: ''
  },
  confirmPasswordValue: {
    type: String,
    default: ''
  },
  passwordErrorMessage: {
    type: String,
    default: 'La contraseña debe tener al menos {minLength} caracteres.'
  },
  confirmPasswordErrorMessage: {
    type: String,
    default: 'Las contraseñas no coinciden.'
  }
});

const emit = defineEmits(['update:passwordValue', 'update:confirmPasswordValue']);

// Refs locales para los valores de las contraseñas
const localPassword = ref(props.passwordValue);
const localConfirmPassword = ref(props.confirmPasswordValue);

// Estado para controlar si se ha intentado enviar el formulario o si ha habido un blur en los campos
const hasBlurredPassword = ref(false);
const hasBlurredConfirmPassword = ref(false);

// Validaciones computadas
const passwordError = computed(() => hasBlurredPassword.value && localPassword.value.length < props.minLength);
const confirmPasswordError = computed(() => hasBlurredConfirmPassword.value && localPassword.value !== localConfirmPassword.value && localConfirmPassword.value !== '');
const formattedPasswordErrorMessage = computed(() => props.passwordErrorMessage.replace('{minLength}', props.minLength));

// Métodos de actualización de contraseñas
const updatePassword = (value) => {
  localPassword.value = value;
  emit('update:passwordValue', value);
  hasBlurredPassword.value = true; // Marcamos que el campo ha perdido el foco
};
const updateConfirmPassword = (value) => {
  localConfirmPassword.value = value;
  emit('update:confirmPasswordValue', value);
  hasBlurredConfirmPassword.value = true; // Marcamos que el campo ha perdido el foco
};

// Watchers para emitir eventos cuando los valores locales cambian (para v-model en el padre)
watch(localPassword, (newPassword) => {
  if (newPassword !== props.passwordValue) {
    emit('update:passwordValue', newPassword);
  }
});

watch(localConfirmPassword, (newConfirmPassword) => {
  if (newConfirmPassword !== props.confirmPasswordValue) {
    emit('update:confirmPasswordValue', newConfirmPassword);
  }
});
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>