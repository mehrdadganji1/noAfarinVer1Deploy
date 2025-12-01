import { Response } from 'express';
import Funding from '../models/Funding';
import { AuthRequest } from '../middleware/auth';
import NotificationClient from '../utils/notificationClient';

// Create notification client instance
const notificationClient = new NotificationClient();

export const applyForFunding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId, type, amount, terms, documents } = req.body;
    
    const funding = await Funding.create({
      teamId,
      type,
      amount,
      terms,
      documents: documents || [],
      status: 'pending',
      requestedBy: req.user!.id,
    });
    
    console.log('📧 Sending funding request notification');
    
    // Notify user that request was submitted
    await notificationClient.notifyFundingSubmitted(
      req.user!.id,
      amount,
      (funding._id as any).toString()
    );
    
    console.log('✅ Funding request submitted and notification sent');

    res.status(201).json({ success: true, data: funding });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error applying for funding' });
  }
};

export const getAllFundings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId, status } = req.query;
    const query: any = {};
    if (teamId) query.teamId = teamId;
    if (status) query.status = status;

    const fundings = await Funding.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: fundings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching fundings' });
  }
};

export const updateFundingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user!.role.includes('admin')) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    const { status, reviewNotes } = req.body;
    const updateData: any = { status, reviewerId: req.user!.id, reviewNotes };

    if (status === 'approved') {
      updateData.approvalDate = new Date();
    } else if (status === 'disbursed') {
      updateData.disbursementDate = new Date();
    }

    const funding = await Funding.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    if (!funding) {
      res.status(404).json({ success: false, error: 'Funding not found' });
      return;
    }
    
    // Send notification based on status
    if (status === 'approved') {
      await notificationClient.notifyFundingApproved(
        funding.teamId.toString(),
        funding.amount,
        (funding._id as any).toString()
      );
    } else if (status === 'rejected') {
      await notificationClient.notifyFundingRejected(
        funding.teamId.toString(),
        (funding._id as any).toString(),
        reviewNotes
      );
    }

    res.json({ success: true, data: funding });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error updating funding' });
  }
};
