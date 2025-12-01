# 🧪 User Service - Testing Guide

## Setup

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Test Structure

```
src/
├── __tests__/
│   ├── setup.ts                 # Test setup & MongoDB Memory Server
│   ├── models/
│   │   └── User.test.ts        # User Model tests
│   ├── controllers/
│   │   └── authController.test.ts
│   └── routes/
│       └── auth.test.ts
```

## Test Coverage Goals

- Controllers: 80%
- Models: 80%
- Routes: 90%
- Utils: 80%

## Writing Tests

### Model Tests

```typescript
import User from '../../models/User';

describe('User Model', () => {
  it('should create a user', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
    });
    
    expect(user._id).toBeDefined();
  });
});
```

### Controller Tests

```typescript
import request from 'supertest';
import app from '../../app';

describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
      });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Clean State**: Database is cleared after each test
3. **Descriptive**: Test names should clearly describe what they test
4. **Fast**: Tests should run quickly
5. **Comprehensive**: Cover happy paths and edge cases

## Coverage Report

After running `npm run test:coverage`, open:
```
coverage/lcov-report/index.html
```
