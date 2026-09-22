const YouTubePlatform = require('./youtube');
const InstagramPlatform = require('./instagram');
const FacebookPlatform = require('./facebook');

// Registry of supported platform handlers
const platforms = [
  new YouTubePlatform(),
  new InstagramPlatform(),
  new FacebookPlatform()
];

/**
 * Finds the corresponding platform handler for a given URL
 * @param {URL} parsedUrl
 * @returns {BasePlatform|null}
 */
function resolvePlatform(parsedUrl) {
  for (const platform of platforms) {
    if (platform.detect(parsedUrl)) {
      return platform;
    }
  }
  return null;
}

/**
 * Returns supported platforms summary for client info
 */
function getSupportedPlatformsList() {
  return platforms.map(p => ({
    id: p.name,
    label: p.label
  }));
}

module.exports = {
  platforms,
  resolvePlatform,
  getSupportedPlatformsList
};
