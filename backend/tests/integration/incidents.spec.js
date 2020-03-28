const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('Incidents', () => {
    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it('should be able to create, list-all, list-profile and delete incidents', async () => {

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

        const createResponse = await request(app)
            .post('/incidents')
            .set('Authorization', ongId)
            .send({
                title: "Caso teste 3",
                description: "descricao descricao descricao",
                value: "300"
            });
        expect(createResponse.body).toHaveProperty('id');

        const listResponse = await request(app).get('/incidents');
        for (let i = 0; i < listResponse.body.length; i++) {
            const incident = listResponse.body[i];
            expect(incident).toHaveProperty('id');
            expect(incident).toHaveProperty('title');
            expect(incident).toHaveProperty('value');
            expect(incident).toHaveProperty('ong_id');
            expect(incident).toHaveProperty('name');
            expect(incident).toHaveProperty('email');
            expect(incident).toHaveProperty('whatsapp');
            expect(incident).toHaveProperty('city');
            expect(incident).toHaveProperty('uf');
        }

        const listProfileResponse = await request(app)
            .get('/incidents')
            .set('Authorization', ongId);
        for (let i = 0; i < listProfileResponse.body.length; i++) {
            const incident = listProfileResponse.body[i];
            expect(incident).toHaveProperty('id');
            expect(incident).toHaveProperty('title');
            expect(incident).toHaveProperty('description');
            expect(incident).toHaveProperty('value');
            expect(incident).toHaveProperty('ong_id');
        }

        const deleteResponse = await request(app)
            .delete(`/incidents/${1}`)
            .set('Authorization', ongId)
            .send({
                title: "Caso teste 3",
                description: "descricao descricao descricao",
                value: "300"
            });
        expect(deleteResponse.status).toEqual(204);
    });
})