import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from '@/stores/authStore';
import { useGlobalModal } from '@/composables/useGlobalModal';

// Importar los componentes de las páginas y layouts
import PublicLayout from "../layouts/PublicLayout.vue";
import Home from "../pages/Home.vue";
import About from "../pages/About.vue";
import Welcome from "../pages/Welcome.vue";

import AdminLayout from "../layouts/AdminLayout.vue";
import Dashboard from "../pages/admin/Dashboard.vue";
import AdminOverview from "../pages/admin/AdminOverview.vue";

import TipoAsistenciaPage from "../pages/admin/tiposAsistencias/TipoAsistenciaPage.vue";
import ListaTiposAsistencia from "../pages/admin/tiposAsistencias/ListaTiposAsistencia.vue";
import CrearEditarTipoAsistencia from "../pages/admin/tiposAsistencias/CrearEditarTipoAsistencia.vue";

import DepartamentosPage from "../pages/admin/departamentos/DepartamentosPage.vue";
import ListaDepartamentos from "../pages/admin/departamentos/ListaDepartamentos.vue";
import CrearEditarDepartamento from "../pages/admin/departamentos/CrearEditarDepartamento.vue";
import ExportDepartamentosView from "../pages/admin/departamentos/ExportDepartamentosView.vue";

import EstadoSolicitudPage from "../pages/admin/estadosSolicitud/EstadoSolicitudPage.vue";
import ListaEstadoSolicitud from "../pages/admin/estadosSolicitud/ListaEstadoSolicitud.vue";
import CrearEditarEstadoSolicitud from "../pages/admin/estadosSolicitud/CrearEditarEstadoSolicitud.vue";

import VacacionesOficialesPage from "../pages/admin/vacacionesOficiales/VacacionesOficialesPage.vue";
import ListaVacacionesOficiales from "../pages/admin/vacacionesOficiales/ListaVacacionesOficiales.vue";
import CrearEditarVacacionesOficiales from "../pages/admin/vacacionesOficiales/CrearEditarVacacionesOficiales.vue";

import EmpleadosPage from "../pages/admin/empleados/EmpleadosPage.vue"; // Importa la página principal de empleados
import ListaEmpleados from "../pages/admin/empleados/ListaEmpleados.vue"; // Importa la lista de empleados
import CrearEditarEmpleado from "../pages/admin/empleados/CrearEditarEmpleado.vue"; // Importa el formulario de creación/edición
import ExportEmpleadosView from "../pages/admin/empleados/ExportEmpleadosView.vue";

import AsistenciasPage from "../pages/admin/asistencias/AsistenciasPage.vue";
import ListaAsistencias from "../pages/admin/asistencias/ListaAsistencias.vue";
import CrearEditarAsistencia from "../pages/admin/asistencias/CrearEditarAsistencia.vue";
import ReportesAsistenciasView from "../pages/admin/asistencias/ReportesAsistenciasView.vue"; // Cambia esto por el componente que maneja los reportes de asistencias
import ReporteAsistenciasPorMes from "../pages/admin/asistencias/ReporteAsistenciasPorMes.vue"; // Cambia esto por el componente que maneja los reportes de asistencias por departamento
import ReporteAsistenciasPorEmpleado from "../pages/admin/asistencias/ReporteAsistenciasPorEmpleado.vue";
import ReporteAsistenciasPorRangoFechas from "../pages/admin/asistencias/ReporteAsistenciasPorRangoFechas.vue"; // Cambia esto por el componente que maneja los reportes de asistencias por rango de fechas

//Seccion vacaiones
import VacacionesPage from "../pages/admin/vacaciones/VacacionesPage.vue";

//paginas de error
import ErrorLayout from "../layouts/ErrorLayout.vue";
import ServerError from "../pages/ServerError.vue";
import NotFound from "../pages/NotFound.vue";
import ListaVacaciones from "../pages/admin/vacaciones/ListaVacaciones.vue";

// Importa la nueva vista de ReportesVacacionesView
import ReportesVacacionesView from '../pages/admin/vacaciones/ReportesVacacionesView.vue';

