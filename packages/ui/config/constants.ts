export const breakpoints = {
  sm: 720, // ThinkPad Portrait
  md: 1080,
  lg: 1280, // ThinkPad Landscape
  xl: 1360,
  xxl: 1920, // desktop
};

export const mediaQueries = {
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  xxl: `(min-width: ${breakpoints.xxl}px)`,
  'max-sm': `(max-width: ${breakpoints.sm - 1}px)`,
  'max-md': `(max-width: ${breakpoints.md - 1}px)`,
  'max-lg': `(max-width: ${breakpoints.lg - 1}px)`,
  'max-xl': `(max-width: ${breakpoints.xl - 1}px)`,
  'max-xxl': `(max-width: ${breakpoints.xxl - 1}px)`,
};

export const gridGap = 18;
