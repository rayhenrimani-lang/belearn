export const colors = {
  // Primary colors
  primary: '#6B46C1',
  primaryDark: '#553C9A',
  primaryLight: '#9333EA',
  
  // Secondary colors
  secondary: '#EC4899',
  accent: '#8B5CF6',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',
  
  // Text colors
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textMuted: '#9CA3AF',
  textWhite: '#FFFFFF',

  surface: '#FFFFFF',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  
  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Category colors
  categories: {
    development: '#6B46C1',
    design: '#EC4899', 
    marketing: '#10B981',
    ai: '#3B82F6',
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: colors.text,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '500' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textTertiary,
  },
};

export const cardShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 3.84,
  elevation: 5,
};

export const softShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 2,
};
