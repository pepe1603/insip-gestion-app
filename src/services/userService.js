// src/services/userService.js

import api from './api'; // Asume que tienes un archivo api.js configurado con Axios

const UserService = {
  /**
   * Obtiene una lista paginada de usuarios con filtros y ordenamiento.
   * GET /api/admin/users
   * @param {Object} params - Parámetros de la consulta (search, role, is_active, sort_by, sort_order, page, per_page)
   * @returns {Promise<Object>} Objeto de paginación de Laravel { data: [], current_page: N, last_page: N, total: N, ... }
   */
  async getUsers(params = {}) {
    try {
      // Construye los parámetros de la URL
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/users?${queryString}`);
      console.log('API Response (getUsers):', response.data);
      return response.data.data; // Retorna los datos de paginación
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Obtiene los detalles de un usuario específico.
   * GET /api/admin/users/{id}
   * @param {number} id - ID del usuario.
   * @returns {Promise<Object>} Detalles del usuario.
   */
  async getUser(id) {
    try {
      const response = await api.get(`/admin/users/${id}`);
      // console.log('API Response (getUser):', response.data);
      return response.data.data; // Asumiendo que ApiResponse::success envuelve el objeto en 'data'
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Crea un nuevo usuario.
   * POST /api/admin/users
   * @param {Object} userData - Datos del nuevo usuario (name, email, password, password_confirmation, role).
   * @returns {Promise<Object>} El usuario creado.
   */
  async createUser(userData) {
    try {
      const response = await api.post('/admin/users', userData);
      console.log('API Response (createUser):', response.data);
      return response.data; // La API retorna { message: '...', user: { ... } }
    } catch (error) {
      console.error('Error creating user:', error.response?.data?.data.message || error.response?.data);
      throw error;
    }
  },

  /**
   * Actualiza un usuario existente.
   * PUT/PATCH /api/admin/users/{id}
   * @param {number} id - ID del usuario a actualizar.
   * @param {Object} userData - Datos a actualizar del usuario (name, email, password, password_confirmation, role, is_active).
   * @returns {Promise<Object>} El usuario actualizado.
   */
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/admin/users/${id}`, userData); // O .patch, si solo envías los campos cambiados
      // console.log('API Response (updateUser):', response.data);
      return response.data.data; // Asumiendo que ApiResponse::success envuelve el objeto en 'data'
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Elimina un usuario.
   * DELETE /api/admin/users/{id}
   * @param {number} id - ID del usuario a eliminar.
   * @returns {Promise<void>}
   */
  async deleteUser(id) {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      // console.log('API Response (deleteUser):', response.status); // Debería ser 204 No Content
      return response; // La API retorna 204 No Content, sin 'data'
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Alterna el estado activo/inactivo de un usuario.
   * PATCH /api/admin/users/{user}/toggle-active
   * @param {number} id - ID del usuario.
   * @returns {Promise<Object>} El usuario con el estado actualizado.
   */
  async toggleUserActiveStatus(id) {
    try {
      const response = await api.patch(`/admin/users/${id}/toggle-active`);
      console.log('API Response (toggleUserActiveStatus):', response.data);
      // Tu API retorna: ['message' => "El estado del ususario cambio a {$status} exitosamente.", $user]
      // Aquí accedemos al objeto user que está en el segundo elemento del array.
      return response.data;
    } catch (error) {
      console.error('serviceError', error);
      console.error(`Error toggling active status for user ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
};

export default UserService;