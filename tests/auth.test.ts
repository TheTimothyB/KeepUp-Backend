import request from 'supertest';
import app from '../src/index';
import { accounts } from '../src/models/Account';
import { users } from '../src/models/User';

describe('Account and user registration', () => {
  beforeEach(() => {
    accounts.length = 0;
    users.length = 0;
  });

  it('creates a new account', async () => {
    const res = await request(app).post('/accounts').send({ name: 'Acme' });
    expect(res.status).toBe(201);
    expect(accounts.length).toBe(1);
    expect(accounts[0].name).toBe('Acme');

    const dup = await request(app).post('/accounts').send({ name: 'Acme' });
    expect(dup.status).toBe(400);
  });

  it('registers a user linked to an account', async () => {
    const acc = await request(app).post('/accounts').send({ name: 'Org' });
    const accountId = acc.body.id;
    const res = await request(app)
      .post(`/accounts/${accountId}/users`)
      .send({ username: 'user1', password: 'pass' });
    expect(res.status).toBe(201);
    expect(users.length).toBe(1);
    expect(users[0].accountId).toBe(accountId);
    expect(users[0].role).toBe('BASIC');
  });

  it('validates role when registering user', async () => {
    const acc = await request(app).post('/accounts').send({ name: 'RoleOrg' });
    const accountId = acc.body.id;

    const adminRes = await request(app)
      .post(`/accounts/${accountId}/users`)
      .send({ username: 'admin', password: 'pass', role: 'ADMIN' });
    expect(adminRes.status).toBe(201);
    expect(users[0].role).toBe('ADMIN');

    const invalid = await request(app)
      .post(`/accounts/${accountId}/users`)
      .send({ username: 'bad', password: 'pass', role: 'INVALID' });
    expect(invalid.status).toBe(400);
    expect(users.length).toBe(1);
  });
});
