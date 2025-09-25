import { Comentarios } from '../models/Comentarios.js';

export const initComentarios = async () => {
    try {
        console.log('🔄 Inicializando datos de comentarios...');
        
        const comentarios = [
            {
                texto: 'Totalmente de acuerdo con tu review. Es una película que marca un antes y un después.',
                usuario_id: 2,
                review_id: 1,
                comentario_padre_id: null
            },
            {
                texto: 'Sí, la actuación de Brando es legendaria.',
                usuario_id: 3,
                review_id: 1,
                comentario_padre_id: 1
            },
            {
                texto: 'Los diálogos de Tarantino son únicos. Cada línea es memorable.',
                usuario_id: 1,
                review_id: 2,
                comentario_padre_id: null
            },
            {
                texto: 'La escena del restaurante es mi favorita.',
                usuario_id: 4,
                review_id: 2,
                comentario_padre_id: 3
            },
            {
                texto: 'Peter Jackson logró adaptar perfectamente los libros de Tolkien.',
                usuario_id: 5,
                review_id: 3,
                comentario_padre_id: null
            },
            {
                texto: 'Los efectos especiales siguen siendo impresionantes después de tantos años.',
                usuario_id: 6,
                review_id: 3,
                comentario_padre_id: 5
            },
            {
                texto: 'Matrix cambió el cine de ciencia ficción para siempre.',
                usuario_id: 1,
                review_id: 4,
                comentario_padre_id: null
            },
            {
                texto: 'La escena de la píldora roja vs azul es icónica.',
                usuario_id: 2,
                review_id: 4,
                comentario_padre_id: 7
            },
            {
                texto: 'Tom Hanks es uno de los mejores actores de todos los tiempos.',
                usuario_id: 3,
                review_id: 5,
                comentario_padre_id: null
            },
            {
                texto: 'La banda sonora también es increíble.',
                usuario_id: 4,
                review_id: 5,
                comentario_padre_id: 9
            },
            {
                texto: 'Heath Ledger se merecía el Oscar por esa interpretación.',
                usuario_id: 5,
                review_id: 6,
                comentario_padre_id: null
            },
            {
                texto: 'Es una lástima que no pudiera ver el resultado final.',
                usuario_id: 6,
                review_id: 6,
                comentario_padre_id: 11
            },
            {
                texto: 'Nolan es un maestro creando narrativas complejas.',
                usuario_id: 2,
                review_id: 7,
                comentario_padre_id: null
            },
            {
                texto: 'Hay que verla varias veces para entenderla completamente.',
                usuario_id: 3,
                review_id: 7,
                comentario_padre_id: 13
            },
            {
                texto: 'La historia de amor de Jack y Rose es conmovedora.',
                usuario_id: 4,
                review_id: 8,
                comentario_padre_id: null
            },
            {
                texto: 'Aunque sabemos cómo termina, siempre esperamos un final diferente.',
                usuario_id: 5,
                review_id: 8,
                comentario_padre_id: 15
            },
            {
                texto: 'Pandora es un mundo que me gustaría visitar.',
                usuario_id: 6,
                review_id: 9,
                comentario_padre_id: null
            },
            {
                texto: 'Los Na\'vi tienen una cultura fascinante.',
                usuario_id: 1,
                review_id: 9,
                comentario_padre_id: 17
            },
            {
                texto: 'El sacrificio de Tony Stark fue épico.',
                usuario_id: 2,
                review_id: 10,
                comentario_padre_id: null
            },
            {
                texto: '"I am Iron Man" - Una frase que quedará para la historia.',
                usuario_id: 3,
                review_id: 10,
                comentario_padre_id: 19
            }
        ];

        // Crear comentarios usando bulkCreate para mejor rendimiento
        const comentariosCreados = await Comentarios.bulkCreate(comentarios, {
            ignoreDuplicates: true,
            returning: true
        });

        console.log(`✅ ${comentariosCreados.length} comentarios creados exitosamente`);
        return comentariosCreados;

    } catch (error) {
        console.error('❌ Error al inicializar comentarios:', error);
        throw error;
    }
};