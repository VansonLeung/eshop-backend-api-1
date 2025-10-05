/**
 * Plugin Manager for Sequelize REST Framework
 * Manages plugin lifecycle and hooks
 */

export class PluginManager {
    constructor() {
        this.plugins = [];
        this.hooks = {
            beforeRequest: [],
            afterRequest: [],
            beforeCreate: [],
            afterCreate: [],
            beforeRead: [],
            afterRead: [],
            beforeUpdate: [],
            afterUpdate: [],
            beforeDelete: [],
            afterDelete: [],
            onError: [],
            modifyQuery: [],
            modifyResponse: [],
            filterJoins: [],
        };
    }

    /**
     * Register a plugin
     * @param {Object} plugin - Plugin instance with install method
     */
    use(plugin) {
        if (typeof plugin.install !== 'function') {
            throw new Error('Plugin must have an install method');
        }

        this.plugins.push(plugin);
        plugin.install(this);
        return this;
    }

    /**
     * Register a hook
     * @param {string} hookName - Name of the hook
     * @param {Function} handler - Handler function
     */
    registerHook(hookName, handler) {
        if (!this.hooks[hookName]) {
            throw new Error(`Unknown hook: ${hookName}`);
        }
        this.hooks[hookName].push(handler);
    }

    /**
     * Execute hooks in sequence
     * @param {string} hookName - Name of the hook to execute
     * @param {Object} context - Context object passed to handlers
     */
    async executeHook(hookName, context) {
        if (!this.hooks[hookName]) {
            return context;
        }

        let result = context;
        for (const handler of this.hooks[hookName]) {
            result = await handler(result) || result;
        }
        return result;
    }

    /**
     * Execute hooks that can modify the result
     * @param {string} hookName - Name of the hook
     * @param {*} value - Value to be modified
     * @param {Object} context - Additional context
     */
    async executeModifierHook(hookName, value, context = {}) {
        if (!this.hooks[hookName]) {
            return value;
        }

        let result = value;
        for (const handler of this.hooks[hookName]) {
            result = await handler(result, context) || result;
        }
        return result;
    }

    /**
     * Execute filter hooks (returns boolean to determine if operation should continue)
     * @param {string} hookName - Name of the hook
     * @param {Object} context - Context to check
     */
    async executeFilterHook(hookName, context) {
        if (!this.hooks[hookName]) {
            return true;
        }

        for (const handler of this.hooks[hookName]) {
            const result = await handler(context);
            if (result === false) {
                return false;
            }
        }
        return true;
    }
}

// Global plugin manager instance
export const pluginManager = new PluginManager();
