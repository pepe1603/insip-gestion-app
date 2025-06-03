<template>
    <div class="container mx-auto p-4">
      <CrearEditarFormDinamico
        :title="modalTitle"
        :subtitle="modalSubtitle"
        :fields="formFields"
        :initialValues="formValues"
        :saveButtonText="saveButtonText"
        @submit-form="guardarVacacionOficial"
        @cancel="cancelar"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import VacacionesOficialesService from '../../../services/vacacionesOficialesService'; // Importa el servicio
  import CrearEditarFormDinamico from '../../../components/forms/CreateEdithFormDynamic.vue';
  
  const router = useRouter();
  const route = useRoute();
  
  const modo = computed(() => route.name === 'editar-vacacion-oficial' ? 'editar' : 'crear');
  
  const formValues = ref({});
  const modalTitle = computed(() => (modo.value === 'editar' ? 'Editar Regla de Vacación Oficial' : 'Crear Nueva Regla de Vacación Oficial'));
  const modalSubtitle = computed(() => (modo.value === 'editar' ? 'Modifica los detalles de la regla de vacación oficial.' : 'Ingresa los detalles para crear una nueva regla de vacación oficial.'));
  const saveButtonText = computed(() => (modo.value === 'editar' ? 'Guardar Cambios' : 'Crear'));
  
  const formFields = ref([
    { type: 'text', model: 'tiempo_servicio', label: 'Tiempo de Servicio:', placeholder: 'Ej: 1 año, 1-5 años, etc.', required: true },
    { type: 'number', model: 'dias_vacaciones', label: 'Días de Vacaciones:', placeholder: 'Ingrese el número de días', required: true, min: 1 },
  ]);
  
  const cargarVacacionOficial = async (id) => {
    try {
      const vacacion = await VacacionesOficialesService.getById(id);
      if (vacacion) {
        formValues.value = { ...vacacion };
      } else {
        router.push({ name: 'lista-vacaciones-oficiales' });
      }
    } catch (error) {
      console.error('Error al cargar la regla de vacación oficial:', error);
      router.push({ name: 'lista-vacaciones-oficiales' });
    }
  };
  
  const cancelar = () => {
    router.push({ name: 'lista-vacaciones-oficiales' });
  };
  
  const guardarVacacionOficial = async (formData) => {
    try {
      if (modo.value === 'editar' && route.params.id) {
        await VacacionesOficialesService.update(route.params.id, formData);
      } else if (modo.value === 'crear') {
        await VacacionesOficialesService.create(formData);
      }
      router.push({ name: 'lista-vacaciones-oficiales' });
    } catch (error) {
      console.error('Error al guardar la regla de vacación oficial:', error);
    }
  };
  
  onMounted(() => {
    if (modo.value === 'editar' && route.params.id) {
      cargarVacacionOficial(route.params.id);
    }
  });
  </script>