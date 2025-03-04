import Sequelize, { DataTypes } from "sequelize";

export const ContactAttributes = () => {
    return {
        firstName: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(1024),
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        zip: {
            type: DataTypes.STRING(16),
            allowNull: false,
        },
    }
}
