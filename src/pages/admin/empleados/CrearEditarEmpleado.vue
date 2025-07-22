<template>
    <div class="container mx-auto p-4">

  <UiAlert v-if="modeEdition" type="warning" :show-icon="true" :dismissible="false" extra-classes="mb-6">
      <h3 class="text-lg font-semibold mb-2">Edición de Datos del Empleado</h3>
      <p>
        Estás editando la información de un empleado existente. Puedes actualizar cualquier detalle según sea necesario.
      </p>
      <p class="mt-2 font-bold text-orange-700 dark:text-orange-300">
        ¡Importante sobre el Email!
      </p>
      <p class="mt-1">
        Si modificas el <strong>correo electrónico</strong>, este cambio se <strong>aplicará automáticamente</strong>
        a la tabla de usuarios. El nuevo email será el nuevo nombre de usuario para el acceso del empleado
        a la plataforma y el destino de sus notificaciones.
      </p>
      <p class="mt-2">
        Asegúrate de que el nuevo email sea correcto y que el empleado esté al tanto del cambio en su credencial de acceso.
      </p>
    </UiAlert>

    <UiAlert v-else type="info" :show-icon="true" :dismissible="false" extra-classes="mb-6">
      <h3 class="text-lg font-semibold mb-2">Creación de Nuevo Empleado</h3>
      <p>
        Por favor, completa todos los campos requeridos para registrar a un nuevo empleado en el sistema.
        El <strong>correo electrónico</strong> que proporciones será crucial, ya que se utilizará como:
      </p>
      <ul class="list-disc list-inside mt-2 space-y-1">
        <li>El <strong>nombre de usuario</strong> para que el empleado acceda a la plataforma.</li>
        <li>El destino principal para el envío de <strong>notificaciones importantes</strong>.</li>
      </ul>
      <p class="mt-2">
        Asegúrate de que el email sea válido y único. Una vez creado, el empleado recibirá instrucciones para su primer inicio de sesión.
      </p>
    </UiAlert>

      <CrearEditarFormDinamico
        :title="modalTitle"
        :subtitle="modalSubtitle"
        :fields="formFields"
        :initialValues="formValues"
        :saveButtonText="saveButtonText"
        @submit-form="guardarEmpleado"
        @cancel="cancelar"
        :loading="cargandoDepartamentos"
        :error="errorDepartamentos"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import EmpleadoService from '../../../services/empleadoService';
  import DepartamentoService from '../../../services/departamentosService';
  import CrearEditarFormDinamico from '../../../components/forms/CreateEdithFormDynamic.vue';
import UiAlert from '../../../components/ui/UiAlert.vue';
  
  const router = useRouter();
  const route = useRoute();
  
  const modo = computed(() => route.name === 'editar-empleado' ? 'editar' : 'crear');
  const modeEdition = ref(false);
  const formValues = ref({
    status: 'ACTIVO',
    tipo_contrato: 'TIEMPO_COMPLETO',
    departamento_id: null, // Inicializamos departamento_id
  });
  const modalTitle = computed(() => (modo.value === 'editar' ? 'Editar Empleado' : 'Crear Nuevo Empleado'));
  const modalSubtitle = computed(() => (modo.value === 'editar' ? 'Modifica los detalles del empleado.' : 'Ingresa los detalles para crear un nuevo empleado.'));
  const saveButtonText = computed(() => (modo.value === 'editar' ? 'Guardar Cambios' : 'Crear'));
  
  const departamentos = ref([]);
  const formFields = ref([
    { type: 'text', model: 'nombre', label: 'Nombre:', placeholder: 'Ingrese el nombre', required: true },
    { type: 'text', model: 'ape_paterno', label: 'Apellido Paterno:', placeholder: 'Ingrese el apellido paterno', required: true },
    { type: 'text', model: 'ape_materno', label: 'Apellido Materno:', placeholder: 'Ingrese el apellido materno', required: true },
    { type: 'email', model: 'email', label: 'Correo Electrónico:', placeholder: 'Ingrese un correo electrónico valido', required: true },
    { type: 'text', model: 'telefono', label: 'Teléfono:', placeholder: 'Ingrese el teléfono' },
    { type: 'date', model: 'fecha_ingreso', label: 'Fecha de Ingreso:', required: true },
    { type: 'text', model: 'puesto', label: 'Puesto:', placeholder: 'Ingrese el puesto', required: true },
    {
      type: 'select',
      model: 'departamento_id',
      label: 'Departamento:',
      options: computed(() => departamentos.value.map(dep => ({ label: dep.nombre, value: dep.id }))),
      placeholder: 'Selecciona un departamento',
      required: true,
    },
    {
      type: 'select',
      model: 'status',
      label: 'Status Inicial:',
      options: [
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Inactivo', value: 'INACTIVO' },
      ],
      required: true,
    },
    {
      type: 'select',
      model: 'tipo_contrato',
      label: 'Horario Laboral:',
      options: [
        { label: 'Lunes a Viernes', value: 'TIEMPO_COMPLETO' },
        { label: 'Semana Completa', value: 'MEDIO_TIEMPO' },
      ],
      required: true,
    },
  ]);
  
  const cargandoDepartamentos = ref(false);
  const errorDepartamentos = ref(null);
  
  const cargarDepartamentos = async () => {
    cargandoDepartamentos.value = true;
    errorDepartamentos.value = null;
    try {
      departamentos.value = await DepartamentoService.getAll();
    } catch (err) {
      errorDepartamentos.value = err;
    } finally {
      cargandoDepartamentos.value = false;
    }
  };
  
  const cargarEmpleado = async (id) => {
    try {
      const empleado = await EmpleadoService.getById(id);
      if (empleado) {
        // Asignamos el departamento_id a formValues para la edición
        formValues.value = { ...empleado, departamento_id: empleado.departamento_id };
      } else {
        router.push({ name: 'lista-empleados' });
      }
    } catch (error) {
      console.error('Error al cargar el empleado:', error);
      router.push({ name: 'lista-empleados' });
    }
  };
  
  const cancelar = () => {
    router.push({ name: 'lista-empleados' });
  };
  
  const guardarEmpleado = async (formData) => {
    try {
      if (modo.value === 'editar' && route.params.id) {
        await EmpleadoService.update(route.params.id, formData);
        
      } else if (modo.value === 'crear') {
        await EmpleadoService.create(formData);
        
      }
      router.push({ name: 'lista-empleados' });
    } catch (error) {
      console.error('Error al guardar el empleado:', error);
    }
  };
  
  onMounted(() => {
    cargarDepartamentos();
    if (modo.value === 'editar' && route.params.id) {
      cargarEmpleado(route.params.id);
      modeEdition.value = true;
    }else{
      modeEdition.value = false;
    }
  });
  </script>