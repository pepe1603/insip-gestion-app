<template>
    <div class="container mx-auto p-4">
      <CrearEditarFormDinamico
        :title="modalTitle"
        :subtitle="modalSubtitle"
        :fields="formFields"
        :initialValues="formValues"
        :saveButtonText="saveButtonText"
        @submit-form="guardarTipoAsistencia"
        @cancel="cancelar"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import TiposAsistenciaService from '../../../services/tiposAsistenciaService';
  import CrearEditarFormDinamico from '../../../components/forms/CreateEdithFormDynamic.vue';
  
  const router = useRouter();
  const route = useRoute();
  
  const modo = computed(() => route.name === 'editar-tipo-asistencia' ? 'editar' : 'crear');
  
  const formValues = ref({});
  const modalTitle = computed(() => (modo.value === 'editar' ? 'Editar Tipo de Asistencia' : 'Crear Nuevo Tipo de Asistencia'));
  const modalSubtitle = computed(() => (modo.value === 'editar' ? 'Modifica los detalles del tipo de asistencia.' : 'Ingresa los detalles para crear un nuevo tipo de asistencia.'));
  const saveButtonText = computed(() => (modo.value === 'editar' ? 'Guardar Cambios' : 'Crear'));
  
  const formFields = ref([
    { type: 'text', model: 'nombre', label: 'Nombre:', placeholder: 'Ingrese el nombre del tipo de asistencia', required: true },
    { type: 'textarea', model: 'descripcion', label: 'Descripción:', placeholder: 'Ingrese la descripción del tipo de asistencia', rows: 3 },
  ]);
  
  const cargarTipoAsistencia = async (id) => {
    try {
      const tipo = await TiposAsistenciaService.getById(id);
      if (tipo) {
        formValues.value = { ...tipo };
      } else {
        router.push({ name: 'lista-tipos-asistencia' });
      }
    } catch (error) {
      console.error('Error al cargar el tipo de asistencia:', error);
      router.push({ name: 'lista-tipos-asistencia' });
    }
  };
  
  const cancelar = () => {
    router.push({ name: 'lista-tipos-asistencia' });
  };
  
  const guardarTipoAsistencia = async (formData) => {
    try {
      if (modo.value === 'editar' && route.params.id) {
        await TiposAsistenciaService.update(route.params.id, formData);
      } else if (modo.value === 'crear') {
        await TiposAsistenciaService.create(formData);
      }
      router.push({ name: 'lista-tipos-asistencia' });
    } catch (error) {
      console.error('Error al guardar el tipo de asistencia:', error);
    }
  };
  
  onMounted(() => {
    if (modo.value === 'editar' && route.params.id) {
      cargarTipoAsistencia(route.params.id);
    }
  });
  </script>