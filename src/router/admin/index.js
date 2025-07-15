// src/router/admin/index.js

import AdminLayout from "@/layouts/AdminLayout.vue";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage.vue";
import IntroPage from "@/pages/admin/introPage.vue"; // Asegúrate de que este archivo exista

// Importaciones para Tipos de Asistencia
import TipoAsistenciaPage from "@/pages/admin/tiposAsistencias/TipoAsistenciaPage.vue";
import ListaTiposAsistencia from "@/pages/admin/tiposAsistencias/ListaTiposAsistencia.vue";
import CrearEditarTipoAsistencia from "@/pages/admin/tiposAsistencias/CrearEditarTipoAsistencia.vue";

// Importaciones para Departamentos
import DepartamentosPage from "@/pages/admin/departamentos/DepartamentosPage.vue";
import ListaDepartamentos from "@/pages/admin/departamentos/ListaDepartamentos.vue";
import CrearEditarDepartamento from "@/pages/admin/departamentos/CrearEditarDepartamento.vue";
import ExportDepartamentosView from "@/pages/admin/departamentos/ExportDepartamentosView.vue";

// Importaciones para Estados de Solicitud
import EstadoSolicitudPage from "@/pages/admin/estadosSolicitud/EstadoSolicitudPage.vue";
import ListaEstadoSolicitud from "@/pages/admin/estadosSolicitud/ListaEstadoSolicitud.vue";
import CrearEditarEstadoSolicitud from "@/pages/admin/estadosSolicitud/CrearEditarEstadoSolicitud.vue";

// Importaciones para Vacaciones Oficiales
import VacacionesOficialesPage from "@/pages/admin/vacacionesOficiales/VacacionesOficialesPage.vue";
import ListaVacacionesOficiales from "@/pages/admin/vacacionesOficiales/ListaVacacionesOficiales.vue";
import CrearEditarVacacionesOficiales from "@/pages/admin/vacacionesOficiales/CrearEditarVacacionesOficiales.vue";

// Importaciones para Empleados
import EmpleadosPage from "@/pages/admin/empleados/EmpleadosPage.vue";
import ListaEmpleados from "@/pages/admin/empleados/ListaEmpleados.vue";
import CrearEditarEmpleado from "@/pages/admin/empleados/CrearEditarEmpleado.vue";
import ExportEmpleadosView from "@/pages/admin/empleados/ExportEmpleadosView.vue";

// Importaciones para Asistencias
import AsistenciasPage from "@/pages/admin/asistencias/AsistenciasPage.vue";
import ListaAsistencias from "@/pages/admin/asistencias/ListaAsistencias.vue";
import CrearEditarAsistencia from "@/pages/admin/asistencias/CrearEditarAsistencia.vue";
import ReportesAsistenciasView from "@/pages/admin/asistencias/ReportesAsistenciasView.vue";
import ReporteAsistenciasPorMes from "@/pages/admin/asistencias/ReporteAsistenciasPorMes.vue";
import ReporteAsistenciasPorEmpleado from "@/pages/admin/asistencias/ReporteAsistenciasPorEmpleado.vue";
import ReporteAsistenciasPorRangoFechas from "@/pages/admin/asistencias/ReporteAsistenciasPorRangoFechas.vue";

// Importaciones para Vacaciones
import VacacionesPage from "@/pages/admin/vacaciones/VacacionesPage.vue";
import ListaVacaciones from "@/pages/admin/vacaciones/ListaVacaciones.vue";
import ReportesVacacionesView from '@/pages/admin/vacaciones/ReportesVacacionesView.vue';

// IMPORTACIONES PARA GESTIÓN DE USUARIOS (NUEVAS O MOVIDAS AQUÍ)
import UserManagementPage from '@/pages/admin/users/UserManagementPage.vue';
import UserListPage from '@/pages/admin/users/UserListPage.vue';
import UserDetailPage from "@/pages/admin/users/UserDetailPage.vue";
import UserCreatePage from "@/pages/admin/users/UserCreatePage.vue";
import UserEditPage from "@/pages/admin/users/UserEditPage.vue";

