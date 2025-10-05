import Sequelize, { DataTypes } from "sequelize";

export const OrderItemAttributes = () => {
    return {
        orderedItemPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0,
        },
        orderedItemQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }
}
