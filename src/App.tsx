import React, { useState, useEffect } from 'react';
import { LetterDocument, StudentProfile } from './types/letter';
import { storageService } from './services/storageService';
import { Sidebar, NavigationTab } from './components/layout/Sidebar';
import { HeaderMobile } from './components/layout/HeaderMobile';
import { DashboardView } from './components/dashboard/DashboardView';
import { LetterBuilderView } from './components/builder/LetterBuilderView';
import { SettingsView } from './components/settings/SettingsView';
import { AlertProvider } from './context/AlertContext';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('del_letter_theme') === 'dark';
  });

  const [letters, setLetters] = useState<LetterDocument[]>([]);
  const [profile, setProfile] = useState<StudentProfile>(() => storageService.getProfile());
  const [activeDocument, setActiveDocument] = useState<LetterDocument>(() =>
    storageService.getInitialLetter()
  );

  useEffect(() => {
    // Sinkronisasi data saat inisialisasi
    setLetters(storageService.getAllLetters());
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('del_letter_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('del_letter_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => setIsDarkMode((prev) => !prev);

  const handleRefreshLetters = () => {
    setLetters(storageService.getAllLetters());
  };

  const handleNavigateToBuilder = (docToEdit?: LetterDocument) => {
    if (docToEdit) {
      setActiveDocument(docToEdit);
    } else {
      setActiveDocument(storageService.getInitialLetter(profile));
    }
    setCurrentTab('builder');
  };

  const handleSaveToDashboard = (doc: LetterDocument) => {
    storageService.saveLetter(doc);
    handleRefreshLetters();
  };

  return (
    <AlertProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col lg:flex-row font-sans">
        {/* Sidebar Navigasi Desktop */}
        <div className="hidden lg:block">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
            letterCount={letters.length}
          />
        </div>

        {/* Header Navigasi Mobile / Tablet */}
        <HeaderMobile
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          letterCount={letters.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              letters={letters}
              onNavigateToBuilder={handleNavigateToBuilder}
              onNavigateToSettings={() => setCurrentTab('settings')}
              onRefreshLetters={handleRefreshLetters}
            />
          )}

          {currentTab === 'builder' && (
            <LetterBuilderView
              document={activeDocument}
              onUpdateDocument={setActiveDocument}
              onSaveToDashboard={handleSaveToDashboard}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={setProfile}
              onRefreshLetters={handleRefreshLetters}
            />
          )}
        </main>
      </div>
    </AlertProvider>
  );
};

export default App;
