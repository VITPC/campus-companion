// context/SettingsContext.tsx
// Issue #15: persisted user settings (language, class reminders, dark mode) and
// the shared profile photo URI (issue #17). Backed by AsyncStorage.
// Dark-mode *behaviour* is issue #18 — here we only persist the switch value.
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import data from "@/mocks/data.json";

export type Language = "en" | "fr";

export type Settings = {
  language: Language;
  classReminders: boolean;
  darkMode: boolean;
};

type SettingsContextValue = {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
  /** true once AsyncStorage has been read and the state hydrated */
  isReady: boolean;
};

const SETTINGS_KEY = "campus-companion/settings";
const PHOTO_KEY = "campus-companion/profile-photo";

// Defaults come from the mock data (read-only). The mock's language is a plain
// string, so narrow it to the Language union.
const defaultSettings: Settings = {
  language: data.settings.language === "fr" ? "fr" : "en",
  classReminders: data.settings.classReminders,
  darkMode: data.settings.darkMode,
};

// Merge whatever is stored over the defaults: unknown, missing or invalid
// fields fall back to the default value.
function parseSettings(raw: string | null): Settings {
  if (!raw) return defaultSettings;
  try {
    const parsed = JSON.parse(raw) as Partial<Record<keyof Settings, unknown>>;
    return {
      language:
        parsed.language === "en" || parsed.language === "fr"
          ? parsed.language
          : defaultSettings.language,
      classReminders:
        typeof parsed.classReminders === "boolean"
          ? parsed.classReminders
          : defaultSettings.classReminders,
      darkMode:
        typeof parsed.darkMode === "boolean"
          ? parsed.darkMode
          : defaultSettings.darkMode,
    };
  } catch (error) {
    console.warn("Could not parse saved settings", error);
    return defaultSettings;
  }
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [photoUri, setPhotoUriState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [rawSettings, rawPhoto] = await Promise.all([
          AsyncStorage.getItem(SETTINGS_KEY),
          AsyncStorage.getItem(PHOTO_KEY),
        ]);
        if (!active) return;
        setSettings(parseSettings(rawSettings));
        setPhotoUriState(rawPhoto);
      } catch (error) {
        console.warn("Could not load saved settings", error);
      } finally {
        if (active) setIsReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const updateSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      // Optimistic update, then persist.
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(
          (error) => console.warn("Could not save settings", error),
        );
        return next;
      });
    },
    [],
  );

  const setPhotoUri = useCallback((uri: string | null) => {
    setPhotoUriState(uri);
    const persist =
      uri === null
        ? AsyncStorage.removeItem(PHOTO_KEY)
        : AsyncStorage.setItem(PHOTO_KEY, uri);
    persist.catch((error) =>
      console.warn("Could not save profile photo", error),
    );
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, updateSetting, photoUri, setPhotoUri, isReady }),
    [settings, updateSetting, photoUri, setPhotoUri, isReady],
  );

  // Hydration gate: never let consumers render with default values and then
  // flip once storage resolves (avoids a language/switch flicker).
  if (!isReady) return null;

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
