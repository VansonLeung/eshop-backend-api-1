import Sequelize, { DataTypes } from "sequelize";

export const ProductVariableAttributes = () => {
    return {
        variants_json: {
            type: DataTypes.JSON,
        },
    }
}
