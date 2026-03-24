import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-6 rounded-3xl luxury-border shadow-sm hover:shadow-lg transition-all duration-300 group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend.value}
        </div>
      )}
    </div>
    <h3 className="text-base font-medium text-slate-500 mb-1">{title}</h3>
    <p className="text-3xl font-bold text-slate-900 font-serif">{value}</p>
  </motion.div>
);