// Importa los marcadores de posición para tus componentes de reporte específicos (los crearás más tarde)
// Asegúrate de que estas rutas sean correctas en relación con tu router/index.js
const ReporteVacacionesPorEmpleadoCiclo = () => import('../pages/admin/vacaciones/reportes/ReporteVacacionesPorEmpleadoCiclo.vue');
const ReporteVacacionesPorDepartamento = () => import('../pages/admin/vacaciones/reportes/ReporteVacacionesPorDepartamento.vue');
const ReporteVacacionesPorPeriodo = () => import('../pages/admin/vacaciones/reportes/ReporteVacacionesPorPeriodo.vue');
const ReporteVacacionesDiasTomadosMes = () => import('../pages/admin/vacaciones/reportes/ReporteVacacionesDiasTomadosMes.vue');
const ReporteVacacionesDiasTomadosSemana = () => import('../pages/admin/vacaciones/reportes/ReporteVacacionesDiasTomadosSemana.vue');
const ReporteVacacionesTopEmpleados = () => import('../pages/admin/vacaciones/reportes/ReporteVacacionesTopEmpleados.vue');
const ReporteVacacionesResumen = () => import('../pages/admin/vacaciones/reportes/ReporteVacacionesResumen.vue');
const TestPage = () => import('@/pages/TestPage.vue');

//modals 
import InfoMessageModal from '@/components/modals/InfoMessageModal.vue';


//rutass modulo auth
import authRoutes from  './auth'
import profileRoutes from "./profile";
import employeeRoutes from "./employee";
import UnauthorizedPage from "../pages/errors/UnauthorizedPage.vue";

