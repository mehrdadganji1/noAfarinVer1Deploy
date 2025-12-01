import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'foundation' | 'hacker' | 'hustler' | 'hipster';
  readTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  tags: string[];
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  bookmarks: number;
  nextResourceId?: string;
  prevResourceId?: string;
  relatedResources: string[];
  metadata: {
    estimatedMinutes: number;
    sections: number;
    exercises: number;
    quizzes: number;
  };
}

const ResourceSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['foundation', 'hacker', 'hustler', 'hipster'],
    required: true 
  },
  readTime: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true 
  },
  order: { type: Number, required: true },
  tags: [{ type: String }],
  author: { type: String, default: 'AAco Team' },
  publishedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
  nextResourceId: { type: String },
  prevResourceId: { type: String },
  relatedResources: [{ type: String }],
  metadata: {
    estimatedMinutes: { type: Number, default: 0 },
    sections: { type: Number, default: 0 },
    exercises: { type: Number, default: 0 },
    quizzes: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

export default mongoose.model<IResource>('Resource', ResourceSchema);
