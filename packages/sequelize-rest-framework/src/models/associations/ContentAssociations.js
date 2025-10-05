import Sequelize, { DataTypes } from "sequelize";
import { AssociationHelpers } from "../helpers/AssociationHelpers.js";

export const ContentAssociations = ({Me, Lang}) => {
    const MeBase = AssociationHelpers.belongsTo(Me, Me, {
        as: 'base',
        foreignKey: 'baseId',
    });

    const MeDerivatives = AssociationHelpers.hasMany(Me, Me, {
        as: 'derivatives',
        foreignKey: 'baseId',
    });

    const MeLang = AssociationHelpers.belongsTo(Me, Lang, {
        foreignKey: 'langId',
        as: 'lang',
    });

    return {
        MeBase,
        MeDerivatives,
        MeLang,
    }
}
