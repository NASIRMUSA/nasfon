/**
 * Sanitizes a string to prevent XSS attacks by stripping script tags and other HTML.
 * @param str The string to sanitize
 * @returns The sanitized string
 */
export const sanitizeInput = (str: string): string => {
  if (typeof str !== 'string') return '';
  
  // Strip script tags completely and their contents
  let sanitized = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Strip any other HTML tags but keep the text
  sanitized = sanitized.replace(/<\/?[^>]+(>|$)/g, "");
  
  return sanitized.trim();
};
