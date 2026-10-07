/**
 * Asset Manager for Gord Character & Logo
 * Caches custom uploaded raster images in LocalStorage and syncs with Server
 */

const STORAGE_KEY_CHARACTER = 'gord_custom_character_image_v2';
const STORAGE_KEY_LOGO = 'gord_custom_logo_image_v2';

export const getCustomCharacterImage = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY_CHARACTER) || '/gord_character.png';
  } catch {
    return '/gord_character.png';
  }
};

export const getCustomLogoImage = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY_LOGO) || '/gord_logo.png';
  } catch {
    return '/gord_logo.png';
  }
};

export const saveCustomCharacterImage = async (dataUrl: string): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEY_CHARACTER, dataUrl);
  } catch (e) {
    console.warn('LocalStorage character quota warning:', e);
  }

  // Upload to server
  try {
    await fetch('/api/upload-asset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'character', dataUrl }),
    });
  } catch (err) {
    console.warn('Server asset upload error:', err);
  }

  window.dispatchEvent(new Event('gord-assets-updated'));
};

export const saveCustomLogoImage = async (dataUrl: string): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEY_LOGO, dataUrl);
  } catch (e) {
    console.warn('LocalStorage logo quota warning:', e);
  }

  // Upload to server
  try {
    await fetch('/api/upload-asset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'logo', dataUrl }),
    });
  } catch (err) {
    console.warn('Server asset upload error:', err);
  }

  window.dispatchEvent(new Event('gord-assets-updated'));
};

export const resetAssetsToDefault = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_CHARACTER);
    localStorage.removeItem(STORAGE_KEY_LOGO);
  } catch {}
  window.dispatchEvent(new Event('gord-assets-updated'));
};
