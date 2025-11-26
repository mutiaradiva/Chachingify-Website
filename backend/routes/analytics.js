// routes/analytics.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction.js');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Get summary statistics
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { userId: req.userId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter);
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get expenses by category
router.get('/by-category', async (req, res) => {
  try {
    const { startDate, endDate, type = 'expense' } = req.query;
    const filter = { userId: req.userId, type };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const result = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$categoryId',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          name: '$category.name',
          icon: '$category.icon',
          color: '$category.color',
          total: 1,
          count: 1
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get trend over time (daily/monthly)
router.get('/trend', async (req, res) => {
  try {
    const { startDate, endDate, interval = 'daily' } = req.query;
    const filter = { userId: req.userId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const dateFormat = interval === 'monthly' ? '%Y-%m' : '%Y-%m-%d';

    const result = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: dateFormat, date: '$date' } },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Transform data for easier frontend consumption
    const trend = {};
    result.forEach(item => {
      if (!trend[item._id.date]) {
        trend[item._id.date] = { date: item._id.date, income: 0, expense: 0 };
      }
      trend[item._id.date][item._id.type] = item.total;
    });

    res.json(Object.values(trend));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;