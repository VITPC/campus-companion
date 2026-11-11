import { Feather } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { useData } from "@/hooks/useData";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

const weekdays = [
  { key: "mon", label: "MON" },
  { key: "tue", label: "TUE" },
  { key: "wed", label: "WED" },
  { key: "thu", label: "THU" },
  { key: "fri", label: "FRI" },
] as const;

type Weekday = (typeof weekdays)[number]["key"];

type ScheduleItem =
  | {
      kind: "class";
      id: string;
      start: string;
      end: string;
      title: string;
      courseCode: string;
      room: string;
      lecturer: string;
    }
  | {
      kind: "break";
      id: string;
      start: string;
      end: string;
      label: string;
    };

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function minutesSinceMidnight(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatWeekRange(start: Date, end: Date) {
  const month = new Intl.DateTimeFormat("en", { month: "short" });
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} – ${end.getDate()} ${month.format(end)}`;
  }
  return `${start.getDate()} ${month.format(start)} – ${end.getDate()} ${month.format(end)}`;
}

export default function WeekTimetableScreen() {
  const { colors, spacing, radius } = useTheme();
  const { breaks, courses, meta, semester, timetable } = useData();

  const weekStart = new Date(`${semester.currentWeek.start}T00:00:00`);
  const weekEnd = new Date(`${semester.currentWeek.end}T00:00:00`);
  const weekDays = weekdays.map((weekday, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return { ...weekday, date, dateKey: dateKey(date) };
  });
  const todayKey = meta.now.slice(0, 10);
  const initialDay =
    weekDays.find((day) => day.dateKey === todayKey) ?? weekDays[0];
  const [selectedDay, setSelectedDay] = useState<Weekday>(initialDay.key);
  const selectedDate = weekDays.find((day) => day.key === selectedDay);
  const selectedClasses = timetable
    .filter((entry) => entry.day === selectedDay)
    .map((entry): ScheduleItem => {
      const course = courses.find((item) => item.id === entry.courseId);
      if (!course) {
        throw new Error(`Missing course for timetable entry ${entry.id}`);
      }

      return {
        kind: "class",
        id: entry.id,
        start: entry.start,
        end: entry.end,
        title: course.title,
        courseCode: course.code,
        room: entry.room,
        lecturer: course.lecturer,
      };
    });
  const selectedBreaks: ScheduleItem[] = breaks
    .filter((item) => item.day === selectedDay)
    .map((item) => ({
      kind: "break",
      id: `${item.day}-${item.start}`,
      start: item.start,
      end: item.end,
      label: item.label,
    }));
  const schedule = [...selectedClasses, ...selectedBreaks].sort((a, b) =>
    a.start.localeCompare(b.start),
  );
  const nowMinutes = minutesSinceMidnight(meta.now.slice(11, 16));

  return (
    <Screen
      style={{
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xxl,
      }}
    >
      <Pressable
        accessibilityLabel="Back to Home"
        accessibilityRole="button"
        onPress={() => router.back()}
        style={{
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radius.full,
          backgroundColor: colors.surface,
        }}
      >
        <Feather name="chevron-left" size={24} color={colors.text} />
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <Text variant="h1">This week</Text>
        <Text variant="body" color="textMuted" style={{ paddingBottom: 4 }}>
          {formatWeekRange(weekStart, weekEnd)}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        {weekDays.map((day) => {
          const isSelected = day.key === selectedDay;
          const hasClasses = timetable.some((entry) => entry.day === day.key);

          return (
            <Pressable
              key={day.key}
              accessibilityLabel={`${day.label}, ${day.date.getDate()}${hasClasses ? ", has classes" : ", no classes"}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setSelectedDay(day.key)}
              style={{
                flex: 1,
                minHeight: 96,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: radius.lg,
                backgroundColor: isSelected ? colors.primary : colors.surface,
              }}
            >
              <Text
                variant="bodyBold"
                color={isSelected ? "onPrimaryMuted" : "textMuted"}
              >
                {day.label}
              </Text>
              <Text
                variant="h2"
                color={isSelected ? "onPrimary" : "text"}
                style={{ marginTop: spacing.xs }}
              >
                {day.date.getDate()}
              </Text>
              <View
                style={{
                  width: 6,
                  height: 6,
                  marginTop: spacing.xs,
                  borderRadius: radius.full,
                  backgroundColor: hasClasses
                    ? isSelected
                      ? colors.secondary
                      : colors.primary
                    : "transparent",
                }}
              />
            </Pressable>
          );
        })}
      </View>

      {schedule.length > 0 ? (
        <View style={{ gap: spacing.md }}>
          {schedule.map((item) => {
            if (item.kind === "break") {
              return (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                    minHeight: 36,
                  }}
                >
                  <Text
                    variant="caption"
                    color="textMuted"
                    style={{ width: 50 }}
                  >
                    {item.start}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      borderBottomWidth: 1,
                      borderStyle: "dashed",
                      borderBottomColor: colors.border,
                    }}
                  />
                  <Text variant="caption" color="textMuted">
                    {item.label}
                  </Text>
                </View>
              );
            }

            const isNow =
              selectedDate?.dateKey === todayKey &&
              nowMinutes >= minutesSinceMidnight(item.start) &&
              nowMinutes < minutesSinceMidnight(item.end);

            return (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <View style={{ width: 50 }}>
                  <Text variant="bodyBold">{item.start}</Text>
                  <Text variant="caption" color="textMuted">
                    {item.end}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.lg,
                    gap: spacing.xs,
                    borderRadius: radius.lg,
                    backgroundColor: isNow ? colors.secondary : colors.surface,
                  }}
                >
                  {isNow && (
                    <Text variant="label" color="onSecondary">
                      Now
                    </Text>
                  )}
                  <Text variant="h3">{item.title}</Text>
                  <Text variant="body" color="textMuted">
                    {item.courseCode} · {item.room} · {item.lecturer}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.xxl,
            gap: spacing.sm,
          }}
        >
          <Text variant="h3">A little breathing room</Text>
          <Text variant="body" color="textMuted" style={{ textAlign: "center" }}>
            No classes or breaks scheduled for this day.
          </Text>
        </View>
      )}
    </Screen>
  );
}
