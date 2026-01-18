"use client";

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PageTransitionContextType {
  isTransitioning: boolean;
  transitionToPage: (href: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionToPage = useCallback((href: string) => {
    // Start transition
    setIsTransitioning(true);

    // Wait for fade out, then scroll and navigate
    setTimeout(() => {
      // Reset scroll during black screen
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Navigate after scroll reset
      router.push(href);

      // Keep overlay longer to hide page mounting
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600); // Increased delay to fully hide new page load
    }, 400); // Increased fade out duration
  }, [router]);

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, transitionToPage }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (context === undefined) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
}
