import Sequelize, { DataTypes } from "sequelize";

export const ProductVariantAttributes = () => {
    return {
        productId: {
            type: DataTypes.UUID,
            index: true,
            uniqueGroups: [{name: "ps", order: 0}],
        },
        sku: {
            type: DataTypes.STRING(64),
            index: true,
            uniqueGroups: [{name: "ps", order: 1}],
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.00,
            index: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            index: true,
        },
    }
}
