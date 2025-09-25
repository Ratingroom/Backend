import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Genero = sequelize.define('Genero', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 100]
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'generos',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});