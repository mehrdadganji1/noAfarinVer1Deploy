import { Router } from 'express';
import faqController from '../controllers/faq.controller';

const router = Router();

// Public routes (for all users)
router.get('/faqs', faqController.getAllFAQs);
router.get('/faqs/popular', faqController.getPopularFAQs);
router.get('/faqs/helpful', faqController.getHelpfulFAQs);
router.get('/faqs/search', faqController.searchFAQs);
router.get('/faqs/statistics', faqController.getStatistics);
router.get('/faqs/category/:category', faqController.getFAQsByCategory);
router.get('/faqs/:id', faqController.getFAQById);

// Tracking routes
router.post('/faqs/:id/view', faqController.trackView);
router.post('/faqs/:id/helpful', faqController.markHelpful);
router.post('/faqs/:id/not-helpful', faqController.markNotHelpful);

// Admin routes (requires admin role)
router.post('/faqs', faqController.createFAQ);
router.put('/faqs/:id', faqController.updateFAQ);
router.delete('/faqs/:id', faqController.deleteFAQ);

export default router;
