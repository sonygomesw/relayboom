export type Language = 'en' | 'fr' | 'es';

export const clipperTranslations = {
  en: {
    views: {
      exact: "Exact view count (optional)",
      placeholder: "Or enter exact number (minimum {count})",
      default: "If empty, we will use {count} views"
    },
    actions: {
      cancel: "Cancel",
      confirmPalier: "Confirm milestone",
      continue: "Continue"
    },
    settings: {
      paymentTitle: "How do payments work?",
      commission: "Commission",
      calculation: "Calculation"
    },
    admin: {
      clipLink: "Clip link",
      missing: "Missing",
      noTikTokLink: "No TikTok link provided by clipper"
    },
    onboarding: {
      configuring: "Configuring...",
      roleChangeNote: "You can change this choice later in your settings"
    },
    platformPreviews: {
      instructions: "Instructions",
      preview: "Preview"
    }
  },
  fr: {
    views: {
      exact: "Nombre de vues exactes (optionnel)",
      placeholder: "Ou indiquez le nombre exact (minimum {count})",
      default: "Si vide, nous utiliserons {count} vues"
    },
    actions: {
      cancel: "Annuler",
      confirmPalier: "Confirmer le palier",
      continue: "Continuer"
    },
    settings: {
      paymentTitle: "Comment fonctionnent les paiements ?",
      commission: "Commission",
      calculation: "Calcul"
    },
    admin: {
      clipLink: "Lien du clip",
      missing: "Manquant",
      noTikTokLink: "Aucun lien TikTok fourni par le clippeur"
    },
    onboarding: {
      configuring: "Configuration...",
      roleChangeNote: "Tu pourras modifier ce choix plus tard dans tes paramètres"
    },
    platformPreviews: {
      instructions: "Instructions",
      preview: "Aperçu"
    }
  },
  es: {} // Empty Spanish translations object
} as const;