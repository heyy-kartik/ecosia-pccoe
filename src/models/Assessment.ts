import mongoose from 'mongoose';

// Learning Goals Schema
const LearningGoalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['understanding', 'action', 'awareness', 'skills'], 
    required: true 
  },
  ageGroups: [{ type: String, enum: ['children', 'teens', 'adults'] }],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] }
});

// Prior Knowledge Assessment Schema
const KnowledgeQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  ageGroup: { type: String, enum: ['children', 'teens', 'adults'] }
});

// User Assessment Result Schema
const AssessmentResultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  assessmentType: { 
    type: String, 
    enum: ['onboarding', 'knowledge_check', 'progress'], 
    required: true 
  },
  responses: [{
    questionId: String,
    selectedAnswer: Number,
    isCorrect: Boolean,
    timeSpent: Number
  }],
  score: { type: Number, required: true },
  knowledgeLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'] 
  },
  completedAt: { type: Date, default: Date.now }
});

// Learning Path Schema
const LearningPathSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  ageGroup: { type: String, required: true },
  knowledgeLevel: { type: String, required: true },
  selectedGoals: [{ type: String, required: true }],
  learningStyle: { 
    type: String, 
    enum: ['visual', 'auditory', 'kinesthetic', 'reading'] 
  },
  
  recommendedContent: [{
    contentId: String,
    priority: Number,
    reason: String,
    estimatedDuration: Number
  }],
  progress: {
    completedContent: [String],
    currentStreak: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 }
  },
  adaptations: [{
    date: Date,
    reason: String,
    changes: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const LearningGoal = mongoose.models.LearningGoal || mongoose.model('LearningGoal', LearningGoalSchema);
export const KnowledgeQuestion = mongoose.models.KnowledgeQuestion || mongoose.model('KnowledgeQuestion', KnowledgeQuestionSchema);
export const AssessmentResult = mongoose.models.AssessmentResult || mongoose.model('AssessmentResult', AssessmentResultSchema);
export const LearningPath = mongoose.models.LearningPath || mongoose.model('LearningPath', LearningPathSchema);