/**
 * BasePlatform Interface
 * Defines the standard contract that each social platform handler must implement
 */
class BasePlatform {
  constructor(name, label) {
    if (new.target === BasePlatform) {
      throw new TypeError('Cannot construct BasePlatform instances directly');
    }
    this.name = name;
    this.label = label;
  }

  /**
   * Detects if the given URL belongs to this platform
   * @param {URL} parsedUrl
   * @returns {boolean}
   */
  detect(parsedUrl) {
    throw new Error('detect() must be implemented by subclass');
  }

  /**
   * Validates the URL structure, pathname, parameters, and extracts media identifiers
   * @param {URL} parsedUrl
   * @returns {{ valid: boolean, mediaId?: string, mediaType?: string, error?: string, normalizedUrl?: string }}
   */
  validate(parsedUrl) {
    throw new Error('validate() must be implemented by subclass');
  }

  /**
   * Fetches clean public preview metadata (title, author, thumbnail, duration, etc.)
   * @param {string} normalizedUrl
   * @param {object} validationInfo
   * @returns {Promise<{ title: string, thumbnail: string, author?: string, duration?: string, originalUrl: string, platform: string, mediaType: string }>}
   */
  async getPreview(normalizedUrl, validationInfo) {
    throw new Error('getPreview() must be implemented by subclass');
  }

  /**
   * Resolves safe download information if permitted by the content and platform
   * @param {string} normalizedUrl
   * @param {object} validationInfo
   * @param {object} previewData
   * @returns {Promise<{ downloadAvailable: boolean, downloadUrl?: string, formats?: Array, message?: string }>}
   */
  async getDownloadInfo(normalizedUrl, validationInfo, previewData) {
    throw new Error('getDownloadInfo() must be implemented by subclass');
  }
}

module.exports = BasePlatform;
