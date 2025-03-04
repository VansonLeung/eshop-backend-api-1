import Sequelize, { DataTypes } from "sequelize";

export const BasicAttributes = () => {
    return {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        name: DataTypes.STRING(256),
    }
}

