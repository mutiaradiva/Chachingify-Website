// src/components/TransactionList.jsx - WITH EDIT BUTTON
import React from 'react';
import { Calendar, CreditCard, Trash2, Receipt, Edit2 } from 'lucide-react';
import { formatCurrency, formatDate, truncateText } from '../utils/helpers';
import { API_URL } from '../utils/api';

function TransactionItem({ transaction, onDelete, onEdit }) {
  const handleDelete = () => {
    if (window.confirm('Hapus transaksi ini?')) {
      onDelete(transaction._id);
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-sm"
            style={{ backgroundColor: transaction.categoryId?.color + '20' }}
          >
            {transaction.categoryId?.icon}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">
              {transaction.categoryId?.name || 'Unknown'}
            </p>
            
            {transaction.description && (
              <p className="text-sm text-gray-600 mt-0.5 truncate">
                {truncateText(transaction.description, 60)}
              </p>
            )}

            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(transaction.date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                {transaction.accountId?.name}
              </span>
            </div>

            {transaction.receipt && (
              <div className="mt-3">
                <img
                  src={`${API_URL.replace('/api', '')}${transaction.receipt}`}
                  alt="Receipt"
                  className="rounded-lg max-w-xs max-h-32 object-cover border-2 border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => window.open(`${API_URL.replace('/api', '')}${transaction.receipt}`, '_blank')}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 flex-shrink-0">
          <div className="text-right">
            <span className={`text-lg font-bold block ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {/* Edit Button */}
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition flex-shrink-0"
              title="Edit transaksi"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
              title="Hapus transaksi"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TransactionList({ transactions, onDelete, onEdit, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
        <h3 className="text-lg font-bold text-gray-800">Riwayat Transaksi</h3>
        <p className="text-sm text-gray-600 mt-1">
          {transactions.length} transaksi ditemukan
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium mb-2">Belum ada transaksi</p>
            <p className="text-sm text-gray-400">
              Klik tombol + untuk menambah transaksi pertama
            </p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <TransactionItem
              key={transaction._id}
              transaction={transaction}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}