export type NavFontKey = 'grotesk' | 'sans' | 'outfit' | 'display' | 'mono';
export type NavCasingKey = 'normal' | 'uppercase';

export interface NavFontOption {
  id: NavFontKey;
  name: string;
  sub: string;
  cssClass: string;
}

export const NAV_FONT_OPTIONS: NavFontOption[] = [
  { id: 'grotesk', name: 'Space Grotesk', sub: 'Geometric & Modern', cssClass: 'font-grotesk' },
  { id: 'sans', name: 'Plus Jakarta Sans', sub: 'Clean & Editorial', cssClass: 'font-sans' },
  { id: 'outfit', name: 'Outfit Modern', sub: 'Contemporary Minimal', cssClass: 'font-outfit' },
  { id: 'display', name: 'Syne Display', sub: 'Cinematic Avant-Garde', cssClass: 'font-display' },
  { id: 'mono', name: 'JetBrains Mono', sub: 'Technical Timeline Code', cssClass: 'font-mono' },
];

export const navFontManager = {
  getFont(): NavFontKey {
    try {
      const saved = localStorage.getItem('kaien_navbar_font');
      if (saved && NAV_FONT_OPTIONS.some((o) => o.id === saved)) {
        return saved as NavFontKey;
      }
    } catch (e) {
      // fallback
    }
    return 'grotesk';
  },

  setFont(font: NavFontKey) {
    try {
      localStorage.setItem('kaien_navbar_font', font);
      window.dispatchEvent(new CustomEvent('navbar_font_changed', { detail: { font } }));
    } catch (e) {
      // fallback
    }
  },

  getCasing(): NavCasingKey {
    try {
      const saved = localStorage.getItem('kaien_navbar_casing');
      if (saved === 'uppercase' || saved === 'normal') {
        return saved as NavCasingKey;
      }
    } catch (e) {
      // fallback
    }
    return 'normal';
  },

  setCasing(casing: NavCasingKey) {
    try {
      localStorage.setItem('kaien_navbar_casing', casing);
      window.dispatchEvent(new CustomEvent('navbar_casing_changed', { detail: { casing } }));
    } catch (e) {
      // fallback
    }
  },
};
