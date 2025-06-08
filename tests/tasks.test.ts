import request from 'supertest';
import app from '../src/index';
import { tasks } from '../src/models/Task';

describe('Tasks API', () => {
  beforeEach(() => {
    tasks.length = 0;
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
});
