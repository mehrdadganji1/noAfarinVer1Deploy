import SupportTicket, { ISupportTicket, TicketStatus, TicketPriority, ITicketMessage } from '../models/SupportTicket';
import mongoose from 'mongoose';

export class SupportService {
  /**
   * Create support ticket
   */
  async createTicket(data: Partial<ISupportTicket>): Promise<ISupportTicket> {
    try {
      const ticket = new SupportTicket(data);
      await ticket.save();

      return ticket;
    } catch (error: any) {
      throw new Error(`Error creating ticket: ${error.message}`);
    }
  }

  /**
   * Get ticket by ID
   */
  async getTicketById(id: string): Promise<ISupportTicket | null> {
    try {
      const ticket = await SupportTicket.findById(id).exec();
      return ticket;
    } catch (error: any) {
      throw new Error(`Error fetching ticket: ${error.message}`);
    }
  }

  /**
   * Get ticket by ticket number
   */
  async getTicketByNumber(ticketNumber: string): Promise<ISupportTicket | null> {
    try {
      const ticket = await SupportTicket.findOne({ ticketNumber }).exec();
      return ticket;
    } catch (error: any) {
      throw new Error(`Error fetching ticket: ${error.message}`);
    }
  }

  /**
   * Get tickets by user
   */
  async getTicketsByUser(userId: string): Promise<ISupportTicket[]> {
    try {
      const tickets = await SupportTicket.find({
        userId: new mongoose.Types.ObjectId(userId)
      })
        .sort({ createdAt: -1 })
        .exec();

      return tickets;
    } catch (error: any) {
      throw new Error(`Error fetching user tickets: ${error.message}`);
    }
  }

  /**
   * Get all tickets (Admin only)
   */
  async getAllTickets(): Promise<ISupportTicket[]> {
    try {
      const tickets = await SupportTicket.find()
        .sort({ status: 1, priority: -1, createdAt: -1 })
        .exec();

      return tickets;
    } catch (error: any) {
      throw new Error(`Error fetching tickets: ${error.message}`);
    }
  }

  /**
   * Get tickets by status
   */
  async getTicketsByStatus(status: TicketStatus): Promise<ISupportTicket[]> {
    try {
      const tickets = await SupportTicket.find({ status })
        .sort({ priority: -1, createdAt: -1 })
        .exec();

      return tickets;
    } catch (error: any) {
      throw new Error(`Error fetching tickets by status: ${error.message}`);
    }
  }

  /**
   * Get tickets assigned to user (Admin/Support only)
   */
  async getAssignedTickets(assignedTo: string): Promise<ISupportTicket[]> {
    try {
      const tickets = await SupportTicket.find({
        assignedTo: new mongoose.Types.ObjectId(assignedTo),
        status: { $nin: [TicketStatus.CLOSED, TicketStatus.RESOLVED] }
      })
        .sort({ priority: -1, createdAt: -1 })
        .exec();

      return tickets;
    } catch (error: any) {
      throw new Error(`Error fetching assigned tickets: ${error.message}`);
    }
  }

