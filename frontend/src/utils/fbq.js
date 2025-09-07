// Utilities for working with Meta (Facebook) Pixel
// Safe wrappers that won't throw if fbq is not available

export const PIXEL_ID = "24440721158921753"; // optional reference
export const DEFAULT_CURRENCY = "EGP"; // Egyptian Pound

function debugEnabled() {
  // Env flag (build/runtime)
  const envFlag = typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_FB_PIXEL_DEBUG === "true";
  // URL flag (?fbq_debug=true)
  let urlFlag = false;
  // LocalStorage flag (FBQ_DEBUG=true)
  let lsFlag = false;
  if (typeof window !== "undefined") {
    try {
      const sp = new URLSearchParams(window.location.search);
      urlFlag = sp.get("fbq_debug") === "true";
    } catch (_) {}
    try {
      lsFlag = window.localStorage && window.localStorage.getItem("FBQ_DEBUG") === "true";
    } catch (_) {}
  }
  return envFlag || urlFlag || lsFlag;
}

export function isBrowser() {
  return typeof window !== "undefined";
}

export function isFbqReady() {
  return isBrowser() && typeof window.fbq === "function";
}

export function track(event, params = {}) {
  if (!isFbqReady()) return false;
  try {
    if (debugEnabled()) {
      // Non-blocking debug log
      // eslint-disable-next-line no-console
      console.debug("[FBQ] track:", event, params);
    }
    window.fbq("track", event, params);
    return true;
  } catch (e) {
    if (debugEnabled()) {
      // eslint-disable-next-line no-console
      console.debug("[FBQ] error:", e);
    }
    return false;
  }
}

export function trackPageView() {
  return track("PageView");
}

export function trackViewContent({ id, value, currency = DEFAULT_CURRENCY } = {}) {
  return track("ViewContent", {
    content_ids: id ? [String(id)] : undefined,
    content_type: "product",
    value,
    currency,
  });
}

export function trackAddToCart({ id, value, currency = DEFAULT_CURRENCY, quantity = 1 } = {}) {
  return track("AddToCart", {
    content_ids: id ? [String(id)] : undefined,
    content_type: "product",
    value,
    currency,
    contents: id ? [{ id: String(id), quantity }] : undefined,
  });
}

export function trackInitiateCheckout({ value, currency = DEFAULT_CURRENCY, contents = [] } = {}) {
  return track("InitiateCheckout", {
    value,
    currency,
    contents,
    content_type: "product",
  });
}

export function trackPurchase({ value, currency = DEFAULT_CURRENCY, contents = [] } = {}) {
  return track("Purchase", {
    value,
    currency,
    contents,
    content_type: "product",
  });
}

// Additional standard Meta events
export function trackSearch({ search_string = "", content_category, contents = [] } = {}) {
  return track("Search", {
    search_string,
    content_category,
    contents,
  });
}

export function trackAddToWishlist({ id, value, currency = DEFAULT_CURRENCY } = {}) {
  return track("AddToWishlist", {
    content_ids: id ? [String(id)] : undefined,
    content_type: "product",
    value,
    currency,
  });
}

export function trackAddPaymentInfo({ value, currency = DEFAULT_CURRENCY, contents = [] } = {}) {
  return track("AddPaymentInfo", {
    value,
    currency,
    contents,
    content_type: "product",
  });
}