// Importaciones de los componentes de reportes de vacaciones (lazy loaded)
const CrearEditarVacacion = () => import('@/pages/admin/vacaciones/CrearEditarVacacion.vue');
const AdminSolicitudesVacaciones = () => import('@/pages/admin/vacaciones/AdminSolicitudesVacaciones.vue');
const OpcionesAvanzadasVacaciones = () => import('@/pages/admin/vacaciones/OpcionesAvanzadas.vue');
const ReporteVacacionesPorEmpleadoCiclo = () => import('@/pages/admin/vacaciones/reportes/ReporteVacacionesPorEmpleadoCiclo.vue');
const ReporteVacacionesPorDepartamento = () => import('@/pages/admin/vacaciones/reportes/ReporteVacacionesPorDepartamento.vue');
const ReporteVacacionesPorPeriodo = () => import('@/pages/admin/vacaciones/reportes/ReporteVacacionesPorPeriodo.vue');
const ReporteVacacionesDiasTomadosMes = () => import('@/pages/admin/vacaciones/reportes/ReporteVacacionesDiasTomadosMes.vue');
const ReporteVacacionesDiasTomadosSemana = () => import('@/pages/admin/vacaciones/reportes/ReporteVacacionesDiasTomadosSemana.vue');
const ReporteVacacionesTopEmpleados = () => import('@/pages/admin/vacaciones/reportes/ReporteVacacionesTopEmpleados.vue');
const ReporteVacacionesResumen = () => import('@/pages/admin/vacaciones/reportes/ReporteVacacionesResumen.vue');


