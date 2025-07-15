// src/router/employee/index.js

import EmployeeLayout from '@/layouts/EmployeeLayout.vue'; 
import EmployeeDashboardPage from '@/pages/employee/EmployeeDashboardPage.vue';
import AttendancePage from '@/pages/employee/AttendancePage.vue';
import VacationsPage from '@/pages/employee/VacationsPage.vue';
import RequestVacationPage from '@/pages/employee/RequestVacationPage.vue';
import ConsultationsPage from '@/pages/employee/ConsultationsPage.vue';
import DataEmployeePage from '../../pages/employee/DataEmployeePage.vue';
import EmployeeDashboardOverviewPage from '@/pages/employee/EmployeeDashboardOverviewPage.vue';

const employeeRoutes = {
  path: '/employee', // Prefijo para todas las rutas del empleado
  component: EmployeeLayout, // Usaremos el nuevo layout de empleado
  meta: { 
    requiresAuth: true, 
    roles: ['employee', 'supervisor', 'admin'] // Ajusta los roles que pueden acceder a esta sección
  }, 

  children: [
    {
      // Este es la página de bienvenida y resumen del panel de empleado
      path: '', 
      name: 'employee-overview', // Nuevo nombre para la ruta principal
      component: EmployeeDashboardOverviewPage, // El nuevo componente de bienvenida
      meta: { title: 'Bienvenido al Panel de Empleado' } 
    },
    {
      // El dashboard original, ahora como una sub-ruta si aún se necesita un "dashboard" específico
      path: 'dashboard', // Cambiado de '' a 'dashboard'
      name: 'employee-dashboard', // Mantén el nombre si es el que usas en el EmployeeLayout para el "Dashboard"
      component: EmployeeDashboardPage,
      meta: { title: 'Resumen del Dashboard' } 
    },
    {
      path: 'attendance', // Ruta: /employee/attendance
      name: 'employee-attendance',
      component: AttendancePage,
      meta: { title: 'Mis Asistencias' }
    },
    {
      path: 'vacations', // Ruta: /employee/vacations
      name: 'employee-vacations',
      component: VacationsPage,
      meta: { title: 'Mis Vacaciones' }
    },
    {
      path: 'request-vacation', // Ruta: /employee/request-vacation
      name: 'employee-request-vacation',
      component: RequestVacationPage,
      meta: { title: 'Solicitar Vacaciones' }
    },
    {
      path: 'consultations', // Ruta: /employee/consultations
      name: 'employee-consultations',
      component: ConsultationsPage,
      meta: { title: 'Consultas' }
    },
        {
      path: 'my-data', // ¡La nueva ruta, ahora sin :id!
      name: 'employee-my-data', // Nombre de la ruta
      component: DataEmployeePage,
      meta: { title: 'Mis Datos', roles: ['employee'] }, // Típicamente solo el empleado puede ver sus propios datos
    },
    // No necesitamos una ruta específica para el perfil de usuario aquí,
    // el EmployeeLayout tendrá un enlace directo a la ruta 'profile'.
  ]
};

export default employeeRoutes;