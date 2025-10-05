import Sequelize, { DataTypes } from "sequelize";
import { AssociationHelpers } from "../helpers/AssociationHelpers.js"

export const ProductVariantAssociations = ({Me, Product}) => {

    AssociationHelpers.belongsTo(Me, Product, {
        as: 'product',
        foreignKey: 'productId',
    });
    AssociationHelpers.hasMany(Product, Me, {
        as: 'variants',
        foreignKey: 'productId',
    });
}
