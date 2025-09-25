import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Reviews = sequelize.define('Reviews', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 10 // Asumiendo una escala de 1-10
        }
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [1, 2000] // Límite razonable para reviews
        }
    },
    creadoEn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    actualizadoEn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    // Claves foráneas
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    pelicula_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'peliculas',
            key: 'id'
        }
    }
}, {
    tableName: 'reviews',
    timestamps: false, // Usamos nuestros propios campos de fecha
    indexes: [
        {
            unique: true,
            fields: ['usuario_id', 'pelicula_id'] // Un usuario solo puede hacer una review por película
        }
    ]
});