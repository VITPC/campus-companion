import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { useData } from "@/hooks/useData";
import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ---------- Types ----------

type Attachment = { name: string; sizeBytes: number; url: string };

type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueAt: string;
  maxScore: number;
  status: "todo" | "submitted" | "graded";
  attachments: Attachment[];
  submittedAt: string | null;
  score: number | null;
};

type Tab = "todo" | "submitted";

// ---------- Date maths ----------
// Formatted by hand (no Intl) so it looks the same on iOS and Android.

const MS_PER_DAY = 86_400_000;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const GOOD_SCORE_RATIO = 14 / 20;
const PICK_DELAY_MS = 900;

const pad = (n: number) => String(n).padStart(2, "0");

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Compares local midnights, so 23:59 tonight is 0 days away, not 1.
function calendarDaysUntil(due: Date, now: Date) {
  return Math.round(
    (startOfDay(due).getTime() - startOfDay(now).getTime()) / MS_PER_DAY,
  );
}

function formatDue(dueAt: string, now: Date) {
  const due = new Date(dueAt);
  if (due.getTime() < now.getTime()) return "Overdue";

  const days = calendarDaysUntil(due, now);
  const when =
    days === 0
      ? "Due today"
      : days === 1
        ? "Due tomorrow"
        : `Due in ${days} days`;
  const time = `${pad(due.getHours())}:${pad(due.getMinutes())}`;
  return `${when} · ${DAYS[due.getDay()]} ${time}`;
}

function formatShortDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function formatSize(bytes: number) {
  const kb = bytes / 1024;
  return kb >= 1024
    ? `${(kb / 1024).toFixed(1)} MB`
    : `${Math.round(kb)} KB`;
}

// ---------- Screen ----------

