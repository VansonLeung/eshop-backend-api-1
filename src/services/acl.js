/**
 * ACLService - Handles authorization and permission checking
 * Provides role-based and permission-based access control
 */
export class ACLService {
    constructor(models) {
        this.models = models;
        this.permissionCache = new Map();
        this.rolePermissionCache = new Map();
    }

    /**
     * Check if user has specific permission for a resource/action
     * @param {string} userId - User UUID
     * @param {string} resource - Resource name (e.g., 'Product', 'Order')
     * @param {string} action - Action name (e.g., 'create', 'read', 'update', 'delete')
     * @returns {boolean} True if user has permission
     */
    async hasPermission(userId, resource, action) {
        const cacheKey = `${userId}:${resource}:${action}`;
        
        if (this.permissionCache.has(cacheKey)) {
            return this.permissionCache.get(cacheKey);
        }
        
        const user = await this.models.User.findByPk(userId, {
            include: [{
                model: this.models.UserRole,
                as: 'role',
                include: [{
                    model: this.models.UserPermission,
                    as: 'permissions',
                    through: { attributes: [] },
                }],
            }],
        });
        
        const hasAccess = user?.role?.permissions?.some(
            p => p.resource === resource && p.action === action
        ) || false;
        
        this.permissionCache.set(cacheKey, hasAccess);
        return hasAccess;
    }

    /**
     * Check if user has one of the specified roles
     * @param {string} userId - User UUID
     * @param {Array<string>} roleCodes - Array of role codes (e.g., ['admin', 'manager'])
     * @returns {boolean} True if user has one of the roles
     */
    async hasRole(userId, roleCodes) {
        const user = await this.models.User.findByPk(userId, {
            include: [{ 
                model: this.models.UserRole, 
                as: 'role' 
            }],
        });
        
        return roleCodes.includes(user?.role?.code);
    }

    /**
     * Check if role has specific permission (with caching)
     * @param {string} roleId - Role UUID
     * @param {string} resource - Resource name
     * @param {string} action - Action name
     * @returns {boolean} True if role has permission
     */
    async roleHasPermission(roleId, resource, action) {
        const cacheKey = `role:${roleId}:${resource}:${action}`;
        
        if (this.rolePermissionCache.has(cacheKey)) {
            return this.rolePermissionCache.get(cacheKey);
        }
        
        const role = await this.models.UserRole.findByPk(roleId, {
            include: [{
                model: this.models.UserPermission,
                as: 'permissions',
                through: { attributes: [] },
            }],
        });
        
        const hasAccess = role?.permissions?.some(
            p => p.resource === resource && p.action === action
        ) || false;
        
        this.rolePermissionCache.set(cacheKey, hasAccess);
        return hasAccess;
    }

    /**
     * Get all permissions for a user
     * @param {string} userId - User UUID
     * @returns {Array} Array of permission objects
     */
    async getUserPermissions(userId) {
        const user = await this.models.User.findByPk(userId, {
            include: [{
                model: this.models.UserRole,
                as: 'role',
                include: [{
                    model: this.models.UserPermission,
                    as: 'permissions',
                    through: { attributes: [] },
                }],
            }],
        });
        
        return user?.role?.permissions || [];
    }

    /**
     * Get all permissions for a role
     * @param {string} roleId - Role UUID
     * @returns {Array} Array of permission objects
     */
    async getRolePermissions(roleId) {
        const role = await this.models.UserRole.findByPk(roleId, {
            include: [{
                model: this.models.UserPermission,
                as: 'permissions',
                through: { attributes: [] },
            }],
        });
        
        return role?.permissions || [];
    }

    /**
     * Assign permission to role
     * @param {string} roleId - Role UUID
     * @param {string} permissionId - Permission UUID
     */
    async assignPermissionToRole(roleId, permissionId) {
        await this.models.UserRolePermissionMapping.create({
            roleId,
            permissionId,
        });
        
        // Clear role permission cache
        this.clearRoleCache(roleId);
    }

    /**
     * Remove permission from role
     * @param {string} roleId - Role UUID
     * @param {string} permissionId - Permission UUID
     */
    async removePermissionFromRole(roleId, permissionId) {
        await this.models.UserRolePermissionMapping.destroy({
            where: { roleId, permissionId },
        });
        
        // Clear role permission cache
        this.clearRoleCache(roleId);
    }

    /**
     * Create a new permission
     * @param {Object} params - Permission parameters
     * @param {string} params.resource - Resource name
     * @param {string} params.action - Action name
     * @param {string} params.description - Description (optional)
     * @returns {Object} Created permission
     */
    async createPermission({ resource, action, description }) {
        return await this.models.UserPermission.create({
            resource,
            action,
            description,
        });
    }

    /**
     * Create a new role
     * @param {Object} params - Role parameters
     * @param {string} params.code - Role code (e.g., 'admin', 'user')
     * @param {string} params.name - Role name
     * @param {number} params.level - Role level (higher = more privileges)
     * @param {string} params.description - Description (optional)
     * @returns {Object} Created role
     */
    async createRole({ code, name, level, description }) {
        return await this.models.UserRole.create({
            code,
            name,
            level,
            description,
        });
    }

    /**
     * Assign role to user
     * @param {string} userId - User UUID
     * @param {string} roleId - Role UUID
     */
    async assignRoleToUser(userId, roleId) {
        await this.models.User.update(
            { roleId },
            { where: { id: userId } }
        );
        
        // Clear user permission cache
        this.clearUserCache(userId);
    }

    /**
     * Check if user has minimum role level
     * @param {string} userId - User UUID
     * @param {number} minimumLevel - Minimum role level required
     * @returns {boolean} True if user meets minimum level
     */
    async hasMinimumLevel(userId, minimumLevel) {
        const user = await this.models.User.findByPk(userId, {
            include: [{ 
                model: this.models.UserRole, 
                as: 'role' 
            }],
        });
        
        return (user?.role?.level || 0) >= minimumLevel;
    }

    /**
     * Check if user can access a model/action based on simple role list
     * @param {string} userId - User UUID
     * @param {string} modelName - Model name
     * @param {string} action - Action (create, read, update, delete)
     * @param {Object} aclConfig - ACL configuration object
     * @returns {boolean} True if user can access
     */
    async canAccess(userId, modelName, action, aclConfig) {
        const user = await this.models.User.findByPk(userId, {
            include: [{ 
                model: this.models.UserRole, 
                as: 'role' 
            }],
        });
        
        const roleCode = user?.role?.code || 'guest';
        const allowedRoles = aclConfig[modelName]?.[action] || [];
        
        return allowedRoles.includes(roleCode);
    }

    /**
     * Clear all permission caches
     */
    clearCache() {
        this.permissionCache.clear();
        this.rolePermissionCache.clear();
    }

    /**
     * Clear cache for specific user
     * @param {string} userId - User UUID
     */
    clearUserCache(userId) {
        for (const key of this.permissionCache.keys()) {
            if (key.startsWith(`${userId}:`)) {
                this.permissionCache.delete(key);
            }
        }
    }

    /**
     * Clear cache for specific role
     * @param {string} roleId - Role UUID
     */
    clearRoleCache(roleId) {
        for (const key of this.rolePermissionCache.keys()) {
            if (key.startsWith(`role:${roleId}:`)) {
                this.rolePermissionCache.delete(key);
            }
        }
    }
}
