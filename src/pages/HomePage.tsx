import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NAV_PAGES } from '../data/pagesData';
import { PageNavCarousel } from '../components/navigation/PageNavCarousel';
import { PageNavBackground } from '../components/navigation/PageNavBackground';

export const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSlug = searchParams.get('p') || undefined;

  const [activePageIndex, setActivePageIndex] = useState<number>(() => {
    if (initialSlug) {
      const idx = NAV_PAGES.findIndex(p => p.slug === initialSlug);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const currentPage = NAV_PAGES[activePageIndex] || NAV_PAGES[0];

  useEffect(() => {
    document.title = `${currentPage.title} — ant1po1e`;
  }, [currentPage]);

  return (
    <div id="home-navigation-page" className="relative w-full h-screen overflow-hidden bg-transparent">
      {/* Immersive Dynamic Backdrop */}
      <PageNavBackground currentPage={currentPage} />

      {/* Main 3D Interactive Carousel */}
      <PageNavCarousel
        pages={NAV_PAGES}
        initialSlug={initialSlug}
        onIndexChange={(index) => setActivePageIndex(index)}
      />
    </div>
  );
};
