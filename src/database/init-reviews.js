import { Reviews } from '../models/Reviews.js';

export const initReviews = async () => {
    try {
        console.log('🔄 Inicializando datos de reviews...');
        
        const reviews = [
            {
                rating: 5,
                texto: 'Una obra maestra del cine. La actuación de Marlon Brando es excepcional y la dirección de Coppola es impecable.',
                usuario_id: 1,
                pelicula_id: 1
            },
            {
                rating: 4,
                texto: 'Película muy entretenida con diálogos brillantes. Tarantino en su mejor momento.',
                usuario_id: 2,
                pelicula_id: 2
            },
            {
                rating: 5,
                texto: 'Una aventura épica que te transporta a la Tierra Media. Efectos visuales impresionantes.',
                usuario_id: 3,
                pelicula_id: 3
            },
            {
                rating: 4,
                texto: 'Revolucionaria en su concepto. Los efectos especiales siguen siendo impresionantes.',
                usuario_id: 4,
                pelicula_id: 4
            },
            {
                rating: 5,
                texto: 'Una película emotiva que te hace reflexionar sobre la vida. Tom Hanks brillante como siempre.',
                usuario_id: 5,
                pelicula_id: 5
            },
            {
                rating: 5,
                texto: 'Heath Ledger como el Joker es simplemente perfecto. Una película de superhéroes madura.',
                usuario_id: 6,
                pelicula_id: 6
            },
            {
                rating: 4,
                texto: 'Compleja y fascinante. Nolan logra crear una historia dentro de otra historia.',
                usuario_id: 1,
                pelicula_id: 7
            },
            {
                rating: 4,
                texto: 'Una historia de amor épica con efectos visuales espectaculares para su época.',
                usuario_id: 2,
                pelicula_id: 8
            },
            {
                rating: 4,
                texto: 'Visualmente impresionante. Cameron crea un mundo completamente nuevo.',
                usuario_id: 3,
                pelicula_id: 9
            },
            {
                rating: 5,
                texto: 'El final perfecto para la saga. Emocionante de principio a fin.',
                usuario_id: 4,
                pelicula_id: 10
            },
            {
                rating: 3,
                texto: 'Buena película pero esperaba más después de tanta expectativa.',
                usuario_id: 5,
                pelicula_id: 1
            },
            {
                rating: 5,
                texto: 'Diálogos memorables y una narrativa no lineal brillante.',
                usuario_id: 6,
                pelicula_id: 2
            },
            {
                rating: 4,
                texto: 'La banda sonora es increíble y la cinematografía es hermosa.',
                usuario_id: 1,
                pelicula_id: 3
            },
            {
                rating: 5,
                texto: 'Cambió mi perspectiva sobre la realidad. Una película que te hace pensar.',
                usuario_id: 2,
                pelicula_id: 4
            },
            {
                rating: 4,
                texto: 'Emotiva y bien actuada. Una lección de vida en cada escena.',
                usuario_id: 3,
                pelicula_id: 5
            }
        ];

        // Crear reviews usando bulkCreate para mejor rendimiento
        const reviewsCreadas = await Reviews.bulkCreate(reviews, {
            ignoreDuplicates: true,
            returning: true
        });

        console.log(`✅ ${reviewsCreadas.length} reviews creadas exitosamente`);
        return reviewsCreadas;

    } catch (error) {
        console.error('❌ Error al inicializar reviews:', error);
        throw error;
    }
};