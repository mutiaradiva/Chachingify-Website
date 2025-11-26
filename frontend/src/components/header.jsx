// src/components/Header.jsx - WITH NAVBAR INTEGRATED
import React from 'react';
import { Wallet, LogOut, LayoutDashboard, Receipt, PieChart, Target } from 'lucide-react';

export function Header({ user, onLogout, activeTab, onTabChange }) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'transactions', icon: Receipt, label: 'Transaksi' },
    { id: 'budget', icon: PieChart, label: 'Budget' },
    { id: 'goals', icon: Target, label: 'Tabungan' }
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">ChaChingify</h1>
              <p className="text-xs text-white/80">
                Halo, <span className="font-semibold">{user?.name || 'User'}</span>! 👋
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-white/20 backdrop-blur-sm shadow-md'
                    : 'hover:bg-white/10'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition backdrop-blur-sm"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-1 mt-3 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-white/20 backdrop-blur-sm shadow-md'
                  : 'hover:bg-white/10'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}