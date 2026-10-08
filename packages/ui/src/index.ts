/**
 * GrowPak Store - Shared UI Design Tokens
 */

export const DESIGN_TOKENS = {
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d', // Brand Forest Green
      800: '#166534',
      900: '#14532d',
    },
    earth: {
      50: '#fdfbf7',
      100: '#f7f2ea',
      200: '#ede2d3',
      300: '#decbb4',
      400: '#cbb092',
      500: '#b99573',
      600: '#aa7e5e',
      700: '#8d644d',
      800: '#735241',
      900: '#5f4337',
    },
    accent: {
      gold: '#f59e0b',
      amber: '#d97706',
      whatsapp: '#25D366',
    },
  },
  typography: {
    fontFamilyEn: 'Inter, system-ui, -apple-system, sans-serif',
    fontFamilyUr: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Urdu Typesetting', serif",
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
} as const;
