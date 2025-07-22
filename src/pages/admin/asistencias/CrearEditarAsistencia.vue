<template>
    <div class="container mx-auto p-4">

      <!-- Indicaciones de aceurdo al modo (contendort de alerts) -->
       <div class="mb-4">
            <UiAlert
        v-if="modo === 'editar'"
      >
        Estás editando una asistencia existente. Asegúrate de guardar los cambios.
      </UiAlert>
      <UiAlert

        v-else
      >
        Estás creando una nueva asistencia. Completa todos los campos requeridos.
      </UiAlert>
      
      
      <UiAlert type="purple-power" class="my-4">
        <!-- Mesage de indicaciones que debe hjacer el usuario para crear o editar la asistencia-->
         <p>Por favor, complete todos los campos obligatorios para continuar.</p>
         <ul class="list-disc pl-5">
           <li>Seleccione un empleado.</li>
           <li>Ingrese la fecha de la asistencia.</li>
           <li>Ingrese la hora de entrada y salida.</li>
           <li>Seleccione el tipo de asistencia.</li>
         </ul>

      </UiAlert>
       </div>


      <CrearEditarFormDinamico
        :title="modalTitle"
        :subtitle="modalSubtitle"
        :fields="formFields"
        :initialValues="formValues"
        :saveButtonText="saveButtonText"
        @submit-form="guardarAsistencia"
        @cancel="cancelar"
        :loading="cargandoRelaciones"
        :error="errorRelaciones"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import AsistenciaService from '../../../services/asistenciaService';
  import EmpleadoService from '../../../services/empleadoService';
  import TiposAsistenciaService from '../../../services/tiposAsistenciaService';
  import CrearEditarFormDinamico from '../../../components/forms/CreateEdithFormDynamic.vue';
  import { format } from 'date-fns'; // Para formatear la fecha para el input
import UiAlert from '../../../components/ui/UiAlert.vue';
  
  const router = useRouter();
  const route = useRoute();
  
  const modo = computed(() => route.name === 'editar-asistencia' ? 'editar' : 'crear');
  
  const formValues = ref({
    fecha: format(new Date(), 'yyyy-MM-dd'), // Inicializamos la fecha actual
    hora_entrada: '08:00:00', // Valores por defecto
    hora_salida: '17:00:00',
    empleado_id: null,
    tipo_asistencia_id: null,
    observaciones: '',
  });
  const modalTitle = computed(() => (modo.value === 'editar' ? 'Editar Asistencia' : 'Crear Nueva Asistencia'));
  const modalSubtitle = computed(() => (modo.value === 'editar' ? 'Modifica los detalles de la asistencia.' : 'Ingresa los detalles para crear una nueva asistencia.'));
  const saveButtonText = computed(() => (modo.value === 'editar' ? 'Guardar Cambios' : 'Crear'));
  
  const empleados = ref([]);
  const tiposAsistencia = ref([]);
  const formFields = ref([
    {
      type: 'select',
      model: 'empleado_id',
      label: 'Empleado:',
      options: computed(() => empleados.value.map(empleado => ({
        label: `${empleado.nombre} ${empleado.ape_paterno} ${empleado.ape_materno}`,
        value: empleado.id
      }))),
      placeholder: 'Selecciona un empleado',
      required: true,
    },
    { type: 'date', model: 'fecha', label: 'Fecha:', required: true },
    { type: 'time', model: 'hora_entrada', label: 'Hora de Entrada:', required: true },
    { type: 'time', model: 'hora_salida', label: 'Hora de Salida:', required: true },
    {
      type: 'select',
      model: 'tipo_asistencia_id',
      label: 'Tipo de Asistencia:',
      options: computed(() => tiposAsistencia.value.map(tipo => ({ label: tipo.nombre, value: tipo.id }))),
      placeholder: 'Selecciona el tipo de asistencia',
      required: true,
    },
    { type: 'textarea', model: 'observaciones', label: 'Observaciones:', placeholder: 'Ingrese observaciones (opcional)' },
  ]);
  
  const cargandoRelaciones = ref(false);
  const errorRelaciones = ref(null);
  
  const cargarRelaciones = async () => {
    cargandoRelaciones.value = true;
    errorRelaciones.value = null;
    try {
      empleados.value = await EmpleadoService.getAll();
      tiposAsistencia.value = await TiposAsistenciaService.getAll();
    } catch (err) {
      errorRelaciones.value = err;
    } finally {
      cargandoRelaciones.value = false;
    }
  };
  
  const cargarAsistencia = async (id) => {
    try {
      const asistencia = await AsistenciaService.getById(id, 'empleado,tipo_asistencia');
      // Verificamos si la asistencia existe
      if (asistencia) {

        // Asignamos los valores a formValues
        formValues.value = {
          empleado_id: asistencia.empleado_id,
          fecha: asistencia.fecha,
          //coponente UiInputTime deveilve
          hora_entrada: asistencia.hora_entrada.substring(0, 8), // Solo la parte de la hora
          hora_salida: asistencia.hora_salida.substring(0, 8),   // Solo la parte de la hora
          tipo_asistencia_id: asistencia.tipo_asistencia_id,
          observaciones: asistencia.observaciones || '',
        };
      } else {
        router.push({ name: 'lista-asistencias' });
      }
    } catch (error) {
      console.error('Error al cargar la asistencia:', error);
      router.push({ name: 'lista-asistencias' });
    }
  };
  
  const cancelar = () => {
    router.push({ name: 'lista-asistencias' });
  };
  
  const guardarAsistencia = async (formData) => {
  const formattedData = { ...formData };
  formattedData.hora_entrada = formData.hora_entrada ? formData.hora_entrada.substring(0, 5) : null; // Extrae HH:mm
  formattedData.hora_salida = formData.hora_salida ? formData.hora_salida.substring(0, 5) : null;   // Extrae HH:mm

  try {
    if (modo.value === 'editar' && route.params.id) {


        
      await AsistenciaService.update(route.params.id, formattedData);
    } else if (modo.value === 'crear') {
      await AsistenciaService.create(formattedData);
    }
    router.push({ name: 'lista-asistencias' });
  } catch (error) {
    console.error('Error al guardar la asistencia:', error);
  }
};
  
  onMounted(() => {
    cargarRelaciones();
    if (modo.value === 'editar' && route.params.id) {
      cargarAsistencia(route.params.id);
    }
  });
  </script>
  
  <style scoped>
  /* Estilos específicos del componente si los hay */
  </style>