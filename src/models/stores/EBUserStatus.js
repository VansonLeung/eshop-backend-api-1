import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes,
    ContentAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
} from "../_incl";

export const EBUserStatus = {
    makeAssociations: ({Me, User}) => {
        Me.belongsTo(User, {
            foreignKey: 'userId',
            as: 'user',
            constraints: Settings.constraints,
        });
        User.hasMany(Me, {
            foreignKey: 'userId',
            as: 'statuses',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            ...ContentAttributes(),
        }
    },
}
