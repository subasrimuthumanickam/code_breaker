import React, { useEffect, useMemo, useState } from "react";

import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

/*
  Calendar popup used for Date of Birth.
  - works on web + Android + iOS (pure React Native, no extra package)
  - tap month title  -> pick a year quickly
  - future dates are disabled
*/

type Props = {
  visible: boolean;
  value: Date | null;
  onSelect: (date: Date) => void;
  onClose: () => void;
  /** latest selectable date (default: today) */
  maxDate?: Date;
  /** earliest selectable year (default: 1900) */
  minYear?: number;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export default function CalendarPickerModal({
  visible,
  value,
  onSelect,
  onClose,
  maxDate,
  minYear = 1900,
}: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(340, width - 40);

  const max = useMemo(() => startOfDay(maxDate ?? new Date()), [maxDate]);
  const maxYear = max.getFullYear();

  const [viewYear, setViewYear] = useState(2000);
  const [viewMonth, setViewMonth] = useState(0);
  const [mode, setMode] = useState<"days" | "years">("days");

  // every time the popup opens: jump to the selected date (or year 2000)
  useEffect(() => {
    if (!visible) return;

    if (value) {
      setViewYear(value.getFullYear());
      setViewMonth(value.getMonth());
    } else {
      setViewYear(Math.min(2000, maxYear));
      setViewMonth(0);
    }

    setMode("days");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  /* ---------- month navigation ---------- */

  const canGoPrev = viewYear > minYear || viewMonth > 0;
  const canGoNext =
    viewYear < maxYear || (viewYear === maxYear && viewMonth < max.getMonth());

  const goPrev = () => {
    if (!canGoPrev) return;

    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (!canGoNext) return;

    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  /* ---------- day grid ---------- */

  const weeks = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: (number | null)[] = [];

    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const rows: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

    return rows;
  }, [viewYear, viewMonth]);

  const isSelected = (day: number) =>
    !!value &&
    value.getFullYear() === viewYear &&
    value.getMonth() === viewMonth &&
    value.getDate() === day;

  const isToday = (day: number) => {
    const now = new Date();
    return (
      now.getFullYear() === viewYear &&
      now.getMonth() === viewMonth &&
      now.getDate() === day
    );
  };

  const isDisabled = (day: number) =>
    new Date(viewYear, viewMonth, day).getTime() > max.getTime();

  const pickDay = (day: number) => {
    if (isDisabled(day)) return;

    onSelect(new Date(viewYear, viewMonth, day));
    onClose();
  };

  /* ---------- year list ---------- */

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) list.push(y);
    return list;
  }, [maxYear, minYear]);

  const pickYear = (y: number) => {
    setViewYear(y);

    // stay inside the allowed range when the max year is chosen
    if (y === maxYear && viewMonth > max.getMonth()) {
      setViewMonth(max.getMonth());
    }

    setMode("days");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* dark backdrop: tap outside = close */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* inner Pressable stops taps inside the card from closing it */}
        <Pressable style={[styles.card, { width: cardWidth }]} onPress={() => {}}>
          {/* ---------- header ---------- */}
          <View style={styles.header}>
            {mode === "days" ? (
              <TouchableOpacity
                onPress={goPrev}
                disabled={!canGoPrev}
                style={[styles.navBtn, !canGoPrev && styles.navBtnDisabled]}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="chevron-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <View style={styles.navBtnSpacer} />
            )}

            <TouchableOpacity
              onPress={() => setMode(mode === "days" ? "years" : "days")}
              style={styles.titleBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.titleText}>
                {mode === "days" ? `${MONTHS[viewMonth]} ${viewYear}` : "Select year"}
              </Text>
              <MaterialCommunityIcons
                name={mode === "days" ? "menu-down" : "menu-up"}
                size={22}
                color="#B9B2FF"
              />
            </TouchableOpacity>

            {mode === "days" ? (
              <TouchableOpacity
                onPress={goNext}
                disabled={!canGoNext}
                style={[styles.navBtn, !canGoNext && styles.navBtnDisabled]}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="chevron-right" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <View style={styles.navBtnSpacer} />
            )}
          </View>

          {/* ---------- body ---------- */}
          {mode === "days" ? (
            <View>
              <View style={styles.weekRow}>
                {WEEKDAYS.map((w, i) => (
                  <Text key={i} style={styles.weekday}>
                    {w}
                  </Text>
                ))}
              </View>

              {weeks.map((row, ri) => (
                <View key={ri} style={styles.weekRow}>
                  {row.map((day, ci) => {
                    if (day === null) {
                      return <View key={ci} style={styles.dayCell} />;
                    }

                    const selected = isSelected(day);
                    const disabled = isDisabled(day);
                    const today = isToday(day);

                    return (
                      <TouchableOpacity
                        key={ci}
                        style={styles.dayCell}
                        activeOpacity={0.8}
                        disabled={disabled}
                        onPress={() => pickDay(day)}
                      >
                        <View
                          style={[
                            styles.dayInner,
                            today && !selected && styles.dayToday,
                            selected && styles.daySelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              disabled && styles.dayTextDisabled,
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
            </View>
          ) : (
            <ScrollView
              style={styles.yearScroll}
              contentContainerStyle={styles.yearGrid}
              showsVerticalScrollIndicator={false}
            >
              {years.map((y) => {
                const active = y === viewYear;

                return (
                  <TouchableOpacity
                    key={y}
                    style={[styles.yearBtn, active && styles.yearBtnActive]}
                    activeOpacity={0.8}
                    onPress={() => pickYear(y)}
                  >
                    <Text style={[styles.yearText, active && styles.yearTextActive]}>
                      {y}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* ---------- footer ---------- */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={styles.footerBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(2,4,12,0.78)",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#0B1224",
    borderWidth: 1.5,
    borderColor: "#2B3A8C",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#5B3FD6",
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,63,214,0.45)",
  },

  navBtnDisabled: {
    opacity: 0.3,
  },

  navBtnSpacer: {
    width: 40,
    height: 40,
  },

  titleBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  titleText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  weekRow: {
    flexDirection: "row",
  },

  weekday: {
    flex: 1,
    textAlign: "center",
    color: "#7B88B5",
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 6,
  },

  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },

  dayInner: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  dayToday: {
    borderWidth: 1.5,
    borderColor: "#4D9DFF",
  },

  daySelected: {
    backgroundColor: "#5B3FD6",
  },

  dayText: {
    color: "#E6E3FF",
    fontSize: 14,
    fontWeight: "600",
  },

  dayTextDisabled: {
    color: "#3A4468",
  },

  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  yearScroll: {
    maxHeight: 260,
  },

  yearGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  yearBtn: {
    width: "31%",
    paddingVertical: 10,
    marginBottom: 8,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#0A1020",
    borderWidth: 1,
    borderColor: "#1E2A66",
  },

  yearBtnActive: {
    backgroundColor: "#5B3FD6",
    borderColor: "#7C63F0",
  },

  yearText: {
    color: "#B9B2FF",
    fontSize: 14,
    fontWeight: "700",
  },

  yearTextActive: {
    color: "#FFFFFF",
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

  cancelText: {
    color: "#8E9BFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
