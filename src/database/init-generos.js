import { Genero } from '../models/Genero.js';

export const initGeneros = async () => {
    try {
        console.log('🔄 Inicializando datos de géneros...');
        
        const generos = [
            {
                nombre: 'Acción',
                descripcion: 'Películas llenas de aventura, persecuciones y escenas de combate'
            },
            {
                nombre: 'Comedia',
                descripcion: 'Películas diseñadas para entretener y hacer reír al público'
            },
            {
                nombre: 'Drama',
                descripcion: 'Películas que se centran en el desarrollo de personajes y situaciones emocionales'
            },
            {
                nombre: 'Terror',
                descripcion: 'Películas diseñadas para asustar, crear tensión y suspense'
            },
            {
                nombre: 'Ciencia Ficción',
                descripcion: 'Películas que exploran conceptos futuristas, tecnología avanzada y mundos alternativos'
            },
            {
                nombre: 'Romance',
                descripcion: 'Películas centradas en relaciones amorosas y historias románticas'
            },
            {
                nombre: 'Thriller',
                descripcion: 'Películas de suspense que mantienen al espectador en tensión constante'
            },
            {
                nombre: 'Fantasía',
                descripcion: 'Películas que incluyen elementos mágicos y mundos imaginarios'
            },
            {
                nombre: 'Animación',
                descripcion: 'Películas creadas mediante técnicas de animación'
            },
            {
                nombre: 'Documental',
                descripcion: 'Películas que documentan la realidad con propósitos informativos o educativos'
            },
            {
                nombre: 'Musical',
                descripcion: 'Películas donde la música y las canciones son elementos centrales de la narrativa'
            },
            {
                nombre: 'Western',
                descripcion: 'Películas ambientadas en el Oeste americano del siglo XIX'
            }
        ];

        // Crear géneros usando bulkCreate para mejor rendimiento
        const generosCreados = await Genero.bulkCreate(generos, {
            ignoreDuplicates: true,
            returning: true
        });

        console.log(`✅ ${generosCreados.length} géneros creados exitosamente`);
        return generosCreados;

    } catch (error) {
        console.error('❌ Error al inicializar géneros:', error);
        throw error;
    }
};