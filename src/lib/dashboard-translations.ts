import { Language } from './types/translations';

export const dashboardTranslations: Record<Language, {
  dashboard: {
    common: {
      loadingAnalytics: string;
      error: string;
      loading: string;
      loadingDashboard: string;
    };
    creator: {
      analytics: {
        title: string;
        description: string;
      };
      missions: {
        title: string;
        stats: {
          totalMissions: string;
          active: string;
          totalBudget: string;
          investment: string;
          pending: string;
          pendingValidations: string;
          totalViews: string;
          avgViews: string;
        };
        missionCard: {
          viewsRate: string;
          views: string;
          clips: string;
          pending: string;
          edit: string;
          delete: string;
        };
        noMissions: {
          title: string;
          description: string;
          createButton: string;
        };
      };
      navigation: {
        newMission: string;
      };
    };
  };
}> = {
  en: {
    dashboard: {
      common: {
        loadingAnalytics: "Loading analytics...",
        error: "Error",
        loading: "Loading...",
        loadingDashboard: "Loading dashboard..."
      },
      creator: {
        analytics: {
          title: "Analytics",
          description: "Track your performance and mission statistics"
        },
        missions: {
          title: "Your Missions",
          stats: {
            totalMissions: "Total Missions",
            active: "active",
            totalBudget: "Total Budget",
            investment: "Total investment",
            pending: "Pending",
            pendingValidations: "Pending validations",
            totalViews: "Total Views",
            avgViews: "Average views"
          },
          missionCard: {
            viewsRate: "€/1k views",
            views: "views",
            clips: "clips",
            pending: "pending",
            edit: "Edit",
            delete: "Delete"
          },
          noMissions: {
            title: "No missions",
            description: "You haven't created any missions yet.",
            createButton: "Create a mission"
          }
        },
        navigation: {
          newMission: "New Mission"
        }
      }
    }
  },
  fr: {
    dashboard: {
      common: {
        loadingAnalytics: "Chargement des analyses...",
        error: "Erreur",
        loading: "Chargement...",
        loadingDashboard: "Chargement du tableau de bord..."
      },
      creator: {
        analytics: {
          title: "Analyses",
          description: "Suivez vos performances et les statistiques de vos missions"
        },
        missions: {
          title: "Vos Missions",
          stats: {
            totalMissions: "Missions totales",
            active: "actives",
            totalBudget: "Budget total",
            investment: "Investissement total",
            pending: "En attente",
            pendingValidations: "Validations en attente",
            totalViews: "Vues totales",
            avgViews: "Vues moyennes"
          },
          missionCard: {
            viewsRate: "€/1k vues",
            views: "vues",
            clips: "clips",
            pending: "en attente",
            edit: "Modifier",
            delete: "Supprimer"
          },
          noMissions: {
            title: "Aucune mission",
            description: "Vous n'avez pas encore créé de missions.",
            createButton: "Créer une mission"
          }
        },
        navigation: {
          newMission: "Nouvelle Mission"
        }
      }
    }
  }
}; 