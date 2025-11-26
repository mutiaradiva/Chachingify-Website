import React, { useState, useEffect } from "react";
import { TrendingUp, Target, Plus, Trash2, X, Edit2 } from "lucide-react";

// Format currency helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Icon options for goals
const iconOptions = ["🏖️", "🛡️", "🏠", "🚗", "💍", "🎓", "💰", "✈️", "🎯", "🎁"];

function GoalModal({ isOpen, onClose, onSave, editGoal }) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
    icon: "🎯",
  });

  useEffect(() => {
    if (editGoal) {
      setFormData({
        name: editGoal.name,
        targetAmount: editGoal.targetAmount.toString(),
        currentAmount: editGoal.currentAmount.toString(),
        deadline: editGoal.deadline.split("T")[0],
        icon: editGoal.icon,
      });
    } else {
      setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "0",
        deadline: "",
        icon: "🎯",
      });
    }
  }, [editGoal, isOpen]);

  const handleSubmit = () => {
    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      alert("Mohon isi semua field yang diperlukan");
      return;
    }

    onSave({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount || 0),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between rounded-t-3xl">
          <h3 className="text-xl font-bold text-gray-800">
            {editGoal ? "Edit Tujuan" : "Tambah Tujuan Baru"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Icon</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-12 h-12 text-2xl rounded-xl border-2 transition ${
                    formData.icon === icon
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Tujuan</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Misal: Liburan ke Bali"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Jumlah</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              placeholder="10000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Current Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Saat Ini</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={formData.currentAmount}
              onChange={(e) =>
                setFormData({ ...formData, currentAmount: e.target.value })
              }
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Tanggal</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition font-medium shadow-lg"
            >
              {editGoal ? "Update" : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // ====== LOAD LOCAL STORAGE ======
  useEffect(() => {
    const saved = localStorage.getItem("financial_goals");
    if (saved) setGoals(JSON.parse(saved));
  }, []);

  // ====== SAVE TO LOCAL STORAGE ======
  useEffect(() => {
    localStorage.setItem("financial_goals", JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = () => {
    setEditingGoal(null);
    setShowModal(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowModal(true);
  };

  const handleSaveGoal = (goalData) => {
    if (editingGoal) {
      // Update existing
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoal.id ? { ...g, ...goalData } : g
        )
      );
    } else {
      // Add new
      const newGoal = {
        id: Date.now(),
        ...goalData,
        createdAt: new Date(),
      };
      setGoals((prev) => [...prev, newGoal]);
    }
    setShowModal(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id) => {
    if (confirm("Yakin ingin menghapus tujuan ini?")) {
      setGoals(goals.filter((g) => g.id !== id));
    }
  };

  const calculateMonthsRemaining = (deadline) => {
    const now = new Date();
    const target = new Date(deadline);
    const months =
      (target.getFullYear() - now.getFullYear()) * 12 +
      (target.getMonth() - now.getMonth());
    return Math.max(months, 0);
  };

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-800">Tujuan Keuangan</h2>
          </div>

          <button
            onClick={handleAddGoal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Tambah Tujuan</span>
          </button>
        </div>

        {/* No goals */}
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada tujuan keuangan</p>
            <p className="text-sm text-gray-400 mt-1">
              Klik tombol di atas untuk membuat tujuan pertamamu!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const progress =
                goal.targetAmount > 0
                  ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
                  : 0;
              const remaining = Math.max(
                goal.targetAmount - goal.currentAmount,
                0
              );
              const monthsLeft = calculateMonthsRemaining(goal.deadline);

              return (
                <div
                  key={goal.id}
                  className="border-2 border-gray-100 rounded-2xl p-5 hover:border-teal-200 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{goal.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-800">{goal.name}</h3>
                        <p className="text-xs text-gray-500">{monthsLeft} bulan</p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      {formatCurrency(goal.currentAmount)}
                    </span>
                    <span className="font-bold text-teal-600">
                      {progress.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Target: {formatCurrency(goal.targetAmount)}</span>
                    {remaining > 0 && (
                      <span className="text-orange-600">
                        Kurang {formatCurrency(remaining)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <GoalModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        editGoal={editingGoal}
      />
    </div>
  );
}
