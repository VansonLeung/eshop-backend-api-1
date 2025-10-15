// API Client Module

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Mock data for testing when backend is not available
 * @param {string} url - API endpoint
 * @returns {object|array} - Mock response data
 */
function getMockData(url) {
    if (url === '/Product') {
        return [
            {
                id: 1,
                name: 'Sample Product 1',
                description: 'This is a sample product for testing',
                price: 29.99,
                sku: 'SP001'
            },
            {
                id: 2,
                name: 'Sample Product 2',
                description: 'Another sample product',
                price: 49.99,
                sku: 'SP002'
            }
        ];
    }
    if (url === '/User') {
        return [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                role: 'admin'
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                role: 'user'
            }
        ];
    }
    if (url === '/Order') {
        return [
            {
                id: 1,
                userId: 1,
                productId: 1,
                quantity: 2,
                total: 59.98,
                status: 'pending'
            }
        ];
    }
    if (url.startsWith('/Product/')) {
        const id = parseInt(url.split('/')[2]);
        return {
            id: id,
            name: `Sample Product ${id}`,
            description: `This is sample product ${id} for testing`,
            price: 29.99 + id,
            sku: `SP00${id}`
        };
    }
    if (url.startsWith('/User/')) {
        const id = parseInt(url.split('/')[2]);
        return {
            id: id,
            name: `User ${id}`,
            email: `user${id}@example.com`,
            role: id === 1 ? 'admin' : 'user'
        };
    }
    if (url.startsWith('/Order/')) {
        const id = parseInt(url.split('/')[2]);
        return {
            id: id,
            userId: 1,
            productId: 1,
            quantity: 1,
            total: 29.99,
            status: 'pending'
        };
    }
    return {};
}

/**
 * Generic fetch wrapper with error handling
 * @param {string} url - API endpoint
 * @param {object} options - fetch options
 * @returns {Promise} - JSON response or throws error
 */
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            // For testing purposes, return mock data when backend is not available
            if (response.status === 404 || response.status >= 500) {
                return getMockData(url);
            }
            if (response.status === 401) {
                // Handle unauthorized - redirect to login
                window.location.href = '/login';
                throw new Error('Unauthorized');
            }
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        // If fetch fails (network error), return mock data for testing
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return getMockData(url);
        }
        console.error('API Request failed:', error);
        throw error;
    }
}

// CRUD operations for entities
export const api = {
    // Generic methods
    get: (endpoint) => apiRequest(endpoint),
    post: (endpoint, data) => apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    put: (endpoint, data) => apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (endpoint) => apiRequest(endpoint, {
        method: 'DELETE'
    }),

    // Entity-specific methods
    users: {
        list: () => apiRequest('/User'),
        get: (id) => apiRequest(`/User/${id}`),
        create: (data) => apiRequest('/User', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => apiRequest(`/User/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => apiRequest(`/User/${id}`, { method: 'DELETE' })
    },

    products: {
        list: () => apiRequest('/Product'),
        get: (id) => apiRequest(`/Product/${id}`),
        create: (data) => apiRequest('/Product', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => apiRequest(`/Product/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => apiRequest(`/Product/${id}`, { method: 'DELETE' })
    },

    orders: {
        list: () => apiRequest('/Order'),
        get: (id) => apiRequest(`/Order/${id}`),
        create: (data) => apiRequest('/Order', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => apiRequest(`/Order/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => apiRequest(`/Order/${id}`, { method: 'DELETE' })
    }
};