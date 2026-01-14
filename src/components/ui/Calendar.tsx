/**
 * 술렌다 Calendar 컴포넌트
 * 월간 캘린더 뷰
 */

import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { Text } from './Text';

interface CalendarProps {
  selectedDate: string; // YYYY-MM-DD
  markedDates?: Record<string, { marked?: boolean; color?: string }>;
  onSelectDate: (date: string) => void;
  onMonthChange?: (year: number, month: number) => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function Calendar({
  selectedDate,
  markedDates = {},
  onSelectDate,
  onMonthChange,
}: CalendarProps) {
  const [currentYear, setCurrentYear] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return d.getFullYear();
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return d.getMonth();
  });

  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const result: (number | null)[] = [];

    // 이전 달 빈 공간
    for (let i = 0; i < startDayOfWeek; i++) {
      result.push(null);
    }

    // 이번 달 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(i);
    }

    return result;
  }, [currentYear, currentMonth]);

  const goToPrevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    onMonthChange?.(newYear, newMonth);
  };

  const goToNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    onMonthChange?.(newYear, newMonth);
  };

  const formatDateString = (day: number) => {
    const month = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${currentYear}-${month}-${dayStr}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === day
    );
  };

  const isSelected = (day: number) => {
    return formatDateString(day) === selectedDate;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPrevMonth} style={styles.navButton}>
          <Text variant="title" color="primary">←</Text>
        </TouchableOpacity>
        <Text variant="heading" color="primary">
          {currentYear}년 {currentMonth + 1}월
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Text variant="title" color="primary">→</Text>
        </TouchableOpacity>
      </View>

      {/* Weekdays */}
      <View style={styles.weekdays}>
        {WEEKDAYS.map((day, index) => (
          <View key={day} style={styles.weekdayCell}>
            <Text
              variant="caption"
              color={index === 0 ? 'primary' : index === 6 ? 'primary' : 'secondary'}
              center
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const dateStr = formatDateString(day);
          const marked = markedDates[dateStr];
          const selected = isSelected(day);
          const today = isToday(day);

          return (
            <TouchableOpacity
              key={day}
              style={styles.dayCell}
              onPress={() => onSelectDate(dateStr)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.dayContent,
                  selected && styles.daySelected,
                  today && !selected && styles.dayToday,
                ]}
              >
                <Text
                  variant="body"
                  color={selected ? 'inverse' : 'primary'}
                  center
                >
                  {day}
                </Text>
                {marked?.marked && (
                  <View
                    style={[
                      styles.marker,
                      { backgroundColor: marked.color || colors.primary.main },
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  navButton: {
    padding: spacing.sm,
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  dayContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  daySelected: {
    backgroundColor: colors.primary.main,
  },
  dayToday: {
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  marker: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
