import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  value: Date | null;
  onSelect: (date: Date) => void;
  onClose: () => void;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MIN_YEAR = 1900;
const YEAR_ROW_H = 46;

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export default function DatePickerModal({
  visible,
  value,
  onSelect,
  onClose,
}: Props) {
  const today = startOfDay(new Date());
  const maxYear = today.getFullYear();

  const [viewYear, setViewYear] = useState(2000);
  const [viewMonth, setViewMonth] = useState(0);
  const [mode, setMode] = useState<"days" | "years">("days");

  const yearScroll = useRef<ScrollView>(null);

  // every time the popup opens, jump to the selected date (or year 2000)
  useEffect(() => {
    if (!visible) return;

    const base = value ?? new Date(2000, 0, 1);

    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setMode("days");
  }, [visible, value]);

  const years: number[] = [];
  for (let y = maxYear; y >= MIN_YEAR; y--) years.push(y);

  /* ---------- month navigation ---------- */

  const canGoNext =
    viewYear < maxYear || (viewYear === maxYear && viewMonth < today.getMonth());

  const canGoPrev = viewYear > MIN_YEAR || viewMonth > 0;

  const prevMonth = () => {
    if (!canGoPrev) return;

    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (!canGoNext) return;

    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  /* ---------- build the day grid ---------- */

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const isSelected = (day: number) =>
    !!value &&
    value.getFullYear() === viewYear &&
    value.getMonth() === viewMonth &&
    value.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const isFuture = (day: number) =>
    new Date(viewYear, viewMonth, day).getTime() > today.getTime();

  const pickDay = (day: number) => {
    if (isFuture(day)) return;

    onSelect(new Date(viewYear, viewMonth, day));
    onClose();
  };

  const pickYear = (y: number) => {
    setViewYear(y);

    // keep the month valid if we jumped into the current year
    if (y === maxYear && viewMonth > today.getMonth()) {
      setViewMonth(today.getMonth());
    }

    setMode("days");
  };

  const scrollToSelectedYear = () => {
    const idx = years.indexOf(viewYear);
    const y = Math.max(0, Math.floor(idx / 4) * YEAR_ROW_H - YEAR_ROW_H);

    yearScroll.current?.scrollTo({ y, animated: false });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* inner Pressable stops taps inside the card from closing it */}
        <Pressable style={styles.card} onPress={() => {}}>
          {/* header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={prevMonth}
              disabled={mode === "years" || !canGoPrev}
              style={[
                styles.navBtn,
                (mode === "years" || !canGoPrev) && styles.navBtnOff,
              ]}
            >
              <MaterialCommunityIcons name="chevron-left" size={26} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.titleBtn}
              onPress={() => setMode((m) => (m === "days" ? "years" : "days"))}
              activeOpacity={0.8}
            >
              <Text style={styles.title}>
                {mode === "days"
                  ? `${MONTHS[viewMonth]} ${viewYear}`
                  : "Select Year"}
              </Text>

              <MaterialCommunityIcons
                name={mode === "days" ? "menu-down" : "menu-up"}
                size={22}
                color="#B9B2FF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={nextMonth}
              disabled={mode === "years" || !canGoNext}
              style={[
                styles.navBtn,
                (mode === "years" || !canGoNext) && styles.navBtnOff,
              ]}
            >
              <MaterialCommunityIcons name="chevron-right" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {mode === "days" ? (
            <>
              {/* weekday labels */}
              <View style={styles.weekRow}>
                {WEEKDAYS.map((w) => (
                  <Text key={w} style={styles.weekText}>
                    {w}
                  </Text>
                ))}
              </View>

              {/* days */}
              {rows.map((row, ri) => (
                <View key={ri} style={styles.weekRow}>
                  {row.map((day, ci) => {
                    if (day === null) {
                      return <View key={ci} style={styles.dayCell} />;
                    }

                    const selected = isSelected(day);
                    const future = isFuture(day);

                    return (
                      <TouchableOpacity
                        key={ci}
                        style={styles.dayCell}
                        activeOpacity={0.7}
                        disabled={future}
                        onPress={() => pickDay(day)}
                      >
                        <View
                          style={[
                            styles.dayCircle,
                            isToday(day) && styles.dayToday,
                            selected && styles.daySelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              future && styles.dayTextOff,
                              selected && styles.dayTextSelected,
                            ]}
                          >
                            {day}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </>
          ) : (
            <ScrollView
              ref={yearScroll}
              style={styles.yearScroll}
              onContentSizeChange={scrollToSelectedYear}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.yearWrap}>
                {years.map((y) => {
                  const active = y === viewYear;

                  return (
                    <TouchableOpacity
                      key={y}
                      style={styles.yearCell}
                      activeOpacity={0.8}
                      onPress={() => pickYear(y)}
                    >
                      <View style={[styles.yearPill, active && styles.yearPillActive]}>
                        <Text style={[styles.yearText, active && styles.yearTextActive]}>
                          {y}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}

          {/* footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.footerBtn}>
              <Text style={styles.footerCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(2,4,12,0.78)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#0A1020",
    borderWidth: 1.5,
    borderColor: "#24307A",
    borderRadius: 24,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,63,214,0.35)",
  },

  navBtnOff: { opacity: 0.25 },

  titleBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  weekRow: {
    flexDirection: "row",
  },

  weekText: {
    flex: 1,
    textAlign: "center",
    color: "#6E7A90",
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 8,
  },

  dayCell: {
    flex: 1,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  dayToday: {
    borderWidth: 1.5,
    borderColor: "#4D9DFF",
  },

  daySelected: {
    backgroundColor: "#5B3FD6",
    borderColor: "#5B3FD6",
  },

  dayText: {
    color: "#E6E3FF",
    fontSize: 14,
    fontWeight: "600",
  },

  dayTextOff: { color: "#3A4561" },

  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  yearScroll: {
    height: 276,
  },

  yearWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  yearCell: {
    width: "25%",
    height: YEAR_ROW_H,
    alignItems: "center",
    justifyContent: "center",
  },

  yearPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  yearPillActive: {
    backgroundColor: "#5B3FD6",
  },

  yearText: {
    color: "#B9B2FF",
    fontSize: 15,
    fontWeight: "600",
  },

  yearTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },

  footerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  footerCancel: {
    color: "#9AA6C0",
    fontSize: 14,
    fontWeight: "700",
  },
});