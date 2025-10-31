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
        expect(response.status).not.toBe(201)
        expect(response.body.status).not.toEqual('success');

    })

    
})
