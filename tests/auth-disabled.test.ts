import request from 'supertest';
import app from '../src/index';

describe('Auth routes in test mode', () => {
  it('returns 404 when register and login routes are disabled', async () => {
    const register = await request(app)
      .post('/auth/register')
      .send({ email: 'a@example.com', password: 'b' });
    expect(register.status).toBe(404);

    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'a@example.com', password: 'b' });
    expect(login.status).toBe(404);
  });
});
