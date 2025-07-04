import { Language } from './clipper-translations';

export const dashboardTranslations = {
  en: {
    common: {
      loading: "Loading...",
      loadingDashboard: "Loading your dashboard...",
      loadingAnalytics: "Loading analytics...",
      loadingWallet: "Loading your wallet...",
      error: "Error:"
    },
    filters: {
      allProducts: "All Products",
      entertainment: "Entertainment",
      music: "Music",
      brand: "Brand",
      products: "Products"
    },
    creator: {
      analytics: {
        title: "Analytics",
        description: "Track your performance and growth",
        stats: {
          totalViews: "Total Views",
          totalEarnings: "Total Earnings",
          totalMissions: "Total Missions",
          totalClippers: "Total Clippers",
          monthlyViews: "Monthly Views",
          monthlyEarnings: "Monthly Earnings",
          weeklyViews: "Weekly Views",
          weeklyEarnings: "Weekly Earnings",
          averageViewsPerMission: "Average Views per Mission",
          topPerformingMission: "Top Performing Mission",
          recentActivity: "Recent Activity",
          viewsGrowth: "Views Growth",
          earningsGrowth: "Earnings Growth"
        }
      },
      missions: {
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
        },
        wallet: {
          title: "Your Wallet",
          description: "Manage your earnings and withdrawals",
          stats: {
            totalEarnings: "Total Earnings",
            availableBalance: "Available Balance",
            pendingPayments: "Pending Payments",
            lastWithdrawal: "Last Withdrawal",
            withdrawalHistory: "Withdrawal History",
            noWithdrawals: "No withdrawals yet"
          },
          actions: {
            withdraw: "Withdraw",
            addBankAccount: "Add Bank Account",
            viewHistory: "View History"
          },
          bankAccount: {
            title: "Bank Account",
            description: "Add or update your bank account information",
            accountHolder: "Account Holder",
            iban: "IBAN",
            bic: "BIC",
            save: "Save",
            cancel: "Cancel",
            success: "Bank account updated successfully",
            error: "Error updating bank account"
          },
          withdrawal: {
            title: "Withdrawal",
            description: "Request a withdrawal of your available balance",
            amount: "Amount",
            minimumAmount: "Minimum amount:",
            maximumAmount: "Maximum amount:",
            confirm: "Confirm Withdrawal",
            cancel: "Cancel",
            success: "Withdrawal request submitted successfully",
            error: "Error submitting withdrawal request"
          }
        }
      }
    },
    clipper: {
      missions: {
        title: "Available Missions",
        description: "Browse and accept missions from creators",
        activeMissionsCount: {
          singular: "active mission",
          plural: "active missions"
        }
      },
      welcome: {
        title: "Welcome",
        description: "Get started with ClipTokk and start earning money by creating clips!",
        steps: {
          findMissions: {
            title: "Find Missions",
            description: "Browse available missions from creators"
          },
          createClips: {
            title: "Create Clips",
            description: "Create engaging clips that follow the mission guidelines"
          },
          earnMoney: {
            title: "Earn Money",
            description: "Get paid for your views and successful clips"
          }
        }
      },
      stats: {
        totalEarnings: {
          title: "Total Earnings",
          description: "Your total earnings from all missions"
        },
        generatedViews: {
          title: "Generated Views",
          description: "Total views across all your clips"
        },
        createdClips: {
          title: "Created Clips",
          description: "Number of clips you've created"
        }
      }
    }
  },
  fr: {
    common: {
      loading: "Chargement...",
      loadingDashboard: "Chargement de votre tableau de bord...",
      loadingAnalytics: "Chargement des analyses...",
      loadingWallet: "Chargement de votre portefeuille...",
      error: "Erreur :"
    },
    filters: {
      allProducts: "Tous les produits",
      entertainment: "Divertissement",
      music: "Musique",
      brand: "Marque",
      products: "Produits"
    },
    creator: {
      analytics: {
        title: "Analyses",
        description: "Suivez vos performances et votre croissance",
        stats: {
          totalViews: "Vues totales",
          totalEarnings: "Gains totaux",
          totalMissions: "Missions totales",
          totalClippers: "Clippers totaux",
          monthlyViews: "Vues mensuelles",
          monthlyEarnings: "Gains mensuels",
          weeklyViews: "Vues hebdomadaires",
          weeklyEarnings: "Gains hebdomadaires",
          averageViewsPerMission: "Vues moyennes par mission",
          topPerformingMission: "Mission la plus performante",
          recentActivity: "Activité récente",
          viewsGrowth: "Croissance des vues",
          earningsGrowth: "Croissance des gains"
        }
      },
      missions: {
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
        },
        wallet: {
          title: "Votre Portefeuille",
          description: "Gérez vos gains et vos retraits",
          stats: {
            totalEarnings: "Gains totaux",
            availableBalance: "Solde disponible",
            pendingPayments: "Paiements en attente",
            lastWithdrawal: "Dernier retrait",
            withdrawalHistory: "Historique des retraits",
            noWithdrawals: "Aucun retrait pour le moment"
          },
          actions: {
            withdraw: "Retirer",
            addBankAccount: "Ajouter un compte bancaire",
            viewHistory: "Voir l'historique"
          },
          bankAccount: {
            title: "Compte bancaire",
            description: "Ajoutez ou mettez à jour vos informations bancaires",
            accountHolder: "Titulaire du compte",
            iban: "IBAN",
            bic: "BIC",
            save: "Enregistrer",
            cancel: "Annuler",
            success: "Compte bancaire mis à jour avec succès",
            error: "Erreur lors de la mise à jour du compte bancaire"
          },
          withdrawal: {
            title: "Retrait",
            description: "Demandez un retrait de votre solde disponible",
            amount: "Montant",
            minimumAmount: "Montant minimum :",
            maximumAmount: "Montant maximum :",
            confirm: "Confirmer le retrait",
            cancel: "Annuler",
            success: "Demande de retrait soumise avec succès",
            error: "Erreur lors de la soumission de la demande de retrait"
          }
        }
      }
    },
    clipper: {
      missions: {
        title: "Missions disponibles",
        description: "Parcourez et acceptez les missions des créateurs",
        activeMissionsCount: {
          singular: "mission active",
          plural: "missions actives"
        }
      },
      welcome: {
        title: "Bienvenue",
        description: "Commencez avec ClipTokk et gagnez de l'argent en créant des clips !",
        steps: {
          findMissions: {
            title: "Trouver des missions",
            description: "Parcourez les missions disponibles des créateurs"
          },
          createClips: {
            title: "Créer des clips",
            description: "Créez des clips engageants qui suivent les directives de la mission"
          },
          earnMoney: {
            title: "Gagner de l'argent",
            description: "Soyez payé pour vos vues et vos clips réussis"
          }
        }
      },
      stats: {
        totalEarnings: {
          title: "Gains totaux",
          description: "Vos gains totaux de toutes les missions"
        },
        generatedViews: {
          title: "Vues générées",
          description: "Vues totales sur tous vos clips"
        },
        createdClips: {
          title: "Clips créés",
          description: "Nombre de clips que vous avez créés"
        }
      }
    }
  }
} 