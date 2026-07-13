// src/components/Alert.jsx — Animated alert/toast notification
import { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const variants = {
  success: { icon: FiCheckCircle, bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400' },
  error:   { icon: FiAlertCircle, bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400'   },
  info:    { icon: FiInfo,        bg: 'bg-primary-500/10', border: 'border-primary-500/30', text: 'text-primary-400' },
};

export default function Alert({ type = 'info', message, dismissible = false, onDismiss }) {
  const [visible, setVisible] = useState(true);
  const v = variants[type] || variants.info;
  const Icon = v.icon;

  const dismiss = () => { setVisible(false); onDismiss?.(); };

  if (!visible || !message) return null;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${v.bg} ${v.border} animate-fade-in`}>
      <Icon className={`${v.text} mt-0.5 flex-shrink-0 text-lg`} />
      <p className={`${v.text} text-sm flex-1`}>{message}</p>
      {dismissible && (
        <button onClick={dismiss} className={`${v.text} opacity-70 hover:opacity-100 transition-opacity`}>
          <FiX />
        </button>
      )}
    </div>
  );
}
