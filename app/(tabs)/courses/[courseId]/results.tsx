import { View, ScrollView, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

import { useData } from "@/hooks/useData";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/Text";

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    courseId?: string | string[];
  }>();

  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId ?? "";

  const { getCourse, getResults } = useData();
  const { colors, spacing, radius } = useTheme();

  const course = getCourse(courseId);
  const results = getResults(courseId);

  if (!course || !results) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.xl,
        }}
      >
        <StatusBar style="dark" />

        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={colors.textMuted}
        />

        <Text variant="h2" style={{ marginTop: spacing.md }}>
          Results unavailable
        </Text>

        <Text
          color="textMuted"
          style={{
            textAlign: "center",
            marginTop: spacing.sm,
          }}
        >
          No results are available for this course.
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: spacing.xl,
            backgroundColor: colors.primary,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
          }}
        >
          <Text color="background" variant="bodyBold">
            Go back
          </Text>
        </Pressable>
      </View>
    );
  }

  const published = results.assessments.filter(
    (item) => item.status === "published"
  );

  const pending = results.assessments.filter(
    (item) => item.status === "pending"
  );

  const caAverage = results.caAverage;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}
        <View
          style={{
            backgroundColor: colors.secondary,
            paddingHorizontal: spacing.xl,
            paddingTop: 60,
            paddingBottom: spacing.xxl,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 42,
              height: 42,
              borderRadius: radius.full,
              backgroundColor: colors.background,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.text}
            />
          </Pressable>

          <Text
            variant="h1"
            color="text"
            style={{ marginTop: spacing.xl }}
          >
            Results
          </Text>

          <Text
            variant="body"
            color="text"
            style={{ marginTop: spacing.xs }}
          >
            {course.code} · {course.title}
          </Text>

          {/* AVERAGE */}
          <View
            style={{
              marginTop: spacing.xl,
              backgroundColor: colors.background,
              padding: spacing.lg,
              borderRadius: radius.lg,
            }}
          >
            <Text variant="body" color="textMuted">
              Continuous Assessment Average
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: spacing.sm,
              }}
            >
              <Text variant="h1" color="primary">
                {caAverage ?? "—"}
              </Text>

              <Text
                variant="bodyBold"
                color="textMuted"
                style={{ marginLeft: spacing.xs }}
              >
                / {results.outOf}
              </Text>
            </View>

            <Text
              variant="bodyBold"
              color="text"
              style={{ marginTop: spacing.sm }}
            >
              Grade: {results.grade ?? "Pending"}
            </Text>
          </View>
        </View>

        {/* ASSESSMENT SUMMARY */}
        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xl,
          }}
        >
          <Text variant="h3" color="text">
            Assessment Summary
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: spacing.md,
              gap: spacing.md,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: colors.successSoft,
                padding: spacing.lg,
                borderRadius: radius.lg,
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={colors.success}
              />

              <Text variant="h2" color="text" style={{ marginTop: spacing.sm }}>
                {published.length}
              </Text>

              <Text variant="caption" color="textMuted">
                Published
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.secondarySoft,
                padding: spacing.lg,
                borderRadius: radius.lg,
              }}
            >
              <Ionicons
                name="time-outline"
                size={24}
                color={colors.secondaryText}
              />

              <Text variant="h2" color="text" style={{ marginTop: spacing.sm }}>
                {pending.length}
              </Text>

              <Text variant="caption" color="textMuted">
                Pending
              </Text>
            </View>
          </View>

          {/* ASSESSMENT LIST */}
          <Text
            variant="h3"
            color="text"
            style={{ marginTop: spacing.xl, marginBottom: spacing.md }}
          >
            All Assessments
          </Text>

          {results.assessments.map((assessment) => {
            const isPublished = assessment.status === "published";

            return (
              <View
                key={assessment.id}
                style={{
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                  marginBottom: spacing.md,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text variant="bodyBold" color="text">
                      {assessment.title}
                    </Text>

                    <Text
                      variant="caption"
                      color="textMuted"
                      style={{ marginTop: spacing.xs }}
                    >
                      Weight: {Math.round(assessment.weight * 100)}%
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: isPublished
                        ? colors.successSoft
                        : colors.secondarySoft,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.xs,
                      borderRadius: radius.full,
                    }}
                  >
                    <Text
                      variant="caption"
                      color={isPublished ? "success" : "textMuted"}
                    >
                      {isPublished ? "Published" : "Pending"}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: spacing.lg,
                  }}
                >
                  <Text color="textMuted" variant="body">
                    Score
                  </Text>

                  <Text variant="h3" color="primary">
                    {assessment.score === null
                      ? "Not available"
                      : `${assessment.score} / ${assessment.outOf}`}
                  </Text>
                </View>

                {assessment.scheduledFor && (
                  <Text
                    variant="caption"
                    color="textMuted"
                    style={{ marginTop: spacing.sm }}
                  >
                    Scheduled:{" "}
                    {new Date(
                      `${assessment.scheduledFor}T00:00:00`
                    ).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}