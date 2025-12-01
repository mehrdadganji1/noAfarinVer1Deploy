import mongoose from 'mongoose';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TicketCategory {
  GENERAL = 'general',
  TECHNICAL = 'technical',
  APPLICATION = 'application',
  DOCUMENTS = 'documents',
  INTERVIEW = 'interview',
  ACCOUNT = 'account',
  OTHER = 'other'
}

export interface ITicketMessage {
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderRole: string;
  message: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
  }>;
  createdAt: Date;
}

export interface ISupportTicket extends mongoose.Document {
  ticketNumber: string;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  messages: ITicketMessage[];
  assignedTo?: mongoose.Types.ObjectId;
  assignedToName?: string;
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TicketMessageSchema: mongoose.Schema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SupportTicketSchema: mongoose.Schema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    userName: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    category: {
      type: String,
      enum: Object.values(TicketCategory),
      required: true,
      index: true
    },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.MEDIUM,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.OPEN,
      index: true
    },
    messages: [TicketMessageSchema],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedToName: {
      type: String
    },
    resolvedAt: {
      type: Date
    },
    closedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
SupportTicketSchema.index({ userId: 1, status: 1 });
SupportTicketSchema.index({ assignedTo: 1, status: 1 });
SupportTicketSchema.index({ status: 1, priority: -1, createdAt: -1 });
SupportTicketSchema.index({ ticketNumber: 1 });

// Auto-generate ticket number
SupportTicketSchema.pre('save', async function(this: ISupportTicket, next: any) {
  if (!this.ticketNumber) {
    const count = await mongoose.model('SupportTicket').countDocuments();
    this.ticketNumber = `TKT-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Virtual for response time (in hours)
SupportTicketSchema.virtual('responseTime').get(function(this: ISupportTicket) {
  if (this.messages.length <= 1) return null;
  
  const firstMessage = this.messages[0].createdAt;
  const firstResponse = this.messages[1].createdAt;
  
  const diffMs = firstResponse.getTime() - firstMessage.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  
  return diffHours;
});

// Virtual for resolution time (in hours)
SupportTicketSchema.virtual('resolutionTime').get(function(this: ISupportTicket) {
  if (!this.resolvedAt) return null;
  
  const diffMs = this.resolvedAt.getTime() - this.createdAt.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  
  return diffHours;
});

export default mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
