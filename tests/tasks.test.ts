import request from 'supertest';
import app from '../src/index';
import { tasks } from '../src/models/Task';
import { timeLogs } from '../src/models/TimeLog';
import { tags } from '../src/models/Tag';

describe('Tasks API', () => {
  beforeEach(() => {
    tasks.length = 0;
    timeLogs.length = 0;
    tags.length = 0;
  });

  it('creates and retrieves a task', async () => {
    const res = await request(app).post('/tasks').send({
      name: 'New Task',
      description: 'Test',
      startDate: '2024-01-01T00:00:00.000Z',
      dueDate: '2024-01-05T00:00:00.000Z',
      priority: 'HIGH',
      assignedUserIds: [1, 2],
    });
    expect(res.status).toBe(201);
    const taskId = res.body.taskId;
    expect(taskId).toBeDefined();

    const getRes = await request(app).get(`/tasks/${taskId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe('New Task');
    expect(getRes.body.assignedUserIds.length).toBe(2);
  });

  it('logs time and computes total', async () => {
    const create = await request(app).post('/tasks').send({ name: 'T' });
    const taskId = create.body.taskId;
    const log = await request(app)
      .post(`/tasks/${taskId}/timelogs`)
      .send({
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-01-01T01:00:00.000Z',
      });
    expect(log.status).toBe(201);
    expect(log.body.totalMs).toBe(3600000);
  });

  it('assigns tags to a task', async () => {
    const tag = await request(app).post('/tags').send({ name: 'bug' });
    const tagId = tag.body.id;
    const create = await request(app).post('/tasks').send({ name: 'T2' });
    const taskId = create.body.taskId;
    const update = await request(app)
      .patch(`/tasks/${taskId}/tags`)
      .send({ tagIds: [tagId] });
    expect(update.status).toBe(200);
    expect(update.body.tagIds).toContain(tagId);
  });
});
