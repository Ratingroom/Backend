import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Comentarios = sequelize.define('Comentarios', {
    texto: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [1, 1000] // Límite razonable para comentarios
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
    review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'reviews',
            key: 'id'
        }
    },
    // Para comentarios anidados (respuestas a otros comentarios)
    comentario_padre_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'comentarios',
            key: 'id'
        }
    }
}, {
    tableName: 'comentarios',
    timestamps: true, // Usar timestamps automáticos de Sequelize
    indexes: [
        {
            fields: ['review_id'] // Índice para buscar comentarios por review
        },
        {
            fields: ['usuario_id'] // Índice para buscar comentarios por usuario
        },
        {
            fields: ['comentario_padre_id'] // Índice para buscar respuestas a un comentario
        }
    ]
});