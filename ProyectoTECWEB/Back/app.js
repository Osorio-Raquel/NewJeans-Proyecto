import express from 'express';
import cors from 'cors';
import usuariosRoutes from './routes/usuarios.js';
import documentosRoutes from './routes/documentos.js';
import swaggerSpec from './swagger.js';
import swaggerUi from 'swagger-ui-express';
import documentosBuscarRoutes from './routes/documentosBuscar.js';
import documentosFiltradoRoutes from './routes/documentosFiltrado.js';
import historialBuscarRoutes from './routes/historialBuscar.js';
import reportesRoutes from './routes/reportes.js';
import reportesPDFRoutes from './routes/reportesPDF.js';
import favoritosRoutes from './routes/favoritos.js';

const app = express();


app.use(cors());
app.use(express.json()); // <--- ESTA LÍNEA ES VITAL
app.use('/api/historial-busqueda', historialBuscarRoutes);
app.use('/api/filtrado', documentosFiltradoRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/documentos', documentosRoutes);
app.use('/api/buscar', documentosBuscarRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/reportes/pdf', reportesPDFRoutes);
app.use('/api/favoritos', favoritosRoutes);


export default app;

// Servir la documentación de Swagger en una ruta
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
    console.log('Swagger en: http://localhost:3000/api-docs');
  });