const adminRoutes = {
  path: "/admin",
  component: AdminLayout,
  meta: { requiresAuth: true, roles: ['admin', 'supervisor'] },
  children: [
    {
      path: "",
      name: "intro",
      component: IntroPage,
    },
    {
      path: "dashboard",
      name: "dashboard",
      component: AdminDashboardPage,
    },
    // INICIO DE LAS RUTAS DE USUARIO AHORA INTEGRADAS DIRECTAMENTE AQUÍ
    {
      path: 'users', // La ruta completa será /admin/users
      component: UserManagementPage, // Este es el componente contenedor con las tabs
      meta: { roles: ['admin', 'supervisor'] },
      children: [
        {
          path: 'list', // La ruta completa será /admin/users/list
          name: 'admin-user-list',
          component: UserListPage,
          meta: { roles: ['admin', 'supervisor'], title: 'listado de eususario' },
        },
        {
          path: 'create', // La ruta completa será /admin/users/create
          name: 'admin-user-create',
          component: UserCreatePage,
          meta: { roles: ['admin'], title: 'Registro de Usuarios' }, // Solo el admin puede crear
        },
        {
          path: 'edit/:id', // La ruta completa será /admin/users/edit/:id
          name: 'admin-user-edit',
          component: UserEditPage, // Reutilizamos el componente
          props: true, // Pasa el parámetro :id como prop
          meta: { roles: ['admin'], title: 'Edicion de usuario' }, // Solo el admin puede editar
        },
        {
          path: ':id', // La ruta completa será /admin/users/:id (Para ver detalles)
          name: 'admin-user-detail',
          component: UserDetailPage, // Usa el componente de detalles si lo necesitas
          props: true,
          meta: { roles: ['admin', 'supervisor'] , title: 'Detalles de usuario en especifico'}, // Ambos pueden ver los detalles
        },
        {
          path: '', // Redirige la ruta base /admin/users a /admin/users/list
          redirect: { name: 'admin-user-list' },
        },
      ],
    },
    // FIN DE LAS RUTAS DE USUARIO
    {
      path: "tipos-asistencia",
      component: TipoAsistenciaPage,
      meta: { roles: ['admin'] },
      children: [
        { path: "lista", name: "lista-tipos-asistencia", component: ListaTiposAsistencia },
        { path: "crear", name: "crear-tipo-asistencia", component: CrearEditarTipoAsistencia },
        { path: "editar/:id", name: "editar-tipo-asistencia", component: CrearEditarTipoAsistencia, props: true },
      ],
    },
    {
      path: "departamentos",
      component: DepartamentosPage,
      meta: { roles: ['admin'] },
      children: [
        { path: "lista", name: "lista-departamentos", component: ListaDepartamentos },
        { path: "crear", name: "crear-departamento", component: CrearEditarDepartamento },
        { path: "editar/:id", name: "editar-departamento", component: CrearEditarDepartamento, props: true },
        { path: "export", name: "exportar-departamentos", component: ExportDepartamentosView },
      ],
    },
    {
      path: "estados-solicitud",
      component: EstadoSolicitudPage,
      meta: { roles: ['admin'] },
      children: [
        { path: "lista", name: "lista-estados-solicitud", component: ListaEstadoSolicitud },
        { path: "crear", name: "crear-estado-solicitud", component: CrearEditarEstadoSolicitud },
        { path: "editar/:id", name: "editar-estado-solicitud", component: CrearEditarEstadoSolicitud, props: true },
      ],
    },
    {
      path: "vacaciones-oficiales",
      component: VacacionesOficialesPage,
      meta: { roles: ['admin'] },
      children: [
        { path: "lista", name: "lista-vacaciones-oficiales", component: ListaVacacionesOficiales },
        { path: "crear", name: "crear-vacacion-oficial", component: CrearEditarVacacionesOficiales },
        { path: "editar/:id", name: "editar-vacacion-oficial", component: CrearEditarVacacionesOficiales, props: true },
      ],
    },
    {
      path: "empleados",
      component: EmpleadosPage,
      meta: { roles: ['admin', 'supervisor'] },
      children: [
        { path: "lista", name: "lista-empleados", component: ListaEmpleados },
        { path: "crear", name: "crear-empleado", component: CrearEditarEmpleado, meta: { roles: ['admin'] } },
        { path: "editar/:id", name: "editar-empleado", component: CrearEditarEmpleado, props: true, meta: { roles: ['admin'] } },
        { path: "export", name: "exportar-empleados", component: ExportEmpleadosView },
      ],
    },
    {
      path: "asistencias",
      component: AsistenciasPage,
      meta: { roles: ['admin', 'supervisor'] },
      children: [
        { path: "lista", name: "lista-asistencias", component: ListaAsistencias },
        { path: "crear", name: "crear-asistencia", component: CrearEditarAsistencia, meta: { roles: ['admin'] } },
        { path: "editar/:id", name: "editar-asistencia", component: CrearEditarAsistencia, props: true, meta: { roles: ['admin'] } },
        {
          path: "reportes",
          component: ReportesAsistenciasView,
          meta: { roles: ['admin', 'supervisor'] },
          children: [
            { path: "empleado", name: "reporte-asistencias-empleado", component: ReporteAsistenciasPorEmpleado, props: true },
            { path: "mes", name: "reporte-asistencias-mes", component: ReporteAsistenciasPorMes, props: true },
            { path: "rango-fechas", name: "reporte-asistencias-rango-fechas", component: ReporteAsistenciasPorRangoFechas },
          ],
        },
      ],
    },
    {
      path: 'vacaciones',
      component: VacacionesPage,
      meta: { roles: ['admin', 'supervisor'] },
      children: [
        { path: 'lista', name: 'lista-vacaciones', component: ListaVacaciones },
        { path: 'crear', name: 'crear-vacacion', component: CrearEditarVacacion, meta: { roles: ['admin'] } },
        { path: 'editar/:id', name: 'editar-vacacion', component: CrearEditarVacacion, props: true, meta: { roles: ['admin'] } },
        { path: 'administrar', name: 'administrar-estados-vacaciones', component: AdminSolicitudesVacaciones },
        { path: 'opciones-avanzadas', name: 'opciones-avanzadas', component: OpcionesAvanzadasVacaciones, meta: { roles: ['admin'] } },
        {
          path: 'reportes',
          component: ReportesVacacionesView,
          meta: { roles: ['admin', 'supervisor'] },
          children: [
            { path: '', redirect: { name: 'reporte-vacaciones-empleado-ciclo' } },
            { path: 'empleado-ciclo', name: 'reporte-vacaciones-empleado-ciclo', component: ReporteVacacionesPorEmpleadoCiclo },
            { path: 'departamento', name: 'reporte-vacaciones-departamento', component: ReporteVacacionesPorDepartamento },
            { path: 'periodo', name: 'reporte-vacaciones-periodo', component: ReporteVacacionesPorPeriodo },
            { path: 'dias-tomados-mes', name: 'reporte-vacaciones-dias-tomados-mes', component: ReporteVacacionesDiasTomadosMes },
            { path: 'dias-tomados-semana', name: 'reporte-vacaciones-dias-tomados-semana', component: ReporteVacacionesDiasTomadosSemana },
            { path: 'top-empleados', name: 'reporte-vacaciones-top-empleados', component: ReporteVacacionesTopEmpleados },
            { path: 'resumen', name: 'reporte-vacaciones-resumen', component: ReporteVacacionesResumen },
          ]
        },
      ]
    },
  ],
};

export default adminRoutes;