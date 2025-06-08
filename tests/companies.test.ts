import request from 'supertest';
import app from '../src/index';
import { companies, userCompanies } from '../src/models/Company';
import { projects } from '../src/models/Project';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';

describe('Companies API', () => {
  beforeEach(() => {
    companies.length = 0;
    userCompanies.length = 0;
    projects.length = 0;
  });

  it('creates master company and prevents duplicate', async () => {
    const token = jwt.sign({ userId: 1, role: 'ADMIN' }, SECRET);
    const first = await request(app)
      .post('/companies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Master', accountId: 1, isMasterCompany: true });
    expect(first.status).toBe(201);

    const dup = await request(app)
      .post('/companies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Another', accountId: 1, isMasterCompany: true });
    expect(dup.status).toBe(400);
  });

  it('assigns users and links projects', async () => {
    const token = jwt.sign({ userId: 1, role: 'ADMIN' }, SECRET);
    const companyRes = await request(app)
      .post('/companies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'C', accountId: 1 });
    const companyId = companyRes.body.id;

    await request(app)
      .post(`/companies/${companyId}/users`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userIds: [1, 2], role: 'MEMBER' })
      .expect(200);

    const proj = await request(app)
      .post('/projects')
      .send({ name: 'P', accountId: 1, companyId });
    expect(proj.status).toBe(201);

    const get = await request(app).get(`/companies/${companyId}`);
    expect(get.body.users.length).toBe(2);
    expect(get.body.projects[0].id).toBe(proj.body.id);
  });
});
