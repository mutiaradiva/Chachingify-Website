// models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  icon: {
    type: String,
    default: '🎯'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Virtual for progress percentage
goalSchema.virtual('progress').get(function() {
  return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
});

// Virtual for remaining amount
goalSchema.virtual('remaining').get(function() {
  return Math.max(this.targetAmount - this.currentAmount, 0);
});

// Virtual for months remaining
goalSchema.virtual('monthsRemaining').get(function() {
  const now = new Date();
  const deadline = new Date(this.deadline);
  const months = (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth());
  return Math.max(months, 0);
});

module.exports = mongoose.model('Goal', goalSchema);