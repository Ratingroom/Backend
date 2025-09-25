import { Pelicula } from '../models/Pelicula.js';

export const initPeliculas = async () => {
    try {
        console.log('🔄 Inicializando datos de películas...');
        
        const peliculas = [
            {
                titulo: 'El Padrino',
                descripcion: 'La historia de una familia de la mafia italiana en Nueva York durante los años 40 y 50.',
                fechaSalida: new Date('1972-03-24'),
                subcategoria: 'Clásico',
                portada: 'https://via.placeholder.com/300x450/8B4513/FFFFFF?text=El+Padrino'
            },
            {
                titulo: 'Pulp Fiction',
                descripcion: 'Historias entrelazadas de crimen y redención en Los Ángeles.',
                fechaSalida: new Date('1994-10-14'),
                subcategoria: 'Neo-noir',
                portada: 'https://via.placeholder.com/300x450/000000/FFFF00?text=Pulp+Fiction'
            },
            {
                titulo: 'El Señor de los Anillos: La Comunidad del Anillo',
                descripcion: 'Un hobbit emprende una épica aventura para destruir un anillo mágico.',
                fechaSalida: new Date('2001-12-19'),
                subcategoria: 'Épica',
                portada: 'https://via.placeholder.com/300x450/8B4513/FFD700?text=LOTR'
            },
            {
                titulo: 'Matrix',
                descripcion: 'Un programador descubre que la realidad es una simulación controlada por máquinas.',
                fechaSalida: new Date('1999-03-31'),
                subcategoria: 'Cyberpunk',
                portada: 'https://via.placeholder.com/300x450/000000/00FF00?text=Matrix'
            },
            {
                titulo: 'Forrest Gump',
                descripcion: 'La extraordinaria vida de un hombre simple que vive momentos históricos importantes.',
                fechaSalida: new Date('1994-07-06'),
                subcategoria: 'Biografía',
                portada: 'https://via.placeholder.com/300x450/87CEEB/FFFFFF?text=Forrest+Gump'
            },
            {
                titulo: 'El Caballero de la Noche',
                descripcion: 'Batman enfrenta al Joker en una batalla por el alma de Ciudad Gótica.',
                fechaSalida: new Date('2008-07-18'),
                subcategoria: 'Superhéroes',
                portada: 'https://via.placeholder.com/300x450/2F4F4F/FFFFFF?text=Batman'
            },
            {
                titulo: 'Inception',
                descripcion: 'Un ladrón que roba secretos del subconsciente debe realizar una misión imposible.',
                fechaSalida: new Date('2010-07-16'),
                subcategoria: 'Psicológica',
                portada: 'https://via.placeholder.com/300x450/4682B4/FFFFFF?text=Inception'
            },
            {
                titulo: 'Titanic',
                descripcion: 'Una historia de amor épica ambientada en el famoso barco que se hundió en 1912.',
                fechaSalida: new Date('1997-12-19'),
                subcategoria: 'Épica romántica',
                portada: 'https://via.placeholder.com/300x450/4169E1/FFFFFF?text=Titanic'
            },
            {
                titulo: 'Avatar',
                descripcion: 'Un marine parapléjico es enviado a la luna Pandora en una misión única.',
                fechaSalida: new Date('2009-12-18'),
                subcategoria: 'Épica espacial',
                portada: 'https://via.placeholder.com/300x450/00CED1/FFFFFF?text=Avatar'
            },
            {
                titulo: 'Avengers: Endgame',
                descripcion: 'Los Vengadores se unen para una batalla final contra Thanos.',
                fechaSalida: new Date('2019-04-26'),
                subcategoria: 'Superhéroes',
                portada: 'https://via.placeholder.com/300x450/8B0000/FFD700?text=Endgame'
            }
        ];

        // Crear películas usando bulkCreate para mejor rendimiento
        const peliculasCreadas = await Pelicula.bulkCreate(peliculas, {
            ignoreDuplicates: true,
            returning: true
        });

        console.log(`✅ ${peliculasCreadas.length} películas creadas exitosamente`);
        return peliculasCreadas;

    } catch (error) {
        console.error('❌ Error al inicializar películas:', error);
        throw error;
    }
};