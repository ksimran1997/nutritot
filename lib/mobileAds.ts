import mobileAds from 'react-native-google-mobile-ads';

let initialization: Promise<unknown> | undefined;

export function initializeMobileAds() {
  initialization ??= mobileAds().initialize();
  return initialization;
}
