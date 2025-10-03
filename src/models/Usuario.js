import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Usuario = sequelize.define('Usuario', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 50]
        }
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 255]
        }
    },
    fotoPerfil: {
        type: DataTypes.TEXT, // Para URLs largas o datos base64
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'usuarios',
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});