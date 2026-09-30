import { useState } from 'react';
import { Platform, View } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  type BannerAdProps,
} from 'react-native-google-mobile-ads';

const ANDROID_BANNER_AD_UNIT_ID = 'ca-app-pub-3683465218447064/9132464490';

const productionAdUnitId = Platform.select({
  android: ANDROID_BANNER_AD_UNIT_ID,
});

export function AdBanner() {
  const [isUnavailable, setIsUnavailable] = useState(false);

  if (!productionAdUnitId || isUnavailable) {
    return null;
  }

  const handleAdFailedToLoad: NonNullable<BannerAdProps['onAdFailedToLoad']> = () => {
    setIsUnavailable(true);
  };

  return (
    <View className="min-h-[50px] w-full items-center justify-center" accessibilityRole="none">
      <BannerAd
        unitId={__DEV__ ? TestIds.ADAPTIVE_BANNER : productionAdUnitId}
        size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={handleAdFailedToLoad}
      />
    </View>
  );
}
