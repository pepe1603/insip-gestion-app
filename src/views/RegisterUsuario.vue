<template>
    <div class="container mx-auto mt-8 bg-white">
      <!-- Componente de formulario dinámico -->
      <DynamicForm
        :fields="registroCampos"
        title="Registro de Nuevo Usuario"
        description="Por favor, completa el siguiente formulario para crear tu cuenta."
        :isGrid="true"
        @submit="registrarUsuario"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import DynamicForm from '../components/modals/ModalDynamic.vue'; // Asegúrate de que la ruta es correcta
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  // Campos dinámicos del formulario
  const registroCampos = ref([
    {
      type: 'text',
      label: 'Nombre',
      model: 'nombre',
      props: {
        placeholder: 'Ingresa tu nombre'
      },
      rules: ['required']
    },
    {
      type: 'email',
      label: 'Correo Electrónico',
      model: 'email',
      props: {
        placeholder: 'tu@email.com'
      },
      rules: ['required', 'email']
    },
    {
      type: 'password',
      label: 'Contraseña',
      model: 'password',
      props: {
        placeholder: 'Ingresa tu contraseña'
      },
      rules: ['required', 'min:6']
    },
    {
      type: 'password',
      label: 'Confirmar Contraseña',
      model: 'confirmarPassword',
      props: {
        placeholder: 'Confirma tu contraseña'
      },
      rules: ['required', 'min:6']
    },
    {
      type: 'select',
      label: 'Rol',
      model: 'rol',
      props: {
        options: [
          { label: 'Usuario', value: 'user' },
          { label: 'Administrador', value: 'admin' }
        ]
      },
      rules: ['required']
    },
    {
      type: 'checkbox',
      label: 'Acepto los términos y condiciones',
      model: 'terminos',
      props: {}
    }
  ]);
  
  // Función para registrar al usuario
  const registrarUsuario = async (formData) => {
    console.log('Datos del formulario de registro:', formData);
    
    try {
      // Simulando el registro exitoso
      console.log('Usuario registrado exitosamente!');
      // router.push('/login'); // Redirigir a la página de inicio de sesión si es necesario
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };
  </script>
  