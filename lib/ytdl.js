const axios = require("axios");
const ytsr = require("ytsr");
const logger = require("./logger");

/**
 * YouTube search + download helpers.
 *
 * The previous backend (tomp3.cc) has been seized/shut down, so the download
 * pipeline is now backed by the public web API used by loader.to.
 * The endpoints, API key and headers below mirror the public frontend of
 * https://en.loader.to (see /js/loader/main2.js) and require no auth token.
 *
 * Flow:  ytdlget(url, format)  -> starts a conversion task (id + progress_url)
 *        ytdlDl(id, progress)  -> polls until a direct `dlink` is ready
 */

// API hosts, ordered by preference (primary + fallbacks, same as loader.to)
const API_HOSTS = ["p.savenow.to", "p.lbserver.xyz", "en.loader.to"];
const API_KEY = "dfcb6d76f2f6a9894gjkege8a4ab232222";
const API_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  Origin: "https://en.loader.to",
  Referer: "https://en.loader.to/",
};

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 150000;
const MAX_CONSECUTIVE_404 = 15; // ~30s of 404s -> task is gone
// Accepted video quality values (loader.to format codes)
const VIDEO_QUALITIES = ["144", "240", "360", "480", "720", "1080", "1440", "4k"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractVideoId = (url) => {
  const match = String(url || "").match(/(?:v=|youtu\.be\/|\/shorts\/|\/embed\/)([\w-]{11})/);
  return match ? match[1] : null;
};

/**
 * Normalize a quality label ("480p", "480", "2160p", "4K", ...) to a
 * loader.to format code ("480", "4k", ...). Returns null when unsupported.
 */
const normalizeQuality = (quality) => {
  if (quality === null || quality === undefined || quality === "") return "480";
  const cleaned = String(quality).trim().toLowerCase().replace(/p$/, "");
  const normalized = cleaned === "2160" ? "4k" : cleaned;
  return VIDEO_QUALITIES.includes(normalized) ? normalized : null;
};

/**
 * Search YouTube for videos.
 * @param {String} query
 * @param {Number} limit max number of results
 * @returns {Promise<Array<{title: String, url: String, author: *, views: *, duration: *, uploadedAt: *}>>}
 */
const search = async (query, limit = 1) => {
  if (!query || !String(query).trim()) {
    throw new Error("A search query is required");
  }

  // YouTube renamed the "Video" filter to "Videos"; fall back to a plain
  // results URL when the filter is missing so the search never crashes.
  let searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  try {
    const filters = await ytsr.getFilters(query);
    const typeFilters = filters.get("Type");
    const videoFilter = typeFilters && (typeFilters.get("Videos") || typeFilters.get("Video"));
    if (videoFilter) searchUrl = videoFilter.url;
  } catch (error) {
    logger.warn(`ytdl: could not fetch ytsr filters (${error.message}), using plain search URL`);
  }

  const searchResults = await ytsr(searchUrl, { limit });
  const items = (searchResults.items || []).filter(
    (item) => item && item.url && item.type !== "channel" && item.type !== "playlist"
  );

  if (!items.length) {
    throw new Error(`No YouTube results found for "${query}"`);
  }

  return items.map(({ title, url, author, views, duration, uploadedAt }) => {
    return { title, url, author, views, duration, uploadedAt };
  });
};

/**
 * Start a download/conversion task for a media URL.
 * @param {String} url media URL
 * @param {String} [format] loader.to format code: "mp3", "m4a", or a video quality ("144".."1440", "4k")
 * @returns {Promise<Object>} task data containing `id`, `progress_url`, `title` and `thumbnail_url`
 */
const ytdlget = async (url, format = "360") => {
  const cleanUrl = String(url || "").trim();
  if (!/^https?:\/\//i.test(cleanUrl)) {
    throw new Error("A valid http(s) URL is required");
  }

  let lastNetworkError = null;
  for (const host of API_HOSTS) {
    let response;
    try {
      response = await axios.get(`https://${host}/api/v2/download`, {
        params: { url: cleanUrl, format, apikey: API_KEY },
        headers: API_HEADERS,
        timeout: 30000,
        validateStatus: () => true,
      });
    } catch (error) {
      lastNetworkError = error;
      logger.warn(`ytdl: request to ${host} failed (${error.message}), trying next host`);
      continue;
    }

    // Transient server-side failures -> try the next host
    if (response.status >= 500 || response.status === 429 || response.status === 408) {
      lastNetworkError = new Error(`host ${host} responded with status ${response.status}`);
      logger.warn(`ytdl: ${lastNetworkError.message}, trying next host`);
      continue;
    }

    const data = response.data;
    if (response.status === 200 && data && data.success === true && data.id) {
      return data;
    }

    const reason =
      (data &&
        (data.message ||
          data.text ||
          (typeof data.error === "string" ? data.error : data.error && data.error.message))) ||
      `the download service responded with status ${response.status}`;
    throw new Error(`Could not start download: ${reason}`);
  }

  throw new Error(
    `Could not reach the download service: ${lastNetworkError ? lastNetworkError.message : "unknown error"}`
  );
};

/**
 * Wait for a conversion task to finish and return the result.
 * @param {String} id task id returned by ytdlget
 * @param {String} [progressUrl] full progress URL returned by ytdlget (optional)
 * @returns {Promise<Object>} result including `dlink`, `title` and `thumb`
 */
async function ytdlDl(id, progressUrl) {
  const taskUrl = /^https?:\/\//i.test(String(progressUrl || ""))
    ? progressUrl
    : id
    ? `https://${API_HOSTS[0]}/api/progress?id=${encodeURIComponent(id)}`
    : null;

  if (!taskUrl) {
    throw new Error("A download task id is required");
  }

  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let consecutiveNotFound = 0;

  while (Date.now() < deadline) {
    let response;
    try {
      response = await axios.get(taskUrl, {
        headers: API_HEADERS,
        timeout: 20000,
        validateStatus: () => true,
      });
    } catch (error) {
      logger.warn(`ytdl: progress poll failed: ${error.message}`);
      await sleep(POLL_INTERVAL_MS);
      continue;
    }

    if (response.status === 404) {
      consecutiveNotFound += 1;
      if (consecutiveNotFound >= MAX_CONSECUTIVE_404) {
        throw new Error("Download task not found or expired, please try again");
      }
      await sleep(POLL_INTERVAL_MS);
      continue;
    }
    consecutiveNotFound = 0;

    const data = response.data;
    if (!data || typeof data !== "object") {
      await sleep(POLL_INTERVAL_MS);
      continue;
    }

    if (data.success === false && data.text === "Expired") {
      throw new Error(data.message || "Download task expired, please try again");
    }

    if (data.success == 1) {
      if (data.download_url) {
        return {
          ...data,
          dlink: data.download_url,
          title: data.title || (data.info && data.info.title) || "",
          thumb: data.thumbnail_url || (data.info && data.info.image) || "",
        };
      }
      throw new Error(data.text || data.message || "Conversion failed");
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error("Timed out while waiting for the download link");
}

/**
 * Format raw link data (legacy y2mate/tomp3 shape) into a flat list of formats.
 * Kept for backward compatibility; the download pipeline no longer depends on it.
 *
 * @param {Object} data response containing `vid` and `links`
 * @param {Object} [options] `{ type, quality }` used to filter the result
 * @returns {Array<{vid, id, size, quality, type}>}
 */
function formatYtdata(data, options = {}) {
  const { type, quality } = options;
  const formatted_data = [];

  if (!data || !data.links || typeof data.links !== "object") {
    return formatted_data;
  }

  const processFormat = (format) => {
    if (!format || !format.k) return;
    formatted_data.push({
      vid: data.vid,
      id: format.k,
      size: format.size,
      quality: format.q,
      type: format.f,
    });
  };

  // Process every available group instead of hard-coded entries so a missing
  // group (e.g. no 3gp links) can no longer crash the function.
  ["mp4", "mp3", "3gp"].forEach((group) => {
    const links = data.links[group];
    if (links && typeof links === "object") {
      Object.values(links).forEach(processFormat);
    }
  });

  // Chain the filters: both must match (previously the quality filter
  // re-filtered the full list and silently dropped the type filter).
  let formatted = formatted_data;
  if (type) {
    formatted = formatted.filter((format) => format.type === type);
  }
  if (quality) {
    formatted = formatted.filter((format) => format.quality === quality);
  }
  return formatted;
}

const buildResult = (task, result, sourceUrl) => {
  const vid = extractVideoId(sourceUrl || task.url) || null;
  const thumb =
    result.thumb ||
    task.thumbnail_url ||
    (task.info && task.info.image) ||
    (vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : "");
  return {
    ...result,
    dlink: result.dlink,
    title: result.title || task.title || "",
    thumb,
    sizes: result.size || result.file_size || "",
    quality: result.full_format || task.full_format || task.format || "",
  };
};

/**
 * Download the audio (mp3) of a YouTube/media URL.
 * @param {String} url
 * @returns {Promise<Object>} `{ dlink, title, thumb, sizes, quality, ... }`
 */
async function yta(url) {
  const task = await ytdlget(url, "mp3");
  const result = await ytdlDl(task.id, task.progress_url);
  return { ...buildResult(task, result, url), format: "mp3" };
}

/**
 * Download a video from a YouTube/media URL.
 * @param {String} url
 * @param {String} [quality] e.g. "480p" (default), "720p", "1080p", "2160p"/"4k"
 * @returns {Promise<Object>} `{ dlink, title, thumb, sizes, quality, ... }`
 */
async function ytv(url, quality = "480p") {
  const requested = normalizeQuality(quality);
  if (!requested) {
    throw new Error(
      `Unsupported quality "${quality}". Supported: 144p, 240p, 360p, 480p, 720p, 1080p, 1440p, 2160p`
    );
  }

  // Requested quality first, then up to two lower fallbacks if the service
  // cannot provide it (never tries a higher quality than requested).
  const requestedIndex = VIDEO_QUALITIES.indexOf(requested);
  const fallbacks = VIDEO_QUALITIES.slice(0, requestedIndex).reverse().slice(0, 2);
  const qualityChain = [requested, ...fallbacks];

  let task = null;
  let lastError = null;
  for (const format of qualityChain) {
    try {
      task = await ytdlget(url, format);
      break;
    } catch (error) {
      lastError = error;
      logger.warn(`ytdl: could not start ${format} video download: ${error.message}`);
    }
  }
  if (!task) {
    throw lastError || new Error("Failed to start the video download");
  }

  const result = await ytdlDl(task.id, task.progress_url);
  return { ...buildResult(task, result, url), format: "mp4" };
}

/**
 * Search YouTube and download the first result.
 * @param {String} query
 * @param {String} [type] "audio" or "video"
 * @returns {Promise<Object>} `{ dlink, title, thumb, sizes, quality, ... }`
 */
const ytsdl = async (query, type = "audio") => {
  if (type !== "audio" && type !== "video") {
    throw new Error("Invalid type. Use 'audio' or 'video'");
  }
  const searchResults = await search(query);
  const url = searchResults[0].url;
  if (type === "audio") {
    return await yta(url);
  }
  return await ytv(url);
};

module.exports = { yta, ytv, ytdlDl, ytdlget, formatYtdata, ytsdl, search };

