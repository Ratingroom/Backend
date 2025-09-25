import app from './app.js';
import { sequelize } from './database/database.js';
import { setupAssociations } from './models/associations.js';
import { Usuario } from './models/Usuario.js';
import { Pelicula } from './models/Pelicula.js';
import { Genero } from './models/Genero.js';
import { Reviews } from './models/Reviews.js';
import { Seguimientos } from './models/Seguimientos.js';
import { Comentarios } from './models/Comentarios.js';

async function init() {  

    try {
        
        await sequelize.authenticate()
            .then(() => {
                console.log('✅ Connection has been established successfully.');
            })
            .catch(err => {
                console.error('❌ Unable to connect to the database:', err);
            });
        
        // Configurar asociaciones antes de sincronizar
        setupAssociations();
        
        // Sincronizar modelos con la base de datos
        await sequelize.sync({ force: true });
        console.log('✅ Database synchronized successfully');
        
        // Inicializar datos de prueba
        const { initializeDatabase } = await import('./database/init-database.js');
        await initializeDatabase();
        console.log('✅ Test data initialized successfully');

        // Inicia el servidor en el puerto 3000
        const server = app.listen(3000, () => {
            console.log(' Server is running on port 3000');
            
        });

    } catch (err) {
        // Captura errores generales
        console.error('❌ Error during initialization:', err);
    }

}

// Ejecuta la función principal
init();
