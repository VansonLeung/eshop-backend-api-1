import { SchemaToIndexes } from './models/SchemaHelper.js';

/**
 * ModelRegistry - A generic registry for managing Sequelize models
 * Provides centralized model registration, initialization, and association setup
 */
class ModelRegistry {
    constructor() {
        this.modelSchemas = new Map();
        this.initializedModels = new Map();
        this.sequelize = null;
    }

    /**
     * Register a model schema with the registry
     * @param {string} modelName - Name of the model
     * @param {Object} modelSchema - Model schema object with makeSchema() and makeAssociations() methods
     */
    registerModel(modelName, modelSchema) {
        if (this.modelSchemas.has(modelName)) {
            throw new Error(`Model '${modelName}' is already registered`);
        }
        this.modelSchemas.set(modelName, modelSchema);
    }

    /**
     * Get a registered model schema
     * @param {string} modelName - Name of the model
     * @returns {Object} Model schema
     */
    getModelSchema(modelName) {
        return this.modelSchemas.get(modelName);
    }

    /**
     * Get all registered model schemas
     * @returns {Map} Map of model name to schema
     */
    getAllModelSchemas() {
        return new Map(this.modelSchemas);
    }

    /**
     * Initialize all registered models with a Sequelize instance
     * @param {Sequelize} sequelize - Sequelize instance
     */
    initializeModels(sequelize) {
        this.sequelize = sequelize;
        this.initializedModels.clear();

        for (const [modelName, modelSchema] of this.modelSchemas) {
            const schema = modelSchema.makeSchema();
            const model = sequelize.define(modelName, schema, {
                indexes: SchemaToIndexes(schema)
            });
            this.initializedModels.set(modelName, model);
        }
    }

    /**
     * Get an initialized model
     * @param {string} modelName - Name of the model
     * @returns {Model} Sequelize model instance
     */
    getModel(modelName) {
        const model = this.initializedModels.get(modelName);
        if (!model) {
            throw new Error(`Model '${modelName}' not found. Make sure models are initialized first.`);
        }
        return model;
    }

    /**
     * Get all initialized models
     * @returns {Map} Map of model name to Sequelize model
     */
    getAllModels() {
        return new Map(this.initializedModels);
    }

    /**
     * Setup associations for all registered models
     * This should be called after all models are initialized
     */
    setupAssociations() {
        if (this.initializedModels.size === 0) {
            throw new Error('Models must be initialized before setting up associations');
        }

        for (const [modelName, modelSchema] of this.modelSchemas) {
            const model = this.initializedModels.get(modelName);
            if (modelSchema.makeAssociations) {
                // Create association context with all models
                const associationContext = { Me: model };
                for (const [otherModelName, otherModel] of this.initializedModels) {
                    associationContext[otherModelName] = otherModel;
                }
                modelSchema.makeAssociations(associationContext);
            }
        }
    }

    /**
     * Check if a model is registered
     * @param {string} modelName - Name of the model
     * @returns {boolean} True if model is registered
     */
    hasModel(modelName) {
        return this.modelSchemas.has(modelName);
    }

    /**
     * Get the count of registered models
     * @returns {number} Number of registered models
     */
    getModelCount() {
        return this.modelSchemas.size;
    }

    /**
     * Clear all registered models and initialized models
     */
    clear() {
        this.modelSchemas.clear();
        this.initializedModels.clear();
        this.sequelize = null;
    }
}

// Export singleton instance
export const modelRegistry = new ModelRegistry();
export default modelRegistry;