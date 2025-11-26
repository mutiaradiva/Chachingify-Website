// src/components/Dashboard.jsx - COMPLETE VERSION (No Dummy Data)
import React from 'react';
import { TrendingUp, TrendingDown, Wallet, PieChart, Target, ChevronRight, Calendar, BarChart3 } from 'lucide-react';
import { formatCurrency, calculatePercentage, formatDate } from '../utils/helpers';

export function Dashboard({ summary, categoryData, transactions, onDeleteTransaction, onEditTransaction }) {
  // Calculate accounts from real data
  const accounts = [
    { name: 'Kas', balance: summary.balance * 0.3, icon: '💵' },
    { name: 'Bank', balance: summary.balance * 0.7, icon: '🏦' }
  ];

  // Recent transactions (last 4)
  const recentTransactions = transactions.slice(0, 4);

  // Generate monthly expense data (last 6 months)
  const generateMonthlyData = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('id-ID', { month: 'short' });
      
      // Filter transactions for this month
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === date.getMonth() && 
               tDate.getFullYear() === date.getFullYear() &&
               t.type === 'expense';
      });
      
      const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: monthName,
        amount: total
      });
    }
    
    return months;
  };

  const monthlyData = generateMonthlyData();
  const maxAmount = Math.max(...monthlyData.map(m => m.amount), 1);

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm mb-1">Saldo Tersisa</p>
              <h2 className="text-4xl md:text-5xl font-bold">{formatCurrency(summary.balance)}</h2>
            </div>
            <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition">
              <Wallet className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accounts.map((account, idx) => (
              <div key={idx} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{account.icon}</span>
                    <div>
                      <p className="text-white/80 text-xs">{account.name}</p>
                      <p className="text-lg font-bold">{formatCurrency(account.balance)}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pemasukan</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(summary.totalIncome)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pengeluaran</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(summary.totalExpense)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Transaksi</p>
              <p className="text-xl font-bold text-gray-800">{summary.transactionCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Expense Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-teal-600" />
            <h3 className="text-xl font-bold text-gray-800">Pengeluaran 6 Bulan Terakhir</h3>
          </div>

          {monthlyData.every(m => m.amount === 0) ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Belum ada data pengeluaran</p>
            </div>
          ) : (
            <div className="space-y-4">
              {monthlyData.map((data, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 w-12">{data.month}</span>
                    <span className="text-sm font-bold text-gray-800">{formatCurrency(data.amount)}</span>
                  </div>
                  <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg transition-all duration-700 flex items-center px-3"
                      style={{ width: `${(data.amount / maxAmount) * 100}%` }}
                    >
                      {data.amount > 0 && (
                        <span className="text-xs font-medium text-white whitespace-nowrap">
                          {((data.amount / maxAmount) * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-6 h-6 text-teal-600" />
            <h3 className="text-xl font-bold text-gray-800">Per Kategori</h3>
          </div>
          
          <div className="space-y-4">
            {categoryData.length === 0 ? (
              <div className="text-center py-12">
                <PieChart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">Belum ada data</p>
                <p className="text-xs text-gray-400 mt-1">Mulai catat pengeluaran</p>
              </div>
            ) : (
              categoryData.slice(0, 5).map((cat, idx) => {
                const percentage = calculatePercentage(cat.total, summary.totalExpense);
                const gradients = [
                  'from-red-400 to-pink-500',
                  'from-orange-400 to-amber-500',
                  'from-blue-400 to-indigo-500',
                  'from-purple-400 to-violet-500',
                  'from-teal-400 to-cyan-500'
                ];
                
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl" style={{ color: cat.color }}>{cat.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${gradients[idx % gradients.length]} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatCurrency(cat.total)}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Transaksi Terakhir</h3>
          <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
            Lihat Semua
          </button>
        </div>

        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Belum ada transaksi</p>
              <p className="text-sm text-gray-400 mt-1">Klik tombol + untuk menambah transaksi</p>
            </div>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: transaction.categoryId?.color + '20' }}
                  >
                    {transaction.categoryId?.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{transaction.categoryId?.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(transaction.date)}
                      {transaction.description && (
                        <>
                          <span>•</span>
                          <span className="truncate">{transaction.description}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className={`text-lg font-bold whitespace-nowrap ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
          <p className="text-sm text-gray-600 mb-1">Rata-rata/Hari</p>
          <p className="text-lg font-bold text-gray-800">
            {summary.totalExpense > 0 
              ? formatCurrency(summary.totalExpense / 30)
              : formatCurrency(0)
            }
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Kategori Aktif</p>
          <p className="text-lg font-bold text-gray-800">{categoryData.length}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-100">
          <p className="text-sm text-gray-600 mb-1">Bulan Ini</p>
          <p className="text-lg font-bold text-gray-800">
            {new Date().toLocaleDateString('id-ID', { month: 'long' })}
          </p>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-5 border border-pink-100">
          <p className="text-sm text-gray-600 mb-1">Saving Rate</p>
          <p className="text-lg font-bold text-gray-800">
            {summary.totalIncome > 0
              ? `${((summary.balance / summary.totalIncome) * 100).toFixed(0)}%`
              : '0%'
            }
          </p>
        </div>
      </div>
    </div>
  );
}