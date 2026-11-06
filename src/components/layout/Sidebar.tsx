import React from 'react';
import {
  FileText,
  PlusCircle,
  Settings as SettingsIcon,
  Moon,
  Sun,
  GraduationCap,
} from 'lucide-react';

export type NavigationTab = 'dashboard' | 'builder' | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  letterCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  letterCount,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Riwayat',
      icon: FileText,
      badge: letterCount > 0 ? letterCount : undefined,
    },
    {
      id: 'builder',
      label: 'Buat Surat Baru',
      icon: PlusCircle,
    },
    {
      id: 'settings',
      label: 'Pengaturan Profil',
      icon: SettingsIcon,
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between p-4 h-screen sticky top-0 no-print select-none">
      <div className="space-y-6">
        {/* Brand / Logo SMA Unggul Del (Clean Solid Color) */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-del-700 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
              SMA Unggul Del
            </div>
            <div className="text-[11px] text-del-700 dark:text-del-400 font-semibold tracking-wider uppercase">
              Surat Izin Siswa
            </div>
          </div>
        </div>

        {/* Navigation Items with tactile motion */}
        <nav className="space-y-1.5" aria-label="Menu Utama">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                  isActive
                    ? 'bg-del-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-mono font-medium ${
                      isActive
                        ? 'bg-del-800 text-del-100'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & Theme Toggle */}
      <div className="pt-4 border-t border-slate-200/90 dark:border-slate-800 space-y-3">
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] transition-all"
        >
          <span className="flex items-center gap-2">
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-del-700" />}
            <span>{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            {isDarkMode ? 'Dark' : 'Light'}
          </span>
        </button>

        <div className="px-3 text-[10px] text-slate-400 leading-normal">
          Laguboti, Toba
        </div>
      </div>
    </aside>
  );
};
