import { AdMob, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';

// Google test banner ad unit (use during development only)
const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
// Your production banner ad unit (from AdMob)
const PROD_BANNER_ID = 'ca-app-pub-1337451525993562/2262231986';

let listeners: Array<{ remove: () => void }> = [];
let bannerHeightCallback: ((height: number) => void) | null = null;

export async function initAdMob(): Promise<void> {
  try {
    await AdMob.initialize();
    console.info('AdMob initialized');

    // Register basic listeners (best-effort; names depend on underlying SDK)
    // Note: Some plugin versions may not support these event names
    try {
      const bannerLoadedHandle = await (AdMob.addListener as any)('onBannerLoaded', () => console.info('AdMob event: banner loaded'));
      if (bannerLoadedHandle && typeof bannerLoadedHandle.remove === 'function') {
        listeners.push(bannerLoadedHandle);
      }
    } catch (e) {
      console.debug('AdMob: onBannerLoaded listener not available');
    }

    try {
      const bannerFailedHandle = await (AdMob.addListener as any)('onBannerFailedToLoad', (err: any) => console.warn('AdMob event: banner failed to load', err));
      if (bannerFailedHandle && typeof bannerFailedHandle.remove === 'function') {
        listeners.push(bannerFailedHandle);
      }
    } catch (e) {
      console.debug('AdMob: onBannerFailedToLoad listener not available');
    }

    try {
      const bannerClickedHandle = await (AdMob.addListener as any)('onBannerClicked', () => console.info('AdMob event: banner clicked'));
      if (bannerClickedHandle && typeof bannerClickedHandle.remove === 'function') {
        listeners.push(bannerClickedHandle);
      }
    } catch (e) {
      console.debug('AdMob: onBannerClicked listener not available');
    }

    // Listen for banner size changes to get actual height
    try {
      const bannerSizeHandle = await (AdMob.addListener as any)('bannerAdSizeChanged', (info: { width: number, height: number }) => {
        console.info('AdMob event: banner size changed', info);
        if (bannerHeightCallback && info.height > 0) {
          bannerHeightCallback(info.height);
        }
      });
      if (bannerSizeHandle && typeof bannerSizeHandle.remove === 'function') {
        listeners.push(bannerSizeHandle);
      }
    } catch (e) {
      console.debug('AdMob: bannerAdSizeChanged listener not available');
    }

  } catch (e) {
    console.warn('AdMob initialize failed', e);
  }
}

export async function showBanner(options?: { production?: boolean; position?: 'TOP' | 'BOTTOM'; margin?: number; isTesting?: boolean; onHeightChange?: (height: number) => void; }): Promise<boolean> {
  const { production = false, position = 'BOTTOM', margin = 0, isTesting = !production, onHeightChange } = options || {};

  // Store callback for height updates
  if (onHeightChange) {
    bannerHeightCallback = onHeightChange;
  }
  const adId = production ? PROD_BANNER_ID : TEST_BANNER_ID;

  // Use enum for position
  const bannerPosition = position === 'TOP' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER;

  try {
    await AdMob.showBanner({
      adId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: bannerPosition,
      margin,
      isTesting
    });
    console.info('AdMob: showBanner called', { adId, position: bannerPosition, margin, isTesting });
    return true;
  } catch (e) {
    console.warn('AdMob showBanner failed', e);
    return false;
  }
}

export async function hideBanner(): Promise<boolean> {
  try {
    await AdMob.hideBanner();
    return true;
  } catch (e) {
    console.warn('AdMob hideBanner failed', e);
    return false;
  }
}

export function removeAllListeners() {
  listeners.forEach(l => { try { l.remove(); } catch (e) { } });
  listeners = [];
}
