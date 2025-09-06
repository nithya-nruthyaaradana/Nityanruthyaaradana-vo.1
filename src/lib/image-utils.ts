
// This file is now simplified as image sources are managed directly in Firestore.
// The functions for providing fallbacks and placeholders are retained for robustness.

// Function to get a generic placeholder image URL
export function getPlaceholderImage(width: number = 600, height: number = 400): string {
  return `https://placehold.co/${width}x${height}/8B0000/FFFFFF?text=Image`;
}

// Function to get fallback URLs using placeholders
export function getFallbackUrls(category?: string): string[] {
  // Use different dimensions for variety if needed, or keep them consistent.
  return [
    getPlaceholderImage(600, 400),
    getPlaceholderImage(400, 600),
    getPlaceholderImage(800, 600),
  ];
}

// Function to validate an image URL
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}
