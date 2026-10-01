/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { AdminPage } from './pages/admin/AdminPage';

type Route = 'home' | 'admin';

function getInitialRoute(): Route {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || hash === '#/admin' || hash.startsWith('#/admin')) {
    return 'admin';
  }
  return 'home';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>(getInitialRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(getInitialRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: Route) => {
    setCurrentRoute(route);
    if (route === 'admin') {
      window.history.pushState({ route: 'admin' }, '', '#/admin');
    } else {
      window.history.pushState({ route: 'home' }, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentRoute === 'admin') {
    return <AdminPage onNavigateToHome={() => navigateTo('home')} />;
  }

  return <Home onNavigateToAdmin={() => navigateTo('admin')} />;
}

