import request from 'supertest';
import app from '../src/index';
import { boards } from '../src/models/ProjectBoard';

describe('Project board API', () => {
  beforeEach(() => {
    boards.length = 0; // reset in-memory store
  });

  it('creates board, list and task and retrieves nested structure', async () => {
    const boardRes = await request(app).post('/boards').send({ name: 'Board A' });
    expect(boardRes.status).toBe(201);
    const boardId = boardRes.body.id;

    const listRes = await request(app)
      .post(`/boards/${boardId}/lists`)
      .send({ name: 'List 1' });
    expect(listRes.status).toBe(201);
    const listId = listRes.body.id;

    const taskRes = await request(app)
      .post(`/lists/${listId}/tasks`)
      .send({ title: 'Task 1', description: 'test' });
    expect(taskRes.status).toBe(201);

    const getRes = await request(app).get(`/boards/${boardId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.lists.length).toBe(1);
    expect(getRes.body.lists[0].tasks.length).toBe(1);
  });

  it('supports updates and deletions', async () => {
    const boardRes = await request(app).post('/boards').send({ name: 'B' });
    const boardId = boardRes.body.id;
    await request(app).put(`/boards/${boardId}`).send({ name: 'B2' });
    let get = await request(app).get(`/boards/${boardId}`);
    expect(get.body.name).toBe('B2');

    const list = await request(app)
      .post(`/boards/${boardId}/lists`)
      .send({ name: 'L' });
    const listId = list.body.id;
    await request(app).put(`/lists/${listId}`).send({ name: 'L2' });

    const task = await request(app)
      .post(`/lists/${listId}/tasks`)
      .send({ title: 'T' });
    const taskId = task.body.id;
    await request(app).put(`/tasks/${taskId}`).send({ title: 'T2' });

    await request(app).delete(`/tasks/${taskId}`).expect(204);
    await request(app).delete(`/lists/${listId}`).expect(204);
    await request(app).delete(`/boards/${boardId}`).expect(204);

    const res = await request(app).get(`/boards/${boardId}`);
    expect(res.status).toBe(404);
  });
});
