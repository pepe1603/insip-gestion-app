<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Información General del Perfil</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Datos Personales</h3>
        <div class="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>Nombre:</strong> <span class="font-normal">John Doe</span></p>
          <p><strong>Correo Electrónico:</strong> <span class="font-normal">john.doe@example.com</span></p>
          <p><strong>Fecha de Registro:</strong> <span class="font-normal">15 de Enero, 2023</span></p>
          <p><strong>Rol:</strong> <span class="font-normal">Usuario Básico</span></p>
        </div>
        <div class="mt-6 flex justify-end">
          <router-link :to="{ name: 'edit-profile' }">
            <UiButton variant="secondary">Editar Perfil</UiButton>
          </router-link>
        </div>
      </div>

      <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Estado de la Cuenta</h3>
        <div class="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>Estado:</strong> <span class="font-normal text-green-600 dark:text-green-400">Activo</span></p>
          <p><strong>Último inicio de sesión:</strong> <span class="font-normal">06 de Julio, 2025</span></p>
          <p><strong>Contraseña:</strong> <span class="font-normal text-amber-600 dark:text-amber-400">Recomendado cambiar cada 90 días</span></p>
        </div>
        <div class="mt-6 flex justify-end">
          <router-link :to="{ name: 'change-password' }">
            <UiButton variant="secondary">Cambiar Contraseña</UiButton>
          </router-link>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Actividad Reciente</h3>
      <ul class="space-y-3 text-gray-700 dark:text-gray-300">
        <li>- 05/07/2025: Actualización de email</li>
        <li>- 01/07/2025: Acceso desde nueva IP (192.168.1.100)</li>
        <li>- 28/06/2025: Inicio de sesión exitoso</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import UiButton from '@/components/ui/UiButton.vue'; // Asegúrate de importar tu componente de botón
</script>

<style scoped>
/* No se necesitan estilos específicos, Tailwind CSS es suficiente */
</style>