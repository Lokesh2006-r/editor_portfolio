export type Theme = 'night';

const THEME_STORAGE_KEY = 'kaien_portfolio_theme_v4';

export const themeManager = {
  getTheme(): Theme {
    return 'night';
  },

  setTheme(_theme: Theme): void {
    localStorage.setItem(THEME_STORAGE_KEY, 'night');
    this.applyTheme('night');
  },

  toggleTheme(): Theme {
    this.applyTheme('night');
    return 'night';
  },

  applyTheme(_theme?: Theme): void {
    const root = document.documentElement;
    root.classList.remove('theme-ios', 'theme-aurora', 'theme-emerald', 'theme-sunset', 'theme-light', 'light');
    root.classList.add('theme-night', 'dark');
    root.setAttribute('data-theme', 'night');
    root.style.colorScheme = 'dark';
  },

  init(): Theme {
    this.applyTheme('night');
    return 'night';
  },
};

