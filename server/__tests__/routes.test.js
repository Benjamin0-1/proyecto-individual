const supertest = require('supertest');
const app = require('../src/server');

describe('Express Routes', () => {
  test('POST /api/drivers - Create a new driver', async () => {
    const newDriverData = {
      name: 'Test',
      lastName: 'Driver',
      description: 'Test driver description',
      image: 'test-image-url',
      nationality: 'Test Nationality',
      birthDate: '2000-01-01',
    };

    const response = await supertest(app)
      .post('/drivers')
      .send(newDriverData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newDriverData.name);
  });

  test('GET /api/drivers/searchname/name - buscar driver por name/query', async () => {
    const searchName = 'Nick';

    const response = await supertest(app)
      .get(`/drivers/searchname/name?name=${searchName}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array); 
  });
  test('testar ruta adicional para crear un equipo POST /teams/createteam', async() => {
    const newTeam = {
      name: 'equipoCampeon',
    };

    const response = await supertest(app)
    .post('/teams/createteam')
    .send(newTeam);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', newTeam.name);

  });

  test('GET /teams', async () => {
    const response = await supertest(app)
    .get('/teams');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

  });
});


