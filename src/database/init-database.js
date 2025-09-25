import { initUsuarios } from './init-usuarios.js';
import { initGeneros } from './init-generos.js';
import { initPeliculas } from './init-peliculas.js';
import { initReviews } from './init-reviews.js';
import { initSeguimientos } from './init-seguimientos.js';
import { initComentarios } from './init-comentarios.js';

export const initializeDatabase = async () => {
    try {
        console.log('🚀 Iniciando la inicialización de la base de datos con datos de prueba...');
        console.log('=' .repeat(60));

        // Inicializar en orden correcto debido a las dependencias de claves foráneas
        
        // 1. Primero los datos base (sin dependencias)
        await initUsuarios();
        await initGeneros();
        await initPeliculas();

        console.log('📊 Datos base inicializados correctamente');
        console.log('-'.repeat(40));

        // 2. Luego los datos que dependen de usuarios y películas
        await initReviews();
        await initSeguimientos();

        console.log('📝 Datos de interacción inicializados correctamente');
        console.log('-'.repeat(40));

        // 3. Finalmente los comentarios que dependen de reviews
        await initComentarios();

        console.log('💬 Comentarios inicializados correctamente');
        console.log('=' .repeat(60));
        console.log('✅ ¡Base de datos inicializada exitosamente con datos de prueba!');
        console.log('📈 Resumen de datos creados:');
        console.log('   👥 6 usuarios');
        console.log('   🎬 12 géneros');
        console.log('   🎭 10 películas');
        console.log('   ⭐ 15 reviews');
        console.log('   👥 18 seguimientos');
        console.log('   💬 20 comentarios');
        console.log('=' .repeat(60));

    } catch (error) {
        console.error('❌ Error durante la inicialización de la base de datos:', error);
        throw error;
    }
};

// Función para ejecutar la inicialización si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    initializeDatabase()
        .then(() => {
            console.log('🎉 Proceso de inicialización completado');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error fatal durante la inicialización:', error);
            process.exit(1);
        });
}