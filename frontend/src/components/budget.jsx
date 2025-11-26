// src/components/Budget.jsx
import React from 'react';
import { PieChart, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency, calculatePercentage } from '../utils/helpers';

export function Budget({ categoryData, summary }) {
  // Calculate budget per category (example: 30% of total income)
  const totalBudget = summary.totalIncome * 0.7; // 70% for expenses
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Budget Bulanan</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total budget: {formatCurrency(totalBudget)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Terpakai</p>
            <p className="text-2xl font-bold text-gray-800">
              {summary.totalIncome > 0 
                ? `${((summary.totalExpense / totalBudget) * 100).toFixed(0)}%`
                : '0%'
              }
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress Total</span>
            <span className="text-sm text-gray-600">
              {formatCurrency(summary.totalExpense)} / {formatCurrency(totalBudget)}
            </span>
          </div>
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                (summary.totalExpense / totalBudget) * 100 > 90
                  ? 'bg-gradient-to-r from-red-400 to-pink-500'
                  : (summary.totalExpense / totalBudget) * 100 > 70
                  ? 'bg-gradient-to-r from-orange-400 to-amber-500'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-500'
              }`}
              style={{ width: `${Math.min((summary.totalExpense / totalBudget) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Category Budgets */}
        <h3 className="text-lg font-bold text-gray-800 mb-4">Budget per Kategori</h3>
        <div className="space-y-4">
          {categoryData.length === 0 ? (
            <div className="text-center py-8">
              <PieChart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Belum ada data pengeluaran</p>
            </div>
          ) : (
            categoryData.map((cat, idx) => {
              const categoryBudget = totalBudget * 0.2; // 20% per kategori (example)
              const percentage = (cat.total / categoryBudget) * 100;
              const isOverBudget = percentage > 100;
              
              return (
                <div key={idx} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{cat.name}</p>
                        <p className="text-xs text-gray-500">{cat.count} transaksi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-800'}`}>
                        {formatCurrency(cat.total)}
                      </p>
                      <p className="text-xs text-gray-500">
                        dari {formatCurrency(categoryBudget)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverBudget
                          ? 'bg-gradient-to-r from-red-400 to-pink-500'
                          : percentage > 80
                          ? 'bg-gradient-to-r from-orange-400 to-amber-500'
                          : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  
                  {isOverBudget && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>Melebihi budget {(percentage - 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}