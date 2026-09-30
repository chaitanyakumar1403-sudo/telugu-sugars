import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Home, Film, Compass, Sparkles, BookOpen } from 'lucide-react';

interface MobileBottomNavProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activePath, onNavigate }) => {
  const { t } = useLanguage();

  const navTabs = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/stories', labelKey: 'nav_stories', icon: BookOpen },
    { path: '/watch', labelKey: 'nav_watch', icon: Film },
    { path: '/research', labelKey: 'nav_research', icon: Compass },
    { path: '/food-labels', labelKey: 'nav_food_labels', icon: Sparkles },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#08090b]/92 backdrop-blur-xl border-t border-white/10 px-2 py-1 shadow-2xl"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.path === '/'
              ? activePath === '/'
              : activePath === tab.path || activePath.startsWith(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => onNavigate(tab.path)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 px-1 rounded-xl transition-all ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={tab.label || (tab.labelKey ? t(tab.labelKey) : '')}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-amber-500/20 scale-110' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-medium truncate max-w-[64px]">
                {tab.label || (tab.labelKey ? t(tab.labelKey) : '')}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
