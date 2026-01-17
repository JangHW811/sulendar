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

// 소주 - 초록색 소주병 모양
export function SojuIcon({ size = 32, color = colors.drinks.soju }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* 병 몸통 */}
      <Path
        d="M11 12C11 12 10 13 10 16V26C10 27.1046 10.8954 28 12 28H20C21.1046 28 22 27.1046 22 26V16C22 13 21 12 21 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 병 목 */}
      <Path
        d="M13 4H19V8C19 8 21 9 21 12H11C11 9 13 8 13 8V4Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* 라벨 */}
      <Rect x="12" y="16" width="8" height="6" rx="1" fill={color} fillOpacity="0.3" />
      {/* 병뚜껑 */}
      <Rect x="14" y="2" width="4" height="2" rx="1" fill={color} />
    </Svg>
  );
}

// 맥주 - 거품이 있는 맥주잔
export function BeerIcon({ size = 32, color = colors.drinks.beer }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* 맥주잔 몸통 */}
      <Path
        d="M6 10H20V26C20 27.1046 19.1046 28 18 28H8C6.89543 28 6 27.1046 6 26V10Z"
        stroke={color}
        strokeWidth="2"
      />
      {/* 손잡이 */}
      <Path
        d="M20 13H24C25.1046 13 26 13.8954 26 15V20C26 21.1046 25.1046 22 24 22H20"
        stroke={color}
        strokeWidth="2"
      />
      {/* 거품 */}
      <Path
        d="M6 10C6 10 7 8 9 8C11 8 11 6 13 6C15 6 15 8 17 8C19 8 20 10 20 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 거품 채우기 */}
      <Path
        d="M7 10C7 10 8 8.5 9.5 8.5C11 8.5 11.5 7 13 7C14.5 7 15 8.5 16.5 8.5C18 8.5 19 10 19 10V12H7V10Z"
        fill={color}
        fillOpacity="0.2"
      />
      {/* 맥주 */}
      <Rect x="7" y="12" width="12" height="10" fill={color} fillOpacity="0.3" />
    </Svg>
  );
}

// 와인 - 둥글고 넓은 와인잔
export function WineIcon({ size = 32, color = colors.drinks.wine }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* 와인잔 볼 (둥글고 넓게) */}
      <Path
        d="M8 6H24V10C24 15.5228 20.4183 20 16 20C11.5817 20 8 15.5228 8 10V6Z"
        stroke={color}
        strokeWidth="2"
      />
      {/* 와인 */}
      <Path
        d="M9 10C9 14 12 17 16 17C20 17 23 14 23 10V9H9V10Z"
        fill={color}
        fillOpacity="0.3"
      />
      {/* 줄기 */}
      <Path d="M16 20V26" stroke={color} strokeWidth="2" />
      {/* 받침대 */}
      <Path
        d="M11 26H21C21 26 20 28 16 28C12 28 11 26 11 26Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 위스키 - 낮은 잔 (온더락 글라스)
export function WhiskeyIcon({ size = 32, color = colors.drinks.whiskey }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* 잔 몸통 - 살짝 기울어진 사각형 */}
      <Path
        d="M7 10L9 26C9 27.1046 9.89543 28 11 28H21C22.1046 28 23 27.1046 23 26L25 10H7Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* 위스키 */}
      <Path
        d="M9 18L10 26C10 26.5 10.5 27 11 27H21C21.5 27 22 26.5 22 26L23 18H9Z"
        fill={color}
        fillOpacity="0.3"
      />
      {/* 얼음 표현 */}
      <Rect x="12" y="20" width="3" height="3" rx="0.5" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
      <Rect x="17" y="21" width="3" height="3" rx="0.5" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
      {/* 잔 윗부분 두께 */}
      <Path d="M7 10H25" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

// 막걸리 - 전통 호리병 모양
export function MakgeolliIcon({ size = 32, color = colors.drinks.makgeolli }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* 호리병 몸통 - 아래가 둥글고 위가 좁음 */}
      <Path
        d="M16 10C12 10 9 14 9 20C9 24.4183 12.134 28 16 28C19.866 28 23 24.4183 23 20C23 14 20 10 16 10Z"
        stroke={color}
        strokeWidth="2"
      />
      {/* 호리병 목 */}
      <Path
        d="M14 10V6C14 5 14.5 4 16 4C17.5 4 18 5 18 6V10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 막걸리 (하얀색 표현) */}
      <Path
        d="M10 20C10 23.5 12.5 27 16 27C19.5 27 22 23.5 22 20C22 17 20 14 16 14C12 14 10 17 10 20Z"
        fill={color}
        fillOpacity="0.2"
      />
      {/* 마개 */}
      <Circle cx="16" cy="4" r="2" fill={color} fillOpacity="0.5" />
    </Svg>
  );
}

// 기타 - 칵테일 글라스
export function EtcDrinkIcon({ size = 32, color = colors.drinks.etc }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* 칵테일 잔 (마티니 글라스) */}
      <Path
        d="M6 6H26L16 18V26"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 받침대 */}
      <Path d="M12 26H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* 음료 */}
      <Path
        d="M9 9H23L16 16L9 9Z"
        fill={color}
        fillOpacity="0.3"
      />
      {/* 장식 (올리브/체리) */}
      <Circle cx="20" cy="8" r="2" fill={color} fillOpacity="0.5" />
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
