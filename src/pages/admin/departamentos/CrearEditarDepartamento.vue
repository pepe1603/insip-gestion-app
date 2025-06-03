<template>
    <div class="container mx-auto p-4">
      <CrearEditarFormDinamico
        :title="modalTitle"
        :subtitle="modalSubtitle"
        :fields="formFields"
        :initialValues="formValues"
        :saveButtonText="saveButtonText"
        @submit-form="guardarDepartamento"
        @cancel="cancelar"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import DepartamentosService from '../../../services/departamentosService';
  import CrearEditarFormDinamico from '../../../components/forms/CreateEdithFormDynamic.vue';
  
  const router = useRouter();
  const route = useRoute();
  
  const modo = computed(() => route.name === 'editar-tipo-asistencia' ? 'editar' : 'crear');
  
  const formValues = ref({});
  const modalTitle = computed(() => (modo.value === 'editar' ? 'Editar Departamento' : 'Crear Nuevo Departamento'));
  const modalSubtitle = computed(() => (modo.value === 'editar' ? 'Modifica los detalles del departamento.' : 'Ingresa los detalles para crear un nuevo departamento.'));
  const saveButtonText = computed(() => (modo.value === 'editar' ? 'Guardar Cambios' : 'Crear'));
  
  const formFields = ref([
    { type: 'text', model: 'nombre', label: 'Nombre:', placeholder: 'Ingrese el nombre del departamento', required: true },
    { type: 'textarea', model: 'descripcion', label: 'Descripción:', placeholder: 'Ingrese la descripción del departamento', rows: 3 },
  ]);
  
  const cargarDepartamento = async (id) => {
    try {
      const departamento = await DepartamentosService.getById(id);
      if (departamento) {
        formValues.value = { ...departamento };
      } else {
        router.push({ name: 'lista-departamentos' });
      }
    } catch (error) {
      console.error('Error al cargar el departamento:', error);
      router.push({ name: 'lista-departamentos' });
    }
  };
  
  const cancelar = () => {
    router.push({ name: 'lista-departamentos' });
  };
  
  const guardarDepartamento = async (formData) => {
    try {
      if (modo.value === 'editar' && route.params.id) {
        await DepartamentosService.update(route.params.id, formData);
      } else if (modo.value === 'crear') {
        await DepartamentosService.create(formData);
      }
      router.push({ name: 'lista-departamentos' });
    } catch (error) {
      console.error('Error al guardar el departamento:', error);
    }
  };
  
  onMounted(() => {
    if (modo.value === 'editar' && route.params.id) {
      cargarDepartamento(route.params.id);
    }
  });
  </script>