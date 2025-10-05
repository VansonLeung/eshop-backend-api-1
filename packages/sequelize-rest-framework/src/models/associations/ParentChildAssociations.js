import Sequelize, { DataTypes } from "sequelize";
import { AssociationHelpers } from "../helpers/AssociationHelpers.js";

export const ParentChildAssociations = ({Me}) => {
    const MeParent = AssociationHelpers.belongsTo(Me, Me, {
        as: 'parent',
        foreignKey: 'parentId',
    });
    const MeChilds = AssociationHelpers.hasMany(Me, Me, {
        as: 'childs',
        foreignKey: 'parentId',
    });

    return {
        MeParent,
        MeChilds,
    }
}
