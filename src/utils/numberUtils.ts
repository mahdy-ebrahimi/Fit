/**
 * Utility for converting Persian and Arabic digits and decimal separators
 * to standard ASCII digits and period.
 */
export function normalizePersianDigits(input: string): string {
  if (!input) return '';
  const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicDigits = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

  let normalized = String(input).replace(/[٫,/]/g, '.');
  for (let i = 0; i < 10; i++) {
    normalized = normalized
      .replace(persianDigits[i], String(i))
      .replace(arabicDigits[i], String(i));
  }

  // Keep only digits and dot
  normalized = normalized.replace(/[^\d.]/g, '');
  const parts = normalized.split('.');
  if (parts.length > 2) {
    normalized = parts[0] + '.' + parts.slice(1).join('');
  }
  return normalized;
}
