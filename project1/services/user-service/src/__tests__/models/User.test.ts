import User, { UserRole } from '../../models/User';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user successfully with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
        role: [UserRole.STUDENT],
      };

      const user = await User.create(userData);

      expect(user._id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.role).toEqual([UserRole.STUDENT]);
      expect(user.password).not.toBe(userData.password); // Should be hashed
      expect(user.createdAt).toBeDefined();
    });

    it('should fail to create user without required fields', async () => {
      const user = new User({});
      
      let error;
      try {
        await user.save();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
    });

    it('should fail to create user with duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
        role: [UserRole.STUDENT],
      };

      await User.create(userData);

      let error;
      try {
        await User.create(userData);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
    });

    it('should fail with invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
        role: [UserRole.STUDENT],
      };

      let error;
      try {
        await User.create(userData);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const plainPassword = 'Test123!';
      const user = await User.create({
        email: 'hash@example.com',
        password: plainPassword,
        firstName: 'Test',
        lastName: 'User',
        role: [UserRole.STUDENT],
      });

      expect(user.password).not.toBe(plainPassword);
      expect(user.password.length).toBeGreaterThan(plainPassword.length);
      expect(user.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
    });

    it('should compare password correctly', async () => {
      const plainPassword = 'Test123!';
      const user = await User.create({
        email: 'compare@example.com',
        password: plainPassword,
        firstName: 'Test',
        lastName: 'User',
        role: [UserRole.STUDENT],
      });

      const isMatch = await user.comparePassword(plainPassword);
      expect(isMatch).toBe(true);

      const isNotMatch = await user.comparePassword('WrongPassword');
      expect(isNotMatch).toBe(false);
    });
  });

  describe('User Roles', () => {
    it('should support multiple roles', async () => {
      const user = await User.create({
        email: 'multirole@example.com',
        password: 'Test123!',
        firstName: 'Multi',
        lastName: 'Role',
        role: [UserRole.STUDENT, UserRole.MENTOR],
      });

      expect(user.role).toHaveLength(2);
      expect(user.role).toContain(UserRole.STUDENT);
      expect(user.role).toContain(UserRole.MENTOR);
    });

    it('should default to STUDENT role if not specified', async () => {
      const user = await User.create({
        email: 'default@example.com',
        password: 'Test123!',
        firstName: 'Default',
        lastName: 'User',
      });

      expect(user.role).toEqual([UserRole.STUDENT]);
    });
  });

  describe('User Update', () => {
    it('should update user information', async () => {
      const user = await User.create({
        email: 'update@example.com',
        password: 'Test123!',
        firstName: 'Old',
        lastName: 'Name',
        role: [UserRole.STUDENT],
      });

      user.firstName = 'New';
      user.lastName = 'Name';
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.firstName).toBe('New');
      expect(updatedUser?.lastName).toBe('Name');
    });

    it('should not rehash password on update if not changed', async () => {
      const user = await User.create({
        email: 'nohash@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
        role: [UserRole.STUDENT],
      });

      const originalHash = user.password;
      
      user.firstName = 'Updated';
      await user.save();

      expect(user.password).toBe(originalHash);
    });
  });
});
