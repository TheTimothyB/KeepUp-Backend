import request from 'supertest';
import app from '../src/index';

describe('Auth routes in test mode', () => {
  it('returns 404 when register and login routes are disabled', async () => {
    const register = await request(app)
      .post('/auth/register')
      .send({ username: 'a', password: 'b' });
    expect(register.status).toBe(404);

    const login = await request(app)
      .post('/auth/login')
      .send({ username: 'a', password: 'b' });
    expect(login.status).toBe(404);
  });
});
