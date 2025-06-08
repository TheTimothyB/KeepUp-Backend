import request from 'supertest';
import app from '../src/index';
import { categories, projects } from '../src/models/Project';

describe('Project categories API', () => {
  beforeEach(() => {
    categories.length = 0;
    projects.length = 0;
  });

  it('creates, updates and deletes categories', async () => {
    const create = await request(app)
      .post('/categories')
      .send({ name: 'Cat A', accountId: 1 });
    expect(create.status).toBe(201);
    const id = create.body.id;

    let list = await request(app).get('/categories');
    expect(list.body.length).toBe(1);

    const update = await request(app)
      .patch(`/categories/${id}`)
      .send({ name: 'Cat B' });
    expect(update.body.name).toBe('Cat B');

    await request(app).delete(`/categories/${id}`).expect(204);
    list = await request(app).get('/categories');
    expect(list.body.length).toBe(0);
  });

  it('assigns default category when creating a project', async () => {
    const res = await request(app)
      .post('/projects')
      .send({ name: 'Proj', accountId: 2 });
    expect(res.status).toBe(201);
    expect(res.body.categoryId).toBeDefined();
    const cats = await request(app).get('/categories?accountId=2');
    expect(cats.body[0].name).toBe('Uncategorized');
  });
});
