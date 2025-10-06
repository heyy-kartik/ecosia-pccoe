import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  ageGroup?: 'child' | 'teen' | 'adult';
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: String,
    lastName: String,
    age: Number,
    ageGroup: {
      type: String,
      enum: ['child', 'teen', 'adult'],
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
