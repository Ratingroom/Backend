import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Reviews = sequelize.define('Reviews', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5 // Escala de 1-5 estrellas
        }
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [1, 2000] // Límite razonable para reviews
        }
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
    timestamps: true, // Usar timestamps automáticos de Sequelize
    indexes: [
        {
            unique: true,
            fields: ['usuario_id', 'pelicula_id'] // Un usuario solo puede hacer una review por película
        }
    ]
});