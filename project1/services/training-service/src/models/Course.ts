import mongoose, { Schema, Document } from 'mongoose';

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: {
    user: mongoose.Types.ObjectId;
    name: string;
    avatar?: string;
  };
  category: string;
  level: CourseLevel;
  duration: number; // in hours
  lessons: {
    title: string;
    description?: string;
    duration: number; // in minutes
    videoUrl?: string;
    materials?: string[];
    order: number;
  }[];
  studentsCount: number;
  maxStudents?: number;
  enrolledStudents: {
    user: mongoose.Types.ObjectId;
    enrolledAt: Date;
    progress: number; // 0-100
    completedLessons: number[];
  }[];
  rating: number;
  reviews: {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
  }[];
  price: number;
  isPremium: boolean;
  startDate: Date;
  endDate?: Date;
  thumbnail?: string;
  syllabus?: string;
  prerequisites?: string[];
  tags?: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
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
    instructor: {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: Object.values(CourseLevel),
      default: CourseLevel.BEGINNER,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    lessons: [{
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      duration: {
        type: Number,
        required: true,
      },
      videoUrl: {
        type: String,
      },
      materials: [{
        type: String,
      }],
      order: {
        type: Number,
        required: true,
      },
    }],
    studentsCount: {
      type: Number,
      default: 0,
    },
    maxStudents: {
      type: Number,
    },
    enrolledStudents: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      enrolledAt: {
        type: Date,
        default: Date.now,
      },
      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      completedLessons: [{
        type: Number,
      }],
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    thumbnail: {
      type: String,
    },
    syllabus: {
      type: String,
    },
    prerequisites: [{
      type: String,
    }],
    tags: [{
      type: String,
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-update rating when reviews change
CourseSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = Math.round((totalRating / this.reviews.length) * 10) / 10;
  }
  next();
});

// Auto-update studentsCount
CourseSchema.pre('save', function(next) {
  this.studentsCount = this.enrolledStudents.length;
  next();
});

export default mongoose.model<ICourse>('Course', CourseSchema);
