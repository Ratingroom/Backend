import { Seguimientos } from '../models/Seguimientos.js';

export const initSeguimientos = async () => {
    try {
        console.log('🔄 Inicializando datos de seguimientos...');
        
        const seguimientos = [
            {
                seguidor_id: 1,
                seguido_id: 2
            },
            {
                seguidor_id: 1,
                seguido_id: 3
            },
            {
                seguidor_id: 1,
                seguido_id: 4
            },
            {
                seguidor_id: 2,
                seguido_id: 1
            },
            {
                seguidor_id: 2,
                seguido_id: 3
            },
            {
                seguidor_id: 2,
                seguido_id: 5
            },
            {
                seguidor_id: 3,
                seguido_id: 1
            },
            {
                seguidor_id: 3,
                seguido_id: 4
            },
            {
                seguidor_id: 3,
                seguido_id: 6
            },
            {
                seguidor_id: 4,
                seguido_id: 2
            },
            {
                seguidor_id: 4,
                seguido_id: 5
            },
            {
                seguidor_id: 4,
                seguido_id: 6
            },
            {
                seguidor_id: 5,
                seguido_id: 1
            },
            {
                seguidor_id: 5,
                seguido_id: 3
            },
            {
                seguidor_id: 5,
                seguido_id: 6
            },
            {
                seguidor_id: 6,
                seguido_id: 1
            },
            {
                seguidor_id: 6,
                seguido_id: 2
            },
            {
                seguidor_id: 6,
                seguido_id: 4
            }
        ];

        // Crear seguimientos usando bulkCreate para mejor rendimiento
        const seguimientosCreados = await Seguimientos.bulkCreate(seguimientos, {
            ignoreDuplicates: true,
            returning: true
        });

        console.log(`✅ ${seguimientosCreados.length} seguimientos creados exitosamente`);
        return seguimientosCreados;

    } catch (error) {
        console.error('❌ Error al inicializar seguimientos:', error);
        throw error;
    }
};