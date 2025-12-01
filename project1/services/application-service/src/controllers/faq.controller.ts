import { Request, Response } from 'express';
import faqService from '../services/faq.service';
import { FAQCategory } from '../models/FAQ';

export class FAQController {
  /**
   * GET /api/faqs
   * Get all FAQs
   */
  async getAllFAQs(_req: Request, res: Response): Promise<void> {
    try {
      const faqs = await faqService.getAllFAQs();

      res.status(200).json({
        success: true,
        data: faqs,
        count: faqs.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/faqs/:id
   * Get FAQ by ID
   */
  async getFAQById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const faq = await faqService.getFAQById(id);

      if (!faq) {
        res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: faq
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/faqs/category/:category
   * Get FAQs by category
   */
  async getFAQsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;

      if (!Object.values(FAQCategory).includes(category as FAQCategory)) {
        res.status(400).json({
          success: false,
          message: 'Invalid FAQ category'
        });
        return;
      }

      const faqs = await faqService.getFAQsByCategory(category as FAQCategory);

      res.status(200).json({
        success: true,
        data: faqs,
        count: faqs.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/faqs/search
   * Search FAQs
   */
  async searchFAQs(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.query;

      if (!query) {
        res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
        return;
      }

      const faqs = await faqService.searchFAQs(query as string);

      res.status(200).json({
        success: true,
        data: faqs,
        count: faqs.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/faqs/popular
   * Get popular FAQs
   */
  async getPopularFAQs(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const faqs = await faqService.getPopularFAQs(limit);

      res.status(200).json({
        success: true,
        data: faqs,
        count: faqs.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/faqs/helpful
   * Get helpful FAQs
   */
  async getHelpfulFAQs(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const faqs = await faqService.getHelpfulFAQs(limit);

      res.status(200).json({
        success: true,
        data: faqs,
        count: faqs.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/faqs
   * Create FAQ (Admin only)
   */
  async createFAQ(req: Request, res: Response): Promise<void> {
    try {
      const faqData = req.body;
      const faq = await faqService.createFAQ(faqData);

      res.status(201).json({
        success: true,
        data: faq,
        message: 'FAQ created successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PUT /api/faqs/:id
   * Update FAQ (Admin only)
   */
  async updateFAQ(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const faq = await faqService.updateFAQ(id, updateData);

      if (!faq) {
        res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: faq,
        message: 'FAQ updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * DELETE /api/faqs/:id
   * Delete FAQ (Admin only)
   */
  async deleteFAQ(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await faqService.deleteFAQ(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'FAQ deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/faqs/:id/view
   * Track FAQ view
   */
  async trackView(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const faq = await faqService.trackView(id);

      if (!faq) {
        res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: faq
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/faqs/:id/helpful
   * Mark FAQ as helpful
   */
  async markHelpful(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const faq = await faqService.markHelpful(id);

      if (!faq) {
        res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: faq
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/faqs/:id/not-helpful
   * Mark FAQ as not helpful
   */
  async markNotHelpful(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const faq = await faqService.markNotHelpful(id);

      if (!faq) {
        res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: faq
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/faqs/statistics
   * Get FAQ statistics
   */
  async getStatistics(_req: Request, res: Response): Promise<void> {
    try {
      const statistics = await faqService.getStatistics();

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

export default new FAQController();
