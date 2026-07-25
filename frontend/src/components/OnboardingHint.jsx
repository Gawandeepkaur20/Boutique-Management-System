import { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';

export default function OnboardingHint({ id, children }) {
  const key = `hint-dismissed-${id}`;
  const [visible, setVisible] = useState(() => !localStorage.getItem(key));

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(key, '1');
    setVisible(false);
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
      <Lightbulb className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm text-primary-900 dark:text-primary-100">{children}</div>
      <button onClick={dismiss} className="text-primary-600 hover:text-primary-800" aria-label="Dismiss">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
