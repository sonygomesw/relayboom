export type Language = 'en' | 'fr';

export const translations = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error:',
      cancel: 'Cancel',
      save: 'Save',
      continue: 'Continue'
    },
    nav: {
      howItWorks: 'How it works',
      faq: 'FAQ',
      signIn: 'Sign in',
      language: 'Language'
    },
    hero: {
      challenge: {
        ongoing: 'Ongoing challenge',
        earned: 'already earned!',
        joinNow: 'Join now'
      },
      badge: '500+ active clippers this week',
      title: {
        part1: 'Make money by posting',
        part2: 'viral TikToks'
      },
      description: 'You post clips? We pay you for every view. Join missions, publish on TikTok, earn money based on performance.',
      cta: {
        missions: 'See available missions',
        becomeClipper: 'Become a clipper'
      }
    },
    dashboard: {
      creator: {
        title: 'Creator Dashboard',
        welcome: 'Welcome',
        overview: 'Here\'s an overview of your performance',
        stats: {
          totalViews: 'Total Views',
          avgViews: 'average views',
          totalRevenue: 'Total Revenue',
          paidMissions: 'paid missions'
        },
        navigation: {
          dashboard: 'Dashboard',
          missions: 'Missions',
          newMission: 'New Mission',
          analytics: 'Analytics',
          wallet: 'Wallet',
          payments: 'Payments',
          logout: 'Logout'
        }
      },
      clipper: {
        title: 'Clipper Dashboard',
        welcome: {
          title: 'Welcome to ClipTokk',
          description: 'You\'re now ready to start your clipping journey'
        },
        stats: {
          totalEarnings: 'Total Earnings',
          generatedViews: 'Generated Views',
          createdClips: 'Created Clips'
        },
        actions: {
          cancel: 'Cancel',
          confirmPalier: 'Confirm milestone'
        }
      }
    },
    missions: {
      title: 'Available Missions',
      description: 'Browse and accept missions from creators',
      filters: {
        allProducts: 'All Products',
        entertainment: 'Entertainment',
        music: 'Music',
        brand: 'Brand',
        products: 'Products'
      }
    }
  },
  fr: {
    common: {
      loading: 'Chargement...',
      error: 'Erreur :',
      cancel: 'Annuler',
      save: 'Enregistrer',
      continue: 'Continuer'
    },
    nav: {
      howItWorks: 'Comment ça marche',
      faq: 'FAQ',
      signIn: 'Se connecter',
      language: 'Langue'
    },
    hero: {
      challenge: {
        ongoing: 'Challenge en cours',
        earned: 'déjà gagnés !',
        joinNow: 'Participer maintenant'
      },
      badge: '500+ clippeurs actifs cette semaine',
      title: {
        part1: 'Gagne de l\'argent en postant des',
        part2: 'TikToks viraux'
      },
      description: 'Tu postes des clips ? On te paie pour chaque vue. Rejoins des missions, publie sur TikTok, gagne de l\'argent à la performance.',
      cta: {
        missions: 'Voir les missions disponibles',
        becomeClipper: 'Devenir clippeur'
      }
    },
    dashboard: {
      creator: {
        title: 'Tableau de bord créateur',
        welcome: 'Bienvenue',
        overview: 'Voici un aperçu de vos performances',
        stats: {
          totalViews: 'Vues totales',
          avgViews: 'vues en moyenne',
          totalRevenue: 'Revenus totaux',
          paidMissions: 'missions payées'
        },
        navigation: {
          dashboard: 'Tableau de bord',
          missions: 'Missions',
          newMission: 'Nouvelle Mission',
          analytics: 'Analytics',
          wallet: 'Portefeuille',
          payments: 'Paiements',
          logout: 'Déconnexion'
        }
      },
      clipper: {
        title: 'Tableau de bord clippeur',
        welcome: {
          title: 'Bienvenue sur ClipTokk',
          description: 'Tu es prêt à commencer ton aventure de clipping'
        },
        stats: {
          totalEarnings: 'Gains totaux',
          generatedViews: 'Vues générées',
          createdClips: 'Clips créés'
        },
        actions: {
          cancel: 'Annuler',
          confirmPalier: 'Confirmer le palier'
        }
      }
    },
    missions: {
      title: 'Missions disponibles',
      description: 'Parcourez et acceptez les missions des créateurs',
      filters: {
        allProducts: 'Tous les produits',
        entertainment: 'Divertissement',
        music: 'Musique',
        brand: 'Marque',
        products: 'Produits'
      }
    }
  }
} 