  /**
   * Update ticket
   */
  async updateTicket(id: string, data: Partial<ISupportTicket>): Promise<ISupportTicket | null> {
    try {
      const ticket = await SupportTicket.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      ).exec();

      return ticket;
    } catch (error: any) {
      throw new Error(`Error updating ticket: ${error.message}`);
    }
  }

  /**
   * Add message to ticket
   */
  async addMessage(id: string, message: ITicketMessage): Promise<ISupportTicket | null> {
    try {
      const ticket = await SupportTicket.findByIdAndUpdate(
        id,
        {
          $push: { messages: message },
          $set: { status: TicketStatus.IN_PROGRESS }
        },
        { new: true }
      ).exec();

      return ticket;
    } catch (error: any) {
      throw new Error(`Error adding message: ${error.message}`);
    }
  }

  /**
   * Assign ticket to user (Admin/Support only)
   */
  async assignTicket(
    id: string,
    assignedTo: string,
    assignedToName: string
  ): Promise<ISupportTicket | null> {
    try {
      const ticket = await SupportTicket.findByIdAndUpdate(
        id,
        {
          $set: {
            assignedTo: new mongoose.Types.ObjectId(assignedTo),
            assignedToName,
            status: TicketStatus.IN_PROGRESS
          }
        },
        { new: true }
      ).exec();

      return ticket;
    } catch (error: any) {
      throw new Error(`Error assigning ticket: ${error.message}`);
    }
  }

  /**
   * Update ticket priority (Admin/Support only)
   */
  async updatePriority(
    id: string,
    priority: TicketPriority
  ): Promise<ISupportTicket | null> {
    try {
      const ticket = await SupportTicket.findByIdAndUpdate(
        id,
        { $set: { priority } },
        { new: true }
      ).exec();

      return ticket;
    } catch (error: any) {
      throw new Error(`Error updating priority: ${error.message}`);
    }
  }

  /**
   * Resolve ticket
   */
  async resolveTicket(id: string): Promise<ISupportTicket | null> {
    try {
      const ticket = await SupportTicket.findByIdAndUpdate(
        id,
        {
          $set: {
            status: TicketStatus.RESOLVED,
            resolvedAt: new Date()
          }
        },
        { new: true }
      ).exec();

      return ticket;
    } catch (error: any) {
      throw new Error(`Error resolving ticket: ${error.message}`);
    }
  }

  /**
   * Close ticket
   */
  async closeTicket(id: string): Promise<ISupportTicket | null> {
    try {
      const ticket = await SupportTicket.findByIdAndUpdate(
        id,
        {
          $set: {
            status: TicketStatus.CLOSED,
            closedAt: new Date()
          }
        },
        { new: true }
      ).exec();

      return ticket;
    } catch (error: any) {
      throw new Error(`Error closing ticket: ${error.message}`);
    }
  }

  /**
   * Reopen ticket
   */
  async reopenTicket(id: string): Promise<ISupportTicket | null> {
    try {
      const ticket = await SupportTicket.findByIdAndUpdate(
        id,
        {
          $set: {
            status: TicketStatus.OPEN,
            resolvedAt: null,
            closedAt: null
          }
        },
        { new: true }
      ).exec();

      return ticket;
    } catch (error: any) {
      throw new Error(`Error reopening ticket: ${error.message}`);
    }
  }

  /**
   * Delete ticket (Admin only)
   */
  async deleteTicket(id: string): Promise<boolean> {
    try {
      const result = await SupportTicket.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error: any) {
      throw new Error(`Error deleting ticket: ${error.message}`);
    }
  }

  /**
   * Get ticket statistics
   */
  async getStatistics(): Promise<any> {
    try {
      const total = await SupportTicket.countDocuments();
      
      const byStatus = await SupportTicket.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      const byPriority = await SupportTicket.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]);

      const byCategory = await SupportTicket.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      const avgResponseTime = await SupportTicket.aggregate([
        {
          $match: {
            $expr: { $gte: [{ $size: '$messages' }, 2] }
          }
        },
        {
          $project: {
            responseTime: {
              $divide: [
                {
                  $subtract: [
                    { $arrayElemAt: ['$messages.createdAt', 1] },
                    { $arrayElemAt: ['$messages.createdAt', 0] }
                  ]
                },
                3600000 // Convert to hours
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgResponseTime: { $avg: '$responseTime' }
          }
        }
      ]);

      const avgResolutionTime = await SupportTicket.aggregate([
        {
          $match: { resolvedAt: { $exists: true } }
        },
        {
          $project: {
            resolutionTime: {
              $divide: [
                { $subtract: ['$resolvedAt', '$createdAt'] },
                3600000 // Convert to hours
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgResolutionTime: { $avg: '$resolutionTime' }
          }
        }
      ]);

      return {
        total,
        byStatus,
        byPriority,
        byCategory,
        avgResponseTime: avgResponseTime[0]?.avgResponseTime || 0,
        avgResolutionTime: avgResolutionTime[0]?.avgResolutionTime || 0
      };
    } catch (error: any) {
      throw new Error(`Error fetching statistics: ${error.message}`);
    }
  }
}

export default new SupportService();
