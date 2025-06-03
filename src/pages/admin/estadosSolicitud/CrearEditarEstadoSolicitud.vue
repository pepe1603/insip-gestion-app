<template>
    <div class="container mx-auto p-4">
      <CrearEditarFormDinamico
        :title="modalTitle"
        :subtitle="modalSubtitle"
        :fields="formFields"
        :initialValues="formValues"
        :saveButtonText="saveButtonText"
        @submit-form="guardarEstadoSolicitud"
        @cancel="cancelar"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import EstadoSolicitudService from '../../../services/estadoSolicitudService';
  import CrearEditarFormDinamico from '../../../components/forms/CreateEdithFormDynamic.vue';
  
  const router = useRouter();
  const route = useRoute();
  
  const modo = computed(() => route.name === 'editar-estado-solicitud' ? 'editar' : 'crear');
  
  const formValues = ref({});
  const modalTitle = computed(() => (modo.value === 'editar' ? 'Editar Estado de Solicitud' : 'Crear Nuevo Estado de Solicitud'));
  const modalSubtitle = computed(() => (modo.value === 'editar' ? 'Modifica los detalles del estado de solicitud.' : 'Ingresa los detalles para crear un nuevo estado de solicitud.'));
  const saveButtonText = computed(() => (modo.value === 'editar' ? 'Guardar Cambios' : 'Crear'));
  
  const formFields = ref([
    { type: 'text', model: 'estado', label: 'Estado:', placeholder: 'Ingrese el nombre del estado', required: true }, // Cambiamos 'nombre' a 'estado'
    { type: 'textarea', model: 'descripcion', label: 'Descripción:', placeholder: 'Ingrese la descripción del estado', rows: 3 },
  ]);
  
  const cargarEstadoSolicitud = async (id) => {
    try {
      const estado = await EstadoSolicitudService.getById(id);
      if (estado) {
        formValues.value = { ...estado };
      } else {
        router.push({ name: 'lista-estados-solicitud' });
      }
    } catch (error) {
      console.error('Error al cargar el estado de solicitud:', error);
      router.push({ name: 'lista-estados-solicitud' });
    }
  };
  
  const cancelar = () => {
    router.push({ name: 'lista-estados-solicitud' });
  };
  
  const guardarEstadoSolicitud = async (formData) => {
    try {
      if (modo.value === 'editar' && route.params.id) {
        await EstadoSolicitudService.update(route.params.id, formData);
      } else if (modo.value === 'crear') {
        await EstadoSolicitudService.create(formData);
      }
      router.push({ name: 'lista-estados-solicitud' });
    } catch (error) {
      console.error('Error al guardar el estado de solicitud:', error);
    }
  };
  
  onMounted(() => {
    if (modo.value === 'editar' && route.params.id) {
      cargarEstadoSolicitud(route.params.id);
    }
  });
  </script>