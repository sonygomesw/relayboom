export type Language = 'en' | 'fr' | 'es' | 'it';

export const translations = {
  en: {
    clipper: {
      views: {
        exact: 'Exact view count (optional)',
        placeholder: 'Or enter exact number (minimum {count})',
        default: 'If empty, we will use {count} views'
      },
      actions: {
        cancel: 'Cancel',
        confirmPalier: 'Confirm milestone'
      }
    },
  en: {
    clipper: {
      views: {
        exact: 'Exact view count (optional)',
        placeholder: 'Or enter exact number (minimum {count})',
        default: 'If empty, we will use {count} views'
      },
      actions: {
        cancel: 'Cancel',
        confirmPalier: 'Confirm milestone'
      }
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
      },
      stats: {
        clippers: '500+ active clippers',
        views: '2.3M views generated'
      }
    },
    howItWorks: {
      title: 'How it works?',
      subtitle: '3 simple steps to start earning',
      steps: {
        mission: {
          title: '1. Choose a mission',
          description: 'Browse available missions and select the ones that interest you. Each mission specifies the theme and compensation.'
        },
        create: {
          title: '2. Create your clip',
          description: 'Create and publish your TikTok following the mission guidelines. Our system automatically tracks your views.'
        },
        paid: {
          title: '3. Get paid',
          description: 'Track your earnings in real-time and withdraw your money from $10. Fast and secure payments via Stripe.'
        }
      }
    },
    platform: {
      title: "Here's what your clipper dashboard looks like",
      subtitle: 'Get a preview of the platform before you start. Missions, statistics, withdrawals... everything is designed to make your life easier.',
      sections: {
        mission: {
          title: 'Mission Selection',
          subtitle: 'Choose a mission based on your style and audience',
          rate: '$0.10 / 1K views',
          followers: 'followers',
          duration: '30-60s',
          expires: 'Expires in 3d'
        },
        performance: {
          title: 'Performance Tracking',
          subtitle: 'Track your earnings, posted clips and views in real-time',
          stats: {
            earnings: 'Earnings',
            views: 'Views'
          }
        },
        submission: {
          title: 'Easy Submission',
          subtitle: 'Paste your TikTok link, everything is detected automatically',
          checks: {
            duration: 'Duration: 45 seconds',
            hashtags: 'Required hashtags present',
            mention: 'Creator mention included'
          }
        },
        withdrawal: {
          title: 'Easy Withdrawal',
          subtitle: 'Get your earnings',
          balance: 'Available balance',
          stripe: {
            title: 'Stripe Connect',
            subtitle: 'Secure payment'
          },
          transfer: {
            time: '24-48h',
            subtitle: 'Transfer time'
          }
        }
      },
      cta: 'I want to try the platform'
    },
    dashboard: {
      common: {
        loading: 'Loading...',
        error: 'Error:',
        loginRequired: 'Login required',
        loginMessage: 'Please log in to access your dashboard.',
        profileSetup: 'Profile Setup',
        profileMessage: 'Your profile is not configured yet.',
        setupProfile: 'Set up my profile',
        loadingDashboard: 'Loading your dashboard...',
        loadingAnalytics: 'Loading your analytics...',
        loadingSettings: 'Loading your settings...',
        cancel: 'Cancel'
      },
      creator: {
        title: 'Creator Dashboard',
        welcome: 'Welcome',
        overview: 'Here\'s an overview of your performance.',
        stats: {
          totalViews: 'Total Views',
          avgViews: 'average views',
          totalRevenue: 'Total Revenue',
          paidMissions: 'paid missions',
          activeMissions: 'Active Missions',
          createdMissions: 'Missions created by you',
          pending: 'Pending',
          pendingValidations: 'Pending validations'
        },
        wallet: {
          title: 'My Wallet',
          description: 'Manage your earnings and withdrawals',
          balance: {
            title: 'Available Balance',
            pending: 'Pending',
            total: 'Total Earnings'
          },
          withdraw: {
            title: 'Withdraw Funds',
            button: 'Withdraw',
            minimum: 'Minimum withdrawal amount:'
          },
          history: {
            title: 'Transaction History',
            empty: 'No transactions yet'
          },
          stats: {
            availableCredits: 'Available Credits',
            available: 'Available now',
            totalDeposited: 'Total Deposited',
            total: 'Total',
            reservedCredits: 'Reserved Credits',
            reserved: 'Reserved',
            spentCredits: 'Spent Credits',
            spent: 'Spent'
          },
          actions: {
            addFunds: 'Add Funds',
            addFundsButton: 'Add Credits',
            bankAccount: 'Bank Account',
            bankAccountButton: 'Manage Account'
          },
          transactions: {
            title: 'Recent Transactions',
            empty: {
              title: 'No transactions yet',
              description: 'Your transaction history will appear here'
            }
          }
        },
        missions: {
          title: 'Content Missions',
          description: 'Post content on social media and get paid for the views you generate. If you want to launch a campaign, click here.',
          activeMissionsCount: {
            singular: 'live content mission',
            plural: 'live content missions'
          },
          gridView: 'Grid view',
          stats: {
            totalMissions: 'Total Missions',
            active: 'active',
            totalBudget: 'Total Budget',
            investment: 'Investment'
          }
        },
        analytics: {
          title: 'Analytics',
          description: 'Track your missions\' performance and audience engagement.',
          kpis: {
            totalViews: 'Total Views',
            thisMonth: 'this month',
            totalEarnings: 'Total Earnings',
            monthlyViews: 'Monthly Views',
            monthlyEarnings: 'Monthly Earnings',
            avgViews: 'Average Views',
            topMission: 'Top Mission'
          }
        },
        navigation: {
          dashboard: 'Dashboard',
          missions: 'Missions',
          newMission: 'New Mission',
          analytics: 'Analytics',
          wallet: 'Wallet',
          payments: 'Payments',
          logout: 'Logout'
        },
        newMission: {
          title: 'Create a new mission',
          description: 'Set up your mission parameters and start receiving clips',
          sections: {
            basicInfo: 'Basic Information',
            pricing: 'Pricing',
            platforms: 'Platforms',
            additionalInfo: 'Additional Information'
          },
          fields: {
            title: {
              label: 'Mission Title',
              placeholder: 'Ex: Clip my best gaming moments'
            },
            description: {
              label: 'Detailed Description',
              placeholder: 'Describe what you expect from clippers, desired style, etc.'
            },
            category: {
              label: 'Category',
              placeholder: 'Select a category',
              options: {
                entertainment: 'Entertainment',
                music: 'Music',
                brand: 'Brand',
                products: 'Products'
              }
            },
            totalBudget: {
              label: 'Total Budget',
              placeholder: 'Ex: 1000'
            },
            reward: {
              label: 'Reward per 1k views',
              placeholder: 'Ex: 1.00'
            },
            rewardExample: 'Example rewards:',
            platforms: {
              label: 'Target Platforms'
            },
            videoUrl: {
              label: 'Reference Video URL',
              placeholder: 'Link to your video'
            },
            brandGuidelines: {
              label: 'Brand Guidelines',
              placeholder: 'Ex: colors, tone, logo...'
            },
            creatorImage: {
              label: 'Creator Image',
              upload: 'Upload image'
            },
            durationMin: {
              label: 'Minimum Duration (seconds)',
              placeholder: 'Ex: 30'
            },
            durationMax: {
              label: 'Maximum Duration (seconds)',
              placeholder: 'Ex: 60'
            }
          },
          actions: {
            publish: 'Publish Mission',
            draft: 'Save as Draft'
          }
        }
      },
      clipper: {
        welcome: {
          title: 'Welcome to ClipTokk,',
          description: 'You\'re now ready to start your clipping journey and earn money with your creations!',
          steps: {
            findMissions: {
              title: '1. Find missions',
              description: 'Browse available missions and choose the ones that interest you'
            },
            createClips: {
              title: '2. Create your clips',
              description: 'Use your creativity to make viral clips from creators\' content'
            },
            earnMoney: {
              title: '3. Earn money',
              description: 'Get paid based on the views your clips generate on TikTok'
            }
          }
        },
        stats: {
          totalEarnings: {
            title: 'Total Earnings',
            description: 'Your first earnings are coming soon!'
          },
          generatedViews: {
            title: 'Generated Views',
            description: 'Ready to make it viral?'
          },
          createdClips: {
            title: 'Created Clips',
            description: 'Your creativity is waiting for you!'
          }
        },
        missions: {
          title: 'Content Missions',
          description: 'Post content on social media and get paid for the views you generate. If you want to launch a campaign, click here.',
          filters: {
            allProducts: 'All products',
            entertainment: 'Entertainment',
            music: 'Music',
            brand: 'Brand',
            products: 'Products'
          }
        },
        views: {
          exact: 'Exact view count (optional)',
          placeholder: 'Or enter exact number (minimum {count})',
          default: 'If empty, we will use {count} views'
        },
        actions: {
          cancel: 'Cancel',
          confirmPalier: 'Confirm milestone'
        },
        payments: {
          title: 'How do payments work?',
          commission: {
            title: 'Commission',
            description: '10% taken during creator recharge'
          },
          share: {
            title: 'Your share',
            description: '100% of calculated amount (commission already deducted)'
          },
          calculation: {
            title: 'Calculation',
            description: '(Number of views ÷ 1000) × Price per 1k views'
          },
          method: {
            title: 'Payment',
            description: 'SEPA transfer within 2-3 business days'
          },
          minimum: {
            title: 'Minimum threshold',
            description: 'No minimum threshold'
          }
        }
      },
      admin: {
        dashboard: {
          title: 'Admin Dashboard (Debug)',
          overview: 'Overview of your ClipTokk platform',
          status: {
            connected: 'Connected',
            notConnected: 'Not connected',
            exists: 'Exists',
            notExists: 'Does not exist',
            adminConnected: 'Connected as admin (bypass)',
            logout: 'Logout'
          }
        },
        paliers: {
          clipLink: 'Clip link',
          missing: 'Missing',
          noLink: 'No TikTok link provided by clipper'
        }
      },
      onboarding: {
        role: {
          configuring: 'Configuring...',
          continue: 'Continue',
          changeNote: 'You can change this choice later in your settings'
        }
      },
      platform: {
        preview: {
          keyPoints: {
            title: 'Key points to include',
            description: 'Gameplay, graphics, fun factor'
          },
          duration: {
            title: 'Recommended duration',
            description: '30-60 seconds'
          },
          actions: {
            accept: 'Accept mission'
          },
          detection: {
            title: 'Automatic detection',
            duration: 'Duration: 45 seconds',
            hashtags: 'Required hashtags present',
            mention: 'Creator mention included',
            submit: 'Validate and submit'
          }
        }
      }
    }
  },
  fr: {
    clipper: {
      views: {
        exact: 'Nombre de vues exactes (optionnel)',
        placeholder: 'Ou indiquez le nombre exact (minimum {count})',
        default: 'Si vide, nous utiliserons {count} vues'
      },
      actions: {
        cancel: 'Annuler',
        confirmPalier: 'Confirmer le palier'
      }
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
      },
      stats: {
        clippers: '500+ clippeurs actifs',
        views: '2,3M vues générées'
      }
    },
    howItWorks: {
      title: 'Comment ça marche ?',
      subtitle: '3 étapes simples pour commencer à gagner',
      steps: {
        mission: {
          title: '1. Choisis une mission',
          description: 'Parcours les missions disponibles et sélectionne celles qui t\'intéressent. Chaque mission précise le thème et la rémunération.'
        },
        create: {
          title: '2. Crée ton clip',
          description: 'Réalise et publie ton TikTok en suivant les consignes de la mission. Notre système détecte automatiquement tes vues.'
        },
        paid: {
          title: '3. Reçois tes gains',
          description: 'Suis tes revenus en temps réel et retire ton argent dès 10€. Paiements rapides et sécurisés via Stripe.'
        }
      }
    },
    platform: {
      title: 'Voici à quoi ressemble ton espace clippeur',
      subtitle: 'Découvre un aperçu de la plateforme avant de te lancer. Missions, statistiques, retraits… tout est pensé pour te simplifier la vie.',
      sections: {
        mission: {
          title: 'Choix de mission',
          subtitle: 'Choisis une mission selon ton style et ton audience',
          rate: '0,10€ / 1K vues',
          followers: 'abonnés',
          duration: '30-60s',
          expires: 'Expire dans 3j'
        },
        performance: {
          title: 'Suivi des performances',
          subtitle: 'Suis tes gains, clips postés et vues en temps réel',
          stats: {
            earnings: 'Gains',
            views: 'Vues'
          }
        },
        submission: {
          title: 'Soumission simple',
          subtitle: 'Colle ton lien TikTok, tout est détecté automatiquement',
          checks: {
            duration: 'Durée : 45 secondes',
            hashtags: 'Hashtags requis présents',
            mention: 'Mention du créateur incluse'
          }
        },
        withdrawal: {
          title: 'Retrait facile',
          subtitle: 'Retire tes gains',
          balance: 'Solde disponible',
          stripe: {
            title: 'Stripe Connect',
            subtitle: 'Paiement sécurisé'
          },
          transfer: {
            time: '24-48h',
            subtitle: 'Délai de virement'
          }
        }
      },
      cta: 'Je veux essayer la plateforme'
    },
    dashboard: {
      common: {
        loading: 'Chargement...',
        error: 'Erreur :',
        loginRequired: 'Connexion requise',
        loginMessage: 'Veuillez vous connecter pour accéder à votre tableau de bord.',
        profileSetup: 'Configuration du profil',
        profileMessage: 'Votre profil n\'est pas encore configuré.',
        setupProfile: 'Configurer mon profil',
        loadingDashboard: 'Chargement de votre tableau de bord...',
        loadingAnalytics: 'Chargement de vos analyses...',
        loadingSettings: 'Chargement de vos paramètres...',
        cancel: 'Annuler'
      },
      creator: {
        title: 'Tableau de bord créateur',
        welcome: 'Bienvenue',
        overview: 'Voici un aperçu de vos performances.',
        stats: {
          totalViews: 'Vues totales',
          avgViews: 'vues en moyenne',
          totalRevenue: 'Revenus totaux',
          paidMissions: 'missions payées',
          activeMissions: 'Missions actives',
          createdMissions: 'Missions créées par vous',
          pending: 'En attente',
          pendingValidations: 'Validations en cours'
        },
        wallet: {
          title: 'Mon Portefeuille',
          description: 'Gérez vos gains et retraits',
          balance: {
            title: 'Solde disponible',
            pending: 'En attente',
            total: 'Gains totaux'
          },
          withdraw: {
            title: 'Retirer des fonds',
            button: 'Retirer',
            minimum: 'Montant minimum de retrait :'
          },
          history: {
            title: 'Historique des transactions',
            empty: 'Aucune transaction pour le moment'
          },
          stats: {
            availableCredits: 'Crédits disponibles',
            available: 'Disponible maintenant',
            totalDeposited: 'Total déposé',
            total: 'Total',
            reservedCredits: 'Crédits réservés',
            reserved: 'Réservé',
            spentCredits: 'Crédits dépensés',
            spent: 'Dépensé'
          },
          actions: {
            addFunds: 'Ajouter des fonds',
            addFundsButton: 'Ajouter des crédits',
            bankAccount: 'Compte bancaire',
            bankAccountButton: 'Gérer le compte'
          },
          transactions: {
            title: 'Transactions récentes',
            empty: {
              title: 'Aucune transaction',
              description: 'Votre historique de transactions apparaîtra ici'
            }
          }
        },
        missions: {
          title: 'Missions de contenu',
          description: 'Publiez du contenu sur les réseaux sociaux et soyez rémunéré(e) pour les vues que vous générez. Si vous souhaitez lancer une campagne, cliquez ici.',
          activeMissionsCount: {
            singular: 'mission de contenu en direct',
            plural: 'missions de contenu en direct'
          },
          gridView: 'Vue grille',
          stats: {
            totalMissions: 'Missions totales',
            active: 'actives',
            totalBudget: 'Budget total',
            investment: 'Investissement'
          }
        },
        analytics: {
          title: 'Analytics',
          description: 'Suivez les performances de vos missions et l\'engagement de votre audience.',
          kpis: {
            totalViews: 'Vues totales',
            thisMonth: 'ce mois',
            totalEarnings: 'Gains totaux',
            monthlyViews: 'Vues mensuelles',
            monthlyEarnings: 'Gains mensuels',
            avgViews: 'Vues moyennes',
            topMission: 'Meilleure mission'
          }
        },
        navigation: {
          dashboard: 'Tableau de bord',
          missions: 'Missions',
          newMission: 'Nouvelle Mission',
          analytics: 'Analytics',
          wallet: 'Wallet',
          payments: 'Paiements',
          logout: 'Déconnexion'
        },
        newMission: {
          title: 'Créer une nouvelle mission',
          description: 'Configurez les paramètres de votre mission et commencez à recevoir des clips',
          sections: {
            basicInfo: 'Informations de base',
            pricing: 'Tarification',
            platforms: 'Plateformes',
            additionalInfo: 'Informations supplémentaires'
          },
          fields: {
            title: {
              label: 'Titre de la mission',
              placeholder: 'Ex : Clipper mes meilleurs moments de jeu'
            },
            description: {
              label: 'Description détaillée',
              placeholder: 'Décrivez ce que vous attendez des clippeurs, le style souhaité, etc.'
            },
            category: {
              label: 'Catégorie',
              placeholder: 'Sélectionnez une catégorie',
              options: {
                entertainment: 'Divertissement',
                music: 'Musique',
                brand: 'Marque',
                products: 'Produits'
              }
            },
            totalBudget: {
              label: 'Budget total',
              placeholder: 'Ex : 1000'
            },
            reward: {
              label: 'Récompense par 1k vues',
              placeholder: 'Ex : 1.00'
            },
            rewardExample: 'Exemples de récompenses :',
            platforms: {
              label: 'Plateformes cibles'
            },
            videoUrl: {
              label: 'URL de la vidéo de référence',
              placeholder: 'Lien vers votre vidéo'
            },
            brandGuidelines: {
              label: 'Instructions de marque',
              placeholder: 'Ex: couleurs, ton, logo...'
            },
            creatorImage: {
              label: 'Image du créateur',
              upload: 'Télécharger une image'
            },
            durationMin: {
              label: 'Durée minimum (secondes)',
              placeholder: 'Ex: 30'
            },
            durationMax: {
              label: 'Durée maximum (secondes)',
              placeholder: 'Ex: 60'
            }
          },
          actions: {
            publish: 'Publier la mission',
            draft: 'Sauvegarder comme brouillon'
          }
        }
      },
      clipper: {
        welcome: {
          title: 'Bienvenue sur ClipTokk,',
          description: 'Vous êtes maintenant prêt(e) à commencer votre aventure de clipping et à gagner de l\'argent avec vos créations !',
          steps: {
            findMissions: {
              title: '1. Trouvez des missions',
              description: 'Parcourez les missions disponibles et choisissez celles qui vous intéressent'
            },
            createClips: {
              title: '2. Créez vos clips',
              description: 'Usa votre créativité pour faire des clips viraux a partir du contenu des créateurs'
            },
            earnMoney: {
              title: '3. Gagnez de l\'argent',
              description: 'Soyez payé en fonction des vues que génèrent vos clips sur TikTok'
            }
          }
        },
        stats: {
          totalEarnings: {
            title: 'Gains totaux',
            description: 'Vos premiers gains arrivent bientôt !'
          },
          generatedViews: {
            title: 'Vues générées',
            description: 'Prêt à faire le buzz ?'
          },
          createdClips: {
            title: 'Clips créés',
            description: 'Votre créativité n\'attend que vous !'
          }
        },
        missions: {
          title: 'Missions de contenu',
          description: 'Publiez du contenu sur les réseaux sociaux et soyez rémunéré(e) pour les vues que vous générez. Si vous souhaitez lancer une campagne, cliquez ici.',
          filters: {
            allProducts: 'Tous les produits',
            entertainment: 'Intrattenimento',
            music: 'Musica',
            brand: 'Marca',
            products: 'Produtos'
          }
        },
        views: {
          exact: 'Nombre de vues exactes (optionnel)',
          placeholder: 'Ou indiquez le nombre exact (minimum {count})',
          default: 'Si vide, nous utiliserons {count} vues'
        },
        actions: {
          cancel: 'Annuler',
          confirmPalier: 'Confirmer le palier'
        },
        payments: {
          title: 'Comment fonctionnent les paiements ?',
          commission: {
            title: 'Commission',
            description: '10% prélevés lors de la recharge du créateur'
          },
          share: {
            title: 'Votre part',
            description: '100% du montant calculé (commission déjà déduite)'
          },
          calculation: {
            title: 'Calcul',
            description: '(Nombre de vues ÷ 1000) × Prix par 1k vues'
          },
          method: {
            title: 'Paiement',
            description: 'Virement SEPA sous 2-3 jours ouvrés'
          },
          minimum: {
            title: 'Seuil minimum',
            description: 'Aucun seuil minimum'
          }
        }
      },
      admin: {
        dashboard: {
          title: 'Dashboard Admin (Debug)',
          overview: 'Vue d\'ensemble de votre plateforme ClipTokk',
          status: {
            connected: 'Connecté',
            notConnected: 'Non connecté',
            exists: 'Existe',
            notExists: 'Inexistant',
            adminConnected: 'Connecté en tant qu\'admin (bypass)',
            logout: 'Déconnexion'
          }
        },
        paliers: {
          clipLink: 'Lien du clip',
          missing: 'Manquant',
          noLink: 'Aucun lien TikTok fourni par le clippeur'
        }
      },
      onboarding: {
        role: {
          configuring: 'Configuration...',
          continue: 'Continuer',
          changeNote: 'Tu pourras modifier ce choix plus tard dans tes paramètres'
        }
      },
      platform: {
        preview: {
          keyPoints: {
            title: 'Points clés à inclure',
            description: 'Gameplay, graphismes, fun factor'
          },
          duration: {
            title: 'Durée recommandée',
            description: '30-60 secondes'
          },
          actions: {
            accept: 'Accepter la mission'
          },
          detection: {
            title: 'Détection automatique',
            duration: 'Durée : 45 secondes',
            hashtags: 'Hashtags requis présents',
            mention: 'Mention du créateur incluse',
            submit: 'Valider et soumettre'
          }
        }
      }
    }
  },
  es: {
    clipper: {
      views: {
        exact: 'Número exacto de vistas (opcional)',
        placeholder: 'O indica el número exacto (mínimo {count})',
        default: 'Si está vacío, usaremos {count} vistas'
      },
      actions: {
        cancel: 'Cancelar',
        confirmPalier: 'Confirmar hito'
      }
    },
    nav: {
      howItWorks: 'Cómo funciona',
      faq: 'FAQ',
      signIn: 'Iniciar sesión',
      language: 'Idioma'
    },
    hero: {
      challenge: {
        ongoing: 'Desafío en curso',
        earned: '¡ya ganados!',
        joinNow: 'Unirse ahora'
      },
      badge: '500+ clippers activos esta semana',
      title: {
        part1: 'Gana dinero publicando',
        part2: 'TikToks virales'
      },
      description: '¿Publicas clips? Te pagamos por cada visualización. Únete a misiones, publica en TikTok, gana dinero según el rendimiento.',
      cta: {
        missions: 'Ver misiones disponibles',
        becomeClipper: 'Convertirse en clipper'
      },
      stats: {
        clippers: '500+ clippers activos',
        views: '2.3M visualizaciones generadas'
      }
    },
    howItWorks: {
      title: '¿Cómo funciona?',
      subtitle: '3 pasos simples para empezar a ganar',
      steps: {
        mission: {
          title: '1. Elige una misión',
          description: 'Explora las misiones disponibles y selecciona las que te interesen. Cada misión especifica el tema y la compensación.'
        },
        create: {
          title: '2. Crea tu clip',
          description: 'Crea y publica tu TikTok siguiendo las pautas de la misión. Nuestro sistema rastrea automáticamente tus visualizaciones.'
        },
        paid: {
          title: '3. Recibe el pago',
          description: 'Rastrea tus ganancias en tiempo real y retira tu dinero desde $10. Pagos rápidos y seguros a través de Stripe.'
        }
      }
    },
    platform: {
      title: 'Así es tu panel de clipper',
      subtitle: 'Obtén una vista previa de la plataforma antes de comenzar. Misiones, estadísticas, retiros... todo está diseñado para facilitarte la vida.',
      sections: {
        mission: {
          title: 'Selección de misión',
          subtitle: 'Elige una misión según tu estilo y audiencia',
          rate: '$0.10 / 1K vistas',
          followers: 'seguidores',
          duration: '30-60s',
          expires: 'Expira en 3d'
        },
        performance: {
          title: 'Seguimiento del rendimiento',
          subtitle: 'Rastrea tus ganancias, clips publicados y vistas en tiempo real',
          stats: {
            earnings: 'Ganancias',
            views: 'Vistas'
          }
        },
        submission: {
          title: 'Envío fácil',
          subtitle: 'Pega tu enlace de TikTok, todo se detecta automáticamente',
          checks: {
            duration: 'Duración: 45 segundos',
            hashtags: 'Hashtags requeridos presentes',
            mention: 'Mención del creador incluida'
          }
        },
        withdrawal: {
          title: 'Retiro fácil',
          subtitle: 'Obtén tus ganancias',
          balance: 'Saldo disponible',
          stripe: {
            title: 'Stripe Connect',
            subtitle: 'Pago seguro'
          },
          transfer: {
            time: '24-48h',
            subtitle: 'Tiempo de transferencia'
          }
        }
      },
      cta: 'Quiero probar la plataforma'
    },
    dashboard: {
      common: {
        loading: 'Cargando...',
        error: 'Error:',
        loginRequired: 'Inicio de sesión requerido',
        loginMessage: 'Por favor, inicia sesión para acceder a tu panel.',
        profileSetup: 'Configuración del perfil',
        profileMessage: 'Tu perfil aún no está configurado.',
        setupProfile: 'Configurar mi perfil',
        loadingDashboard: 'Cargando tu panel...',
        loadingAnalytics: 'Cargando tus análisis...',
        loadingSettings: 'Cargando tus ajustes...',
        cancel: 'Cancelar'
      },
      creator: {
        title: 'Panel de creador',
        welcome: 'Bienvenido',
        overview: 'Aquí tienes un resumen de tu rendimiento.',
        stats: {
          totalViews: 'Visualizaciones totales',
          avgViews: 'visualizaciones promedio',
          totalRevenue: 'Ingresos totales',
          paidMissions: 'misiones pagadas',
          activeMissions: 'Misiones activas',
          createdMissions: 'Misiones creadas por ti',
          pending: 'Pendiente',
          pendingValidations: 'Validaciones pendientes'
        },
        wallet: {
          title: 'Mi Billetera',
          description: 'Administra tus ganancias y retiros',
          balance: {
            title: 'Saldo disponible',
            pending: 'Pendiente',
            total: 'Ganancias totales'
          },
          withdraw: {
            title: 'Retirar fondos',
            button: 'Retirar',
            minimum: 'Monto mínimo de retiro:'
          },
          history: {
            title: 'Historial de transacciones',
            empty: 'Aún no hay transacciones'
          },
          stats: {
            availableCredits: 'Créditos disponibles',
            available: 'Disponible ahora',
            totalDeposited: 'Total depositado',
            total: 'Total',
            reservedCredits: 'Créditos reservados',
            reserved: 'Reservado',
            spentCredits: 'Créditos gastados',
            spent: 'Gastado'
          },
          actions: {
            addFunds: 'Agregar fondos',
            addFundsButton: 'Agregar créditos',
            bankAccount: 'Cuenta bancaria',
            bankAccountButton: 'Gestionar cuenta'
          },
          transactions: {
            title: 'Transacciones recientes',
            empty: {
              title: 'Sin transacciones',
              description: 'Tu historial de transacciones aparecerá aquí'
            }
          }
        },
        missions: {
          title: 'Misiones de contenido',
          description: 'Publica contenido en redes sociales y recibe pagos por las visualizaciones que generes. Si quieres lanzar una campaña, haz clic aquí.',
          activeMissionsCount: {
            singular: 'misión de contenido en vivo',
            plural: 'misiones de contenido en vivo'
          },
          gridView: 'Vista de cuadrícula',
          stats: {
            totalMissions: 'Misiones totales',
            active: 'activas',
            totalBudget: 'Presupuesto total',
            investment: 'Inversión'
          }
        },
        analytics: {
          title: 'Análisis',
          description: 'Sigue el rendimiento de tus misiones y el compromiso de tu audiencia.',
          kpis: {
            totalViews: 'Visualizaciones totales',
            thisMonth: 'este mes',
            totalEarnings: 'Ganancias totales',
            monthlyViews: 'Visualizaciones mensuales',
            monthlyEarnings: 'Ganancias mensuales',
            avgViews: 'Visualizaciones promedio',
            topMission: 'Mejor misión'
          }
        },
        navigation: {
          dashboard: 'Panel',
          missions: 'Misiones',
          newMission: 'Nueva Misión',
          analytics: 'Análisis',
          wallet: 'Billetera',
          payments: 'Pagos',
          logout: 'Cerrar sesión'
        },
        newMission: {
          title: 'Crear nueva misión',
          description: 'Configura los parámetros de tu misión y comienza a recibir clips',
          sections: {
            basicInfo: 'Información básica',
            pricing: 'Precios',
            platforms: 'Plataformas',
            additionalInfo: 'Información adicional'
          },
          fields: {
            title: {
              label: 'Título de la misión',
              placeholder: 'Ej: Clipear mis mejores momentos de juego'
            },
            description: {
              label: 'Descripción detallada',
              placeholder: 'Describe lo que esperas de los clippers, el estilo deseado, etc.'
            },
            category: {
              label: 'Categoría',
              placeholder: 'Selecciona una categoría',
              options: {
                entertainment: 'Entretenimiento',
                music: 'Música',
                brand: 'Marca',
                products: 'Productos'
              }
            },
            totalBudget: {
              label: 'Presupuesto total',
              placeholder: 'Ej: 1000'
            },
            reward: {
              label: 'Recompensa por 1k vistas',
              placeholder: 'Ej: 1.00'
            },
            rewardExample: 'Ejemplos de recompensas:',
            platforms: {
              label: 'Plataformas objetivo'
            },
            videoUrl: {
              label: 'URL del video de referencia',
              placeholder: 'Enlace a tu video'
            },
            brandGuidelines: {
              label: 'Pautas de marca',
              placeholder: 'Ej: colores, tono, logo...'
            },
            creatorImage: {
              label: 'Imágen del creador',
              upload: 'Subir imagen'
            },
            durationMin: {
              label: 'Duración mínima (segundos)',
              placeholder: 'Ej: 30'
            },
            durationMax: {
              label: 'Duración máxima (segundos)',
              placeholder: 'Ej: 60'
            }
          },
          actions: {
            publish: 'Publicar misión',
            draft: 'Guardar como borrador'
          }
        }
      },
      clipper: {
        welcome: {
          title: '¡Bienvenido a ClipTokk,',
          description: '¡Ahora estás listo para comenzar tu viaje de clipping y ganar dinero con tus creaciones!',
          steps: {
            findMissions: {
              title: '1. Encuentra misiones',
              description: 'Explora las misiones disponibles y elige las que te interesen'
            },
            createClips: {
              title: '2. Crea tus clips',
              description: 'Usa tu creatividad para hacer clips virales a partir del contenido de los creadores'
            },
            earnMoney: {
              title: '3. Gana dinero',
              description: 'Recibe pagos según las visualizaciones que generen tus clips en TikTok'
            }
          }
        },
        stats: {
          totalEarnings: {
            title: 'Ganancias totales',
            description: '¡Tus primeras ganancias están por llegar!'
          },
          generatedViews: {
            title: 'Visualizaciones generadas',
            description: '¿Listo para hacerte viral?'
          },
          createdClips: {
            title: 'Clips creados',
            description: '¡Tu creatividad te está esperando!'
          }
        },
        missions: {
          title: 'Misiones de contenido',
          description: 'Pubblica contenuti sui social media e guadagna in base alle visualizzazioni che generi. Se vuoi lanciare una campagna, clicca qui.',
          filters: {
            allProducts: 'Todos los productos',
            entertainment: 'Intrattenimento',
            music: 'Musica',
            brand: 'Marca',
            products: 'Produtos'
          }
        },
        views: {
          exact: 'Número exacto de vistas (opcional)',
          placeholder: 'O indica el número exacto (mínimo {count})',
          default: 'Si está vacío, usaremos {count} vistas'
        },
        actions: {
          cancel: 'Cancelar',
          confirmPalier: 'Confirmar hito'
        },
        payments: {
          title: '¿Cómo funcionan los pagos?',
          commission: {
            title: 'Comisión',
            description: '10% tomado durante la recarga del creador'
          },
          share: {
            title: 'Tu parte',
            description: '100% del monto calculado (commissione già dedotta)'
          },
          calculation: {
            title: 'Cálculo',
            description: '(Número de vistas ÷ 1000) × Precio por 1k vistas'
          },
          method: {
            title: 'Pago',
            description: 'Transferencia SEPA en 2-3 días hábiles'
          },
          minimum: {
            title: 'Umbral mínimo',
            description: 'Sin umbral mínimo'
          }
        }
      },
      admin: {
        dashboard: {
          title: 'Panel de Administración (Debug)',
          overview: 'Vista general de tu plataforma ClipTokk',
          status: {
            connected: 'Conectado',
            notConnected: 'No conectado',
            exists: 'Existe',
            notExists: 'No existe',
            adminConnected: 'Connecté en tant qu\'admin (bypass)',
            logout: 'Cerrar sesión'
          }
        },
        paliers: {
          clipLink: 'Enlace del clip',
          missing: 'Faltante',
          noLink: 'Nessun link TikTok fornito'
        }
      },
      onboarding: {
        role: {
          configuring: 'Configurando...',
          continue: 'Continuar',
          changeNote: 'Podrás cambiar esta elección más tarde en tu configuración'
        }
      },
      platform: {
        preview: {
          keyPoints: {
            title: 'Puntos clave a incluir',
            description: 'Gameplay, gráficos, factor diversión'
          },
          duration: {
            title: 'Duración recomendada',
            description: '30-60 segundos'
          },
          actions: {
            accept: 'Aceptar misión'
          },
          detection: {
            title: 'Detección automática',
            duration: 'Duración: 45 segundos',
            hashtags: 'Hashtags requeridos presentes',
            mention: 'Mención del creador incluida',
            submit: 'Validar y enviar'
          }
        }
      }
    }
  },
  it: {
    clipper: {
      views: {
        exact: 'Numero esatto di visualizzazioni (opzionale)',
        placeholder: 'O indica il numero esatto (minimo {count})',
        default: 'Se vuoto, useremo {count} visualizzazioni'
      },
      actions: {
        cancel: 'Annulla',
        confirmPalier: 'Conferma milestone'
      }
    },
    nav: {
      howItWorks: 'Come funziona',
      faq: 'FAQ',
      signIn: 'Accedi',
      language: 'Lingua'
    },
    hero: {
      challenge: {
        ongoing: 'Sfida in corso',
        earned: 'già guadagnati!',
        joinNow: 'Unisciti ora'
      },
      badge: '500+ clipper attivi questa settimana',
      title: {
        part1: 'Guadagna pubblicando',
        part2: 'TikTok virali'
      },
      description: 'Pubblichi clip? Ti paghiamo per ogni visualizzazione. Unisciti alle missioni, pubblica su TikTok, guadagna in base alle prestazioni.',
      cta: {
        missions: 'Vedi missioni disponibili',
        becomeClipper: 'Diventa clipper'
      },
      stats: {
        clippers: '500+ clipper attivi',
        views: '2.3M visualizzazioni generate'
      }
    },
    howItWorks: {
      title: 'Come funziona?',
      subtitle: '3 semplici passi per iniziare a guadagnare',
      steps: {
        mission: {
          title: '1. Scegli una missione',
          description: 'Sfoglia le missioni disponibili e seleziona quelle che ti interessano. Ogni missione specifica il tema e il compenso.'
        },
        create: {
          title: '2. Crea il tuo clip',
          description: 'Crea e pubblica il tuo TikTok seguendo le linee guida della missione. Il nostro sistema traccia automaticamente le tue visualizzazioni.'
        },
        paid: {
          title: '3. Ricevi il pagamento',
          description: 'Traccia i tuoi guadagni in tempo reale e preleva i tuoi soldi da $10. Pagamenti rapidi e sicuri tramite Stripe.'
        }
      }
    },
    platform: {
      title: 'Ecco come appare la tua dashboard clipper',
      subtitle: 'Ottieni un\'anteprima della piattaforma prima di iniziare. Missioni, statistiche, prelievi... tutto è progettato per semplificarti la vita.',
      sections: {
        mission: {
          title: 'Selezione missione',
          subtitle: 'Scegli una missione in base al tuo stile e pubblico',
          rate: '$0.10 / 1K visualizzazioni',
          followers: 'follower',
          duration: '30-60s',
          expires: 'Scade in 3g'
        },
        performance: {
          title: 'Monitoraggio prestazioni',
          subtitle: 'Traccia i tuoi guadagni, clip pubblicati e visualizzazioni in tempo reale',
          stats: {
            earnings: 'Guadagni',
            views: 'Visualizzazioni'
          }
        },
        submission: {
          title: 'Invio facile',
          subtitle: 'Incolla il tuo link TikTok, tutto viene rilevato automaticamente',
          checks: {
            duration: 'Durata: 45 secondi',
            hashtags: 'Hashtag richiesti presenti',
            mention: 'Menzione del creatore inclusa'
          }
        },
        withdrawal: {
          title: 'Prelievo facile',
          subtitle: 'Ottieni i tuoi guadagni',
          balance: 'Saldo disponibile',
          stripe: {
            title: 'Stripe Connect',
            subtitle: 'Pagamento sicuro'
          },
          transfer: {
            time: '24-48h',
            subtitle: 'Tempo di trasferimento'
          }
        }
      },
      cta: 'Voglio provare la piattaforma'
    },
    dashboard: {
      common: {
        loading: 'Caricamento...',
        error: 'Errore:',
        loginRequired: 'Accesso richiesto',
        loginMessage: 'Effettua l\'accesso per accedere alla tua dashboard.',
        profileSetup: 'Configurazione profilo',
        profileMessage: 'Il tuo profilo non è ancora configurato.',
        setupProfile: 'Configura il mio profilo',
        loadingDashboard: 'Caricamento della tua dashboard...',
        loadingAnalytics: 'Caricamento delle tue analisi...',
        loadingSettings: 'Caricamento delle tue impostazioni...',
        cancel: 'Annulla'
      },
      creator: {
        title: 'Dashboard del creatore',
        welcome: 'Benvenuto',
        overview: 'Ecco una panoramica delle tue prestazioni.',
        stats: {
          totalViews: 'Visualizzazioni totali',
          avgViews: 'visualizzazioni medie',
          totalRevenue: 'Ricavi totali',
          paidMissions: 'missioni pagate',
          activeMissions: 'Missioni attive',
          createdMissions: 'Missioni create da te',
          pending: 'In attesa',
          pendingValidations: 'Validazioni in attesa'
        },
        wallet: {
          title: 'Il mio Portafoglio',
          description: 'Gestisci i tuoi guadagni e prelievi',
          balance: {
            title: 'Saldo disponibile',
            pending: 'In attesa',
            total: 'Guadagni totali'
          },
          withdraw: {
            title: 'Preleva fondi',
            button: 'Preleva',
            minimum: 'Importo minimo di prelievo:'
          },
          history: {
            title: 'Cronologia transazioni',
            empty: 'Nessuna transazione ancora'
          },
          stats: {
            availableCredits: 'Crediti disponibili',
            available: 'Disponibile ora',
            totalDeposited: 'Totale depositato',
            total: 'Totale',
            reservedCredits: 'Crediti riservati',
            reserved: 'Riservato',
            spentCredits: 'Crediti spesi',
            spent: 'Speso'
          },
          actions: {
            addFunds: 'Aggiungi fondi',
            addFundsButton: 'Aggiungi crediti',
            bankAccount: 'Conto bancario',
            bankAccountButton: 'Gestisci conto'
          },
          transactions: {
            title: 'Transazioni recenti',
            empty: {
              title: 'Nessuna transazione',
              description: 'La tua cronologia delle transazioni apparirà qui'
            }
          }
        },
        missions: {
          title: 'Missioni di contenuto',
          description: 'Pubblica contenuti sui social media e guadagna in base alle visualizzazioni che generi. Se vuoi lanciare una campagna, clicca qui.',
          activeMissionsCount: {
            singular: 'missione di contenuto in diretta',
            plural: 'missioni di contenuto in diretta'
          },
          gridView: 'Vista griglia',
          stats: {
            totalMissions: 'Missioni totali',
            active: 'attive',
            totalBudget: 'Budget totale',
            investment: 'Investimento'
          }
        },
        analytics: {
          title: 'Analisi',
          description: 'Monitora le prestazioni delle tue missioni e il coinvolgimento del tuo pubblico.',
          kpis: {
            totalViews: 'Visualizzazioni totali',
            thisMonth: 'questo mese',
            totalEarnings: 'Guadagni totali',
            monthlyViews: 'Visualizzazioni mensili',
            monthlyEarnings: 'Guadagni mensili',
            avgViews: 'Visualizzazioni medie',
            topMission: 'Migliore missione'
          }
        },
        navigation: {
          dashboard: 'Dashboard',
          missions: 'Missioni',
          newMission: 'Nuova Missione',
          analytics: 'Analisi',
          wallet: 'Portafoglio',
          payments: 'Pagamenti',
          logout: 'Esci'
        },
        newMission: {
          title: 'Crea nuova missione',
          description: 'Configura i parametri della tua missione e inizia a ricevere clip',
          sections: {
            basicInfo: 'Informazioni di base',
            pricing: 'Prezzi',
            platforms: 'Piattaforme',
            additionalInfo: 'Informazioni aggiuntive'
          },
          fields: {
            title: {
              label: 'Titolo della missione',
              placeholder: 'Es: Clippare i miei migliori momenti di gioco'
            },
            description: {
              label: 'Descrizione dettagliata',
              placeholder: 'Descrivi cosa ti aspetti dai clipper, lo stile desiderato, ecc.'
            },
            category: {
              label: 'Categoria',
              placeholder: 'Seleziona una categoria',
              options: {
                entertainment: 'Intrattenimento',
                music: 'Musica',
                brand: 'Marca',
                products: 'Prodotti'
              }
            },
            totalBudget: {
              label: 'Budget totale',
              placeholder: 'Es: 1000'
            },
            reward: {
              label: 'Ricompensa per 1k visualizzazioni',
              placeholder: 'Es: 1.00'
            },
            rewardExample: 'Esempi di ricompense:',
            platforms: {
              label: 'Piattaforme target'
            },
            videoUrl: {
              label: 'URL del video di riferimento',
              placeholder: 'Link al tuo video'
            },
            brandGuidelines: {
              label: 'Linee guida del marchio',
              placeholder: 'Es: colori, tono, logo...'
            },
            creatorImage: {
              label: 'Immagine del creatore',
              upload: 'Carica immagine'
            },
            durationMin: {
              label: 'Durata minima (secondi)',
              placeholder: 'Es: 30'
            },
            durationMax: {
              label: 'Durata massima (secondi)',
              placeholder: 'Es: 60'
            }
          },
          actions: {
            publish: 'Pubblica missione',
            draft: 'Salva come bozza'
          }
        }
      },
      clipper: {
        welcome: {
          title: 'Benvenuto su ClipTokk,',
          description: 'Ora sei pronto per iniziare il tuo viaggio di clipping e guadagnare con le tue creazioni!',
          steps: {
            findMissions: {
              title: '1. Trova missioni',
              description: 'Sfoglia le missioni disponibili e scegli quelle che ti interessano'
            },
            createClips: {
              title: '2. Crea i tuoi clip',
              description: 'Usa la tua creatività per creare clip virali dai contenuti dei creatori'
            },
            earnMoney: {
              title: '3. Guadagna',
              description: 'Ricevi pagamenti in base alle visualizzazioni che i tuoi clip generano su TikTok'
            }
          }
        },
        stats: {
          totalEarnings: {
            title: 'Guadagni totali',
            description: 'I tuoi primi guadagni stanno arrivando!'
          },
          generatedViews: {
            title: 'Visualizzazioni generate',
            description: 'Pronto a diventare virale?'
          },
          createdClips: {
            title: 'Clip creati',
            description: 'La tua creatività ti sta aspettando!'
          }
        },
        missions: {
          title: 'Missioni di contenuto',
          description: 'Pubblica contenuti sui social media e guadagna in base alle visualizzazioni che generi. Se vuoi lanciare una campagna, clicca qui.',
          filters: {
            allProducts: 'Tutti i prodotti',
            entertainment: 'Intrattenimento',
            music: 'Musica',
            brand: 'Marca',
            products: 'Prodotti'
          }
        },
        views: {
          exact: 'Numero esatto di visualizzazioni (opzionale)',
          placeholder: 'O indica il numero esatto (mínimo {count})',
          default: 'Se vuoto, useremo {count} visualizzazioni'
        },
        actions: {
          cancel: 'Annulla',
          confirmPalier: 'Conferma milestone'
        },
        payments: {
          title: 'Come funzionano i pagamenti?',
          commission: {
            title: 'Commissione',
            description: '10% prelevato durante la ricarica del creatore'
          },
          share: {
            title: 'La tua parte',
            description: '100% dell\'importo calcolato (commissione già dedotta)'
          },
          calculation: {
            title: 'Calcolo',
            description: '(Numero di visualizzazioni ÷ 1000) × Prezzo per 1k visualizzazioni'
          },
          method: {
            title: 'Pagamento',
            description: 'Bonifico SEPA entro 2-3 giorni lavorativi'
          },
          minimum: {
            title: 'Soglia minima',
            description: 'Nessuna soglia minima'
          }
        }
      },
      admin: {
        dashboard: {
          title: 'Dashboard Admin (Debug)',
          overview: 'Panoramica della tua piattaforma ClipTokk',
          status: {
            connected: 'Connesso',
            notConnected: 'Non connesso',
            exists: 'Esiste',
            notExists: 'Non esiste',
            adminConnected: 'Connecté en tant qu\'admin (bypass)',
            logout: 'Disconnetti'
          }
        },
        paliers: {
          clipLink: 'Link del clip',
          missing: 'Mancante',
          noLink: 'Nessun link TikTok fornito'
        }
      },
      onboarding: {
        role: {
          configuring: 'Configurazione in corso...',
          continue: 'Continua',
          changeNote: 'Potrai modificare questa scelta più tardi nelle impostazioni'
        }
      },
      platform: {
        preview: {
          keyPoints: {
            title: 'Punti chiave da includere',
            description: 'Gameplay, grafica, fattore divertimento'
          },
          duration: {
            title: 'Durata consigliata',
            description: '30-60 secondi'
          },
          actions: {
            accept: 'Accetta missione'
          },
          detection: {
            title: 'Rilevamento automatico',
            duration: 'Durata: 45 secondi',
            hashtags: 'Hashtag richiesti presenti',
            mention: 'Menzione del creatore inclusa',
            submit: 'Valida e invia'
          }
        }
      }
    }
  }
}; 