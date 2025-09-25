import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Pelicula = sequelize.define('Pelicula', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 255]
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fechaSalida: {
        type: DataTypes.DATEONLY, // Solo fecha, sin hora
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    subcategoria: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 100]
        }
    },
    portada: {
        type: DataTypes.TEXT, // Para URLs largas o datos base64
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'peliculas',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});