const routes = [
  // --- Rutas Públicas (usando PublicLayout) ---
  {
    path: "/",
    component: PublicLayout, 
    children: [
      { path: "", component: Welcome, name: "Welcome" }, // Página de bienvenida por defecto
      { path: "home", name: "Home", component: Home },
      { path: "about", name: "About", component: About },
      { path: "test", name: "TestPage", component: TestPage }, // Tu página de pruebas de modales
    ],
  },
//tutass de authenticacion publicass
    {...authRoutes},
  // ---- Rutas de Perfile
    {...profileRoutes},
  // --- Rutas de usuario con rol empleados
    {...employeeRoutes},
  // --- Rutas del Panel Administrativo/Supervisor (usando AdminLayout) ---
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "", // Ruta base para /admin
        name: "admin-base",
        component: AdminOverview,
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "tipos-asistencia",
        component: TipoAsistenciaPage,
        children: [
          {
            path: "lista",
            name: "lista-tipos-asistencia",
            component: ListaTiposAsistencia,
          },
          {
            path: "crear",
            name: "crear-tipo-asistencia",
            component: CrearEditarTipoAsistencia,
          },
          {
            path: "editar/:id",
            name: "editar-tipo-asistencia",
            component: CrearEditarTipoAsistencia,
            props: true,
          },
        ],
      },
      {
        path: "departamentos",
        component: DepartamentosPage,
        children: [
          {
            path: "lista",
            name: "lista-departamentos",
            component: ListaDepartamentos,
          },
          {
            path: "crear",
            name: "crear-deepartamento",
            component: CrearEditarDepartamento,
          },
          {
            path: "editar/:id",
            name: "editar-tipo-asistencia",
            component: CrearEditarDepartamento,
            props: true,
          },
          {
            path: "export",
            name: "exportar-departamentos",
            component: ExportDepartamentosView,
          },
        ],
      },
      {
        path: "estados-solicitud",
        component: EstadoSolicitudPage,
        children: [
          {
            path: "lista",
            name: "lista-estados-solicitud",
            component: ListaEstadoSolicitud,
          },
          {
            path: "crear",
            name: "crear-estado-solicitud",
            component: CrearEditarEstadoSolicitud,
          },
          {
            path: "editar/:id",
            name: "editar-estado-solicitud",
            component: CrearEditarEstadoSolicitud,
            props: true,
          },
        ],
      },
      {
        path: "vacaciones-oficiales",
        component: VacacionesOficialesPage,
        children: [
          {
            path: "lista",
            name: "lista-vacaciones-oficiales",
            component: ListaVacacionesOficiales,
          },
          {
            path: "crear",
            name: "crear-vacacion-oficial",
            component: CrearEditarVacacionesOficiales,
          },
          {
            path: "editar/:id",
            name: "editar-vacacion-oficial",
            component: CrearEditarVacacionesOficiales,
            props: true,
          },
        ],
      },
      {
        path: "empleados",
        component: EmpleadosPage,
        children: [
          {
            path: "lista",
            name: "lista-empleados",
            component: ListaEmpleados,
          },
          {
            path: "crear",
            name: "crear-empleado",
            component: CrearEditarEmpleado,
          },
          {
            path: "editar/:id",
            name: "editar-empleado",
            component: CrearEditarEmpleado,
            props: true,
          },
          {
            path: "export",
            name: "exportar-empleados",
            component: ExportEmpleadosView,
          },
        ],
      },
      {
        path: "asistencias",
        component: AsistenciasPage,
        children: [
          {
            path: "lista",
            name: "lista-asistencias",
            component: ListaAsistencias,
          },
          {
            path: "crear",
            name: "crear-asistencia",
            component: CrearEditarAsistencia,
          },
          {
            path: "editar/:id",
            name: "editar-asistencia",
            component: CrearEditarAsistencia,
            props: true,
          },
          {
            path: "reportes",
            component: ReportesAsistenciasView, // Nuestro nuevo componente "hub"
            children: [
              {
                path: "empleado", // Cambiamos la ruta para que sea más intuitiva
                name: "reporte-asistencias-empleado",
                component: ReporteAsistenciasPorEmpleado,
                props: true,
              },
              {
                path: "mes",
                name: "reporte-asistencias-mes",
                component: ReporteAsistenciasPorMes,
                props: true,
              },
              {
                path: "rango-fechas",
                name: "reporte-asistencias-rango-fechas",
                component: ReporteAsistenciasPorRangoFechas,
              },
              // Agrega aquí más rutas para otros tipos de reportes de asistencias
            ],
          },
        ],
      },
     {
  path: 'vacaciones',
  component: VacacionesPage,
  children: [
    { path: 'lista', name: 'lista-vacaciones', component: ListaVacaciones },
    { path: 'crear', name: 'crear-vacacion', component: () => import('../pages/admin/vacaciones/CrearEditarVacacion.vue') },
    { path: 'editar/:id', name: 'editar-vacacion', component: () => import('../pages/admin/vacaciones/CrearEditarVacacion.vue'), props: true },
    { path: 'administrar', name: 'administrar-estados-vacaciones', component: () => import('../pages/admin/vacaciones/AdminSolicitudesVacaciones.vue') },
    { path: 'opciones-avanzadas', name: 'opciones-avanzadas', component: () => import('../pages/admin/vacaciones/OpcionesAvanzadas.vue'), },
    {
      path: 'reportes',
      component: ReportesVacacionesView,
      children: [
          // Ruta hija predeterminada para /vacaciones/reportes
          { path: '', redirect: { name: 'reporte-vacaciones-empleado-ciclo' } }, // Redirigir a un reporte predeterminado
          { path: 'empleado-ciclo', name: 'reporte-vacaciones-empleado-ciclo', component: ReporteVacacionesPorEmpleadoCiclo },
          { path: 'departamento', name: 'reporte-vacaciones-departamento', component: ReporteVacacionesPorDepartamento },
          { path: 'periodo', name: 'reporte-vacaciones-periodo', component: ReporteVacacionesPorPeriodo },
          { path: 'dias-tomados-mes', name: 'reporte-vacaciones-dias-tomados-mes', component: ReporteVacacionesDiasTomadosMes },
          { path: 'dias-tomados-semana', name: 'reporte-vacaciones-dias-tomados-semana', component: ReporteVacacionesDiasTomadosSemana },
          { path: 'top-empleados', name: 'reporte-vacaciones-top-empleados', component: ReporteVacacionesTopEmpleados },
          { path: 'resumen', name: 'reporte-vacaciones-resumen', component: ReporteVacacionesResumen } ,

      ]
    },
  ]
}
      //mas rutas para Empleados, vacaciones, etc..
    ],
    meta:{ requiresAuth: true },
  },
      //ruta para información del sistema
    {
      path: '/released',
      name: 'released',
      component: () => import('../views/SystemInfo.vue'), // Asegúrate de que este componente exista
    },
