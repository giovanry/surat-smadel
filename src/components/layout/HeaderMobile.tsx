import React, { useState } from 'react';
import { NavigationTab } from './Sidebar';
import {
  Menu,
  X,
  GraduationCap,
  FileText,
  PlusCircle,
  Settings as SettingsIcon,
  Moon,
  Sun,
} from 'lucide-react';

interface HeaderMobileProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  letterCount: number;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  letterCount,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleNav = (tab: NavigationTab) => {
    onSelectTab(tab);
    setIsOpen(false);
  };

  return (
    <header className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-40 no-print">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-del-700 text-white flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-xs tracking-tight">
              SMA Unggul Del
            </div>
            <div className="text-[10px] text-del-700 dark:text-del-400 font-semibold uppercase">
              Surat Izin Siswa
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Buka navigasi mobile"
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Drawer Menu */}
      {isOpen && (
        <div className="pt-4 pb-2 space-y-2 border-t border-slate-100 dark:border-slate-800 mt-3 animate-fade-in">
          <button
            type="button"
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold ${
              currentTab === 'dashboard'
                ? 'bg-del-700 text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" /> Dashboard Riwayat
            </span>
            {letterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {letterCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNav('builder')}
            className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold ${
              currentTab === 'builder'
                ? 'bg-del-700 text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Buat Surat Baru
          </button>

          <button
            type="button"
            onClick={() => handleNav('settings')}
            className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold ${
              currentTab === 'settings'
                ? 'bg-del-700 text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <SettingsIcon className="w-4 h-4" /> Pengaturan Profil
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="flex items-center gap-2">
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-del-700" />}
              <span>{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
            </span>
          </button>
        </div>
      )}
    </header>
  );
};

