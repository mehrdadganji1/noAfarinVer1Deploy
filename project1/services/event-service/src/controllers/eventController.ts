import { Response } from 'express';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/auth';
import NotificationClient from '../utils/notificationClient';

// Create notification client instance
const notificationClient = new NotificationClient();

export const getAllEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    const query: any = {};
    
    if (type) query.type = type;
    if (status) query.status = status;

    const events = await Event.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ date: -1 });

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: { events, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching events' });
  }
};

export const getEventById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching event' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // TODO: Re-enable role check in production
    // if (!req.user!.role.includes('admin') && !req.user!.role.includes('faculty')) {
    //   res.status(403).json({ success: false, error: 'Forbidden' });
    //   return;
    // }

    const eventData = {
      ...req.body,
      organizers: [req.user!.id],
      createdBy: req.user!.id,
      registered: 0,
    };

    const event = await Event.create(eventData);
    
    console.log('📧 Sending event creation notification');
    
    // Send notification (to creator for now, can be expanded to all users)
    await notificationClient.notifyEventCreated(
      [req.user!.id],
      event.title,
      (event._id as any).toString(),
      event.date
    );
    
    console.log('✅ Event created and notification sent');
    
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, error: 'Error creating event' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }

    const isOrganizer = event.organizers.some((id: any) => id.toString() === req.user!.id);
    if (!isOrganizer && !req.user!.role.includes('admin')) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Notify all registered participants about the update
    if (updated && updated.registeredParticipants.length > 0) {
      const participantIds = updated.registeredParticipants.map((id: any) => id.toString());
      await notificationClient.notifyEventUpdated(
        participantIds,
        updated.title,
        (updated._id as any).toString()
      );
    }
    
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Event update error:', error);
    res.status(500).json({ success: false, error: 'Error updating event' });
  }
};

export const registerForEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('🔵 Register attempt:', { eventId: req.params.id, user: req.user?.id });
    
    if (!req.user?.id) {
      console.log('❌ No user ID in request');
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const userId = req.user.id;
    console.log('✅ User authenticated:', userId);

    const event = await Event.findById(req.params.id);
    console.log('📋 Event found:', event ? { id: event._id, title: event.title, registered: event.registered, capacity: event.capacity } : 'NOT FOUND');
    if (!event) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }

    if (event.registered >= event.capacity) {
      res.status(400).json({ success: false, error: 'Event is full' });
      return;
    }

    if (event.registeredParticipants.some((id: any) => id.toString() === userId)) {
      res.status(400).json({ success: false, error: 'Already registered' });
      return;
    }

    event.registeredParticipants.push(userId as any);
    event.registered = event.registeredParticipants.length;
    await event.save();
    
    // Send registration confirmation notification (don't block on failure)
    try {
      await notificationClient.notifyEventRegistered(
        userId,
        event.title,
        (event._id as any).toString()
      );
    } catch (notifError) {
      console.warn('Failed to send notification, but registration succeeded:', notifError);
    }

    res.json({ success: true, message: 'Registered successfully', data: event });
  } catch (error: any) {
    console.error('Event registration error:', {
      message: error.message,
      stack: error.stack,
      eventId: req.params.id,
      userId: req.user?.id,
    });
    res.status(500).json({ 
      success: false, 
      error: 'Error registering for event',
      details: error.message 
    });
  }
};

export const cancelRegistration = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('🔴 Cancel registration attempt:', { eventId: req.params.id, user: req.user?.id });
    
    if (!req.user?.id) {
      console.log('❌ No user ID in request');
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const userId = req.user.id;
    console.log('✅ User authenticated:', userId);

    const event = await Event.findById(req.params.id);
    console.log('📋 Event found:', event ? { 
      id: event._id, 
      title: event.title, 
      registered: event.registered,
      registeredParticipants: event.registeredParticipants,
      participantsCount: event.registeredParticipants.length 
    } : 'NOT FOUND');
    if (!event) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }

    const isRegistered = event.registeredParticipants.some((id: any) => id.toString() === userId);
    console.log('🔍 Registration check:', { 
      isRegistered, 
      userId, 
      participantIds: event.registeredParticipants.map((id: any) => id.toString()) 
    });
    
    if (!isRegistered) {
      console.log('❌ User not registered for this event');
      res.status(400).json({ success: false, error: 'Not registered for this event' });
      return;
    }

    event.registeredParticipants = event.registeredParticipants.filter(
      (id: any) => id.toString() !== userId
    );
    event.registered = event.registeredParticipants.length;
    await event.save();

    res.json({ success: true, message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ success: false, error: 'Error cancelling registration' });
  }
};

export const markAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const currentUserId = req.user.id;
    const { userId } = req.body;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }

    if (!event.organizers.some((id: any) => id.toString() === currentUserId) && !req.user.role.includes('admin')) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
      await event.save();
    }

    res.json({ success: true, message: 'Attendance marked', data: event });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ success: false, error: 'Error marking attendance' });
  }
};

export const getEventStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const ongoingEvents = await Event.countDocuments({ status: 'ongoing' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });
    
    // Get user's registered events (only if authenticated)
    let userRegisteredEvents = 0;
    let userAttendedEvents = 0;
    
    if (req.user?.id) {
      userRegisteredEvents = await Event.countDocuments({
        registeredParticipants: req.user.id
      });
      
      userAttendedEvents = await Event.countDocuments({
        attendees: req.user.id
      });
    }

    res.json({
      success: true,
      data: {
        total: totalEvents,
        upcoming: upcomingEvents,
        ongoing: ongoingEvents,
        completed: completedEvents,
        userRegistered: userRegisteredEvents,
        userAttended: userAttendedEvents,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, error: 'Error fetching event stats' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }

    const isOrganizer = event.organizers.some((id: any) => id.toString() === req.user!.id);
    if (!isOrganizer && !req.user!.role.includes('admin') && !req.user!.role.includes('director')) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ success: false, error: 'Error deleting event' });
  }
};

export const getEventAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const events = await Event.find();
    
    // Calculate analytics
    const totalEvents = events.length;
    const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
    const totalRegistered = events.reduce((sum, e) => sum + e.registered, 0);
    const totalAttended = events.reduce((sum, e) => sum + e.attendees.length, 0);
    
    const avgRegistrationRate = totalEvents > 0 ? (totalRegistered / totalCapacity) * 100 : 0;
    const avgAttendanceRate = totalRegistered > 0 ? (totalAttended / totalRegistered) * 100 : 0;
    
    // Events by type
    const eventsByType = events.reduce((acc: any, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {});
    
    // Events by status
    const eventsByStatus = events.reduce((acc: any, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    }, {});
    
    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentEvents = events.filter(e => new Date(e.date) >= sixMonthsAgo);
    const monthlyTrend = recentEvents.reduce((acc: any, event) => {
      const month = new Date(event.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        overview: {
          totalEvents,
          totalCapacity,
          totalRegistered,
          totalAttended,
          avgRegistrationRate: Math.round(avgRegistrationRate),
          avgAttendanceRate: Math.round(avgAttendanceRate),
        },
        eventsByType,
        eventsByStatus,
        monthlyTrend,
        topEvents: events
          .sort((a, b) => b.registered - a.registered)
          .slice(0, 5)
          .map(e => ({
            id: e._id,
            title: e.title,
            registered: e.registered,
            capacity: e.capacity,
            attendanceRate: e.registered > 0 ? Math.round((e.attendees.length / e.registered) * 100) : 0,
          })),
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, error: 'Error fetching analytics' });
  }
};
