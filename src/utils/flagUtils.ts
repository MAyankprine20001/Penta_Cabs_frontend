/**
 * Converts ISO country code to flag emoji
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., "IN", "US")
 * @returns Flag emoji string
 */
export const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

/**
 * Gets flag image URL from a CDN
 * @param isoCode - ISO 3166-1 alpha-2 country code
 * @param size - Flag width in pixels (default: 40)
 * @returns Flag image URL
 */
export const getImageFlag = (isoCode: string, size: number = 40): string => {
  const code = isoCode.toLowerCase();
  // flagcdn.com supports sizes: 20, 40, 80, 160, 320, 640
  // Round to nearest supported size
  let validSize = 40;
  if (size <= 20) validSize = 20;
  else if (size <= 40) validSize = 40;
  else if (size <= 80) validSize = 80;
  else if (size <= 160) validSize = 160;
  else validSize = 320;
  
  return `https://flagcdn.com/w${validSize}/${code}.png`;
};

/**
 * Gets flag image URL from a CDN (alias for getImageFlag)
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @param size - Flag size (16, 24, 32, 48, 64)
 * @returns Flag image URL
 */
export const getFlagImageUrl = (
  countryCode: string,
  size: number = 32
): string => {
  return getImageFlag(countryCode, size);
};
