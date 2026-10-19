import { useState, useEffect, useCallback } from 'react';

export type AppRoute = 'home' | 'admin' | 'order';

export function usePageRouter() {
  const getRouteFromLocation = (): AppRoute => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (path === '/admin' || hash === '#admin') {
      return 'admin';
    }
    if (path === '/pesan' || path === '/order' || hash === '#pesan' || hash === '#order') {
      return 'order';
    }
    return 'home';
  };

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getRouteFromLocation);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getRouteFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = useCallback((route: AppRoute) => {
    let url = '/';
    if (route === 'admin') url = '/admin';
    if (route === 'order') url = '/pesan';

    window.history.pushState({}, '', url);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { currentRoute, navigateTo };
}
