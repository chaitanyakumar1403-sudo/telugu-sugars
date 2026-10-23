import { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import NewsletterModal from './components/common/NewsletterModal';

// Pages
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import ComingSoonPage from './pages/ComingSoonPage';
import FoodLabelsPage from './pages/FoodLabelsPage';
import EditorialStandardsPage from './pages/EditorialStandardsPage';
import AtlasPage from './pages/AtlasPage';
import CreatorsPage from './pages/CreatorsPage';
import FounderPage from './pages/FounderPage';

export function AppContent() {
  const { t } = useLanguage();
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  // Initialize path from window.location and sync with popstate
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialPath = window.location.pathname || '/';
      setCurrentPath(initialPath);

      const handlePopState = () => {
        setCurrentPath(window.location.pathname || '/');
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render appropriate view based on current path
  const renderCurrentView = () => {
    if (currentPath === '/') {
      return <HomePage onNavigate={navigateTo} />;
    }

    if (currentPath.startsWith('/watch')) {
      return <WatchPage />;
    }

    if (currentPath.startsWith('/research')) {
      return <ComingSoonPage title={t('nav_research')} onNavigate={navigateTo} />;
    }

    if (currentPath.startsWith('/food-labels')) {
      return <FoodLabelsPage />;
    }

    if (currentPath === '/atlas') {
      return <AtlasPage />;
    }

    if (currentPath === '/founder') {
      return <FounderPage onNavigate={navigateTo} />;
    }

    if (currentPath === '/creators') {
      return <CreatorsPage />;
    }

    if (currentPath === '/about/editorial-standards') {
      return <EditorialStandardsPage />;
    }

    // Default Fallback
    return <HomePage onNavigate={navigateTo} />;
  };

  return (
    <div
      id="app"
      data-testid="telugusugars-root"
      className="min-h-screen flex flex-col justify-between bg-(--bg-obsidian) text-white"
    >
      <a href="#main-content" className="skip-link">
        {t('skip_main')}
      </a>

      {/* Global Sticky Header */}
      <Header
        activePath={currentPath}
        onNavigate={navigateTo}
      />

      {/* Main Content Landmark */}
      <main id="main-content" className="flex-grow">
        {renderCurrentView()}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenNewsletter={() => setIsNewsletterOpen(true)}
      />


      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
