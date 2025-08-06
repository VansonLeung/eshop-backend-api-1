import Sequelize, { DataTypes } from "sequelize";

export const OrderItemAttributes = () => {
    return {
        orderedItemPrice: {
            type: DataTypes.DOUBLE, // Represents a fixed-point number with precision 10 and scale 2
            allowNull: false,
        },
        orderedItemQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, // Default quantity value is set to 0
        },
    }
}
