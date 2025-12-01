import FAQ, { IFAQ, FAQCategory } from '../models/FAQ';

export class FAQService {
  /**
   * Get all FAQs
   */
  async getAllFAQs(): Promise<IFAQ[]> {
    try {
      const faqs = await FAQ.find({ isActive: true })
        .sort({ order: 1, createdAt: -1 })
        .exec();

      return faqs;
    } catch (error: any) {
      throw new Error(`Error fetching FAQs: ${error.message}`);
    }
  }

  /**
   * Get FAQ by ID
   */
  async getFAQById(id: string): Promise<IFAQ | null> {
    try {
      const faq = await FAQ.findById(id).exec();
      return faq;
    } catch (error: any) {
      throw new Error(`Error fetching FAQ: ${error.message}`);
    }
  }

  /**
   * Get FAQs by category
   */
  async getFAQsByCategory(category: FAQCategory): Promise<IFAQ[]> {
    try {
      const faqs = await FAQ.find({ 
        category, 
        isActive: true 
      })
        .sort({ order: 1, createdAt: -1 })
        .exec();

      return faqs;
    } catch (error: any) {
      throw new Error(`Error fetching FAQs by category: ${error.message}`);
    }
  }

  /**
   * Search FAQs
   */
  async searchFAQs(query: string): Promise<IFAQ[]> {
    try {
      const faqs = await FAQ.find({
        $text: { $search: query },
        isActive: true
      })
        .sort({ score: { $meta: 'textScore' } })
        .limit(50)
        .exec();

      return faqs;
    } catch (error: any) {
      throw new Error(`Error searching FAQs: ${error.message}`);
    }
  }

  /**
   * Get popular FAQs (most viewed)
   */
  async getPopularFAQs(limit: number = 10): Promise<IFAQ[]> {
    try {
      const faqs = await FAQ.find({ isActive: true })
        .sort({ views: -1 })
        .limit(limit)
        .exec();

      return faqs;
    } catch (error: any) {
      throw new Error(`Error fetching popular FAQs: ${error.message}`);
    }
  }

  /**
   * Get helpful FAQs (highest helpfulness ratio)
   */
  async getHelpfulFAQs(limit: number = 10): Promise<IFAQ[]> {
    try {
      const faqs = await FAQ.aggregate([
        { $match: { isActive: true } },
        {
          $addFields: {
            helpfulnessRatio: {
              $cond: [
                { $eq: [{ $add: ['$helpfulCount', '$notHelpfulCount'] }, 0] },
                0,
                {
                  $multiply: [
                    { $divide: ['$helpfulCount', { $add: ['$helpfulCount', '$notHelpfulCount'] }] },
                    100
                  ]
                }
              ]
            }
          }
        },
        { $sort: { helpfulnessRatio: -1 } },
        { $limit: limit }
      ]);

      return faqs;
    } catch (error: any) {
      throw new Error(`Error fetching helpful FAQs: ${error.message}`);
    }
  }

  /**
   * Create FAQ (Admin only)
   */
  async createFAQ(data: Partial<IFAQ>): Promise<IFAQ> {
    try {
      const faq = new FAQ(data);
      await faq.save();

      return faq;
    } catch (error: any) {
      throw new Error(`Error creating FAQ: ${error.message}`);
    }
  }

  /**
   * Update FAQ (Admin only)
   */
  async updateFAQ(id: string, data: Partial<IFAQ>): Promise<IFAQ | null> {
    try {
      const faq = await FAQ.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      ).exec();

      return faq;
    } catch (error: any) {
      throw new Error(`Error updating FAQ: ${error.message}`);
    }
  }

  /**
   * Delete FAQ (Admin only)
   */
  async deleteFAQ(id: string): Promise<boolean> {
    try {
      const result = await FAQ.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error: any) {
      throw new Error(`Error deleting FAQ: ${error.message}`);
    }
  }

  /**
   * Track FAQ view
   */
  async trackView(id: string): Promise<IFAQ | null> {
    try {
      const faq = await FAQ.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      ).exec();

      return faq;
    } catch (error: any) {
      throw new Error(`Error tracking view: ${error.message}`);
    }
  }

  /**
   * Mark FAQ as helpful
   */
  async markHelpful(id: string): Promise<IFAQ | null> {
    try {
      const faq = await FAQ.findByIdAndUpdate(
        id,
        { $inc: { helpfulCount: 1 } },
        { new: true }
      ).exec();

      return faq;
    } catch (error: any) {
      throw new Error(`Error marking FAQ as helpful: ${error.message}`);
    }
  }

  /**
   * Mark FAQ as not helpful
   */
  async markNotHelpful(id: string): Promise<IFAQ | null> {
    try {
      const faq = await FAQ.findByIdAndUpdate(
        id,
        { $inc: { notHelpfulCount: 1 } },
        { new: true }
      ).exec();

      return faq;
    } catch (error: any) {
      throw new Error(`Error marking FAQ as not helpful: ${error.message}`);
    }
  }

  /**
   * Get FAQ statistics
   */
  async getStatistics(): Promise<any> {
    try {
      const totalFAQs = await FAQ.countDocuments({ isActive: true });
      const totalViews = await FAQ.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]);

      const byCategory = await FAQ.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      const avgHelpfulness = await FAQ.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            avgHelpful: { $avg: '$helpfulCount' },
            avgNotHelpful: { $avg: '$notHelpfulCount' }
          }
        }
      ]);

      return {
        total: totalFAQs,
        views: totalViews[0]?.total || 0,
        byCategory,
        avgHelpfulness: avgHelpfulness[0] || { avgHelpful: 0, avgNotHelpful: 0 }
      };
    } catch (error: any) {
      throw new Error(`Error fetching statistics: ${error.message}`);
    }
  }
}

export default new FAQService();
