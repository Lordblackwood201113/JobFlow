// LimeProject Design System Theme Configuration
export const theme = {
  colors: {
    background: {
      app: '#D8F26E',
      card: '#FFFFFF',
      tag: '#F3F4F6',
      input: '#FFFFFF'
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      light: '#9CA3AF',
      accent: '#D8F26E'
    },
    brand: {
      primary: '#D8F26E',
      secondary: '#8B5CF6',
      success: '#D8F26E',
      danger: '#EF4444'
    },
    status: {
      envoye: '#3B82F6',    // Blue
      entretien: '#8B5CF6',  // Purple
      refus: '#EF4444',      // Red
      offre: '#10B981'       // Green
    },
    ui: {
      borderSubtle: '#E5E7EB',
      toggleActive: '#8B5CF6',
      toggleInactive: '#E5E7EB',
      progressRing: '#8B5CF6'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    card: '24px',
    full: '9999px'
  },
  shadows: {
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    floating: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    sizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px'
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  }
};
