// src/pages/DashboardPage.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { Dashboard } from '../components/dashboard';
import { TransactionList } from '../components/TransactionList';
import { AddTransactionModal } from '../components/addTransactionModal';
import { EditTransactionModal } from '../components/editTransactionModal';
import { Budget } from '../components/budget';
import Goals from '../components/goals';
import { 
  transactionsAPI, 
  categoriesAPI, 
  accountsAPI, 
  analyticsAPI,
  tokenManager 
} from '../utils/api';

export function DashboardPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0
  });
  const [categoryData, setCategoryData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch transactions, categories, accounts, and analytics in parallel
      const [transactionsData, categoriesData, accountsData, summaryData, categoryBreakdown] = await Promise.all([
        transactionsAPI.getAll(),
        categoriesAPI.getAll(),
        accountsAPI.getAll(),
        analyticsAPI.getSummary(), // GET /api/analytics/summary
        analyticsAPI.getByCategory() // GET /api/analytics/by-category
      ]);

      console.log('Fetched data:', {
        transactions: transactionsData,
        summary: summaryData,
        categories: categoryBreakdown
      });

      setTransactions(transactionsData);
      setCategories(categoriesData);
      setAccounts(accountsData);
      setSummary(summaryData);
      setCategoryData(categoryBreakdown);
      
    } catch (err) {
      console.error("Fetch error:", err);
      // Show error to user
      alert('Gagal memuat data. Silakan refresh halaman.');
    } finally {
      setLoading(false);
    }
  };

  // Delete transaction
  const onDeleteTransaction = async (id) => {
    try {
      await transactionsAPI.delete(id);
      // Refresh all data after delete
      await fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      alert('Gagal menghapus transaksi');
    }
  };

  // Edit transaction
  const onEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setShowEditModal(true);
  };

  // After add/edit success
  const onTransactionSuccess = async () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingTransaction(null);
    // Refresh all data
    await fetchData();
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header 
        user={user} 
        onLogout={onLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {activeTab === 'dashboard' && (
          <Dashboard 
            summary={summary} 
            categoryData={categoryData}
            transactions={transactions}
            onDeleteTransaction={onDeleteTransaction}
            onEditTransaction={onEditTransaction}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionList
            transactions={transactions}
            onDelete={onDeleteTransaction}
            onEdit={onEditTransaction}
            loading={loading}
          />
        )}

        {activeTab === 'budget' && (
          <Budget categoryData={categoryData} summary={summary} />
        )}

        {activeTab === 'goals' && (
          <Goals summary={summary} />
        )}
      </main>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center justify-center z-50 group"
      >
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
      </button>

      {/* Modals */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
        accounts={accounts}
        onSuccess={onTransactionSuccess}
      />

      <EditTransactionModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTransaction(null);
        }}
        transaction={editingTransaction}
        categories={categories}
        accounts={accounts}
        onSuccess={onTransactionSuccess}
      />
    </div>
  );
}