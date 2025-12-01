import { Router } from 'express';
import supportController from '../controllers/support.controller';

const router = Router();

// Public routes (for authenticated users)
router.post('/support/tickets', supportController.createTicket);
router.get('/support/tickets/user/:userId', supportController.getTicketsByUser);
router.get('/support/tickets/number/:ticketNumber', supportController.getTicketByNumber);
router.get('/support/tickets/:id', supportController.getTicketById);
router.post('/support/tickets/:id/messages', supportController.addMessage);
router.patch('/support/tickets/:id/reopen', supportController.reopenTicket);

// Admin/Support routes
router.get('/support/tickets', supportController.getAllTickets);
router.get('/support/tickets/status/:status', supportController.getTicketsByStatus);
router.get('/support/tickets/assigned/:assignedTo', supportController.getAssignedTickets);
router.put('/support/tickets/:id', supportController.updateTicket);
router.post('/support/tickets/:id/assign', supportController.assignTicket);
router.patch('/support/tickets/:id/priority', supportController.updatePriority);
router.patch('/support/tickets/:id/resolve', supportController.resolveTicket);
router.patch('/support/tickets/:id/close', supportController.closeTicket);
router.delete('/support/tickets/:id', supportController.deleteTicket);
router.get('/support/statistics', supportController.getStatistics);

export default router;
