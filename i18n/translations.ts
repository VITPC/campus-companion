// i18n/translations.ts
// Flat dotted-key dictionaries. `en` is the source of truth: `fr` is typed as
// `typeof en`, so a missing or misspelled French key is a TypeScript error.
// No i18n library is used (dependency rule in MY_UI_IMPLEMENTATION.md §1.7).

export const en = {
  "tabs.home": "Home",
  "tabs.courses": "Courses",
  "tabs.profile": "Profile",

  "common.cancel": "Cancel",
  "common.back": "Back",
  "common.close": "Close",
  "common.error": "Something went wrong. Please try again.",

  "profile.preferences": "Preferences",
  "profile.level": "Level",
  "profile.language": "Language",
  "profile.classReminders": "Class reminders",
  "profile.darkMode": "Dark mode",
  "profile.help": "Help & feedback",
  "profile.signOut": "Sign out",
  "profile.signOutTitle": "Sign out",
  "profile.signOutMessage": "Are you sure you want to sign out?",
  "profile.changePhoto": "Change profile photo",

  "language.breadcrumb": "Profile · Preferences",
  "language.title": "Language",
  "language.default": "Default",
  "language.french": "French",
  "language.note":
    "Menus, dates and buttons switch right away. Course notes stay in the language your lecturer uploaded them in.",

  "photo.title": "Profile photo",
  "photo.hint": "Square images work best · max 5 MB",
  "photo.take": "Take a photo",
  "photo.gallery": "Choose from gallery",
  "photo.remove": "Remove photo",
  "photo.permissionTitle": "Permission needed",
  "photo.cameraPermission":
    "Campus Companion needs camera access to take your profile photo. You can turn it on in Settings.",
  "photo.galleryPermission":
    "Campus Companion needs access to your photos to choose a profile picture. You can turn it on in Settings.",
  "photo.openSettings": "Open Settings",
  "photo.tooLarge":
    "That image is larger than 5 MB. Please choose a smaller one.",

  "home.laterToday": "Later Today",
  "home.announcements": "Announcements",
};

export type TranslationKey = keyof typeof en;

export const fr: typeof en = {
  "tabs.home": "Accueil",
  "tabs.courses": "Cours",
  "tabs.profile": "Profil",

  "common.cancel": "Annuler",
  "common.back": "Retour",
  "common.close": "Fermer",
  "common.error": "Une erreur s'est produite. Veuillez réessayer.",

  "profile.preferences": "Préférences",
  "profile.level": "Niveau",
  "profile.language": "Langue",
  "profile.classReminders": "Rappels de cours",
  "profile.darkMode": "Mode sombre",
  "profile.help": "Aide et commentaires",
  "profile.signOut": "Se déconnecter",
  "profile.signOutTitle": "Se déconnecter",
  "profile.signOutMessage": "Voulez-vous vraiment vous déconnecter ?",
  "profile.changePhoto": "Changer la photo de profil",

  "language.breadcrumb": "Profil · Préférences",
  "language.title": "Langue",
  "language.default": "Par défaut",
  "language.french": "Français",
  "language.note":
    "Les menus, les dates et les boutons changent immédiatement. Les notes de cours restent dans la langue choisie par votre enseignant.",

  "photo.title": "Photo de profil",
  "photo.hint": "Les images carrées conviennent le mieux · 5 Mo max",
  "photo.take": "Prendre une photo",
  "photo.gallery": "Choisir dans la galerie",
  "photo.remove": "Supprimer la photo",
  "photo.permissionTitle": "Autorisation requise",
  "photo.cameraPermission":
    "Campus Companion a besoin d'accéder à l'appareil photo pour prendre votre photo de profil. Vous pouvez l'activer dans les Réglages.",
  "photo.galleryPermission":
    "Campus Companion a besoin d'accéder à vos photos pour choisir une photo de profil. Vous pouvez l'activer dans les Réglages.",
  "photo.openSettings": "Ouvrir les Réglages",
  "photo.tooLarge":
    "Cette image dépasse 5 Mo. Veuillez en choisir une plus petite.",

  "home.laterToday": "Plus tard aujourd'hui",
  "home.announcements": "Annonces",
};

export const translations = { en, fr };
