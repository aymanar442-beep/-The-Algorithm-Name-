export function encodeToZeroWidth(secret: string): string {
  if (!secret) return '';
  return secret.split('').map(char => {
    const binary = char.charCodeAt(0).toString(2).padStart(16, '0');
    return binary.split('').map(bit => bit === '1' ? '\u200C' : '\u200B').join('');
  }).join('\u200D');
}

export function injectHiddenPayload(visibleText: string, hiddenPayload: string): string {
  if (!hiddenPayload) return visibleText;
  const encodedHidden = encodeToZeroWidth(hiddenPayload);
  
  // Inject the hidden payload right after the first character of the visible text
  // so it's safely embedded but completely invisible.
  if (visibleText.length > 0) {
    return visibleText.charAt(0) + encodedHidden + visibleText.slice(1);
  }
  return encodedHidden;
}
