const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('Session', () => {
    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it('should be able to login', async () => {

        //create ong to test
        const data = await request(app)
            .post('/ongs')
            .send({
                name: "APAD4",
                email: "contato@mail.com",
                whatsapp: "0123456789",
                city: "Belo Horizonte",
                uf: "MG"
            });

        const ongId = data.body.id;

        const response = await request(app)
            .post('/sessions')
            .send({
                "id": ongId
            });

        expect(response.body).toHaveProperty('name');
    });
})