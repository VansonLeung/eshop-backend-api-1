import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import { 
    BasicAttributes, 
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes, 
} from "../_incl/index.js";

export const EBUser = {
    makeAssociations: ({Me, UserRole}) => {
        AssociationHelpers.belongsTo(Me, UserRole, {
            foreignKey: 'userRoleId',
            as: 'userRole',
        });
        AssociationHelpers.hasMany(UserRole, Me, {
            foreignKey: 'userRoleId',
            as: 'users',
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

