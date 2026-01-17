/**
 * 술렌다 투톤 아이콘 컴포넌트
 * 피그마 디자인 기반 - 심플한 투톤 SVG 아이콘
 */

import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { colors } from '../../theme/colors';

interface IconProps {
  size?: number;
  color?: string;
  secondaryColor?: string;
  filled?: boolean;
}

const defaultProps = {
  size: 24,
  color: colors.primary.main,
  secondaryColor: colors.primary.light,
};

// 홈 아이콘
export function HomeIcon({ size = 24, color = colors.text.secondary, filled = false }: IconProps) {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z"
          fill={color}
        />
        <Rect x="9" y="13" width="6" height="8" rx="1" fill={colors.background.primary} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Rect x="9" y="13" width="6" height="8" rx="1" fill={color} fillOpacity="0.3" />
    </Svg>
  );
}

// 통계 아이콘
export function ChartIcon({ size = 24, color = colors.text.secondary, filled = false }: IconProps) {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="12" width="5" height="9" rx="1" fill={color} />
        <Rect x="10" y="6" width="5" height="15" rx="1" fill={color} />
        <Rect x="17" y="3" width="5" height="18" rx="1" fill={color} fillOpacity="0.5" />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="12" width="5" height="9" rx="1" stroke={color} strokeWidth="2" />
      <Rect x="10" y="6" width="5" height="15" rx="1" stroke={color} strokeWidth="2" />
      <Rect x="17" y="3" width="5" height="18" rx="1" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

// 목표 아이콘
export function TargetIcon({ size = 24, color = colors.text.secondary, filled = false }: IconProps) {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.2" />
        <Circle cx="12" cy="12" r="6" fill={color} fillOpacity="0.4" />
        <Circle cx="12" cy="12" r="2" fill={color} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" strokeOpacity="0.5" />
      <Circle cx="12" cy="12" r="2" fill={color} />
    </Svg>
  );
}

// 상담 아이콘 (채팅)
export function ChatIcon({ size = 24, color = colors.text.secondary, filled = false }: IconProps) {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M21 12C21 16.4183 16.9706 20 12 20C10.5 20 9 19.7 7.5 19L3 21L4.5 16.5C3.5 15 3 13.5 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z"
          fill={color}
        />
        <Circle cx="8" cy="12" r="1.5" fill={colors.background.primary} />
        <Circle cx="12" cy="12" r="1.5" fill={colors.background.primary} />
        <Circle cx="16" cy="12" r="1.5" fill={colors.background.primary} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12C21 16.4183 16.9706 20 12 20C10.5 20 9 19.7 7.5 19L3 21L4.5 16.5C3.5 15 3 13.5 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Circle cx="8" cy="12" r="1" fill={color} />
      <Circle cx="12" cy="12" r="1" fill={color} />
      <Circle cx="16" cy="12" r="1" fill={color} />
    </Svg>
  );
}

// 프로필 아이콘
export function UserIcon({ size = 24, color = colors.text.secondary, filled = false }: IconProps) {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" fill={color} />
        <Path
          d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20V21H4V20Z"
          fill={color}
          fillOpacity="0.6"
        />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="3" stroke={color} strokeWidth="2" />
      <Path
        d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 주종 아이콘들
export function SojuIcon({ size = 32, color = colors.drinks.soju }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Rect x="10" y="4" width="12" height="24" rx="2" stroke={color} strokeWidth="2" />
      <Rect x="12" y="8" width="8" height="4" fill={color} fillOpacity="0.3" />
      <Path d="M10 12H22" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

export function BeerIcon({ size = 32, color = colors.drinks.beer }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Rect x="6" y="8" width="16" height="20" rx="2" stroke={color} strokeWidth="2" />
      <Path d="M22 12H26C27.1046 12 28 12.8954 28 14V20C28 21.1046 27.1046 22 26 22H22" stroke={color} strokeWidth="2" />
      <Rect x="8" y="10" width="12" height="6" fill={color} fillOpacity="0.3" />
    </Svg>
  );
}

export function WineIcon({ size = 32, color = colors.drinks.wine }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M10 4H22L20 14C20 17.3137 18.2091 20 16 20C13.7909 20 12 17.3137 12 14L10 4Z"
        stroke={color}
        strokeWidth="2"
      />
      <Path d="M16 20V26" stroke={color} strokeWidth="2" />
      <Path d="M12 26H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M12 8C14 10 18 10 20 8" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.3" />
    </Svg>
  );
}

export function WhiskeyIcon({ size = 32, color = colors.drinks.whiskey }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M8 10L10 28H22L24 10H8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Rect x="10" y="4" width="12" height="6" rx="1" stroke={color} strokeWidth="2" />
      <Rect x="10" y="18" width="12" height="6" fill={color} fillOpacity="0.3" />
    </Svg>
  );
}

export function MakgeolliIcon({ size = 32, color = colors.drinks.makgeolli }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Circle cx="16" cy="18" r="10" stroke={color} strokeWidth="2" />
      <Circle cx="16" cy="18" r="6" fill={color} fillOpacity="0.2" />
      <Path d="M16 4V8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="16" cy="18" r="2" fill={color} />
    </Svg>
  );
}

export function EtcDrinkIcon({ size = 32, color = colors.drinks.etc }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M12 4L8 16V26C8 27.1046 8.89543 28 10 28H22C23.1046 28 24 27.1046 24 26V16L20 4H12Z"
        stroke={color}
        strokeWidth="2"
      />
      <Path d="M8 16H24" stroke={color} strokeWidth="2" />
      <Rect x="12" y="18" width="8" height="6" fill={color} fillOpacity="0.3" />
    </Svg>
  );
}

// 설정 메뉴 아이콘들
export function BellIcon({ size = 24, color = colors.text.secondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function ExportIcon({ size = 24, color = colors.text.secondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M12 3V15M12 3L7 8M12 3L17 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function LockIcon({ size = 24, color = colors.text.secondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="2" />
      <Path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="16" r="1.5" fill={color} />
    </Svg>
  );
}

export function DocumentIcon({ size = 24, color = colors.text.secondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <Path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <Path d="M8 13H16M8 17H12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function HelpIcon({ size = 24, color = colors.text.secondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <Path d="M9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9C15 10.3062 14.1652 11.4175 13 11.8293V13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="17" r="1" fill={color} />
    </Svg>
  );
}

// 추가 버튼 아이콘
export function PlusIcon({ size = 24, color = colors.background.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

// 화살표 아이콘
export function ChevronLeftIcon({ size = 24, color = colors.text.secondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 24, color = colors.text.secondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
