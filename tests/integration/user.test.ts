import request from 'supertest';
import { createApp } from '../../src/app'
import { mongoDb } from '../../src/config/db';

let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  process.env.MONGO_URI = 'mongodb://localhost:27017/test_db';
  await mongoDb.connect();
  app = createApp(mongoDb);
});

afterAll(async () => {
  await mongoDb.disconnect();
});

describe('Route: /users', () => {
   it('GET /users', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body[0]._id).toEqual("6944b9372fbef153975303d0");
    expect(res.body[0].name).toEqual("integrationTest");
    expect(res.body[0].email).toEqual("integrationtest@domain.com");
  });
});