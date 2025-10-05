/**
 * Model Registry - Central registry for auto-registering models with CRUD endpoints
 */

class ModelRegistry {
    constructor() {
        this.models = new Map();
    }

    /**
     * Register a model for auto-CRUD
     * @param {string} collectionName - Name of the collection (e.g., 'Product')
     * @param {object} collectionModel - Sequelize model instance
     * @param {object} options - Optional configuration
     */
    register(collectionName, collectionModel, options = {}) {
        this.models.set(collectionName, {
            collectionName,
            collectionModel,
            options,
        });
    }

    /**
     * Get all registered models
     * @returns {Array} Array of registered model configs
     */
    getAll() {
        return Array.from(this.models.values());
    }

    /**
     * Get a specific model by name
     * @param {string} collectionName
     * @returns {object|undefined}
     */
    get(collectionName) {
        return this.models.get(collectionName);
    }

    /**
     * Check if a model is registered
     * @param {string} collectionName
     * @returns {boolean}
     */
    has(collectionName) {
        return this.models.has(collectionName);
    }

    /**
     * Clear all registered models (useful for testing)
     */
    clear() {
        this.models.clear();
    }

    /**
     * Initialize CRUD endpoints for all registered models
     * @param {object} app - Express app
     * @param {object} appWithMeta - Express app with metadata support
     */
    async initializeAll({ app, appWithMeta }) {
        const { GenericCRUD } = await import('./api/GenericCRUD.js');

        const registeredModels = this.getAll();
        console.log(`Initializing ${registeredModels.length} auto-registered models...`);

        registeredModels.forEach(({ collectionName, collectionModel, options }) => {
            GenericCRUD.initialize({
                app,
                appWithMeta,
                collectionName,
                collectionModel,
                ...options,
            });
        });

        console.log(`✓ Auto-registered ${registeredModels.length} models with CRUD endpoints`);
    }
}

// Export singleton instance
export const modelRegistry = new ModelRegistry();
