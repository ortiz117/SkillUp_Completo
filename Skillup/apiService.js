// apiService.js

// Importamos la configuración que ya tienes
import CONFIG from './config.js';

/**
 * Función genérica para manejar las peticiones fetch.
 * Así no repetimos código.
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${CONFIG.API_URL}${endpoint}`;

    // Configuramos los headers por defecto
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers, // Permite sobreescribir o añadir headers
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // Si el servidor responde con un error (4xx, 5xx), lo lanzamos
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ocurrió un error en la petición');
    }

    return response.json(); // Devolvemos los datos en formato JSON
}

/**
 * Inicia sesión de un usuario.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} El token y los datos del usuario.
 */
export const login = (email, password) => {
    return apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

/**
 * Registra un nuevo usuario.
 * @param {object} userData - Datos del usuario (name, email, password, etc.)
 * @returns {Promise<object>} El usuario registrado.
 */
export const register = (userData) => {
    return apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

// --- A FUTURO: Aquí podrías añadir más funciones ---
// export const getCertifications = () => apiFetch('/certifications');
// export const getTutors = () => apiFetch('/tutors');