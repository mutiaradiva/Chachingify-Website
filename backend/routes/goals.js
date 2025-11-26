// routes/goals.js
const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Get all goals
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single goal
router.get('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create goal
router.post('/', async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline, icon } = req.body;
    
    const goal = new Goal({
      userId: req.userId,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      icon: icon || '🎯'
    });
    
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create goal', error: error.message });
  }
});

// Update goal
router.put('/:id', async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline, icon } = req.body;
    
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, targetAmount, currentAmount, deadline, icon },
      { new: true, runValidators: true }
    );
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update goal', error: error.message });
  }
});

// Delete goal
router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add contribution to goal
router.post('/:id/contribute', async (req, res) => {
  try {
    const { amount } = req.body;
    
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    goal.currentAmount += amount;
    await goal.save();
    
    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add contribution', error: error.message });
  }
});

module.exports = router;