import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContent extends Document {
  title: string;
  description: string;
  content: string;
  ageGroup: 'child' | 'teen' | 'adult';
  category: string;
  tags: string[];
  authorId: string;
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema<IContent> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    ageGroup: {
      type: String,
      enum: ['child', 'teen', 'adult'],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [String],
    authorId: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ContentSchema.index({ ageGroup: 1, published: 1 });
ContentSchema.index({ category: 1 });
ContentSchema.index({ tags: 1 });

const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);

export default Content;
