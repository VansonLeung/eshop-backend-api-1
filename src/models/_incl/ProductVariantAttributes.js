import Sequelize, { DataTypes } from "sequelize";

export const ProductVariantAttributes = () => {
    return {
        sku: {
            type: DataTypes.STRING(64),
            index: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2), // Represents a fixed-point number with precision 10 and scale 2
            allowNull: false,
            defaultValue: 0.00, // Default price value is set to 0.00
            index: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, // Default quantity value is set to 0
            index: true,
        },
    }
}
