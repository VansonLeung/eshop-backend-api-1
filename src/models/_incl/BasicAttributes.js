import Sequelize, { DataTypes } from "sequelize";

export const BasicAttributes = () => {
    return {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        seqId: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          unique: true,
        },
        seq: {
            type: DataTypes.BIGINT,
            index: true,
        },
        name: DataTypes.STRING(256),
    }
}

