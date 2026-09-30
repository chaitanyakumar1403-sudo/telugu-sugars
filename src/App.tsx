import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/common/Header';
import MobileBottomNav from './components/common/MobileBottomNav';
import Footer from './components/common/Footer';
import ConsentBanner from './components/common/ConsentBanner';
import NewsletterModal from './components/common/NewsletterModal';
import SearchModal from './components/search/SearchModal';

// Pages
import HomePage from './pages/HomePage';
import StoriesIndexPage from './pages/StoriesIndexPage';
import StoryDetailPage from './pages/StoryDetailPage';
import WatchPage from './pages/WatchPage';
import TopicsPage from './pages/TopicsPage';
import TopicDetailPage from './pages/TopicDetailPage';
import ResearchPage from './pages/ResearchPage';
import FoodLabelsPage from './pages/FoodLabelsPage';
import EditorialStandardsPage from './pages/EditorialStandardsPage';

export function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

    if (currentPath === '/stories') {
      return (
        <StoriesIndexPage
          onSelectStory={(slug) => navigateTo(`/stories/${slug}`)}
        />
      );
    }

    if (currentPath.startsWith('/stories/')) {
      const slug = currentPath.replace('/stories/', '');
      return <StoryDetailPage slug={slug} onBack={() => navigateTo('/stories')} />;
    }

    if (currentPath.startsWith('/watch')) {
      const slug = currentPath.replace('/watch/', '').replace('/watch', '');
      return <WatchPage episodeSlug={slug || undefined} />;
    }

    if (currentPath === '/topics') {
      return (
        <TopicsPage
          onSelectTopic={(slug) => navigateTo(`/topics/${slug}`)}
        />
      );
    }

    if (currentPath.startsWith('/topics/')) {
      const slug = currentPath.replace('/topics/', '');
      return <TopicDetailPage slug={slug} onNavigate={navigateTo} />;
    }

    if (currentPath.startsWith('/research')) {
      return <ResearchPage />;
    }

    if (currentPath.startsWith('/food-labels')) {
      return <FoodLabelsPage />;
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
      className="min-h-screen flex flex-col justify-between bg-[#08090b] text-[#f8fafc]"
    >
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Global Sticky Header */}
      <Header
        activePath={currentPath}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
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

      {/* Global Overlays: Search & Newsletter & Privacy Consent */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigateTo}
      />

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
