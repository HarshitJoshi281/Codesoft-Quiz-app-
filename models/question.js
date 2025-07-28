import mongoose from "mongoose";

// Define schema for a single question
const singleQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String], // Array of 4 options
    required: true,
    validate: [arr => arr.length === 4, 'Exactly 4 options required']
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3 // Because index will be between 0 and 3
  }
});

// Schema for a full quiz
const quizSchema = new mongoose.Schema({
  quizName: {
    type: String,
    required: true,
    unique: true // e.g., "quiz1", "quiz2", etc.
  },
  questions: {
    type: [singleQuestionSchema], // Array of questions
    required: true,
    validate: [arr => arr.length === 10, 'Exactly 10 questions required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
