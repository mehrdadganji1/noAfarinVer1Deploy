import Resource, { IResource, ResourceType, ResourceCategory } from '../models/Resource';

export class ResourceService {
  /**
   * Get all resources
   */
  async getAllResources(): Promise<IResource[]> {
    try {
      const resources = await Resource.find({ isActive: true })
        .sort({ publishedDate: -1 })
        .exec();

      return resources;
    } catch (error: any) {
      throw new Error(`Error fetching resources: ${error.message}`);
    }
  }

  /**
   * Get resource by ID
   */
  async getResourceById(id: string): Promise<IResource | null> {
    try {
      const resource = await Resource.findById(id)
        .populate('relatedResources')
        .exec();

      return resource;
    } catch (error: any) {
      throw new Error(`Error fetching resource: ${error.message}`);
    }
  }

  /**
   * Get resources by type
   */
  async getResourcesByType(type: ResourceType): Promise<IResource[]> {
    try {
      const resources = await Resource.find({ 
        type, 
        isActive: true 
      })
        .sort({ publishedDate: -1 })
        .exec();

      return resources;
    } catch (error: any) {
      throw new Error(`Error fetching resources by type: ${error.message}`);
    }
  }

  /**
   * Get resources by category
   */
  async getResourcesByCategory(category: ResourceCategory): Promise<IResource[]> {
    try {
      const resources = await Resource.find({ 
        category, 
        isActive: true 
      })
        .sort({ publishedDate: -1 })
        .exec();

      return resources;
    } catch (error: any) {
      throw new Error(`Error fetching resources by category: ${error.message}`);
    }
  }

  /**
   * Get featured resources
   */
  async getFeaturedResources(): Promise<IResource[]> {
    try {
      const resources = await Resource.find({ 
        isFeatured: true, 
        isActive: true 
      })
        .sort({ publishedDate: -1 })
        .limit(6)
        .exec();

      return resources;
    } catch (error: any) {
      throw new Error(`Error fetching featured resources: ${error.message}`);
    }
  }

  /**
   * Get popular resources (most viewed)
   */
  async getPopularResources(limit: number = 10): Promise<IResource[]> {
    try {
      const resources = await Resource.find({ isActive: true })
        .sort({ views: -1 })
        .limit(limit)
        .exec();

      return resources;
    } catch (error: any) {
      throw new Error(`Error fetching popular resources: ${error.message}`);
    }
  }

  /**
   * Search resources
   */
  async searchResources(query: string): Promise<IResource[]> {
    try {
      const resources = await Resource.find({
        $text: { $search: query },
        isActive: true
      })
        .sort({ score: { $meta: 'textScore' } })
        .limit(50)
        .exec();

      return resources;
    } catch (error: any) {
      throw new Error(`Error searching resources: ${error.message}`);
    }
  }

  /**
   * Create resource (Admin only)
   */
  async createResource(data: Partial<IResource>): Promise<IResource> {
    try {
      const resource = new Resource(data);
      await resource.save();

      return resource;
    } catch (error: any) {
      throw new Error(`Error creating resource: ${error.message}`);
    }
  }

  /**
   * Update resource (Admin only)
   */
  async updateResource(id: string, data: Partial<IResource>): Promise<IResource | null> {
    try {
      const resource = await Resource.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      ).exec();

      return resource;
    } catch (error: any) {
      throw new Error(`Error updating resource: ${error.message}`);
    }
  }

  /**
   * Delete resource (Admin only)
   */
  async deleteResource(id: string): Promise<boolean> {
    try {
      const result = await Resource.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error: any) {
      throw new Error(`Error deleting resource: ${error.message}`);
    }
  }

  /**
   * Track resource view
   */
  async trackView(id: string): Promise<IResource | null> {
    try {
      const resource = await Resource.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      ).exec();

      return resource;
    } catch (error: any) {
      throw new Error(`Error tracking view: ${error.message}`);
    }
  }

  /**
   * Track resource download
   */
  async trackDownload(id: string): Promise<IResource | null> {
    try {
      const resource = await Resource.findByIdAndUpdate(
        id,
        { $inc: { downloads: 1 } },
        { new: true }
      ).exec();

      return resource;
    } catch (error: any) {
      throw new Error(`Error tracking download: ${error.message}`);
    }
  }

  /**
   * Get related resources
   */
  async getRelatedResources(id: string): Promise<IResource[]> {
    try {
      const resource = await Resource.findById(id).exec();
      
      if (!resource) {
        return [];
      }

      // Find resources with similar tags or same category
      const relatedResources = await Resource.find({
        _id: { $ne: id },
        isActive: true,
        $or: [
          { category: resource.category },
          { tags: { $in: resource.tags } }
        ]
      })
        .sort({ views: -1 })
        .limit(5)
        .exec();

      return relatedResources;
    } catch (error: any) {
      throw new Error(`Error fetching related resources: ${error.message}`);
    }
  }

  /**
   * Get resources by tags
   */
  async getResourcesByTags(tags: string[]): Promise<IResource[]> {
    try {
      const resources = await Resource.find({
        tags: { $in: tags },
        isActive: true
      })
        .sort({ publishedDate: -1 })
        .exec();

      return resources;
    } catch (error: any) {
      throw new Error(`Error fetching resources by tags: ${error.message}`);
    }
  }

  /**
   * Get resource statistics
   */
  async getStatistics(): Promise<any> {
    try {
      const totalResources = await Resource.countDocuments({ isActive: true });
      const totalViews = await Resource.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]);
      const totalDownloads = await Resource.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$downloads' } } }
      ]);

      const byType = await Resource.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]);

      const byCategory = await Resource.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      return {
        total: totalResources,
        views: totalViews[0]?.total || 0,
        downloads: totalDownloads[0]?.total || 0,
        byType,
        byCategory
      };
    } catch (error: any) {
      throw new Error(`Error fetching statistics: ${error.message}`);
    }
  }
}

export default new ResourceService();
