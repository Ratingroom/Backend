import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Comentarios = sequelize.define('Comentarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [1, 1000] // Límite razonable para comentarios
        }
    },
    creadoEn: {
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
    timestamps: false, // Usamos nuestro propio campo creadoEn
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