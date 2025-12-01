import { Request, Response } from 'express';
import Application, { DocumentStatus } from '../models/Application';
import NotificationService from '../services/notificationService';
import { ActivityService } from './activityController';

/**
 * Get all documents for an application
 */
export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const application = await Application.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found',
      });
      return;
    }

    // Check if user owns this application
    if (application.userId.toString() !== userId) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: application.documents || [],
    });
  } catch (error: any) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get documents',
    });
  }
};

/**
 * Add a document to application
 */
export const addDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { type, fileName, fileId, fileSize, mimeType } = req.body;

    const application = await Application.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found',
      });
      return;
    }

    // Check if user owns this application
    if (application.userId.toString() !== userId) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
      });
      return;
    }

    // Check if document type already exists
    const existingDoc = application.documents.find(doc => doc.type === type);
    if (existingDoc) {
      res.status(400).json({
        success: false,
        error: 'Document of this type already exists',
      });
      return;
    }

    // Add new document
    const newDocument = {
      type,
      fileName,
      fileId,
      fileSize,
      mimeType,
      status: DocumentStatus.PENDING,
      uploadedAt: new Date(),
    };

    application.documents.push(newDocument as any);
    await application.save();
    
    // Log activity
    await ActivityService.logDocumentUploaded(userId!, type, fileName);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: newDocument,
    });
  } catch (error: any) {
    console.error('Add document error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload document',
    });
  }
};

/**
 * Delete a document from application
 */
export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, documentId } = req.params;
    const userId = req.user?.id;

    const application = await Application.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found',
      });
      return;
    }

    // Check if user owns this application
    if (application.userId.toString() !== userId) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
      });
      return;
    }

    // Find document
    const documentIndex = application.documents.findIndex(
      (doc: any) => doc._id.toString() === documentId
    );

    if (documentIndex === -1) {
      res.status(404).json({
        success: false,
        error: 'Document not found',
      });
      return;
    }

    // Only allow deletion of pending documents
    const document = application.documents[documentIndex];
    if (document.status !== DocumentStatus.PENDING) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete verified or rejected documents',
      });
      return;
    }

    // Remove document
    application.documents.splice(documentIndex, 1);
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete document',
    });
  }
};

/**
 * Verify a document (Admin only)
 */
export const verifyDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, documentId } = req.params;
    const { notes } = req.body;
    const reviewerId = req.user?.id;

    const application = await Application.findById(id).populate('userId', 'email firstName lastName');

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found',
      });
      return;
    }

    // Find document
    const document = application.documents.find(
      (doc: any) => doc._id.toString() === documentId
    );

    if (!document) {
      res.status(404).json({
        success: false,
        error: 'Document not found',
      });
      return;
    }

    // Update document status
    document.status = DocumentStatus.VERIFIED;
    document.verifiedAt = new Date();
    document.verifiedBy = reviewerId as any;
    if (notes) document.notes = notes;

    await application.save();

    // Send notification
    await NotificationService.create({
      userId: application.userId._id,
      type: 'system',
      title: 'مدرک تایید شد',
      message: `مدرک "${document.type}" شما تایید شد.`,
      metadata: {
        applicationId: String((application as any)._id),
        documentId: String((document as any)._id),
        documentType: document.type,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Document verified successfully',
      data: document,
    });
  } catch (error: any) {
    console.error('Verify document error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify document',
    });
  }
};

/**
 * Reject a document (Admin only)
 */
export const rejectDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, documentId } = req.params;
    const { rejectionReason, notes } = req.body;
    const reviewerId = req.user?.id;

    if (!rejectionReason) {
      res.status(400).json({
        success: false,
        error: 'Rejection reason is required',
      });
      return;
    }

    const application = await Application.findById(id).populate('userId', 'email firstName lastName');

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found',
      });
      return;
    }

    // Find document
    const document = application.documents.find(
      (doc: any) => doc._id.toString() === documentId
    );

    if (!document) {
      res.status(404).json({
        success: false,
        error: 'Document not found',
      });
      return;
    }

    // Update document status
    document.status = DocumentStatus.REJECTED;
    document.verifiedAt = new Date();
    document.verifiedBy = reviewerId as any;
    document.rejectionReason = rejectionReason;
    if (notes) document.notes = notes;

    await application.save();

    // Send notification
    await NotificationService.create({
      userId: application.userId._id,
      type: 'system',
      title: 'مدرک رد شد',
      message: `مدرک "${document.type}" شما رد شد. دلیل: ${rejectionReason}`,
      metadata: {
        applicationId: String((application as any)._id),
        documentId: String((document as any)._id),
        documentType: document.type,
        rejectionReason,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Document rejected',
      data: document,
    });
  } catch (error: any) {
    console.error('Reject document error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject document',
    });
  }
};

/**
 * Get all pending documents (Admin only)
 */
export const getPendingDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, applicantId } = req.query;

    const query: any = {
      'documents.status': DocumentStatus.PENDING,
    };

    if (applicantId) {
      query.userId = applicantId;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const applications = await Application.find(query)
      .populate('userId', 'email firstName lastName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ 'documents.uploadedAt': -1 });

    // Extract pending documents with application info
    const pendingDocuments = applications.flatMap((app) =>
      app.documents
        .filter((doc: any) => doc.status === DocumentStatus.PENDING)
        .map((doc: any) => ({
          _id: doc._id,
          type: doc.type,
          fileName: doc.fileName,
          fileId: doc.fileId,
          fileSize: doc.fileSize,
          mimeType: doc.mimeType,
          status: doc.status,
          uploadedAt: doc.uploadedAt,
          applicationId: app._id,
          applicant: {
            _id: (app.userId as any)._id,
            email: (app.userId as any).email,
            firstName: app.firstName,
            lastName: app.lastName,
          },
        }))
    );

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      data: pendingDocuments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get pending documents error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get pending documents',
    });
  }
};

/**
 * Request additional information for a document (Admin only)
 */
export const requestDocumentInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, documentId } = req.params;
    const { message } = req.body;

    if (!message) {
      res.status(400).json({
        success: false,
        error: 'Message is required',
      });
      return;
    }

    const application = await Application.findById(id).populate('userId', 'email firstName lastName');

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found',
      });
      return;
    }

    // Find document
    const document = application.documents.find(
      (doc: any) => doc._id.toString() === documentId
    );

    if (!document) {
      res.status(404).json({
        success: false,
        error: 'Document not found',
      });
      return;
    }

    // Send notification
    await NotificationService.create({
      userId: application.userId._id,
      type: 'system',
      title: 'درخواست اطلاعات تکمیلی',
      message: `درخواست اطلاعات بیشتر برای مدرک "${document.type}": ${message}`,
      metadata: {
        applicationId: String((application as any)._id),
        documentId: String((document as any)._id),
        documentType: document.type,
        requestMessage: message,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Information request sent successfully',
    });
  } catch (error: any) {
    console.error('Request document info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to request document information',
    });
  }
};
