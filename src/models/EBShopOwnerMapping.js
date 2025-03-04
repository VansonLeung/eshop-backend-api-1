import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js";
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

export const EBShopOwnerMapping = {
    makeAssociations: ({Me, Shop, User}) => {
        Shop.belongsToMany(User, { 
            through: Me,
            as: 'users',
            foreignKey: 'shopId',
            constraints: Settings.constraints,
        });
        User.belongsToMany(Shop, { 
            through: Me,
            as: 'shops',
            foreignKey: 'userId',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            shopId: DataTypes.UUID,
            userId: DataTypes.UUID,
        }
    },
}
