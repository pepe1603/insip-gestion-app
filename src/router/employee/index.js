// src/router/employee/index.js

import EmployeeLayout from '@/layouts/EmployeeLayout.vue'; 
import EmployeeDashboardPage from '@/pages/employee/EmployeeDashboardPage.vue';
import AttendancePage from '@/pages/employee/AttendancePage.vue';
import VacationsPage from '@/pages/employee/VacationsPage.vue';
import RequestVacationPage from '@/pages/employee/RequestVacationPage.vue';
import ConsultationsPage from '@/pages/employee/ConsultationsPage.vue';

const employeeRoutes = {
  path: '/employee', // Prefijo para todas las rutas del empleado
  component: EmployeeLayout, // Usaremos el nuevo layout de empleado
  meta: { 
    requiresAuth: true, 
    roles: ['employee', 'supervisor'] // Ajusta los roles que pueden acceder a esta sección
  }, 

  children: [
    {
      path: '', // Ruta base: /employee
      name: 'employee-dashboard',
      component: EmployeeDashboardPage,
      meta: { title: 'Mi Espacio de Empleado' } 
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
    // No necesitamos una ruta específica para el perfil de usuario aquí,
    // el EmployeeLayout tendrá un enlace directo a la ruta 'profile'.
  ]
};

export default employeeRoutes;