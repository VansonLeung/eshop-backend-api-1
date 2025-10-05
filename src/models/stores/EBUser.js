import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes, 
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes, 
} from 'sequelize-rest-framework';

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

