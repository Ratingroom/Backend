// Importar todos los modelos
import { Usuario } from './Usuario.js';
import { Pelicula } from './Pelicula.js';
import { Genero } from './Genero.js';
import { Reviews } from './Reviews.js';
import { Seguimientos } from './Seguimientos.js';
import { Comentarios } from './Comentarios.js';

// Configurar todas las asociaciones
export function setupAssociations() {
    
    // Asociaciones Usuario - Reviews
    Usuario.hasMany(Reviews, {
        foreignKey: 'usuario_id',
        as: 'reviews'
    });
    Reviews.belongsTo(Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
    });

    // Asociaciones Pelicula - Reviews
    Pelicula.hasMany(Reviews, {
        foreignKey: 'pelicula_id',
        as: 'reviews'
    });
    Reviews.belongsTo(Pelicula, {
        foreignKey: 'pelicula_id',
        as: 'pelicula'
    });

    // Asociaciones Pelicula - Genero (muchos a muchos)
    Pelicula.belongsToMany(Genero, {
        through: 'pelicula_generos',
        foreignKey: 'pelicula_id',
        otherKey: 'genero_id',
        as: 'generos'
    });
    Genero.belongsToMany(Pelicula, {
        through: 'pelicula_generos',
        foreignKey: 'genero_id',
        otherKey: 'pelicula_id',
        as: 'peliculas'
    });

    // Asociaciones Usuario - Seguimientos (seguidor)
    Usuario.hasMany(Seguimientos, {
        foreignKey: 'seguidor_id',
        as: 'siguiendo'
    });
    Seguimientos.belongsTo(Usuario, {
        foreignKey: 'seguidor_id',
        as: 'seguidor'
    });

    // Asociaciones Usuario - Seguimientos (seguido)
    Usuario.hasMany(Seguimientos, {
        foreignKey: 'seguido_id',
        as: 'seguidores'
    });
    Seguimientos.belongsTo(Usuario, {
        foreignKey: 'seguido_id',
        as: 'seguido'
    });

    // Asociaciones Usuario - Comentarios
    Usuario.hasMany(Comentarios, {
        foreignKey: 'usuario_id',
        as: 'comentarios'
    });
    Comentarios.belongsTo(Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
    });

    // Asociaciones Reviews - Comentarios
    Reviews.hasMany(Comentarios, {
        foreignKey: 'review_id',
        as: 'comentarios'
    });
    Comentarios.belongsTo(Reviews, {
        foreignKey: 'review_id',
        as: 'review'
    });

    // Asociaciones Comentarios - Comentarios (auto-referencia para respuestas)
    Comentarios.hasMany(Comentarios, {
        foreignKey: 'comentario_padre_id',
        as: 'respuestas'
    });
    Comentarios.belongsTo(Comentarios, {
        foreignKey: 'comentario_padre_id',
        as: 'comentarioPadre'
    });

    console.log('✅ Asociaciones de modelos configuradas correctamente');
}