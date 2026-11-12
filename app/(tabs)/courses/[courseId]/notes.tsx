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

type NoteCategory = "all" | "lectures" | "tutorials" | "pastPapers";

export default function NotesScreen() {
  const params = useLocalSearchParams<{
    courseId?: string | string[];
  }>();

  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId ?? "";

  const { getCourse, getNotes } = useData();
  const { colors, spacing, radius } = useTheme();

  const [selectedCategory, setSelectedCategory] =
    useState<NoteCategory>("all");

  const course = getCourse(courseId);
  const notes = getNotes(courseId);

  const categories: {
    label: string;
    value: NoteCategory;
  }[] = [
    { label: "All", value: "all" },
    { label: "Lectures", value: "lectures" },
    { label: "Tutorials", value: "tutorials" },
    { label: "Past Papers", value: "pastPapers" },
  ];

  const filteredNotes =
    selectedCategory === "all"
      ? notes
      : notes.filter(
          (note) => note.category === selectedCategory
        );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return "document-text-outline" as const;
      case "ppt":
        return "easel-outline" as const;
      case "doc":
        return "document-outline" as const;
      default:
        return "document-attach-outline" as const;
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
            Course Notes
          </Text>

          <Text
            color="text"
            variant="body"
            style={{ marginTop: spacing.xs }}
          >
            {course.code} · {course.title}
          </Text>

          {/* NOTES SUMMARY */}
          <View
            style={{
              flexDirection: "row",
              marginTop: spacing.xl,
              gap: spacing.md,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: colors.background,
                padding: spacing.lg,
                borderRadius: radius.lg,
              }}
            >
              <Ionicons
                name="folder-open-outline"
                size={24}
                color={colors.primary}
              />

              <Text
                variant="h1"
                color="primary"
                style={{ marginTop: spacing.sm }}
              >
                {notes.length}
              </Text>

              <Text variant="caption" color="textMuted">
                Total files
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.background,
                padding: spacing.lg,
                borderRadius: radius.lg,
              }}
            >
              <Ionicons
                name="sparkles-outline"
                size={24}
                color={colors.secondaryText}
              />

              <Text
                variant="h1"
                color="text"
                style={{ marginTop: spacing.sm }}
              >
                {notes.filter((note) => note.isNew).length}
              </Text>

              <Text variant="caption" color="textMuted">
                New materials
              </Text>
            </View>
          </View>
        </View>

        {/* CATEGORY FILTERS */}
        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xl,
          }}
        >
          <Text variant="h3" color="text">
            Browse Materials
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: spacing.md }}
            contentContainerStyle={{ gap: spacing.sm }}
          >
            {categories.map((category) => {
              const isSelected =
                selectedCategory === category.value;

              return (
                <Pressable
                  key={category.value}
                  onPress={() =>
                    setSelectedCategory(category.value)
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
                    color={isSelected ? "background" : "textMuted"}
                  >
                    {category.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* FILE LIST */}
        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xl,
          }}
        >
          <Text
            variant="h3"
            color="text"
            style={{ marginBottom: spacing.md }}
          >
            {selectedCategory === "all"
              ? "All Materials"
              : categories.find(
                  (item) => item.value === selectedCategory
                )?.label}
            {" "}({filteredNotes.length})
          </Text>

          {filteredNotes.map((note) => (
            <View
              key={note.id}
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radius.lg,
                padding: spacing.lg,
                marginBottom: spacing.md,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* FILE ICON */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: radius.md,
                  backgroundColor: colors.primarySoft,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name={getFileIcon(note.fileType)}
                  size={25}
                  color={colors.primary}
                />
              </View>

              {/* FILE INFORMATION */}
              <View
                style={{
                  flex: 1,
                  marginLeft: spacing.md,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: spacing.xs,
                  }}
                >
                  <Text variant="bodyBold" color="text">
                    {note.title}
                  </Text>

                  {note.isNew && (
                    <View
                      style={{
                        backgroundColor: colors.secondarySoft,
                        paddingHorizontal: spacing.xs,
                        paddingVertical: 2,
                        borderRadius: radius.sm,
                      }}
                    >
                      <Text
                        variant="caption"
                        color="text"
                      >
                        NEW
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: spacing.xs }}
                >
                  {note.fileType.toUpperCase()} ·{" "}
                  {formatFileSize(note.sizeBytes)}
                </Text>

                <Text
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: spacing.xs }}
                >
                  {note.category === "pastPapers"
                    ? "Past examination paper"
                    : note.category === "tutorials"
                    ? "Tutorial material"
                    : "Lecture material"}
                </Text>
              </View>

              {/* OPEN FILE */}
              <Pressable
                onPress={() => {
                  // File opening will be connected in a later step.
                }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: radius.full,
                  backgroundColor: colors.surface,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: spacing.sm,
                }}
              >
                <Ionicons
                  name="download-outline"
                  size={21}
                  color={colors.primary}
                />
              </Pressable>
            </View>
          ))}

          {filteredNotes.length === 0 && (
            <View
              style={{
                alignItems: "center",
                paddingVertical: spacing.xxl,
              }}
            >
              <Ionicons
                name="folder-open-outline"
                size={42}
                color={colors.textMuted}
              />

              <Text
                variant="h3"
                style={{ marginTop: spacing.md }}
              >
                No materials found
              </Text>

              <Text
                color="textMuted"
                variant="body"
                style={{
                  textAlign: "center",
                  marginTop: spacing.xs,
                }}
              >
                There are no files in this category yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
