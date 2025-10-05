import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import {
    BasicAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

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
