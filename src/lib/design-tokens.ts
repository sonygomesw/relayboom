// Design Tokens Apple-Style
// Système de design cohérent pour ClipTokk

export const designTokens = {
  // Palette minimaliste Apple
  colors: {
    // Texte principal
    text: {
      primary: '#1D1D1F',      // Noir très prononcé
      secondary: '#424245',    // Gris foncé (menu/nav)
      muted: '#6E6E73',       // Gris moyen pour texte secondaire
      inverse: '#FFFFFF',      // Blanc pour texte sur fond sombre
    },
    
    // Arrière-plans
    background: {
      primary: '#FFFFFF',      // Blanc pur
      secondary: '#F5F5F7',    // Blanc cassé
      tertiary: '#E6E6E6',     // Gris clair
      dark: '#424245',         // Gris foncé pour nav/menu
    },
    
    // Accents - seulement bleu et orange
    accent: {
      primary: '#0066CC',      // Bleu vif (liens et boutons)
      secondary: '#F56300',    // Orange ponctuel (étiquettes "Nouveau")
    },
    
    // États des boutons
    button: {
      primary: '#0066CC',
      primaryHover: '#0052A3',
      primaryActive: '#004080',
      secondary: '#F5F5F7',
      secondaryHover: '#E6E6E6',
      secondaryActive: '#D1D1D6',
    },
    
    // Bordures
    border: {
      light: '#E6E6E6',
      medium: '#D1D1D6',
      dark: '#424245',
    },
    
    // États
    success: '#0066CC',        // Utiliser le bleu au lieu du vert
    warning: '#F56300',        // Orange pour les alertes
    error: '#FF3B30',          // Rouge Apple pour les erreurs
    info: '#0066CC',           // Bleu pour les infos
  },
  
  // Typography - Apple style
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      mono: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },
  
  // Spacing - Apple's generous spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
    '5xl': '8rem',    // 128px
  },
  
  // Border radius
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  // Shadows - Apple's subtle shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(29, 29, 31, 0.05)',
    md: '0 4px 6px -1px rgba(29, 29, 31, 0.1), 0 2px 4px -1px rgba(29, 29, 31, 0.06)',
    lg: '0 10px 15px -3px rgba(29, 29, 31, 0.1), 0 4px 6px -2px rgba(29, 29, 31, 0.05)',
    xl: '0 20px 25px -5px rgba(29, 29, 31, 0.1), 0 10px 10px -5px rgba(29, 29, 31, 0.04)',
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease-out',
    normal: '250ms ease-out',
    slow: '350ms ease-out',
  },
}

// Utilitaires pour appliquer les tokens
export const applyTokens = {
  // Classes pour les cartes Apple-style
  card: {
    base: 'bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-250',
    rounded: 'rounded-xl',
    padding: 'p-6',
  },
  
  // Classes pour les boutons Apple-style
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-150',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition-all duration-150',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-all duration-150',
    rounded: 'rounded-lg',
    padding: 'px-4 py-2.5',
  },

  // Classes pour les inputs Apple-style
  input: {
    base: 'border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-150',
    rounded: 'rounded-lg',
    padding: 'px-4 py-3',
  },

  // Classes pour la typographie
  text: {
    heading: 'font-semibold text-gray-900 tracking-tight',
    body: 'text-gray-600 leading-relaxed',
    caption: 'text-gray-500 text-sm',
  }
}

export default designTokens 