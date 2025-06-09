const request = require('supertest');
const app = require('../../app');
const { connect, disconnect } = require('../../services/mongo');

describe('launches API', () => {
  beforeEach(async () => {
    await connect();
  });

  afterEach(async () => {
    await disconnect();
  });

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async() => {
      const response = 
        await request(app)
          .get('/v1/launches')
          .expect('Content-Type', /json/)//'application/json; charset=utf-8')
          .expect(200);
    });
  });

  describe('Test POST /launch', () => {
    const completeLaunchData = {
      mission: 'something',
      rocket: 'rocket',
      target: 'Kepler-1410 b',
      launchDate: 'January 4, 2028',
    };

    test('It should respond with 201 success', async() => {
      const response = await request(app).post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toMatchObject({
        mission: 'something',
        rocket: 'rocket',
        target: 'Kepler-1410 b',
        launchDate: '2028-01-04T06:00:00.000Z',
      });
    });

    test('It should catch missing required properties', async() => {
      const response = await request(app).post('/v1/launches')
          .expect(400);

      expect(response.body.error).toBe('Missing launch property');
    });
    
    test('It should catch invalid date', async() => {
      const response = await request(app).post('/v1/launches')
        .send({
          mission: 'something',
          rocket: 'rocket',
          target: 'Kepler-1410 b',
          launchDate: 'ABC',
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Invalid launc Date');
    });
  });
});