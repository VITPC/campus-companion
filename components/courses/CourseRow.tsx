// components/courses/CourseRow.tsx
// One row of the Courses list:
//   [CSC 201 tile]  Title                       [1 due]  >
//                   Lecturer · N credits
//
// TODO(#3): when the shared ListRow from issue #3 is merged, build this row
// on top of it (tile → `leading`, due pill + chevron → `trailing`). The props
// of CourseRow can stay the same, so the Courses screen won't need to change.
import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { Course } from "@/types/models";
import { splitCourseCode } from "@/utils/courses";

/** Width and height of the code tile. Fixed so every row's text lines up. */
const TILE_SIZE = 52;

type Props = {
  course: Course;
  /** Number of `todo` assignments due this week. 0 hides the pill. */
  dueCount: number;
  /** Yellow tile instead of the soft blue one. */
  highlighted: boolean;
  /** Line under the row. Off for the last row. */
  showDivider: boolean;
  onPress: () => void;
};

export function CourseRow({
  course,
  dueCount,
  highlighted,
  showDivider,
  onPress,
}: Props) {
  const { colors, spacing, radius } = useTheme();
  const { prefix, number } = splitCourseCode(course.code);
  const tileText = highlighted ? "onSecondary" : "primary";
  const credits = `${course.credits} ${course.credits === 1 ? "credit" : "credits"}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${course.title}, ${course.code}, ${course.lecturer}, ${credits}${
        dueCount > 0 ? `, ${dueCount} due this week` : ""
      }`}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.lg,
        paddingVertical: spacing.lg,
        borderBottomWidth: showDivider ? 1 : 0,
        borderBottomColor: colors.border,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      {/* Leading: two-line course code tile */}
      <View
        style={{
          width: TILE_SIZE,
          height: TILE_SIZE,
          borderRadius: radius.md,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: highlighted ? colors.secondary : colors.primarySoft,
        }}
      >
        <Text variant="label" color={tileText}>
          {prefix}
        </Text>
        <Text variant="h3" color={tileText}>
          {number}
        </Text>
      </View>

      {/* Middle: grows to fill the space, long text is cut with "…" */}
      <View style={{ flex: 1 }}>
        <Text variant="bodyBold" numberOfLines={1}>
          {course.title}
        </Text>
        <Text variant="caption" color="textMuted" numberOfLines={1}>
          {course.lecturer} · {credits}
        </Text>
      </View>

      {/* Trailing: due pill (only if something is due) and chevron */}
      {dueCount > 0 && (
        <View
          style={{
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
            borderRadius: radius.full,
            backgroundColor: colors.dangerSoft,
          }}
        >
          <Text
            variant="caption"
            color="dangerText"
            style={{ fontFamily: fonts.semibold }}
          >
            {dueCount} due
          </Text>
        </View>
      )}
      <Feather name="chevron-right" size={20} color={colors.textMuted} />
    </Pressable>
  );
}
