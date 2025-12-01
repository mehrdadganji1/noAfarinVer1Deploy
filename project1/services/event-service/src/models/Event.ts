import mongoose, { Schema, Document } from 'mongoose';

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

export interface IEvent extends Document {
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  date: Date;
  time: string;
  duration: number; // in hours
  startDate?: Date; // Alternative format for frontend
  endDate?: Date; // Alternative format for frontend
  location?: string;
  onlineLink?: string;
  isOnline?: boolean;
  meetingLink?: string; // Alternative for onlineLink
  capacity: number;
  registered: number;
  registeredParticipants: mongoose.Types.ObjectId[];
  attendees: mongoose.Types.ObjectId[];
  organizer?: string;
  organizers: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  thumbnail?: string;
  agenda?: string;
  materials?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    type: {
      type: String,
      enum: Object.values(EventType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.UPCOMING,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0.5,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    location: {
      type: String,
      trim: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    onlineLink: {
      type: String,
    },
    meetingLink: {
      type: String,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    registered: {
      type: Number,
      default: 0,
    },
    registeredParticipants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    attendees: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    organizer: {
      type: String,
      trim: true,
    },
    organizers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnail: {
      type: String,
    },
    agenda: {
      type: String,
    },
    materials: [{
      type: String,
    }],
    tags: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEvent>('Event', EventSchema);
