import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js";
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

export const EBUserRolePermissionMapping = {
    makeAssociations: ({Me, UserPermission, UserRole}) => {
        UserPermission.belongsToMany(UserRole, { 
            through: Me,
            as: 'userRoles',
            foreignKey: 'userPermissionId',
            constraints: Settings.constraints,
        });
        UserRole.belongsToMany(UserPermission, { 
            through: Me,
            as: 'userPermissions',
            foreignKey: 'userRoleId',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            permissionId: DataTypes.UUID,
            roleId: DataTypes.UUID,
        }
    },
}
