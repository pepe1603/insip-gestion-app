import { createRouter, createWebHistory } from "vue-router";
// Importar los componentes de las páginas y layouts
import DefaultLayout from "../layouts/DefaultLayout.vue";
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



const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", component: Welcome },
      { path: "/home", name: "Home", component: Home },
      { path: "/about", component: About },
    ],
  },
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
  },
      //ruta para información del sistema
    {
      path: '/released',
      name: 'released',
      component: () => import('../views/SystemInfo.vue'), // Asegúrate de que este componente exista
    },
  {
    path: "/:pathMatch(.*)*", // Ruta para 404 - Página no encontrada
    component: ErrorLayout,
    children: [{ path: "", component: NotFound }],
  },
  {
    path: "/error/500", // Ruta para 500 - Error del servidor
    component: ErrorLayout,
    children: [{ path: "", component: ServerError }],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
