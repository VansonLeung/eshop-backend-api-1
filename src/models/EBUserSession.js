import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

export const EBUserSession = {
    makeAssociations: ({Me, User, UserCredential}) => {
        User.hasMany(Me, {
            foreignKey: 'userId',
            as: 'sessions',
            constraints: Settings.constraints,
        });
        Me.belongsTo(User, {
            foreignKey: 'userId',
            as: 'user',
            constraints: Settings.constraints,
        });

        UserCredential.hasMany(Me, {
            foreignKey: 'userCredentialId',
            as: 'sessions',
            constraints: Settings.constraints,
        });
        Me.belongsTo(UserCredential, {
            foreignKey: 'userCredentialId',
            as: 'userCredential',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            userId: DataTypes.UUID,
            userCredentialId: DataTypes.UUID,
            access_token: {
                type: DataTypes.STRING(256),
                allowNull: false,
                unique: true,
            },
            refresh_token: {
                type: DataTypes.STRING(256),
                allowNull: false,
                unique: true,
            },    
        }
    },
};

