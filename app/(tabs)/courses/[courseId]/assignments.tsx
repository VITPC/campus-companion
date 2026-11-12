
import { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

import { useData } from "@/hooks/useData";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/Text";

type AssignmentFilter =
  | "all"
  | "todo"
  | "submitted"
  | "graded";

export default function AssignmentsScreen() {
  const params = useLocalSearchParams<{
    courseId?: string | string[];
  }>();

  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId ?? "";

  const { getCourse, getAssignments } = useData();
  const { colors, spacing, radius } = useTheme();

  const [selectedFilter, setSelectedFilter] =
    useState<AssignmentFilter>("all");

  const course = getCourse(courseId);
  const assignments = getAssignments(courseId);

  const filters: {
    label: string;
    value: AssignmentFilter;
  }[] = [
    { label: "All", value: "all" },
    { label: "To Do", value: "todo" },
    { label: "Submitted", value: "submitted" },
    { label: "Graded", value: "graded" },
  ];

  const filteredAssignments =
    selectedFilter === "all"
      ? assignments
      : assignments.filter(
          (assignment) =>
            assignment.status === selectedFilter
        );

  const counts = {
    todo: assignments.filter(
      (item) => item.status === "todo"
    ).length,

    submitted: assignments.filter(
      (item) => item.status === "submitted"
    ).length,

    graded: assignments.filter(
      (item) => item.status === "graded"
    ).length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "graded":
        return {
          label: "Graded",
          color: colors.success,
          background: colors.successSoft,
          icon: "checkmark-circle-outline" as const,
        };

      case "submitted":
        return {
          label: "Submitted",
          color: colors.primary,
          background: colors.primarySoft,
          icon: "cloud-done-outline" as const,
        };

      default:
        return {
          label: "To Do",
          color: colors.secondaryText,
          background: colors.secondarySoft,
          icon: "time-outline" as const,
        };
    }
  };

  if (!course) {
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

        <Text variant="h2">Course not found</Text>

        <Text
          color="textMuted"
          style={{
            textAlign: "center",
            marginTop: spacing.sm,
          }}
        >
          The selected course could not be found.
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={{ marginTop: spacing.xl }}
        >
          <Text color="primary" variant="bodyBold">
            Go back
          </Text>
        </Pressable>
      </View>
    );
  }

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
            Assignments
          </Text>

          <Text
            color="text"
            variant="body"
            style={{ marginTop: spacing.xs }}
          >
            {course.code} · {course.title}
          </Text>

          {/* SUMMARY CARDS */}
          <View
            style={{
              flexDirection: "row",
              marginTop: spacing.xl,
              gap: spacing.sm,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: colors.background,
                padding: spacing.md,
                borderRadius: radius.lg,
              }}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color={colors.primary}
              />

              <Text
                variant="h1"
                color="primary"
                style={{ marginTop: spacing.sm }}
              >
                {assignments.length}
              </Text>

              <Text variant="caption" color="textMuted">
                Total
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.background,
                padding: spacing.md,
                borderRadius: radius.lg,
              }}
            >
              <Ionicons
                name="time-outline"
                size={22}
                color={colors.secondaryText}
              />

              <Text
                variant="h1"
                color="text"
                style={{ marginTop: spacing.sm }}
              >
                {counts.todo}
              </Text>

              <Text variant="caption" color="textMuted">
                To Do
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.background,
                padding: spacing.md,
                borderRadius: radius.lg,
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color={colors.success}
              />

              <Text
                variant="h1"
                color="text"
                style={{ marginTop: spacing.sm }}
              >
                {counts.graded}
              </Text>

              <Text variant="caption" color="textMuted">
                Graded
              </Text>
            </View>
          </View>
        </View>

        {/* FILTERS */}
        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xl,
          }}
        >
          <Text variant="h3" color="text">
            My Assignments
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: spacing.md }}
            contentContainerStyle={{ gap: spacing.sm }}
          >
            {filters.map((filter) => {
              const isSelected =
                selectedFilter === filter.value;

              return (
                <Pressable
                  key={filter.value}
                  onPress={() =>
                    setSelectedFilter(filter.value)
                  }
                  style={{
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.surface,
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.sm,
                    borderRadius: radius.full,
                  }}
                >
                  <Text
                    variant="label"
                    color={
                      isSelected
                        ? "background"
                        : "textMuted"
                    }
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ASSIGNMENT LIST */}
        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xl,
          }}
        >
          {filteredAssignments.map((assignment) => {
            const status = getStatusDetails(
              assignment.status
            );

            return (
              <View
                key={assignment.id}
                style={{
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                  marginBottom: spacing.md,
                }}
              >
                {/* TITLE AND STATUS */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: spacing.sm,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      variant="bodyBold"
                      color="text"
                    >
                      {assignment.title}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: status.background,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.xs,
                      borderRadius: radius.full,
                      gap: 4,
                    }}
                  >
                    <Ionicons
                      name={status.icon}
                      size={14}
                      color={status.color}
                    />

                    <Text
                      variant="caption"
                      color="text"
                    >
                      {status.label}
                    </Text>
                  </View>
                </View>

                {/* DESCRIPTION */}
                <Text
                  variant="body"
                  color="textMuted"
                  style={{
                    marginTop: spacing.md,
                    lineHeight: 21,
                  }}
                >
                  {assignment.description}
                </Text>

                {/* DEADLINE */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: spacing.lg,
                    gap: spacing.sm,
                  }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={colors.textMuted}
                  />

                  <View style={{ flex: 1 }}>
                    <Text
                      variant="caption"
                      color="textMuted"
                    >
                      Due date
                    </Text>

                    <Text
                      variant="label"
                      color="text"
                    >
                      {formatDate(assignment.dueAt)}
                    </Text>
                  </View>
                </View>

                {/* SCORE */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: spacing.md,
                    gap: spacing.sm,
                  }}
                >
                  <Ionicons
                    name="trophy-outline"
                    size={18}
                    color={colors.textMuted}
                  />

                  <View style={{ flex: 1 }}>
                    <Text
                      variant="caption"
                      color="textMuted"
                    >
                      Maximum score
                    </Text>

                    <Text
                      variant="label"
                      color="text"
                    >
                      {assignment.maxScore} points
                    </Text>
                  </View>

                  {assignment.status === "graded" &&
                    assignment.score !== null &&
                    assignment.score !== undefined && (
                      <View
                        style={{
                          backgroundColor: colors.successSoft,
                          paddingHorizontal: spacing.md,
                          paddingVertical: spacing.sm,
                          borderRadius: radius.md,
                        }}
                      >
                        <Text
                          variant="bodyBold"
                          color="success"
                        >
                          {assignment.score}/
                          {assignment.maxScore}
                        </Text>
                      </View>
                    )}
                </View>

                {/* ATTACHMENTS */}
                {assignment.attachments &&
                  assignment.attachments.length > 0 && (
                    <View
                      style={{
                        marginTop: spacing.lg,
                        paddingTop: spacing.md,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                      }}
                    >
                      <Text
                        variant="caption"
                        color="textMuted"
                      >
                        <Ionicons
                          name="attach-outline"
                          size={14}
                        />{" "}
                        {assignment.attachments.length} attachment(s)
                      </Text>
                    </View>
                  )}
              </View>
            );
          })}

          {/* EMPTY STATE */}
          {filteredAssignments.length === 0 && (
            <View
              style={{
                alignItems: "center",
                paddingVertical: spacing.xxl,
              }}
            >
              <Ionicons
                name="clipboard-outline"
                size={44}
                color={colors.textMuted}
              />

              <Text
                variant="h3"
                style={{ marginTop: spacing.md }}
              >
                No assignments found
              </Text>

              <Text
                color="textMuted"
                variant="body"
                style={{
                  textAlign: "center",
                  marginTop: spacing.xs,
                }}
              >
                There are no assignments in this category.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
