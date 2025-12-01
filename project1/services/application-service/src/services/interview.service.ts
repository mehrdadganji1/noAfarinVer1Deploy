import Interview, { IInterview, InterviewStatus } from '../models/Interview';
import mongoose from 'mongoose';

export class InterviewService {
  /**
   * Create a new interview
   */
  async createInterview(data: Partial<IInterview>): Promise<IInterview> {
    try {
      const interview = new Interview(data);
      await interview.save();
      return interview;
    } catch (error: any) {
      throw new Error(`Error creating interview: ${error.message}`);
    }
  }

  /**
   * Get all interviews by application ID
   */
  async getInterviewsByApplication(applicationId: string): Promise<IInterview[]> {
    try {
      const interviews = await Interview.find({ 
        applicationId: new mongoose.Types.ObjectId(applicationId) 
      })
        .sort({ interviewDate: 1 })
        .exec();
      
      return interviews;
    } catch (error: any) {
      throw new Error(`Error fetching interviews: ${error.message}`);
    }
  }

  /**
   * Get all interviews by applicant ID
   */
  async getInterviewsByApplicant(applicantId: string): Promise<IInterview[]> {
    try {
      const interviews = await Interview.find({ 
        applicantId: applicantId 
      })
        .sort({ interviewDate: -1 })
        .exec();
      
      return interviews;
    } catch (error: any) {
      console.error('Error fetching interviews:', error);
      throw new Error(`Error fetching interviews: ${error.message}`);
    }
  }

  /**
   * Get upcoming interviews by applicant ID
   */
  async getUpcomingInterviews(applicantId: string): Promise<IInterview[]> {
    try {
      const now = new Date();
      const interviews = await Interview.find({ 
        applicantId: applicantId,
        status: InterviewStatus.SCHEDULED,
        interviewDate: { $gte: now }
      })
        .sort({ interviewDate: 1 })
        .exec();
      
      return interviews;
    } catch (error: any) {
      console.error('Error fetching upcoming interviews:', error);
      throw new Error(`Error fetching upcoming interviews: ${error.message}`);
    }
  }

  /**
   * Get past interviews by applicant ID
   */
  async getPastInterviews(applicantId: string): Promise<IInterview[]> {
    try {
      const now = new Date();
      const interviews = await Interview.find({ 
        applicantId: applicantId,
        $or: [
          { interviewDate: { $lt: now } },
          { status: { $in: [InterviewStatus.COMPLETED, InterviewStatus.CANCELLED, InterviewStatus.NO_SHOW] } }
        ]
      })
        .sort({ interviewDate: -1 })
        .exec();
      
      return interviews;
    } catch (error: any) {
      console.error('Error fetching past interviews:', error);
      throw new Error(`Error fetching past interviews: ${error.message}`);
    }
  }

  /**
   * Get next upcoming interview for applicant
   */
  async getNextInterview(applicantId: string): Promise<IInterview | null> {
    try {
      const now = new Date();
      const interview = await Interview.findOne({ 
        applicantId: new mongoose.Types.ObjectId(applicantId),
        status: InterviewStatus.SCHEDULED,
        interviewDate: { $gte: now }
      })
        .sort({ interviewDate: 1 })
        .exec();
      
      return interview;
    } catch (error: any) {
      throw new Error(`Error fetching next interview: ${error.message}`);
    }
  }

  /**
   * Get interview by ID
   */
  async getInterviewById(id: string): Promise<IInterview | null> {
    try {
      const interview = await Interview.findById(id).exec();
      return interview;
    } catch (error: any) {
      throw new Error(`Error fetching interview: ${error.message}`);
    }
  }

  /**
   * Update interview
   */
  async updateInterview(id: string, data: Partial<IInterview>): Promise<IInterview | null> {
    try {
      const interview = await Interview.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      ).exec();
      
      return interview;
    } catch (error: any) {
      throw new Error(`Error updating interview: ${error.message}`);
    }
  }

  /**
   * Delete interview
   */
  async deleteInterview(id: string): Promise<boolean> {
    try {
      const result = await Interview.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error: any) {
      throw new Error(`Error deleting interview: ${error.message}`);
    }
  }

  /**
   * Mark interview as completed
   */
  async markAsCompleted(id: string, feedback?: string, score?: number): Promise<IInterview | null> {
    try {
      const updateData: any = {
        status: InterviewStatus.COMPLETED
      };
      
      if (feedback) updateData.feedback = feedback;
      if (score !== undefined) updateData.score = score;
      
      const interview = await Interview.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).exec();
      
      return interview;
    } catch (error: any) {
      throw new Error(`Error marking interview as completed: ${error.message}`);
    }
  }

  /**
   * Mark interview as cancelled
   */
  async markAsCancelled(id: string, reason?: string): Promise<IInterview | null> {
    try {
      const updateData: any = {
        status: InterviewStatus.CANCELLED
      };
      
      if (reason) updateData.notes = reason;
      
      const interview = await Interview.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).exec();
      
      return interview;
    } catch (error: any) {
      throw new Error(`Error cancelling interview: ${error.message}`);
    }
  }

  /**
   * Add feedback to interview
   */
  async addFeedback(id: string, feedback: string, score?: number): Promise<IInterview | null> {
    try {
      const updateData: any = { feedback };
      if (score !== undefined) updateData.score = score;
      
      const interview = await Interview.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).exec();
      
      return interview;
    } catch (error: any) {
      throw new Error(`Error adding feedback: ${error.message}`);
    }
  }

  /**
   * Get interviews grouped by date
   */
  async getInterviewSchedule(applicationId: string): Promise<Record<string, IInterview[]>> {
    try {
      const interviews = await this.getInterviewsByApplication(applicationId);
      
      const schedule: Record<string, IInterview[]> = {};
      
      interviews.forEach(interview => {
        const dateKey = interview.interviewDate.toISOString().split('T')[0];
        if (!schedule[dateKey]) {
          schedule[dateKey] = [];
        }
        schedule[dateKey].push(interview);
      });
      
      return schedule;
    } catch (error: any) {
      throw new Error(`Error fetching interview schedule: ${error.message}`);
    }
  }

  /**
   * Get interview statistics
   */
  async getStatistics(applicantId: string): Promise<{
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  }> {
    try {
      const objectId = new mongoose.Types.ObjectId(applicantId);
      
      const [total, upcoming, completed, cancelled] = await Promise.all([
        Interview.countDocuments({ applicantId: objectId }),
        Interview.countDocuments({ 
          applicantId: objectId, 
          status: InterviewStatus.SCHEDULED 
        }),
        Interview.countDocuments({ 
          applicantId: objectId, 
          status: InterviewStatus.COMPLETED 
        }),
        Interview.countDocuments({ 
          applicantId: objectId, 
          status: InterviewStatus.CANCELLED 
        })
      ]);
      
      return { total, upcoming, completed, cancelled };
    } catch (error: any) {
      throw new Error(`Error fetching statistics: ${error.message}`);
    }
  }
}

export default new InterviewService();
