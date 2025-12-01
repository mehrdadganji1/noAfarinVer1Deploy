import { Request, Response } from 'express';
import supportService from '../services/support.service';
import { TicketStatus, TicketPriority } from '../models/SupportTicket';

export class SupportController {
  /**
   * POST /api/support/tickets
   * Create support ticket
   */
  async createTicket(req: Request, res: Response): Promise<void> {
    try {
      const ticketData = req.body;
      const ticket = await supportService.createTicket(ticketData);

      res.status(201).json({
        success: true,
        data: ticket,
        message: 'Support ticket created successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/support/tickets/:id
   * Get ticket by ID
   */
  async getTicketById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const ticket = await supportService.getTicketById(id);

      if (!ticket) {
        res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/support/tickets/number/:ticketNumber
   * Get ticket by ticket number
   */
  async getTicketByNumber(req: Request, res: Response): Promise<void> {
    try {
      const { ticketNumber } = req.params;
      const ticket = await supportService.getTicketByNumber(ticketNumber);

      if (!ticket) {
        res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/support/tickets/user/:userId
   * Get tickets by user
   */
  async getTicketsByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const tickets = await supportService.getTicketsByUser(userId);

      res.status(200).json({
        success: true,
        data: tickets,
        count: tickets.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/support/tickets
   * Get all tickets (Admin only)
   */
  async getAllTickets(_req: Request, res: Response): Promise<void> {
    try {
      const tickets = await supportService.getAllTickets();

      res.status(200).json({
        success: true,
        data: tickets,
        count: tickets.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/support/tickets/status/:status
   * Get tickets by status
   */
  async getTicketsByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;

      if (!Object.values(TicketStatus).includes(status as TicketStatus)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ticket status'
        });
        return;
      }

      const tickets = await supportService.getTicketsByStatus(status as TicketStatus);

      res.status(200).json({
        success: true,
        data: tickets,
        count: tickets.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/support/tickets/assigned/:assignedTo
   * Get tickets assigned to user (Admin/Support only)
   */
  async getAssignedTickets(req: Request, res: Response): Promise<void> {
    try {
      const { assignedTo } = req.params;
      const tickets = await supportService.getAssignedTickets(assignedTo);

      res.status(200).json({
        success: true,
        data: tickets,
        count: tickets.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PUT /api/support/tickets/:id
   * Update ticket
   */
  async updateTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const ticket = await supportService.updateTicket(id, updateData);

      if (!ticket) {
        res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket,
        message: 'Ticket updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/support/tickets/:id/messages
   * Add message to ticket
   */
  async addMessage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const message = req.body;

      const ticket = await supportService.addMessage(id, message);

      if (!ticket) {
        res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket,
        message: 'Message added successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/support/tickets/:id/assign
   * Assign ticket to user (Admin/Support only)
   */
  async assignTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { assignedTo, assignedToName } = req.body;

      if (!assignedTo || !assignedToName) {
        res.status(400).json({
          success: false,
          message: 'assignedTo and assignedToName are required'
        });
        return;
      }

      const ticket = await supportService.assignTicket(id, assignedTo, assignedToName);

      if (!ticket) {
        res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket,
        message: 'Ticket assigned successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PATCH /api/support/tickets/:id/priority
   * Update ticket priority (Admin/Support only)
   */
  async updatePriority(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { priority } = req.body;

      if (!priority || !Object.values(TicketPriority).includes(priority)) {
        res.status(400).json({
          success: false,
          message: 'Valid priority is required'
        });
        return;
      }

      const ticket = await supportService.updatePriority(id, priority);

      if (!ticket) {
        res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket,
        message: 'Priority updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PATCH /api/support/tickets/:id/resolve
   * Resolve ticket
   */
  async resolveTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const ticket = await supportService.resolveTicket(id);

      if (!ticket) {
        res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket,
        message: 'Ticket resolved successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PATCH /api/support/tickets/:id/close
   * Close ticket
   */
  async closeTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const ticket = await supportService.closeTicket(id);

      if (!ticket) {
        res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket,
        message: 'Ticket closed successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PATCH /api/support/tickets/:id/reopen
   * Reopen ticket
   */
  async reopenTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const ticket = await supportService.reopenTicket(id);

      if (!ticket) {
        res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket,
        message: 'Ticket reopened successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * DELETE /api/support/tickets/:id
   * Delete ticket (Admin only)
   */
  async deleteTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await supportService.deleteTicket(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Ticket deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/support/statistics
   * Get support statistics
   */
  async getStatistics(_req: Request, res: Response): Promise<void> {
    try {
      const statistics = await supportService.getStatistics();

      res.status(200).json({
        success: true,
        data: statistics
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new SupportController();
