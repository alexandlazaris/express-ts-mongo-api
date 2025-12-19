import request from 'supertest';
import { createApp } from '../../src/app'
import { MongoDb } from '../../src/config/db';

describe('app setup', () => {
  const mockDb: jest.Mocked<MongoDb> = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    ping: jest.fn().mockResolvedValue(true),
  };

  const app = createApp(mockDb);

  it('GET /health', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(mockDb.ping).toHaveBeenCalled();
  });
});