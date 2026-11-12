// app/(tabs)/courses/index.tsx
// Courses list (issue #10, design/screens/03-courses.png):
// semester overline, title, search, filter chips and the list of courses.
import { Feather } from "@expo/vector-icons";
import { type Href, router } from "expo-router";
import { type ReactElement, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CourseRow } from "@/components/courses/CourseRow";
import { FilterChip } from "@/components/courses/FilterChip";
import { SearchBar } from "@/components/courses/SearchBar";
import { Text } from "@/components/ui/Text";
import { useAsync } from "@/hooks/useAsync";
import { useTheme } from "@/hooks/useTheme";
import { getAllAssignments, getCourses, getSemester } from "@/services/api";
import {
  type CourseFilter,
  countDueThisWeek,
  filterCourses,
} from "@/utils/courses";

// Room to scroll the last row above the floating tab bar
// (64 high + 28 from the bottom + 24 gap), same as components/ui/Screen.
const TAB_BAR_SPACE = 116;

// Everything this screen needs, fetched together so there is one loading
// state and pull to refresh reloads all of it at once.
async function loadCoursesScreen() {
  const [courses, todo, semester] = await Promise.all([
    getCourses(),
    getAllAssignments("todo"),
    getSemester(),
  ]);
  return {
    courses,
    semester,
    dueCounts: countDueThisWeek(todo, semester.currentWeek),
  };
}

function openCourse(courseId: string) {
  // The [courseId] route is added by issue #11. Until it is merged, typed
  // routes don't know it exists, hence the cast. TODO(#11): remove `as Href`.
  router.push(`/courses/${encodeURIComponent(courseId)}` as Href);
}

export default function CoursesScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { data, loading, error, reload } = useAsync(loadCoursesScreen);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CourseFilter>("all");

  // Derived on every render instead of kept in state: it can never get out
  // of sync with the search text, the chip or the data.
  const courses = data?.courses ?? [];
  const visible = filterCourses(courses, query, filter);

  const filters: { value: CourseFilter; label: string }[] = [
    { value: "all", label: data ? `All · ${courses.length}` : "All" },
    { value: "core", label: "Core" },
    { value: "elective", label: "Electives" },
  ];

  const clearSearch = () => {
    setQuery("");
    setFilter("all");
  };

  // Passed to FlatList as an element (not a component), so the search box
  // isn't re-created on every keystroke and keeps the keyboard open.
  const header = (
    <View style={{ gap: spacing.lg, paddingBottom: spacing.sm }}>
      <View>
        {/* A space keeps the line's height while the semester loads */}
        <Text variant="overline" color="textMuted">
          {data?.semester.label ?? " "}
        </Text>
        <Text variant="h1" accessibilityRole="header">
          Courses
        </Text>
      </View>

      <SearchBar value={query} onChangeText={setQuery} />

      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        {filters.map((f) => (
          <FilterChip
            key={f.value}
            label={f.label}
            selected={filter === f.value}
            onPress={() => setFilter(f.value)}
          />
        ))}
      </View>

      {/* A refresh failed but we still have the old list: say so, keep it */}
      {error && data && (
        <Text variant="caption" color="dangerText">
          {"Couldn't refresh. Pull down to try again."}
        </Text>
      )}
    </View>
  );

  // What to show when there are no rows: first load, failed first load,
  // or a search/filter that matches nothing.
  let empty: ReactElement;
  if (!data && error) {
    empty = (
      <Message
        icon="wifi-off"
        title="Couldn't load your courses"
        body={error.message}
        action="Try again"
        onAction={reload}
      />
    );
  } else if (!data) {
    empty = (
      <ActivityIndicator
        color={colors.primary}
        style={{ marginTop: spacing.xxl }}
      />
    );
  } else {
    empty = (
      <Message
        icon="search"
        title="No courses found"
        body={
          query.trim()
            ? `Nothing matches "${query.trim()}". Check the spelling or try a course code like CSC 201.`
            : "There are no courses in this category."
        }
        action="Clear search"
        onAction={clearSearch}
      />
    );
  }

  return (
    <FlatList
      data={visible}
      keyExtractor={(course) => course.id}
      renderItem={({ item, index }) => (
        <CourseRow
          course={item}
          dueCount={data?.dueCounts[item.id] ?? 0}
          highlighted={index === 0}
          showDivider={index < visible.length - 1}
          onPress={() => openCourse(item.id)}
        />
      )}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      refreshControl={
        <RefreshControl
          // Only for pull to refresh; the first load shows the spinner above.
          refreshing={loading && data !== null}
          onRefresh={reload}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      // Tapping a row while the keyboard is open opens the course straight
      // away; scrolling the list hides the keyboard.
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.xl,
        paddingHorizontal: spacing.xl,
        paddingBottom: TAB_BAR_SPACE,
      }}
    />
  );
}

type MessageProps = {
  icon: "search" | "wifi-off";
  title: string;
  body: string;
  action: string;
  onAction: () => void;
};

// Centered icon + text + button, for the empty and error states.
function Message({ icon, title, body, action, onAction }: MessageProps) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        gap: spacing.sm,
        paddingTop: spacing.xxl,
        paddingHorizontal: spacing.lg,
      }}
    >
      <Feather name={icon} size={32} color={colors.textMuted} />
      <Text variant="h3" style={{ marginTop: spacing.sm }}>
        {title}
      </Text>
      <Text color="textMuted" style={{ textAlign: "center" }}>
        {body}
      </Text>
      <Pressable
        onPress={onAction}
        accessibilityRole="button"
        style={({ pressed }) => ({
          marginTop: spacing.md,
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,
          borderRadius: radius.full,
          backgroundColor: colors.primary,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text variant="bodyBold" color="onPrimary">
          {action}
        </Text>
      </Pressable>
    </View>
  );
}
