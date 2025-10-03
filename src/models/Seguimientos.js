import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Seguimientos = sequelize.define('Seguimientos', {
    // Claves foráneas
    seguidor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    seguido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    }
}, {
    tableName: 'seguimientos',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
        {
            unique: true,
            fields: ['seguidor_id', 'seguido_id'] // Un usuario no puede seguir al mismo usuario dos veces
        }
    ],
    validate: {
        // Validación para evitar que un usuario se siga a sí mismo
        noSelfFollow() {
            if (this.seguidor_id === this.seguido_id) {
                throw new Error('Un usuario no puede seguirse a sí mismo');
            }
        }
    }
});