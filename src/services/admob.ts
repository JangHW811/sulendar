/**
 * AdMob 서비스
 * 리워드 광고 로드 및 표시
 */

import { Platform } from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';

// 테스트 광고 ID (프로덕션에서는 실제 ID로 교체)
const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
      ios: 'ca-app-pub-xxxxx/xxxxx', // 실제 iOS 리워드 광고 ID
      android: 'ca-app-pub-xxxxx/xxxxx', // 실제 Android 리워드 광고 ID
    }) || TestIds.REWARDED;

let rewardedAd: RewardedAd | null = null;
let isAdLoaded = false;
let isAdLoading = false;

/**
 * 리워드 광고 미리 로드
 */
export async function loadRewardedAd(): Promise<boolean> {
  if (isAdLoaded || isAdLoading) {
    return isAdLoaded;
  }

  isAdLoading = true;

  return new Promise((resolve) => {
    rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        isAdLoaded = true;
        isAdLoading = false;
        unsubscribeLoaded();
        resolve(true);
      }
    );

    const unsubscribeError = rewardedAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error('AdMob 로드 실패:', error);
        isAdLoaded = false;
        isAdLoading = false;
        unsubscribeError();
        resolve(false);
      }
    );

    rewardedAd.load();
  });
}

/**
 * 리워드 광고 표시
 * @returns 광고 시청 완료 여부
 */
export async function showRewardedAd(): Promise<boolean> {
  // 광고가 로드되지 않았으면 로드 시도
  if (!isAdLoaded) {
    const loaded = await loadRewardedAd();
    if (!loaded) {
      return false;
    }
  }

  if (!rewardedAd) {
    return false;
  }

  return new Promise((resolve) => {
    const unsubscribeEarned = rewardedAd!.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('리워드 획득:', reward);
        unsubscribeEarned();
        isAdLoaded = false;
        // 다음 광고 미리 로드
        loadRewardedAd();
        resolve(true);
      }
    );

    const unsubscribeClosed = rewardedAd!.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        unsubscribeClosed();
        // 광고 닫힘 (리워드 획득 안 했을 수 있음)
        isAdLoaded = false;
        loadRewardedAd();
      }
    );

    const unsubscribeError = rewardedAd!.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error('AdMob 표시 실패:', error);
        unsubscribeError();
        isAdLoaded = false;
        resolve(false);
      }
    );

    rewardedAd!.show();
  });
}

/**
 * 광고 로드 상태 확인
 */
export function isRewardedAdReady(): boolean {
  return isAdLoaded;
}

/**
 * 웹 환경 체크 (웹에서는 AdMob 사용 불가)
 */
export function isAdMobSupported(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}
