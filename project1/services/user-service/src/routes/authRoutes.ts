import { Router } from 'express';
import { 
  register, 
  login, 
  refreshToken, 
  getMe, 
  seedAdmin,
  verifyEmail,
  checkVerificationStatus,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changeEmail,
  changePassword,
  requestPasswordSetupOTP,
  setPasswordWithOTP
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Authentication
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getMe);

// Email Verification
router.get('/verify-email', verifyEmail);
router.get('/check-verification-status', checkVerificationStatus); // Debug endpoint
router.post('/resend-verification', resendVerificationEmail);

// Password Reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Account Settings (requires authentication)
router.put('/change-email', authenticate, changeEmail);
router.put('/change-password', authenticate, changePassword);

// Set Password with SMS OTP (for first-time password setup)
router.post('/request-password-setup-otp', authenticate, requestPasswordSetupOTP);
router.post('/set-password-with-otp', authenticate, setPasswordWithOTP);

// Development
router.post('/seed-admin', seedAdmin);

export default router;
