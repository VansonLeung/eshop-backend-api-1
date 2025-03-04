import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

export const EBUser = {
    makeAssociations: ({Me, UserRole}) => {
        Me.belongsTo(UserRole, {
            foreignKey: 'userRoleId',
            as: 'userRole',
            constraints: Settings.constraints,
        });
        UserRole.hasMany(Me, {
            foreignKey: 'userRoleId',
            as: 'users',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            userRoleId: DataTypes.UUID,
            username: {
                type: DataTypes.STRING(64),
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING(256),
                allowNull: false,
                unique: true,
            },    
        }
    },
};