// --- Rutas de Error (usando ErrorLayout) ---
  {
    path: "/error",
    component: ErrorLayout,
    children: [
      { path: "500", name: "ServerError", component: ServerError },
      { path: "403", name: "Unauthorized", component: UnauthorizedPage }, // Página de acceso denegado
    ],
  },
   // --- Catch-all para 404 (siempre al final) ---
  {
    path: "/:pathMatch(.*)*", // Ruta para 404 - Página no encontrada
    component: ErrorLayout,
    children: [{ path: "", component: NotFound }],
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
/**-------------------------------- GUardianes de Rutas --------------------------------------- */

// Guard para verificar si está autenticado antes de acceder a rutas protegidas
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const $modal = useGlobalModal();

  // 1. **Cargar usuario si hay token pero no está en el store (al recargar, por ejemplo)**
  if (authStore.token && !authStore.user) {
    try {
      console.log('Token presente pero usuario no cargado. Intentando cargar usuario...');
      await authStore.fetchUser();
      console.log('Usuario cargado con éxito.');
    } catch (error) {
      console.error('Error al recuperar el usuario con token existente:', error);
      authStore.logout(); // Limpiar token inválido
      // No redirigimos aquí inmediatamente para permitir que los siguientes checks lo hagan
    }
  }

  // Protección para rutas privadas
// Verificar si la ruta requiere autenticación y el usuario NO está autenticado
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    console.warn(`[Guard] Redirigiendo a login: Ruta '${to.fullPath}' requiere autenticación.`);
    await $modal?.showModal(
      InfoMessageModal,
      {
        message: 'Necesitas iniciar sesión para acceder a esta sección.',
        buttonText: 'Ir a Iniciar Sesión'
      },
      {
        title: 'Acceso Restringido'
      }
    );
    // IMPORTANTE: usar `return next(...)` después de `await` para evitar doble navegación
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

   // 2. **Verificar Acceso de Invitados** (`guestOnly`)
  // Si la ruta es solo para invitados Y el usuario SÍ está autenticado
  if (to.matched.some(record => record.meta.guestOnly) && authStore.isAuthenticated) {
    console.log(`[Guard] Redirigiendo desde ruta de invitado: Usuario ya autenticado.`);
    await $modal?.showModal(
      InfoMessageModal,
      {
        message: 'Ya estás autenticado. Redirigiendo a tu dashboard.',
        buttonText: 'Aceptar'
      },
      {
        title: 'Ya Iniciaste Sesión'
      }
    );
    // Redirige al dashboard apropiado según el rol del usuario
    const userRole = authStore.user?.role;
    if (userRole === 'admin' || userRole === 'supervisor') {
      return next({ name: 'admin-base' });
    } else if (userRole === 'employee') {
      return next({ name: 'employee-dashboard' });
    } else {
      // Un rol desconocido o por defecto
      return next({ name: 'profile' }); // O a una página general para autenticados
    }
  }

// 3. **Verificar Roles** (`roles`)
  // Si la ruta tiene roles definidos Y el usuario SÍ está autenticado (ya cubierto por requiresAuth si no)
  if (to.matched.some(record => record.meta.roles) && authStore.isAuthenticated) {
    const requiredRoles = to.matched
      .flatMap(record => record.meta.roles || [])
      .filter((value, index, self) => self.indexOf(value) === index); // Obtener roles únicos de todas las metas coincidentes

    const userRole = authStore.user?.role;

    // Si hay roles requeridos y el rol del usuario no está en ellos
    if (requiredRoles.length > 0 && (!userRole || !requiredRoles.includes(userRole))) {
      console.warn(`[Guard] Acceso denegado: Rol '${userRole}' no autorizado para la ruta '${to.fullPath}'. Requeridos: ${requiredRoles.join(', ')}`);
      return next({ name: 'Unauthorized' }); // Redirige a la página de "Acceso Denegado"
    }
  }


// 4. **Continuar la navegación si todas las verificaciones pasan**
  return next();
});

export default router;
