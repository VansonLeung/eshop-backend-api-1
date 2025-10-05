import { Settings } from '../config/Settings.js';

/**
 * Helper functions that wrap Sequelize association methods
 * and automatically apply Settings.constraints
 */

export const AssociationHelpers = {
    /**
     * Wrapper for Model.belongsTo that applies default settings
     */
    belongsTo: (sourceModel, targetModel, options = {}) => {
        return sourceModel.belongsTo(targetModel, {
            constraints: Settings.constraints,
            ...options,
        });
    },

    /**
     * Wrapper for Model.hasMany that applies default settings
     */
    hasMany: (sourceModel, targetModel, options = {}) => {
        return sourceModel.hasMany(targetModel, {
            constraints: Settings.constraints,
            ...options,
        });
    },

    /**
     * Wrapper for Model.hasOne that applies default settings
     */
    hasOne: (sourceModel, targetModel, options = {}) => {
        return sourceModel.hasOne(targetModel, {
            constraints: Settings.constraints,
            ...options,
        });
    },

    /**
     * Wrapper for Model.belongsToMany that applies default settings
     */
    belongsToMany: (sourceModel, targetModel, options = {}) => {
        return sourceModel.belongsToMany(targetModel, {
            constraints: Settings.constraints,
            ...options,
        });
    },
};

/**
 * Configure Settings.constraints globally
 * @param {boolean} enabled - Whether to enable foreign key constraints
 */
export const configureConstraints = (enabled) => {
    Settings.constraints = enabled;
};
