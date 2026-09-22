const { resolvePlatform } = require('../platforms');
const logger = require('../utils/logger');

/**
 * Controller to handle video URL processing
 * POST /api/process
 */
async function processVideo(req, res, next) {
  const startTime = Date.now();
  const safeUrl = req.safeUrl;

  try {
    const platform = resolvePlatform(safeUrl);

    if (!platform) {
      return res.status(400).json({
        success: false,
        error: "This platform isn't supported yet. We currently support YouTube, Instagram, and Facebook."
      });
    }

    // Step 1: Validate URL structure for this platform
    const validation = platform.validate(safeUrl);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error || 'Unable to retrieve this video. Please verify the URL.'
      });
    }

    // Step 2: Extract clean preview metadata with overall 9s timeout
    const preview = await Promise.race([
      platform.getPreview(validation.normalizedUrl, validation),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Processing request timed out')), 9000)
      )
    ]);

    // Step 3: Check download availability & options
    const downloadInfo = await platform.getDownloadInfo(
      validation.normalizedUrl,
      validation,
      preview
    );

    logger.info('Video processed successfully', {
      platform: platform.name,
      mediaId: validation.mediaId,
      durationMs: Date.now() - startTime
    });

    return res.status(200).json({
      success: true,
      platform: platform.name,
      platformLabel: platform.label,
      mediaType: validation.mediaType || 'Video',
      mediaId: validation.mediaId,
      title: preview.title || 'Social Video',
      author: preview.author || 'Creator',
      authorUrl: preview.authorUrl || preview.originalUrl,
      thumbnail: preview.thumbnail,
      originalUrl: preview.originalUrl,
      downloadAvailable: Boolean(downloadInfo.downloadAvailable),
      downloadUrl: downloadInfo.downloadUrl || null,
      downloadOptions: downloadInfo.options || [],
      message: downloadInfo.message || null
    });

  } catch (err) {
    logger.error('Error during video processing:', { error: err.message });
    return res.status(500).json({
      success: false,
      error: "We couldn't process this video right now. Please verify the URL or try again in a moment."
    });
  }
}

module.exports = { processVideo };
