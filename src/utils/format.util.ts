/**
 * Formats a date string or Date object as a localized date string.
 * @param {string | Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (date: string | Date): string => new Date(date).toLocaleDateString();

/**
 * Returns the value if truthy, otherwise returns a fallback (default: em dash).
 * @param {string | null | undefined} value - The value to display.
 * @param {string} [fallback='—'] - The fallback string.
 * @returns {string} The value or the fallback.
 */
export const displayValue = (value: string | null | undefined, fallback = '—'): string => value || fallback;

/**
 * Returns a count with a properly pluralized label.
 * @param {number} count - The number of items.
 * @param {string} singular - The singular form of the noun.
 * @param {string} [plural] - The plural form (defaults to singular + 's').
 * @returns {string} The formatted string, e.g. "1 issue" or "3 elements".
 */
export const pluralize = (count: number, singular: string, plural?: string): string =>
  `${count} ${count === 1 ? singular : (plural ?? singular + 's')}`;

/**
 * Converts a string to a URL-friendly slug (lowercase, hyphens).
 * @param {string} text - The text to slugify.
 * @returns {string} The slugified string.
 */
export const slugify = (text: string): string => text.replace(/\s+/g, '-').toLowerCase();

/**
 * Converts a snake_case or underscore-separated string to a human-readable form.
 * @param {string} text - The text to humanize (e.g. "native_app").
 * @returns {string} The humanized string (e.g. "Native app").
 */
export const humanize = (text: string): string => {
  const spaced = text.replace(/_/g, ' ');

  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};
