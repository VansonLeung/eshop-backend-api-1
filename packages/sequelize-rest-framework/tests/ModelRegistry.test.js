import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Sequelize } from 'sequelize';
import { modelRegistry } from '../src/ModelRegistry.js';

// Mock model schemas for testing
const createMockSchema = (name, associations = false) => ({
    makeSchema: () => ({
        id: { type: 'INTEGER', primaryKey: true },
        name: { type: 'STRING', allowNull: false },
        createdAt: { type: 'DATE' },
        updatedAt: { type: 'DATE' }
    }),
    makeAssociations: associations ? vi.fn() : undefined
});

describe('ModelRegistry', () => {
    let sequelize;

    beforeEach(() => {
        // Clear registry before each test
        modelRegistry.clear();

        // Create in-memory SQLite instance for testing
        sequelize = new Sequelize('sqlite::memory:', { logging: false });
    });

    describe('registerModel', () => {
        it('should register a model successfully', () => {
            const mockSchema = createMockSchema('User');
            modelRegistry.registerModel('User', mockSchema);

            expect(modelRegistry.hasModel('User')).toBe(true);
            expect(modelRegistry.getModelSchema('User')).toBe(mockSchema);
        });

        it('should throw error when registering duplicate model', () => {
            const mockSchema = createMockSchema('User');
            modelRegistry.registerModel('User', mockSchema);

            expect(() => {
                modelRegistry.registerModel('User', mockSchema);
            }).toThrow("Model 'User' is already registered");
        });

        it('should handle multiple model registrations', () => {
            const userSchema = createMockSchema('User');
            const postSchema = createMockSchema('Post');
            const commentSchema = createMockSchema('Comment');

            modelRegistry.registerModel('User', userSchema);
            modelRegistry.registerModel('Post', postSchema);
            modelRegistry.registerModel('Comment', commentSchema);

            expect(modelRegistry.getModelCount()).toBe(3);
            expect(modelRegistry.hasModel('User')).toBe(true);
            expect(modelRegistry.hasModel('Post')).toBe(true);
            expect(modelRegistry.hasModel('Comment')).toBe(true);
        });
    });

    describe('initializeModels', () => {
        it('should initialize models with Sequelize instance', () => {
            const userSchema = createMockSchema('User');
            const postSchema = createMockSchema('Post');

            modelRegistry.registerModel('User', userSchema);
            modelRegistry.registerModel('Post', postSchema);

            modelRegistry.initializeModels(sequelize);

            expect(() => modelRegistry.getModel('User')).not.toThrow();
            expect(() => modelRegistry.getModel('Post')).not.toThrow();

            const userModel = modelRegistry.getModel('User');
            const postModel = modelRegistry.getModel('Post');

            expect(userModel).toBeDefined();
            expect(postModel).toBeDefined();
            expect(userModel.name).toBe('User');
            expect(postModel.name).toBe('Post');
        });

        it('should throw error when getting model before initialization', () => {
            const userSchema = createMockSchema('User');
            modelRegistry.registerModel('User', userSchema);

            expect(() => modelRegistry.getModel('User')).toThrow(
                "Model 'User' not found. Make sure models are initialized first."
            );
        });

        it('should throw error when getting unregistered model', () => {
            modelRegistry.initializeModels(sequelize);

            expect(() => modelRegistry.getModel('NonExistent')).toThrow(
                "Model 'NonExistent' not found. Make sure models are initialized first."
            );
        });
    });

    describe('setupAssociations', () => {
        it('should setup associations for models with makeAssociations method', () => {
            const userSchema = createMockSchema('User', true);
            const postSchema = createMockSchema('Post', true);

            modelRegistry.registerModel('User', userSchema);
            modelRegistry.registerModel('Post', postSchema);

            modelRegistry.initializeModels(sequelize);
            modelRegistry.setupAssociations();

            expect(userSchema.makeAssociations).toHaveBeenCalled();
            expect(postSchema.makeAssociations).toHaveBeenCalled();

            // Check that associations were called with correct context
            const userCall = userSchema.makeAssociations.mock.calls[0][0];
            expect(userCall.Me).toBeDefined();
            expect(userCall.User).toBeDefined();
            expect(userCall.Post).toBeDefined();
        });

        it('should throw error when setting up associations before initialization', () => {
            const userSchema = createMockSchema('User', true);
            modelRegistry.registerModel('User', userSchema);

            expect(() => modelRegistry.setupAssociations()).toThrow(
                'Models must be initialized before setting up associations'
            );
        });

        it('should handle models without makeAssociations method', () => {
            const userSchema = createMockSchema('User', false); // No associations
            const postSchema = createMockSchema('Post', true);

            modelRegistry.registerModel('User', userSchema);
            modelRegistry.registerModel('Post', postSchema);

            modelRegistry.initializeModels(sequelize);
            modelRegistry.setupAssociations();

            // Only Post should have associations called
            expect(postSchema.makeAssociations).toHaveBeenCalled();
        });
    });

    describe('getAllModels and getAllModelSchemas', () => {
        it('should return all registered schemas', () => {
            const userSchema = createMockSchema('User');
            const postSchema = createMockSchema('Post');

            modelRegistry.registerModel('User', userSchema);
            modelRegistry.registerModel('Post', postSchema);

            const allSchemas = modelRegistry.getAllModelSchemas();
            expect(allSchemas.size).toBe(2);
            expect(allSchemas.get('User')).toBe(userSchema);
            expect(allSchemas.get('Post')).toBe(postSchema);
        });

        it('should return all initialized models', () => {
            const userSchema = createMockSchema('User');
            const postSchema = createMockSchema('Post');

            modelRegistry.registerModel('User', userSchema);
            modelRegistry.registerModel('Post', postSchema);
            modelRegistry.initializeModels(sequelize);

            const allModels = modelRegistry.getAllModels();
            expect(allModels.size).toBe(2);
            expect(allModels.get('User')).toBeDefined();
            expect(allModels.get('Post')).toBeDefined();
        });
    });

    describe('utility methods', () => {
        it('should return correct model count', () => {
            expect(modelRegistry.getModelCount()).toBe(0);

            modelRegistry.registerModel('User', createMockSchema('User'));
            expect(modelRegistry.getModelCount()).toBe(1);

            modelRegistry.registerModel('Post', createMockSchema('Post'));
            expect(modelRegistry.getModelCount()).toBe(2);
        });

        it('should clear registry correctly', () => {
            const userSchema = createMockSchema('User');
            modelRegistry.registerModel('User', userSchema);
            modelRegistry.initializeModels(sequelize);

            expect(modelRegistry.getModelCount()).toBe(1);
            expect(modelRegistry.hasModel('User')).toBe(true);

            modelRegistry.clear();

            expect(modelRegistry.getModelCount()).toBe(0);
            expect(modelRegistry.hasModel('User')).toBe(false);
            expect(() => modelRegistry.getModel('User')).toThrow();
        });
    });
});