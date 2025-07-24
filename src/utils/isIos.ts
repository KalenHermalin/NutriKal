export function isIOS() {
  const userAgent = navigator.userAgent;

  // Check for common iOS device strings in the User Agent
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return true;
  }

  // Handle iPadOS 13 and later, where navigator.platform might be 'MacIntel'
  // and navigator.maxTouchPoints > 1 indicates a touch-enabled device.
  if ((navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return true;
  }

  return false;
}