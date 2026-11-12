// components/profile/ChangePhotoSheet.tsx
// Issue #17: the "change profile photo" bottom sheet. Rendered by the Profile
// screen; reads and writes the shared photo through the settings context.
// Layout and behaviour: MY_UI_IMPLEMENTATION.md §8.
import { Feather } from "@expo/vector-icons";
import { Directory, File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import {
  type ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  type LayoutChangeEvent,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text";
import { fonts, palette, radius } from "@/constants/theme";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import data from "@/mocks/data.json";

const student = data.student;

const AVATAR_SIZE = 64;
const OPEN_MS = 280; // §8.6 [?: duration not in the design]
const CLOSE_MS = 200;
// iOS: present the system picker only after the sheet's Modal has fully closed.
const CLOSE_SETTLE_MS = 100;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // §8.7.4

type props = {
  visible: boolean;
  onClose: () => void;
};

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// §8.7: camera/cropped images can live in an OS-purgeable cache directory.
// `expo-file-system` is already installed, so copy the picked file into the
// app's document directory and store that stable URI. A unique filename keeps
// expo-image from serving a stale cached image for a reused path. Falls back to
// the picked URI if the copy fails (e.g. on web).
async function persistPhoto(uri: string): Promise<string> {
  try {
    const directory = new Directory(Paths.document, "profile-photo");
    if (!directory.exists) {
      directory.create({ intermediates: true, idempotent: true });
    }
    // Keep only the current photo.
    for (const entry of directory.list()) {
      entry.delete();
    }
    const extension = Paths.extname(uri) || ".jpg";
    const destination = new File(directory, `photo-${Date.now()}${extension}`);
    await new File(uri).copy(destination);
    return destination.uri;
  } catch (error) {
    console.warn(
      "Could not persist the profile photo; using the picked URI",
      error,
    );
    return uri;
  }
}

export function ChangePhotoSheet({ visible, onClose }: props) {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const { photoUri, setPhotoUri } = useSettings();
  const insets = useSafeAreaInsets();

  // Kept mounted through the close animation, then hidden (§8.6).
  const [mounted, setMounted] = useState(visible);
  // Lazy initialisers keep one Animated.Value for the component's lifetime
  // (same pattern as components/ui/Switch.tsx).
  const [backdropOpacity] = useState(() => new Animated.Value(0));
  // Start off-screen so the first frame of a freshly mounted sheet never flashes.
  const [translateY] = useState(
    () => new Animated.Value(Dimensions.get("window").height),
  );
  const sheetHeight = useRef(0);
  const closeResolvers = useRef<(() => void)[]>([]);

  // Adjust state during render instead of in an effect (a supported React
  // pattern), so the Modal mounts in the same commit that `visible` flips true.
  if (visible && !mounted) setMounted(true);

  const flushClose = useCallback(() => {
    const resolvers = closeResolvers.current;
    closeResolvers.current = [];
    for (const resolve of resolvers) resolve();
  }, []);

  // Slide in once mounted and visible.
  useEffect(() => {
    if (!mounted || !visible) return;
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: OPEN_MS,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: OPEN_MS,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [mounted, visible, backdropOpacity, translateY]);

  // Slide out, then unmount and release any picker awaiting the close.
  useEffect(() => {
    if (visible || !mounted) return;
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: CLOSE_MS,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: sheetHeight.current,
        duration: CLOSE_MS,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) return;
      setMounted(false);
      flushClose();
    });
  }, [visible, mounted, backdropOpacity, translateY, flushClose]);

  // Ask the parent to close and resolve once the close animation has finished.
  const closeSheet = useCallback((): Promise<void> => {
    if (!mounted) return Promise.resolve();
    return new Promise<void>((resolve) => {
      closeResolvers.current.push(resolve);
      onClose();
    });
  }, [mounted, onClose]);

  const onSheetLayout = (event: LayoutChangeEvent) => {
    sheetHeight.current = event.nativeEvent.layout.height;
  };

  const pickPhoto = async (source: "camera" | "gallery") => {
    try {
      await closeSheet();
      await delay(CLOSE_SETTLE_MS);

      const permission =
        source === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          t("photo.permissionTitle"),
          t(
            source === "camera"
              ? "photo.cameraPermission"
              : "photo.galleryPermission",
          ),
          [
            { text: t("common.cancel"), style: "cancel" },
            {
              text: t("photo.openSettings"),
              onPress: () => {
                void Linking.openSettings();
              },
            },
          ],
        );
        return;
      }

      const options: ImagePicker.ImagePickerOptions = {
        // `mediaTypes: ['images']` is the non-deprecated form (§8.7.2).
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      if (result.canceled) return;
      const asset = result.assets[0];
      if (!asset) return;
      if (asset.fileSize != null && asset.fileSize > MAX_PHOTO_BYTES) {
        Alert.alert(t("common.error"), t("photo.tooLarge"));
        return;
      }
      setPhotoUri(await persistPhoto(asset.uri));
    } catch (error) {
      console.warn("Image picker failed", error);
      Alert.alert(t("common.error"));
    }
  };

  const removePhoto = () => {
    setPhotoUri(null);
    void closeSheet();
  };

  return (
    <Modal
      visible={mounted}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={() => {
        void closeSheet();
      }}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
            onPress={() => {
              void closeSheet();
            }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Animated.View
          accessibilityViewIsModal
          onLayout={onSheetLayout}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingHorizontal: spacing.xl,
              paddingBottom: insets.bottom + spacing.sm,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />

          <View
            style={[styles.headerRow, { marginTop: spacing.lg + spacing.xs }]}
          >
            <Avatar
              name={`${student.firstName} ${student.lastName}`}
              size={AVATAR_SIZE}
              photoUri={photoUri}
            />
            <View style={{ flex: 1, marginLeft: spacing.lg }}>
              <Text variant="h2">{t("photo.title")}</Text>
              <Text
                variant="caption"
                color="textMuted"
                style={{ marginTop: 2 }}
              >
                {t("photo.hint")}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: spacing.lg + spacing.xs,
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              overflow: "hidden",
            }}
          >
            <ActionRow
              icon="camera"
              label={t("photo.take")}
              onPress={() => {
                void pickPhoto("camera");
              }}
            />
            <ActionRow
              icon="image"
              label={t("photo.gallery")}
              onPress={() => {
                void pickPhoto("gallery");
              }}
              divider={photoUri != null}
            />
            {photoUri != null ? (
              <ActionRow
                icon="trash-2"
                label={t("photo.remove")}
                onPress={removePhoto}
                danger
                divider={false}
              />
            ) : null}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("common.cancel")}
            onPress={() => {
              void closeSheet();
            }}
            style={({ pressed }) => ({
              marginTop: spacing.lg + spacing.xs,
              height: 52,
              borderRadius: radius.full,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text variant="bodyBold" style={{ color: colors.onPrimary }}>
              {t("common.cancel")}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

type actionProps = {
  icon: ComponentProps<typeof Feather>["name"];
  label: string;
  onPress: () => void;
  divider?: boolean;
  danger?: boolean;
};

function ActionRow({
  icon,
  label,
  onPress,
  divider = true,
  danger = false,
}: actionProps) {
  const { colors, spacing } = useTheme();
  const color = danger ? colors.danger : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
        borderBottomWidth: divider ? 1 : 0,
        borderBottomColor: colors.border,
        // §8.4 pressed feedback [?]: darken slightly with the border colour.
        backgroundColor: pressed ? colors.border : "transparent",
      })}
    >
      <Feather name={icon} size={20} color={color} />
      <Text
        variant="body"
        style={{ marginLeft: spacing.lg, color, fontFamily: fonts.medium }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // §8.2: ink at 50 %.
    backgroundColor: `${palette.ink}80`,
  },
  sheet: {
    // §8.2: top corners rounded, bottom square; paddingTop puts the grabber at 10.
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: 10,
  },
  grabber: {
    width: 40,
    height: 5,
    borderRadius: radius.full,
    alignSelf: "center",
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
});