export default function AssignmentsScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { assignments: allAssignments, courses, now: nowIso } = useData();
  const { spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const now = useMemo(() => new Date(nowIso), [nowIso]);
  const course = courses.find((c) => c.id === courseId);

  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    (allAssignments as Assignment[]).filter((a) => a.courseId === courseId),
  );
  const [tab, setTab] = useState<Tab>("todo");
  // Files chosen, but the card has not moved to Submitted yet.
  const [pickedNames, setPickedNames] = useState<Record<string, string>>({});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const t of pending) clearTimeout(t);
    };
  }, []);

  const todo = useMemo(
    () =>
      assignments
        .filter((a) => a.status === "todo")
        .sort(
          (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
        ),
    [assignments],
  );
  // "Submitted" includes graded work.
  const submitted = useMemo(
    () =>
      assignments
        .filter((a) => a.status !== "todo")
        .sort((a, b) => (b.submittedAt ?? "").localeCompare(a.submittedAt ?? "")),
    [assignments],
  );
  const recentlyGraded = useMemo(
    () => submitted.filter((a) => a.status === "graded").slice(0, 3),
    [submitted],
  );

  function markSubmitted(id: string) {
    // Immutable update: new array, new object only for the changed item.
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "submitted", submittedAt: nowIso } : a,
      ),
    );
    setPickedNames((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([key]) => key !== id)),
    );
  }

  async function handleUpload(id: string) {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: false,
      });

      // Cancelled picker: change nothing.
      if (result.canceled) return;
      const [file] = result.assets;
      if (!file) return;

      setPickedNames((prev) => ({ ...prev, [id]: file.name }));
      // Short pause so the chosen file name is visible before the card moves.
      timers.current.push(setTimeout(() => markSubmitted(id), PICK_DELAY_MS));
    } catch {
      // The picker failed to open: leave everything as it was.
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen
        style={{
          paddingHorizontal: spacing.xl,
          paddingTop: insets.top + spacing.md,
        }}
      >
        <BackButton />

        <View style={{ gap: spacing.xs }}>
          <Text variant="overline" color="textMuted">
            {course ? `${course.code} · ${course.title}` : "Course"}
          </Text>
          <Text variant="h1">Assignments</Text>
        </View>

        <SegmentedControl
          tab={tab}
          onChange={setTab}
          todoCount={todo.length}
          submittedCount={submitted.length}
        />

        {tab === "todo" ? (
          <>
            {todo.length === 0 && (
              <Text color="textMuted" style={{ textAlign: "center" }}>
                Nothing to hand in right now.
              </Text>
            )}
            {todo.map((a) => (
              <TodoCard
                key={a.id}
                assignment={a}
                now={now}
                pickedName={pickedNames[a.id]}
                onUpload={() => handleUpload(a.id)}
              />
            ))}

            {recentlyGraded.length > 0 && (
              <View style={{ marginTop: spacing.sm }}>
                <Text variant="overline" color="textMuted">
                  Recently graded
                </Text>
                {recentlyGraded.map((a, i) => (
                  <ResultRow
                    key={a.id}
                    assignment={a}
                    last={i === recentlyGraded.length - 1}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <View>
            {submitted.length === 0 && (
              <Text color="textMuted" style={{ textAlign: "center" }}>
                You haven't submitted anything yet.
              </Text>
            )}
            {submitted.map((a, i) => (
              <ResultRow
                key={a.id}
                assignment={a}
                last={i === submitted.length - 1}
              />
            ))}
          </View>
        )}
      </Screen>
    </>
  );
}

// ---------- Components ----------

function BackButton() {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Back"
      style={{
        width: 44,
        height: 44,
        borderRadius: radius.full,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Feather name="chevron-left" size={24} color={colors.text} />
    </Pressable>
  );
}

function SegmentedControl({
  tab,
  onChange,
  todoCount,
  submittedCount,
}: {
  tab: Tab;
  onChange: (tab: Tab) => void;
  todoCount: number;
  submittedCount: number;
}) {
  const { colors, radius } = useTheme();

  const items: { key: Tab; label: string }[] = [
    { key: "todo", label: `To do · ${todoCount}` },
    { key: "submitted", label: `Submitted · ${submittedCount}` },
  ];

  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        backgroundColor: colors.surface,
        borderRadius: radius.full,
        padding: 4,
      }}
    >
      {items.map((item) => {
        const active = tab === item.key;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={{
              flex: 1,
              height: 44,
              borderRadius: radius.full,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: active ? colors.background : "transparent",
              shadowColor: colors.text,
              shadowOpacity: active ? 0.1 : 0,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              elevation: active ? 2 : 0,
            }}
          >
            <Text
              variant="bodyBold"
              color={active ? "text" : "textMuted"}
              style={{ fontSize: 16 }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function TodoCard({
  assignment,
  now,
  pickedName,
  onUpload,
}: {
  assignment: Assignment;
  now: Date;
  pickedName?: string;
  onUpload: () => void;
}) {
  const { colors, spacing, radius } = useTheme();
  const busy = pickedName !== undefined;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: radius.lg,
        padding: spacing.lg + spacing.xs,
        gap: spacing.md,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            backgroundColor: colors.dangerSoft,
            borderRadius: radius.full,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs + 2,
          }}
        >
          <Feather name="clock" size={16} color={colors.dangerText} />
          <Text
            variant="bodyBold"
            color="dangerText"
            style={{ fontSize: 14 }}
          >
            {formatDue(assignment.dueAt, now)}
          </Text>
        </View>
        <Text variant="bodyBold" color="textMuted">
          {assignment.maxScore} marks
        </Text>
      </View>

      <Text variant="h2">{assignment.title}</Text>
      <Text color="textMuted">{assignment.description}</Text>

      {assignment.attachments.map((file) => (
        <FileRow
          key={file.name}
          icon="paperclip"
          name={file.name}
          size={formatSize(file.sizeBytes)}
        />
      ))}

      {busy && <FileRow icon="check-circle" name={pickedName} />}

      <Pressable
        onPress={onUpload}
        disabled={busy}
        accessibilityRole="button"
        style={{
          height: 56,
          borderRadius: radius.full,
          backgroundColor: colors.primary,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.sm,
          opacity: busy ? 0.6 : 1,
        }}
      >
        <Feather name="arrow-up" size={22} color={colors.secondary} />
        <Text variant="h3" color="onPrimary">
          {busy ? "Submitting…" : "Upload submission"}
        </Text>
      </Pressable>
    </View>
  );
}

function FileRow({
  icon,
  name,
  size,
}: {
  icon: "paperclip" | "check-circle";
  name: string;
  size?: string;
}) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        paddingHorizontal: spacing.lg,
        height: 48,
      }}
    >
      <Feather
        name={icon}
        size={20}
        color={icon === "check-circle" ? colors.success : colors.text}
      />
      <Text numberOfLines={1} style={{ flex: 1 }}>
        {name}
      </Text>
      {size && (
        <Text color="textMuted" style={{ fontSize: 14 }}>
          {size}
        </Text>
      )}
    </View>
  );
}

function ResultRow({
  assignment,
  last,
}: {
  assignment: Assignment;
  last: boolean;
}) {
  const { colors, spacing } = useTheme();
  const { score, maxScore } = assignment;
  const graded = assignment.status === "graded" && score !== null;
  const good = graded && score / maxScore >= GOOD_SCORE_RATIO;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        paddingVertical: spacing.lg,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text variant="h3" numberOfLines={1}>
          {assignment.title}
        </Text>
        <Text color="textMuted">
          Submitted {formatShortDate(assignment.submittedAt)}
        </Text>
      </View>
      {graded ? (
        <Text variant="h2" color={good ? "success" : "text"}>
          {score} / {maxScore}
        </Text>
      ) : (
        <Text variant="label" color="textMuted">
          Awaiting grade
        </Text>
      )}
    </View>
  );
}
