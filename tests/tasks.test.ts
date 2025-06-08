import request from 'supertest';
import app from '../src/index';
import { tasks } from '../src/models/Task';
import { timeLogs } from '../src/models/TimeLog';
import { tags } from '../src/models/Tag';
import { comments } from '../src/models/Comment';
import { followers } from '../src/models/Follower';
import { repeatSettings } from '../src/models/RepeatSetting';

describe('Tasks API', () => {
  beforeEach(() => {
    tasks.length = 0;
    timeLogs.length = 0;
    tags.length = 0;
    comments.length = 0;
    followers.length = 0;
    repeatSettings.length = 0;
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

  it('rejects invalid startDate', async () => {
    const res = await request(app).post('/tasks').send({
      name: 'Bad',
      startDate: 'not-a-date',
    });
    expect(res.status).toBe(400);
  });

  it('rejects invalid dueDate', async () => {
    const res = await request(app).post('/tasks').send({
      name: 'Bad',
      dueDate: 'also-bad',
    });
    expect(res.status).toBe(400);
  });

  it('rejects invalid priority', async () => {
    const res = await request(app).post('/tasks').send({
      name: 'Bad',
      priority: 'URGENT',
    });
    expect(res.status).toBe(400);
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

  it('rejects time logs where end precedes start', async () => {
    const create = await request(app).post('/tasks').send({ name: 'T' });
    const taskId = create.body.taskId;
    const res = await request(app)
      .post(`/tasks/${taskId}/timelogs`)
      .send({
        start: '2024-01-01T01:00:00.000Z',
        end: '2024-01-01T00:00:00.000Z',
      });
    expect(res.status).toBe(400);
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

  it('parses mentions and sends notifications', async () => {
    const create = await request(app).post('/tasks').send({ name: 'Com' });
    const taskId = create.body.taskId;
    await request(app).post(`/tasks/${taskId}/followers`).send({ userId: 1 });
    const logs: string[] = [];
    const orig = console.log;
    console.log = (msg: any) => {
      logs.push(String(msg));
    };
    const res = await request(app)
      .post(`/tasks/${taskId}/comments`)
      .send({ userId: 2, text: 'hello @john' });
    console.log = orig;
    expect(res.status).toBe(201);
    expect(res.body.mentions).toContain('john');
    expect(logs.some((l) => l.includes('follower 1'))).toBe(true);
    expect(logs.some((l) => l.includes('john'))).toBe(true);
  });

  it('creates a new task when repeat due date is reached', async () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const res = await request(app).post('/tasks').send({
      name: 'Repeat',
      startDate: past,
      dueDate: past,
    });
    const taskId = res.body.taskId;
    await request(app).post(`/tasks/${taskId}/repeat`).send({ pattern: 'DAILY' });
    const before = tasks.length;
    await request(app).post('/tasks/process-repeats');
    expect(tasks.length).toBe(before + 1);
    const newTask = tasks[tasks.length - 1];
    expect(new Date(newTask.dueDate).getTime()).toBeGreaterThan(
      new Date(res.body.dueDate).getTime()
    );
  });
});
