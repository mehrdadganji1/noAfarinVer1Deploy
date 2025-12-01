// Event Types and Interfaces

export enum EventType {
  WORKSHOP = 'workshop',
  NETWORKING = 'networking',
  SEMINAR = 'seminar',
  WEBINAR = 'webinar',
  INDUSTRIAL_VISIT = 'industrial_visit',
  PITCH_SESSION = 'pitch_session',
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  date: Date | string;
  time: string;
  duration: number; // in hours
  startDate?: Date | string;
  endDate?: Date | string;
  location?: string;
  isOnline?: boolean;
  onlineLink?: string;
  meetingLink?: string;
  capacity: number;
  registered: number;
  registeredParticipants: string[];
  attendees: string[];
  organizer?: string;
  organizers: string[];
  createdBy: string;
  thumbnail?: string;
  agenda?: string;
  materials?: string[];
  tags?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface EventsListResponse {
  success: boolean;
  data: {
    events: Event[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface EventResponse {
  success: boolean;
  data: Event;
  message?: string;
}

export interface EventStatsResponse {
  success: boolean;
  data: {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    userRegistered: number;
    userAttended: number;
  };
}

export interface EventFilters {
  type?: EventType;
  status?: EventStatus;
  page?: number;
  limit?: number;
}

export interface CreateEventInput {
  title: string;
  description: string;
  type: EventType;
  date: Date | string;
  time: string;
  duration: number;
  location?: string;
  isOnline?: boolean;
  onlineLink?: string;
  meetingLink?: string;
  capacity: number;
  thumbnail?: string;
  agenda?: string;
  materials?: string[];
  tags?: string[];
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  status?: EventStatus;
}

// Helper Functions
export const getEventTypeLabel = (type: EventType): string => {
  const labels: Record<EventType, string> = {
    [EventType.WORKSHOP]: 'کارگاه آموزشی',
    [EventType.NETWORKING]: 'شبکه‌سازی',
    [EventType.SEMINAR]: 'سمینار',
    [EventType.WEBINAR]: 'وبینار',
    [EventType.INDUSTRIAL_VISIT]: 'بازدید صنعتی',
    [EventType.PITCH_SESSION]: 'جلسه پیچ',
  };
  return labels[type] || type;
};

export const getEventTypeColor = (type: EventType): string => {
  const colors: Record<EventType, string> = {
    [EventType.WORKSHOP]: 'blue',
    [EventType.NETWORKING]: 'purple',
    [EventType.SEMINAR]: 'green',
    [EventType.WEBINAR]: 'cyan',
    [EventType.INDUSTRIAL_VISIT]: 'orange',
    [EventType.PITCH_SESSION]: 'pink',
  };
  return colors[type] || 'gray';
};

export const getEventStatusLabel = (status: EventStatus): string => {
  const labels: Record<EventStatus, string> = {
    [EventStatus.UPCOMING]: 'آینده',
    [EventStatus.ONGOING]: 'در حال برگزاری',
    [EventStatus.COMPLETED]: 'تکمیل شده',
    [EventStatus.CANCELLED]: 'لغو شده',
  };
  return labels[status] || status;
};

export const getEventStatusColor = (status: EventStatus): string => {
  const colors: Record<EventStatus, string> = {
    [EventStatus.UPCOMING]: 'blue',
    [EventStatus.ONGOING]: 'green',
    [EventStatus.COMPLETED]: 'gray',
    [EventStatus.CANCELLED]: 'red',
  };
  return colors[status] || 'gray';
};

export const formatEventDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatEventTime = (time: string): string => {
  // Assuming time is in HH:MM format
  return time;
};

export const isEventFull = (event: Event): boolean => {
  return event.registered >= event.capacity;
};

export const isUserRegistered = (event: Event, userId: string): boolean => {
  return event.registeredParticipants.includes(userId);
};

export const getEventCapacityPercentage = (event: Event): number => {
  return Math.round((event.registered / event.capacity) * 100);
};
