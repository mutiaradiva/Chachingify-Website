// routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const Account = require('../models/account');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all transactions for user
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, categoryId, accountId, type } = req.query;
    
    // Build filter
    const filter = { userId: req.userId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    if (categoryId) filter.categoryId = categoryId;
    if (accountId) filter.accountId = accountId;
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter)
      .populate('categoryId', 'name icon color type')
      .populate('accountId', 'name type')
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId
    })
      .populate('categoryId')
      .populate('accountId');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create transaction with optional file upload
router.post('/', upload.single('receipt'), async (req, res) => {
  try {
    const { categoryId, accountId, type, amount, description, date } = req.body;

    // Create transaction
    const transaction = new Transaction({
      userId: req.userId,
      categoryId,
      accountId,
      type,
      amount: parseFloat(amount),
      description,
      date: date || Date.now(),
      receipt: req.file ? `/uploads/${req.file.filename}` : null
    });

    await transaction.save();

    // Update account balance
    const account = await Account.findById(accountId);
    if (account) {
      if (type === 'expense') {
        account.balance -= parseFloat(amount);
      } else {
        account.balance += parseFloat(amount);
      }
      await account.save();
    }

    // Populate and return
    await transaction.populate('categoryId accountId');
    
    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update transaction
router.put('/:id', upload.single('receipt'), async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const oldAmount = transaction.amount;
    const oldType = transaction.type;
    const oldAccountId = transaction.accountId;

    // Update fields
    const { categoryId, accountId, type, amount, description, date } = req.body;
    
    if (categoryId) transaction.categoryId = categoryId;
    if (accountId) transaction.accountId = accountId;
    if (type) transaction.type = type;
    if (amount) transaction.amount = parseFloat(amount);
    if (description !== undefined) transaction.description = description;
    if (date) transaction.date = date;
    if (req.file) transaction.receipt = `/uploads/${req.file.filename}`;

    await transaction.save();

    // Update account balances
    // Revert old transaction
    const oldAccount = await Account.findById(oldAccountId);
    if (oldAccount) {
      if (oldType === 'expense') {
        oldAccount.balance += oldAmount;
      } else {
        oldAccount.balance -= oldAmount;
      }
      await oldAccount.save();
    }

    // Apply new transaction
    const newAccount = await Account.findById(transaction.accountId);
    if (newAccount) {
      if (transaction.type === 'expense') {
        newAccount.balance -= transaction.amount;
      } else {
        newAccount.balance += transaction.amount;
      }
      await newAccount.save();
    }

    await transaction.populate('categoryId accountId');

    res.json({
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update account balance
    const account = await Account.findById(transaction.accountId);
    if (account) {
      if (transaction.type === 'expense') {
        account.balance += transaction.amount;
      } else {
        account.balance -= transaction.amount;
      }
      await account.save();
    }

    await Transaction.deleteOne({ _id: req.params.id });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;