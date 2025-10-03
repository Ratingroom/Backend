import { Usuario } from '../models/Usuario.js';

export const initUsuarios = async () => {
    try {
        console.log('🔄 Inicializando datos de usuarios...');
        
        const usuarios = [
            {
                email: 'juan.perez@email.com',
                username: 'juanperez',
                contrasena: 'password123',
                fotoPerfil: 'https://via.placeholder.com/150/0000FF/808080?text=JP'
            },
            {
                email: 'maria.garcia@email.com',
                username: 'mariagarcia',
                contrasena: 'password456',
                fotoPerfil: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=MG'
            },
            {
                email: 'carlos.rodriguez@email.com',
                username: 'carlosrod',
                contrasena: 'password789',
                fotoPerfil: 'https://via.placeholder.com/150/00FF00/000000?text=CR'
            },
            {
                email: 'ana.martinez@email.com',
                username: 'anamartinez',
                contrasena: 'password321',
                fotoPerfil: 'https://via.placeholder.com/150/FFFF00/000000?text=AM'
            },
            {
                email: 'luis.lopez@email.com',
                username: 'luislopez',
                contrasena: 'password654',
                fotoPerfil: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=LL'
            },
            {
                email: 'sofia.hernandez@email.com',
                username: 'sofiahernandez',
                contrasena: 'password987',
                fotoPerfil: 'https://via.placeholder.com/150/00FFFF/000000?text=SH'
            }
        ];

        // Crear usuarios usando bulkCreate para mejor rendimiento
        const usuariosCreados = await Usuario.bulkCreate(usuarios, {
            ignoreDuplicates: true,
            returning: true
        });

        console.log(`✅ ${usuariosCreados.length} usuarios creados exitosamente`);
        return usuariosCreados;

    } catch (error) {
        console.error('❌ Error al inicializar usuarios:', error);
        throw error;
    }
};