import { Router } from 'express';
import {
  uploadFile,
  uploadMultipleFiles,
  downloadFile,
  viewFile,
  getFile,
  listFiles,
  deleteFile,
} from '../controllers/fileController';
import { uploadSingle, uploadMultiple } from '../middleware/upload';

const router = Router();

// Upload routes
router.post('/upload', uploadSingle, uploadFile);
router.post('/upload/multiple', uploadMultiple, uploadMultipleFiles);

// Download/View file
router.get('/download/:filename', downloadFile);
router.get('/view/:id', viewFile);

// Get file info
router.get('/:id', getFile);

// List files
router.get('/', listFiles);

// Delete file
router.delete('/:id', deleteFile);

export default router;
