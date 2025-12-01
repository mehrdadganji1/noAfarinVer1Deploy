import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getProfile,
  updateProfile,
  getProfileCompletion,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addSkill,
  updateSkill,
  deleteSkill,
  addCertification,
  deleteCertification,
  updateSocialLinks,
  uploadAvatar,
  deleteAvatar,
} from '../controllers/profileController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('فقط فایل‌های تصویری مجاز هستند'));
    }
  }
});

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/:userId', getProfile);
router.put('/:userId', updateProfile);
router.get('/:userId/completion', getProfileCompletion);

// Avatar routes - multer is optional, also accepts base64 in body
router.post('/:userId/avatar', (req, res, next) => {
  console.log('🔵 Avatar route hit:', {
    userId: req.params.userId,
    contentType: req.headers['content-type'],
    isMultipart: req.is('multipart/form-data')
  });
  
  // If content-type is multipart/form-data, use multer
  if (req.is('multipart/form-data')) {
    upload.single('avatar')(req, res, (err) => {
      if (err) {
        console.error('❌ Multer error:', err);
        return res.status(400).json({
          success: false,
          error: err.message || 'خطا در آپلود فایل'
        });
      }
      next();
    });
  } else {
    // Otherwise, skip multer and go directly to controller
    next();
  }
}, uploadAvatar);
router.delete('/:userId/avatar', deleteAvatar);

// Education routes
router.post('/:userId/education', addEducation);
router.put('/:userId/education/:eduId', updateEducation);
router.delete('/:userId/education/:eduId', deleteEducation);

// Experience routes
router.post('/:userId/experience', addExperience);
router.put('/:userId/experience/:expId', updateExperience);
router.delete('/:userId/experience/:expId', deleteExperience);

// Skills routes
router.post('/:userId/skills', addSkill);
router.put('/:userId/skills/:skillId', updateSkill);
router.delete('/:userId/skills/:skillId', deleteSkill);

// Certifications routes
router.post('/:userId/certifications', addCertification);
router.delete('/:userId/certifications/:certId', deleteCertification);

// Social links routes
router.put('/:userId/social-links', updateSocialLinks);

export default router;
