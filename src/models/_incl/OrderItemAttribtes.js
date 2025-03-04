import Sequelize, { DataTypes } from "sequelize";

export const OrderItemAttributes = () => {
    return {
        ordered_price: {
            type: DataTypes.DECIMAL(10, 2), // Represents a fixed-point number with precision 10 and scale 2
            allowNull: false,
        },
        ordered_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, // Default quantity value is set to 0
        },
        ordered_variants_json: {
            type: DataTypes.JSON,
        },
    }
}
