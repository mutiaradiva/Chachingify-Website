import React, { useState } from 'react';
import { X, Upload, DollarSign } from 'lucide-react';
import { transactionsAPI } from '../utils/api';
import { getTodayDate, formatFileSize } from '../utils/helpers';

export function AddTransactionModal({ 
  isOpen, 
  onClose, 
  categories, 
  accounts, 
  onSuccess 
}) {
  const [formData, setFormData] = useState({
    type: 'expense',
    categoryId: '',
    accountId: '',
    amount: '',
    description: '',
    date: getTodayDate(),
    receipt: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Jumlah harus lebih dari 0');
      return false;
    }
    if (!formData.categoryId) {
      setError('Pilih kategori');
      return false;
    }
    if (!formData.accountId) {
      setError('Pilih akun');
      return false;
    }
    if (!formData.date) {
      setError('Pilih tanggal');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setError('');
    setLoading(true);

    try {
      await transactionsAPI.create(formData);
      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      categoryId: '',
      accountId: '',
      amount: '',
      description: '',
      date: getTodayDate(),
      receipt: null
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return;
      }
      setFormData({ ...formData, receipt: file });
    }
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter(c => c.type === formData.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Tambah Transaksi</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFormData({ ...formData, type: 'expense', categoryId: '' })}
              className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                formData.type === 'expense'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pengeluaran
            </button>
            <button
              onClick={() => setFormData({ ...formData, type: 'income', categoryId: '' })}
              className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                formData.type === 'income'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pemasukan
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="0"
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Pilih kategori</option>
              {filteredCategories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Akun <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Pilih akun</option>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} - Saldo: Rp {acc.balance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              max={getTodayDate()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan (Opsional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              rows="3"
              placeholder="Contoh: Makan siang di warteg..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Bukti (Opsional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-600 transition">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                {formData.receipt ? (
                  <div className="text-sm">
                    <p className="text-gray-700 font-medium">{formData.receipt.name}</p>
                    <p className="text-gray-500">{formatFileSize(formData.receipt.size)}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Klik untuk upload foto struk
                    <span className="block text-xs text-gray-400 mt-1">
                      Format: JPG, PNG, PDF (Max 5MB)
                    </span>
                  </p>
                )}
              </label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </span>
            ) : (
              'Simpan Transaksi'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}