// نقش‌های کاربری
export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  MENTOR = 'mentor',
  JUDGE = 'judge',
  INDUSTRY_EXPERT = 'industry_expert',
  FACULTY = 'faculty',
}

// وضعیت تیم
export enum TeamStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  IN_EVALUATION = 'in_evaluation',
  SELECTED = 'selected',
  REJECTED = 'rejected',
  GRADUATED = 'graduated',
}

// مراحل تیم
export enum TeamPhase {
  IDEATION = 'ideation',
  AACO_EVENT = 'aaco_event',
  TRAINING = 'training',
  MVP_DEVELOPMENT = 'mvp_development',
  PITCH_PREPARATION = 'pitch_preparation',
  FINAL_PRESENTATION = 'final_presentation',
  PARK_ENTRY = 'park_entry',
}

// نوع رویداد
export enum EventType {
  AACO = 'aaco',
  WORKSHOP = 'workshop',
  INDUSTRIAL_VISIT = 'industrial_visit',
  TRAINING = 'training',
  PITCH_SESSION = 'pitch_session',
  CLOSING_CEREMONY = 'closing_ceremony',
}

// وضعیت رویداد
export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// نوع تسهیلات
export enum FundingType {
  SEED_FUNDING = 'seed_funding',
  GRANT = 'grant',
  LOAN = 'loan',
}

// وضعیت درخواست تسهیلات
export enum FundingStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DISBURSED = 'disbursed',
}

// اینترفیس‌های اصلی

export interface IUser {
  _id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: UserRole[];
  phoneNumber?: string;
  university?: string;
  major?: string;
  studentId?: string;
  bio?: string;
  avatar?: string;
  expertise?: string[];
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeam {
  _id: string;
  name: string;
  description: string;
  ideaTitle: string;
  ideaDescription: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  technology: string[];
  members: ITeamMember[];
  mentors: string[];
  status: TeamStatus;
  phase: TeamPhase;
  score?: number;
  ranking?: number;
  logo?: string;
  pitchDeck?: string;
  mvpUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeamMember {
  userId: string;
  role: 'founder' | 'co-founder' | 'member';
  joinedAt: Date;
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  capacity?: number;
  registeredParticipants: string[];
  attendees: string[];
  organizers: string[];
  agenda?: string;
  materials?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvaluation {
  _id: string;
  teamId: string;
  eventId?: string;
  judgeId: string;
  criteria: IEvaluationCriteria[];
  totalScore: number;
  feedback: string;
  phase: TeamPhase;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvaluationCriteria {
  name: string;
  description: string;
  score: number;
  maxScore: number;
  weight: number;
}

export interface ITraining {
  _id: string;
  title: string;
  description: string;
  type: 'course' | 'workshop' | 'webinar';
  instructor: string;
  duration: number; // minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  materials: string[];
  enrolledUsers: string[];
  completedUsers: string[];
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFunding {
  _id: string;
  teamId: string;
  type: FundingType;
  amount: number;
  currency: string;
  status: FundingStatus;
  applicationDate: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
  terms?: string;
  documents: string[];
  reviewerId?: string;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  university?: string;
  major?: string;
  studentId?: string;
}

export interface CreateTeamDTO {
  name: string;
  description: string;
  ideaTitle: string;
  ideaDescription: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  technology: string[];
}

export interface UpdateTeamDTO {
  name?: string;
  description?: string;
  ideaDescription?: string;
  problemStatement?: string;
  solution?: string;
  targetMarket?: string;
  technology?: string[];
  status?: TeamStatus;
  phase?: TeamPhase;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  capacity?: number;
  agenda?: string;
}

export interface SubmitEvaluationDTO {
  teamId: string;
  eventId?: string;
  criteria: IEvaluationCriteria[];
  feedback: string;
  phase: TeamPhase;
}

export interface ApplyFundingDTO {
  teamId: string;
  type: FundingType;
  amount: number;
  terms?: string;
}

// Response Types

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  user: IUser;
  token: string;
  refreshToken: string;
}
