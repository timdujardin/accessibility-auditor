export const SEMANTIC_COLORS = {
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#C62828',
  info: '#0288D1',
  neutral: '#9E9E9E',
  primary: '#1976d2',
  secondary: '#9c27b0',
} as const;

export type SemanticColor = keyof typeof SEMANTIC_COLORS;

type MuiColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const MUI_COLOR_MAP: Record<SemanticColor, MuiColor> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  neutral: 'default',
  primary: 'primary',
  secondary: 'secondary',
};

/**
 * Converts a semantic color key to its corresponding MUI palette color name.
 * @param {SemanticColor} semantic - The semantic color key.
 * @returns {MuiColor} The MUI palette color name.
 */
export const toMuiColor = (semantic: SemanticColor): MuiColor => MUI_COLOR_MAP[semantic];

const CONFORMANCE_RED_THRESHOLD = 50;
const CONFORMANCE_ORANGE_THRESHOLD = 75;

/**
 * Maps a conformance percentage to a semantic color hex value.
 * <50% → error (red), >=50% & <75% → warning (orange), >=75% → success (green).
 * @param {number} percentage - The conformance percentage (0–100).
 * @returns {string} The corresponding hex color from SEMANTIC_COLORS.
 */
export const getConformanceColor = (percentage: number): string => {
  if (percentage < CONFORMANCE_RED_THRESHOLD) {
    return SEMANTIC_COLORS.error;
  }
  if (percentage < CONFORMANCE_ORANGE_THRESHOLD) {
    return SEMANTIC_COLORS.warning;
  }

  return SEMANTIC_COLORS.success;
};

/**
 * Maps a conformance percentage to a MUI theme palette path.
 * <50% → 'error.main', >=50% & <75% → 'warning.main', >=75% → 'success.main'.
 * @param {number} percentage - The conformance percentage (0–100).
 * @returns {string} The MUI palette path (e.g. 'success.main').
 */
export const getConformanceMuiColor = (percentage: number): string => {
  if (percentage < CONFORMANCE_RED_THRESHOLD) {
    return 'error.main';
  }
  if (percentage < CONFORMANCE_ORANGE_THRESHOLD) {
    return 'warning.main';
  }

  return 'success.main';
};
