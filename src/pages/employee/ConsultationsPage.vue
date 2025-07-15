<template>
  <div class="max-w-4xl mx-auto space-y-6 p-4">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
      <QuestionMarkCircleIcon class="w-7 h-7 mr-3 text-purple-600" />
      Mis Consultas y Solicitudes
    </h2>
    
    <div v-if="employeeIdError || consultationsError" class="bg-red-100 dark:bg-red-800 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md mb-6 shadow-md">
      <div class="flex items-center">
        <ExclamationTriangleIcon class="h-5 w-5 mr-3 flex-shrink-0" />
        <div class="w-full">
          <p class="font-bold">
            {{ employeeIdError ? 'Error de Acceso o Identificación:' : 'Error al cargar consultas:' }}
          </p>
          <p class="text-sm">
            {{ employeeIdError || consultationsError }}
          </p>
           <div class="mt-4 text-right">
            <button @click="loadAttendanceData" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="bg-purple-50 dark:bg-purple-900 border-l-4 border-purple-500 p-4 mb-6 rounded-md shadow-sm">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <LightBulbIcon class="h-6 w-6 text-purple-600 dark:text-purple-300" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-purple-800 dark:text-purple-200">
            ¡Bienvenido a tu centro de consultas! Aquí podrás gestionar tus preguntas y solicitudes al equipo de Recursos Humanos. Aunque esta sección está en desarrollo, pronto podrás:
          </p>
          <ul class="mt-2 list-disc list-inside text-sm text-purple-700 dark:text-purple-300 space-y-1">
            <li>Enviar nuevas consultas sobre nómina, beneficios, o cualquier tema relacionado.</li>
            <li>Consultar el estado de tus solicitudes enviadas.</li>
            <li>Acceder a respuestas y documentos importantes.</li>
          </ul>
          <p class="mt-2 text-xs text-purple-600 dark:text-purple-400">
            Mantente atento a las próximas actualizaciones. ¡Tu opinión nos ayuda a mejorar!
          </p>
        </div>
      </div>
    </div>



    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          Historial de Consultas Recientes
          <UiBadge v-if="mockConsultations.length > 0 && !loadingConsultations" 
                   :text="mockConsultations.length.toString()" 
                   color="purple" 
                   size="sm" 
                   class="ml-2" />
        </h3>
      </div>
      
      <div v-if="loadingConsultations && !employeeIdError" class="flex flex-col items-center justify-center p-4">
        <UiSpinner class="h-6 w-6 text-purple-600 animate-spin" />
        <p class="ml-3 text-gray-600 dark:text-gray-300 mt-2">Cargando historial de consultas...</p>
      </div>

      <div v-else-if="mockConsultations.length > 0 && !employeeIdError">
        <ul class="divide-y divide-gray-200 dark:divide-gray-600">
          <li v-for="consultation in mockConsultations" :key="consultation.id" 
              class="py-3 flex flex-col sm:flex-row justify-between sm:items-center text-gray-700 dark:text-gray-300">
            <div class="mb-2 sm:mb-0 flex-grow">
              <p class="font-semibold text-gray-800 dark:text-white">{{ consultation.subject }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Enviada: {{ consultation.date }}</p>
            </div>
            <UiBadge :text="formatStatus(consultation.status)" 
                     :color="getBadgeColor(consultation.status)" 
                     size="sm" 
                     class="flex-shrink-0 mt-2 sm:mt-0" />
          </li>
        </ul>
      </div>
      <div v-else-if="!employeeIdError" class="text-gray-500 dark:text-gray-400 text-center p-4">
        No tienes consultas recientes registradas.
      </div>

      <div class="mt-6 flex justify-end">
        <UiButton variant="primary" @click="handleNewConsultation" :disabled="isSubmittingNewConsultation || employeeIdError">
          <UiSpinner v-if="isSubmittingNewConsultation" class="h-4 w-4 mr-2 text-white" />
          {{ isSubmittingNewConsultation ? 'Enviando...' : 'Enviar Nueva Consulta' }}
        </UiButton>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recursos Útiles</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Mientras desarrollamos la funcionalidad completa de consultas, puedes encontrar información útil en las siguientes secciones:
      </p>
      <ul class="space-y-3">
        <li>
          <a href="#" @click.prevent="openResourceLink('Política de Vacaciones')" 
             class="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <DocumentTextIcon class="h-5 w-5 mr-2" />
            Política de Vacaciones de la Empresa
          </a>
        </li>
        <li>
          <a href="#" @click.prevent="openResourceLink('Preguntas Frecuentes de Nómina')" 
             class="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <QuestionMarkCircleIcon class="h-5 w-5 mr-2" />
            Preguntas Frecuentes sobre Nómina
          </a>
        </li>
        <li>
          <a href="#" @click.prevent="openResourceLink('Contacto de RRHH')" 
             class="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <EnvelopeIcon class="h-5 w-5 mr-2" />
            Contacto Directo con Recursos Humanos
          </a>
        </li>
      </ul>
    </div>

    <div class="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-500 p-4 rounded-md shadow-sm">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <PuzzlePieceIcon class="h-6 w-6 text-yellow-700 dark:text-yellow-300" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            ¿Necesitas ayuda o no puedes ver tus datos? Aquí te explicamos qué hacer:
          </p>
          <ul class="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>
              **Si tus datos no cargan:** Haz clic en el botón **"Reintentar Carga"** que aparece arriba. A veces, un pequeño problema de conexión se resuelve con un reintento.
            </li>
            <li>
              **Si el error persiste o no ves tu información:** Es posible que necesites **cerrar sesión y volver a iniciarla**. Esto refrescará tu información de usuario.
            </li>
            <li>
              **Si el problema continúa:** Por favor, contacta directamente al equipo de **Recursos Humanos**. Proporciona una captura de pantalla del error si es posible.
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore'; // Asegúrate de importar authStore
import { useGlobalToast } from '@/composables/useGlobalToast';

// Componentes UI
import UiButton from '@/components/ui/UiButton.vue';
import UiBadge from '@/components/ui/UiBadge.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue';

// Heroicons
import { 
  QuestionMarkCircleIcon, 
  LightBulbIcon, 
  DocumentTextIcon, 
  EnvelopeIcon,
  ExclamationTriangleIcon, // Para mensajes de error
  ArrowPathIcon, // Para el botón de reintentar
  PuzzlePieceIcon // Para la sección "Qué hacer"
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore(); // Instanciar el authStore
const $toast = useGlobalToast();

// --- Estados para simular carga y error del historial de consultas ---
const mockConsultations = ref([]);
const loadingConsultations = ref(true);
const consultationsError = ref(null);
const employeeIdError = ref(null); // Nuevo ref para el error de empleado_id

// --- Estado para simular el envío de una nueva consulta ---
const isSubmittingNewConsultation = ref(false);

// Datos simulados (los cargaremos con un delay)
const simulatedData = [
  { id: 1, subject: 'Consulta sobre Deducciones de Nómina', date: '01/07/2025', status: 'IN_REVIEW' },
  { id: 2, subject: 'Solicitud de Constancia de Empleo', date: '15/06/2025', status: 'COMPLETED' },
  { id: 3, subject: 'Pregunta sobre Beneficios de Salud', date: '01/06/2025', status: 'CLOSED' },
  { id: 4, subject: 'Duda sobre días feriados', date: '20/05/2025', status: 'COMPLETED' },
  { id: 5, subject: 'Información sobre plan de carrera', date: '10/05/2025', status: 'IN_REVIEW' },
];

// Función para verificar la disponibilidad del empleado_id
const checkEmployeeIdAvailability = () => {
  const empleadoId = authStore.user?.empleado_id;
  if (!empleadoId) {
    employeeIdError.value = 'No se pudo obtener tu ID de empleado. Esto puede afectar la carga de tus consultas.';
    $toast?.error('ID de empleado no disponible. No se puede cargar tu historial de consultas.', { duration: 5000 });
    return false;
  }
  employeeIdError.value = null; // Limpiar si antes había un error
  return true;
};

// Función para simular la carga del historial de consultas
const loadConsultationHistory = async () => {
  // Primero, verificar si tenemos un empleado_id válido
  if (!checkEmployeeIdAvailability()) {
    loadingConsultations.value = false; // Detener el spinner si no hay ID
    return; // No intentar cargar datos si no hay ID de empleado
  }

  loadingConsultations.value = true;
  consultationsError.value = null; // Limpiar errores anteriores

  try {
    // Simular una llamada a la API con un delay
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    // Simular un error aleatorio (para pruebas, descomentar para ver el error)
    // if (Math.random() < 0.5) { 
    //   throw new Error('No se pudo cargar el historial de consultas debido a un problema del servidor.');
    // }

    mockConsultations.value = simulatedData; // Asignar los datos simulados
  } catch (error) {
    console.error('Error simulado al cargar consultas:', error);
    consultationsError.value = error.message || 'Error desconocido al cargar el historial.';
    $toast?.error('Error al cargar el historial de consultas.', { duration: 5000 });
  } finally {
    loadingConsultations.value = false;
  }
};

// Maneja el reintento de carga
const handleRetryLoad = () => {
  // Limpiar cualquier error existente y reintentar ambas comprobaciones
  employeeIdError.value = null;
  consultationsError.value = null;
  loadConsultationHistory();
};

// Función para manejar el botón de nueva consulta (ahora con simulación de envío)
const handleNewConsultation = async () => {
  if (employeeIdError.value) { // Si hay un error de ID, no permitir el envío
    $toast?.error('No se puede enviar una consulta sin un ID de empleado válido.', { duration: 5000 });
    return;
  }

  isSubmittingNewConsultation.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay de envío
    
    // Simular un error en el envío (para pruebas, descomentar para ver el error)
    // if (Math.random() < 0.5) {
    //   throw new Error('Fallo al enviar tu consulta. Por favor, revisa los datos.');
    // }

    $toast?.success('¡Tu consulta ha sido enviada con éxito! La revisaremos pronto.', { duration: 4000 });
    // Aquí podrías añadir la nueva consulta simulada al `mockConsultations`
    // (si tuvieras un formulario para capturar los datos)
  } catch (error) {
    console.error('Error simulado al enviar consulta:', error);
    $toast?.error(error.message || 'Error desconocido al enviar tu consulta. Intenta de nuevo.', { title: 'Error al Enviar' });
  } finally {
    isSubmittingNewConsultation.value = false;
  }
};

// Funciones para formatear el estado y obtener el color del badge
const formatStatus = (status) => {
  switch (status) {
    case 'IN_REVIEW': return 'En Revisión';
    case 'COMPLETED': return 'Completada';
    case 'CLOSED': return 'Cerrada';
    case 'PENDING_INFO': return 'Info. Pendiente';
    default: return status || 'Desconocido';
  }
};

const getBadgeColor = (status) => {
  switch (status) {
    case 'IN_REVIEW': return 'blue';
    case 'COMPLETED': return 'green';
    case 'CLOSED': return 'gray';
    case 'PENDING_INFO': return 'yellow';
    default: return 'gray';
  }
};

// Función para simular la apertura de enlaces de recursos
const openResourceLink = (resourceName) => {
  $toast?.info(`Abriendo recurso: "${resourceName}". (Simulado)`, { duration: 3000 });
};

// Carga el historial de consultas al montar el componente
onMounted(() => {
  loadConsultationHistory();
});
</script>

<style scoped>
/* No se necesitan estilos específicos de `style` aquí si todo es Tailwind */
</style>