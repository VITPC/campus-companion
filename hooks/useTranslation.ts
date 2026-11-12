// hooks/useTranslation.ts
// Issue #16: tiny translator with no external i18n library. Reads the language
// from the settings context, so changing it re-renders every consumer at once.
import { useSettings } from "@/context/SettingsContext";
import { en, type TranslationKey, translations } from "@/i18n/translations";

export function useTranslation() {
  const { settings } = useSettings();
  const language = settings.language;

  const t = (
    key: TranslationKey,
    params?: Record<string, string | number>,
  ): string => {
    const dictionary = translations[language] ?? en;
    // Missing key: fall back to English, then to the key itself.
    let value = dictionary[key] ?? en[key] ?? key;
    if (params) {
      for (const [name, replacement] of Object.entries(params)) {
        value = value.replace(`{${name}}`, String(replacement));
      }
    }
    return value;
  };

  return { t, language };
}
