import request from 'supertest';
import app from '../../app';
import User from '../../models/User';

describe('Auth Integration Tests', () => {
  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'Test123!',
        firstName: 'New',
        lastName: 'User',
      };

      const res = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe(userData.email);
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
      };

      // First registration
      await request(app).post('/auth/register').send(userData);

      // Second registration with same email
      const res = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          // Missing password, firstName, lastName
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with invalid email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test123!',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await User.create({
        email: 'logintest@example.com',
        password: 'Test123!',
        firstName: 'Login',
        lastName: 'Test',
      });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'Test123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe('logintest@example.com');
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'WrongPassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with missing credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User Service is running');
      expect(res.body).toHaveProperty('timestamp');
    });
  });
});
