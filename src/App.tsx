import { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Header from './components/common/Header';
import MobileBottomNav from './components/common/MobileBottomNav';
import Footer from './components/common/Footer';
import ConsentBanner from './components/common/ConsentBanner';
import NewsletterModal from './components/common/NewsletterModal';
import WelcomeGreeting from './components/common/WelcomeGreeting';
import CursorRing from './components/common/CursorRing';

// Pages
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import ComingSoonPage from './pages/ComingSoonPage';
import FoodLabelsPage from './pages/FoodLabelsPage';
import EditorialStandardsPage from './pages/EditorialStandardsPage';
import AtlasPage from './pages/AtlasPage';

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

  // Fade sections in as they scroll into view; re-scan whenever the page changes
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target))),
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [currentPath]);

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
      return <ComingSoonPage title={t('nav_research')} />;
    }

    if (currentPath.startsWith('/food-labels')) {
      return <FoodLabelsPage />;
    }

    if (currentPath === '/atlas') {
      return <AtlasPage />;
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
        Skip to main content
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

      {/* Mobile Sticky Bottom Navigation (48px tap targets) */}
      <MobileBottomNav activePath={currentPath} onNavigate={navigateTo} />

      <WelcomeGreeting />

      <CursorRing />

      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />

      <ConsentBanner />
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
