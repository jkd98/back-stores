import server from '../../index.js';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';


describe('POST /auth/registro/', () => {
    // Enviando un objeto vacio
    it('should display validations errors', async () => {
        const response = await request(server).post('/auth/registro').send({});

        expect(response.status).toEqual(400)
        expect(response.body.status).toEqual('error')
        expect(response.body.data).toHaveLength(14)

        //Contraparte
        /* expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2) */

    })

    /**
     //  Enviando un objeto con precio = 0
     it('should validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Monitor - Test",
            price: 0
        });

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        //Contraparte
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)

    })

    //  Enviando un objeto donde el precio es un string
    it('should validate that the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Monitor - Test",
            price: "hi stronger"
        });

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        //Contraparte
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(1)
        
    })


    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse - testing",
            price: 280.71
        });

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        //Contraparte
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('errors')

    })
    */
})

/*
describe('GET /api/products', () => {
    it('should check if api/products url exists', async () => {
        const response = await request(server).get('/api/products')

        expect(response.status).not.toBe(404)
    })


    it('GET a json response with products', async () => {
        const response = await request(server).get('/api/products')

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')

        expect(response.body).not.toHaveProperty('errors')
        expect(response.status).not.toEqual(404)
    })
})


describe('GET /api/products/:id', () => {
    let idProduct = 2000;

    it('Should return a 404 response for a non-existent product', async () => {
        const response = await request(server).get(`/api/products/${idProduct}`);
        expect(response.status).toEqual(404)
        expect(response.body).toHaveProperty('error')
    })

    it('Should check a valid ID in the url', async () => {
        const response = await request(server).get('/api/products/holamundo');
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
    })

    it('GET a json response whith a product by id', async () => {
        const response = await request(server).get('/api/products/1')
        expect(response.status).toBe(200)
    })
})


describe('PUT /api/products/:id', () => {
    it('Should check a valid ID in the url', async () => {
        const response = await request(server).put('/api/products/holamundo').send({
            name: "Tecado -- ACTUALIZADO --",
            price: 4000.66,
            availability: true
        });
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')

    })

    it('should display validation error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({});

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy() // Verifica si hay algo 
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should validate that th price is greater than 0', async () => {
        const response = await request(server).put('/api/products/1').send(
            {
                name: "Tecado -- ACTUALIZADO --",
                price: -4000.66,
                availability: true
            });

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy() // Verifica si hay algo 
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 1000;
        const response = await request(server).put(`/api/products/${productId}`).send(
            {
                name: "Tecado -- ACTUALIZADO --",
                price: 4000.66,
                availability: true
            });

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update a existing product with valid data', async () => {
        const response = await request(server).put(`/api/products/1`).send(
            {
                name: "Tecado -- ACTUALIZADO --",
                price: 4000.66,
                availability: true
            });

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})


describe('PATCH /api/products:/id', () => {
    it('should check a valid ID in the url', async () => {
        const response = await request(server).patch('/api/products/helloworld')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should return a 404 response for a non-existing product', async () => {
        const id = 200;
        const response = await request(server).patch(`/api/products/${id}`);

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')

    })


    it('should change availability true || false', async () => {
        const response = await request(server).patch('/api/products/1');
        //console.log(response.body)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('error')

    })
})

describe('DELETE /api/products/:id', () => {
    it('should validate that product ID is valid', async () => {
        const response = await request(server).delete('/api/products/holamundo');
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000;
        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should delete a product', async () => {
        const response = await request(server).delete('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('error')
    })
})


*/