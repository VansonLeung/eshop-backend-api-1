/**
 * UserACL Service
 * Provides access control functionality for the built-in User system
 */
export class UserACLService {
    constructor({ User, UserRole, UserPermission, UserRolePermissionMapping }) {
        this.User = User;
        this.UserRole = UserRole;
        this.UserPermission = UserPermission;
        this.UserRolePermissionMapping = UserRolePermissionMapping;
        this.permissionCache = new Map();
    }

    /**
     * Check if user has permission
     */
    async hasPermission(userId, resource, action) {
        const user = await this.User.findByPk(userId, {
            include: [{
                model: this.UserRole,
                as: 'userRole',
                include: [{
                    model: this.UserRolePermissionMapping,
                    as: 'rolePermissions',
                    include: [{
                        model: this.UserPermission,
                        as: 'permission',
                    }]
                }]
            }]
        });

        if (!user || !user.userRole) {
            return false;
        }

        // Check role permissions
        const permissions = user.userRole.rolePermissions || [];
        return permissions.some(mapping => {
            const perm = mapping.permission;
            return perm && (
                (perm.resource === resource && perm.action === action) ||
                (perm.resource === '*' && perm.action === action) ||
                (perm.resource === resource && perm.action === '*') ||
                (perm.resource === '*' && perm.action === '*')
            );
        });
    }

    /**
     * Check if role has permission (by role object)
     */
    async roleHasPermission(userRole, resource, action) {
        if (!userRole) {
            return false;
        }

        const cacheKey = `${userRole.id}:${resource}:${action}`;

        // Check cache
        if (this.permissionCache.has(cacheKey)) {
            return this.permissionCache.get(cacheKey);
        }

        // Load role permissions if not included
        let role = userRole;
        if (!userRole.rolePermissions) {
            role = await this.UserRole.findByPk(userRole.id, {
                include: [{
                    model: this.UserRolePermissionMapping,
                    as: 'rolePermissions',
                    include: [{
                        model: this.UserPermission,
                        as: 'permission',
                    }]
                }]
            });
        }

        const permissions = role?.rolePermissions || [];
        const hasPermission = permissions.some(mapping => {
            const perm = mapping.permission;
            return perm && (
                (perm.resource === resource && perm.action === action) ||
                (perm.resource === '*' && perm.action === action) ||
                (perm.resource === resource && perm.action === '*') ||
                (perm.resource === '*' && perm.action === '*')
            );
        });

        // Cache result
        this.permissionCache.set(cacheKey, hasPermission);

        return hasPermission;
    }

    /**
     * Get all permissions for a user
     */
    async getUserPermissions(userId) {
        const user = await this.User.findByPk(userId, {
            include: [{
                model: this.UserRole,
                as: 'userRole',
                include: [{
                    model: this.UserRolePermissionMapping,
                    as: 'rolePermissions',
                    include: [{
                        model: this.UserPermission,
                        as: 'permission',
                    }]
                }]
            }]
        });

        if (!user || !user.userRole) {
            return [];
        }

        return user.userRole.rolePermissions.map(mapping => mapping.permission);
    }

    /**
     * Get all permissions for a role
     */
    async getRolePermissions(roleId) {
        const role = await this.UserRole.findByPk(roleId, {
            include: [{
                model: this.UserRolePermissionMapping,
                as: 'rolePermissions',
                include: [{
                    model: this.UserPermission,
                    as: 'permission',
                }]
            }]
        });

        if (!role) {
            return [];
        }

        return role.rolePermissions.map(mapping => mapping.permission);
    }

    /**
     * Assign permission to role
     */
    async assignPermissionToRole(roleId, permissionId) {
        const existing = await this.UserRolePermissionMapping.findOne({
            where: { userRoleId: roleId, userPermissionId: permissionId }
        });

        if (existing) {
            return existing;
        }

        const mapping = await this.UserRolePermissionMapping.create({
            userRoleId: roleId,
            userPermissionId: permissionId,
            status: 'active',
        });

        // Clear cache for this role
        this.clearRoleCache(roleId);

        return mapping;
    }

    /**
     * Remove permission from role
     */
    async removePermissionFromRole(roleId, permissionId) {
        const result = await this.UserRolePermissionMapping.destroy({
            where: { userRoleId: roleId, userPermissionId: permissionId }
        });

        // Clear cache for this role
        this.clearRoleCache(roleId);

        return result > 0;
    }

    /**
     * Create a new permission
     */
    async createPermission({ code, resource, action, name, description }) {
        return await this.UserPermission.create({
            code,
            resource,
            action,
            name,
            description,
            status: 'active',
        });
    }

    /**
     * Create a new role
     */
    async createRole({ code, name, description, level }) {
        return await this.UserRole.create({
            code,
            name,
            description,
            level: level || 0,
            status: 'active',
        });
    }

    /**
     * Assign role to user
     */
    async assignRoleToUser(userId, roleId) {
        const user = await this.User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await user.update({ userRoleId: roleId });
        return user;
    }

    /**
     * Check if user role level is sufficient
     */
    async hasMinimumLevel(userId, minimumLevel) {
        const user = await this.User.findByPk(userId, {
            include: [{
                model: this.UserRole,
                as: 'userRole',
            }]
        });

        if (!user || !user.userRole) {
            return false;
        }

        return user.userRole.level >= minimumLevel;
    }

    /**
     * Clear permission cache for a role
     */
    clearRoleCache(roleId) {
        const keysToDelete = [];
        for (const key of this.permissionCache.keys()) {
            if (key.startsWith(`${roleId}:`)) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.permissionCache.delete(key));
    }

    /**
     * Clear all permission cache
     */
    clearCache() {
        this.permissionCache.clear();
    }
}
