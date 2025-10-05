import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import {
    BasicAttributes,
    DatedStatusAttributes,
} from "../_incl/index.js";

export const EBUserRolePermissionMapping = {
    makeAssociations: ({Me, UserPermission, UserRole}) => {
        AssociationHelpers.belongsToMany(UserPermission, UserRole, { 
            through: Me,
            as: 'userRoles',
            foreignKey: 'userPermissionId',
        });
        AssociationHelpers.belongsToMany(UserRole, UserPermission, { 
            through: Me,
            as: 'userPermissions',
            foreignKey: 'userRoleId',
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
