import { AdMob } from '@capacitor-community/admob';

// Google test banner ad unit (use during development only)
const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
// Your production banner ad unit (from AdMob)
const PROD_BANNER_ID = 'ca-app-pub-1337451525993562/2262231986';

let listeners: Array<{remove: () => void}> = [];

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

  } catch (e) {
    console.warn('AdMob initialize failed', e);
  }
}

export async function showBanner(options?: { production?: boolean; position?: string; margin?: number; isTesting?: boolean; }): Promise<boolean> {
  const { production = false, position = 'TOP_CENTER', margin = 56, isTesting = !production } = options || {};
  const adId = production ? PROD_BANNER_ID : TEST_BANNER_ID;

  try {
    await AdMob.showBanner({
      adId,
      adSize: 'BANNER',
      position,
      margin,
      isTesting
    } as any);
    console.info('AdMob: showBanner called', { adId, position, margin, isTesting });
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
  listeners.forEach(l => { try { l.remove(); } catch (e) {} });
  listeners = [];
}
