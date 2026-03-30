import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import productModel from '../../src/models/products.model.js';

describe('Tests de Integración - Ecommerce API', () => {
    
    beforeAll(async () => {
        // Si ya hay una conexión abierta por app.js, la usamos o reconectamos
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect('TU_MONGO_URI_AQUI');
        }
    });

    afterAll(async () => {
        // Limpiamos la base de datos de test al terminar (opcional)
        // await mongoose.connection.db.dropDatabase(); 
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // IMPORTANTE: Solo borramos los productos de la DB de TEST antes de cada test
        await productModel.deleteMany({});
    });

    test('GET /api/products debería responder con status 200', async () => {
        const response = await request(app).get('/api/products');
        expect(response.status).toBe(200);
    });



    test('POST /api/products debería fallar si falta el precio', async () => {
        const productoInvalido = {
            title: "Sin Precio",
            code: "ERR01"
            // Falta el price
        };
    
        const response = await request(app)
            .post('/api/products')
            .send(productoInvalido);
    
        // Esperamos un error de cliente (400 Bad Request)
        expect(response.status).toBe(400);
    });


});