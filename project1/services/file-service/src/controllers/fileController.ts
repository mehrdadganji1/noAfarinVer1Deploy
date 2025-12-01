import { Request, Response } from 'express';
import File from '../models/File';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3007';

// Upload single file
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  console.log('[Upload] Request received');
  console.log('[Upload] File:', req.file ? req.file.filename : 'NO FILE');
  
  try {
    if (!req.file) {
      console.log('[Upload] ERROR: No file in request');
      res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
      return;
    }

    const { relatedType, relatedId } = req.body;
    const userId = (req as any).user?.id || 'anonymous';

    // Generate URL
    const url = `${BASE_URL}/api/files/download/${req.file.filename}`;

    // Create thumbnail for images
    let thumbnail: string | undefined;
    if (req.file.mimetype.startsWith('image/')) {
      try {
        const thumbnailFilename = `thumb-${req.file.filename}`;
        const thumbnailPath = path.join(req.file.destination, thumbnailFilename);
        
        await sharp(req.file.path)
          .resize(200, 200, { fit: 'cover' })
          .toFile(thumbnailPath);

        thumbnail = `${BASE_URL}/api/files/download/${thumbnailFilename}`;
      } catch (error) {
        console.error('Thumbnail generation failed:', error);
      }
    }

    // Get image metadata
    let metadata: any = {};
    if (req.file.mimetype.startsWith('image/')) {
      try {
        const imageMetadata = await sharp(req.file.path).metadata();
        metadata = {
          width: imageMetadata.width,
          height: imageMetadata.height,
        };
      } catch (error) {
        console.error('Metadata extraction failed:', error);
      }
    }

    // Save to database
    console.log('[Upload] Saving to database...');
    const file = await File.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url,
      thumbnail,
      uploadedBy: userId,
      relatedTo: relatedType && relatedId ? {
        type: relatedType,
        id: relatedId,
      } : undefined,
      metadata,
      isPublic: req.body.isPublic === 'true',
    });

    console.log('[Upload] File saved to DB:', file._id);
    console.log('[Upload] Sending response...');
    
    const response = {
      success: true,
      message: 'File uploaded successfully',
      data: file,
    };
    
    console.log('[Upload] Response data:', JSON.stringify(response, null, 2));
    res.status(201).json(response);
    
    console.log('[Upload] Response sent successfully');
  } catch (error: any) {
    console.error('[Upload] ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Error uploading file',
    });
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No files uploaded',
      });
      return;
    }

    const { relatedType, relatedId } = req.body;
    const userId = (req as any).user?.id || 'anonymous';

    const uploadedFiles = [];

    for (const file of req.files) {
      const url = `${BASE_URL}/api/files/download/${file.filename}`;

      // Create thumbnail for images
      let thumbnail: string | undefined;
      if (file.mimetype.startsWith('image/')) {
        try {
          const thumbnailFilename = `thumb-${file.filename}`;
          const thumbnailPath = path.join(file.destination, thumbnailFilename);
          
          await sharp(file.path)
            .resize(200, 200, { fit: 'cover' })
            .toFile(thumbnailPath);

          thumbnail = `${BASE_URL}/api/files/download/${thumbnailFilename}`;
        } catch (error) {
          console.error('Thumbnail generation failed:', error);
        }
      }

      const savedFile = await File.create({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        url,
        thumbnail,
        uploadedBy: userId,
        relatedTo: relatedType && relatedId ? {
          type: relatedType,
          id: relatedId,
        } : undefined,
        isPublic: req.body.isPublic === 'true',
      });

      uploadedFiles.push(savedFile);
    }

    res.status(201).json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully`,
      data: uploadedFiles,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Error uploading files',
    });
  }
};

// Download/View file by filename
export const downloadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;

    const file = await File.findOne({ filename });
    if (!file) {
      res.status(404).json({
        success: false,
        error: 'File not found',
      });
      return;
    }

    // Increment download counter
    file.downloads += 1;
    await file.save();

    // Send file
    res.sendFile(file.path);
  } catch (error: any) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      error: 'Error downloading file',
    });
  }
};

// View file by ID (for preview)
export const viewFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) {
      res.status(404).json({
        success: false,
        error: 'File not found',
      });
      return;
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      res.status(404).json({
        success: false,
        error: 'File not found on disk',
      });
      return;
    }

    // Increment download counter
    file.downloads += 1;
    await file.save();

    // Set content type
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
    
    // Send file
    res.sendFile(path.resolve(file.path));
  } catch (error: any) {
    console.error('View file error:', error);
    res.status(500).json({
      success: false,
      error: 'Error viewing file',
    });
  }
};

// Get file info
export const getFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) {
      res.status(404).json({
        success: false,
        error: 'File not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error: any) {
    console.error('Get file error:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving file',
    });
  }
};

// List files
export const listFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { relatedType, relatedId, uploadedBy, page = 1, limit = 20 } = req.query;

    const query: any = {};

    if (relatedType && relatedId) {
      query['relatedTo.type'] = relatedType;
      query['relatedTo.id'] = relatedId;
    }

    if (uploadedBy) {
      query.uploadedBy = uploadedBy;
    }

    const files = await File.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await File.countDocuments(query);

    res.status(200).json({
      success: true,
      data: files,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('List files error:', error);
    res.status(500).json({
      success: false,
      error: 'Error listing files',
    });
  }
};

// Delete file
export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const file = await File.findById(id);
    if (!file) {
      res.status(404).json({
        success: false,
        error: 'File not found',
      });
      return;
    }

    // Check if user owns the file (add proper auth later)
    if (file.uploadedBy !== userId && (req as any).user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Not authorized to delete this file',
      });
      return;
    }

    // Delete physical file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete thumbnail if exists
    if (file.thumbnail) {
      const thumbnailFilename = file.thumbnail.split('/').pop();
      const thumbnailPath = path.join(path.dirname(file.path), thumbnailFilename || '');
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // Delete from database
    await File.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting file',
    });
  }
};
