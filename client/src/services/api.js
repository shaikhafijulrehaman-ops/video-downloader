/**
 * API Service for DownloadHub Client
 */

const API_BASE = '/api';

/**
 * Sends video URL to backend for processing and preview generation
 * @param {string} url 
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function processVideoUrl(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 11000);

  try {
    const response = await fetch(`${API_BASE}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url.trim() }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Unable to retrieve this video. Please verify the URL.'
      };
    }

    return {
      success: true,
      data
    };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'The request took too long. Please check your network and try again.'
      };
    }

    return {
      success: false,
      error: 'Unable to connect to the server. Please check your connection and try again.'
    };
  }
}

/**
 * Fetches supported platform meta
 */
export async function getSupportedPlatforms() {
  try {
    const res = await fetch(`${API_BASE}/platforms`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.platforms || [];
  } catch (e) {
    return [];
  }
}
