import type { ConfigContext, ExpoConfig } from '@expo/config';

type ExpoPlugins = NonNullable<ExpoConfig['plugins']>;

export default ({ config }: ConfigContext): ExpoConfig => {
  const nativePlugins: ExpoPlugins =
    process.env.EXPO_PLATFORM === 'native'
      ? [['expo-dev-client', { launchMode: 'most-recent' }]]
      : [];

  return {
    ...config,
    name: 'NutriTot',
    slug: 'nutritot',
    version: process.env.BILT_APP_VERSION ?? '1.0.10',
    userInterfaceStyle: 'automatic',
    scheme: 'nutritot',
    icon: './assets/images/nutritot-logo.png',
    runtimeVersion: {
      policy: 'appVersion',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      supportsTablet: true,
      bundleIdentifier: process.env.BILT_IOS_BUNDLE_ID ?? 'com.yourcompany.yourapp',
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './public/icons/icon-192.png',
    },
    android: {
      package: process.env.BILT_ANDROID_PACKAGE ?? 'com.yourcompany.yourapp',
      versionCode: 13,
      icon: './assets/images/nutritot-logo.png',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
    extra: {
      appStoreAppId: process.env.BILT_APP_STORE_APP_ID,
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-splash-screen',
      'expo-status-bar',
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: 'ca-app-pub-3683465218447064~6475703530',
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            enableMinifyInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
            extraProguardRules: [
              '# Keep JS bridge / TurboModule plumbing',
              '-keep class com.facebook.react.turbomodule.** { *; }',
              '-keep class com.facebook.jni.** { *; }',
              '-keepclassmembers class * { @com.facebook.proguard.annotations.DoNotStrip *; }',
              '-keepclassmembers class * { @com.facebook.react.bridge.ReactMethod *; }',
              '',
              '# Reanimated / Worklets',
              '-keep class com.swmansion.reanimated.** { *; }',
              '-keep class com.swmansion.worklets.** { *; }',
              '',
              '# react-native-svg',
              '-keep public class com.horcrux.svg.** { *; }',
              '',
              '# Hermes',
              '-keep class com.facebook.hermes.unicode.** { *; }',
              '',
              '# Keep annotations and generic signatures used by reflection',
              '-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod',
            ].join('\n'),
          },
        },
      ],
      ...nativePlugins,
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  };
};
