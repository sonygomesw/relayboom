export type Language = 'en' | 'fr' | 'es' | 'it';

export const translations = {
  en: {
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      continue: "Continue",
      confirm: "Confirm",
      edit: "Edit",
      delete: "Delete",
      examine: "Examine",
      missing: "Missing",
      error: "Error",
      approve: "Approve",
      reject: "Reject",
      processing: "Processing..."
    },
    views: {
      exact: "Exact view count (optional)",
      placeholder: "Or enter exact number (minimum {count})",
      default: "If empty, we will use {count} views",
      total: "Total views",
      average: "Average views per clip"
    },
    actions: {
      cancel: "Cancel",
      confirmPalier: "Confirm milestone",
      continue: "Continue",
      approve: "Approve",
      reject: "Reject",
      examine: "Examine"
    },
    settings: {
      title: "Settings",
      description: "Manage your personal information and payment preferences",
      tabs: {
        payment: "Payment Method",
        profile: "Profile",
        security: "Security",
        notifications: "Notifications"
      },
      bankInfo: {
        title: "Bank Information",
        description: "Set up your bank information to receive payments via SEPA transfer"
      },
      paymentHistory: {
        title: "Payment History",
        noPayments: "No payments yet",
        description: "Your payments will appear here once your clips are approved and paid"
      },
      paymentInfo: {
        title: "How do payments work?",
        commission: "Commission",
        yourShare: "Your share",
        calculation: "Calculation",
        payment: "Payment",
        minimumThreshold: "Minimum threshold",
        details: {
          commission: "10% taken when creator recharges",
          yourShare: "100% of calculated amount (commission already deducted)",
          calculation: "(Number of views ÷ 1000) × Price per 1k views",
          payment: "SEPA transfer within 2-3 business days",
          minimumThreshold: "No minimum threshold"
        }
      },
      paymentTitle: "How do payments work?",
      commission: "Commission",
      commissionDescription: "10% taken when creator recharges",
      calculation: "Calculation",
      calculationDescription: "(Views count ÷ 1000) × Price per 1k views",
      bankInfoDescription: "Set up your bank information to receive payments via SEPA transfer",
      paymentMethod: "Payments",
      profile: "Profile",
      security: "Security",
      notifications: "Notifications",
      yourShare: "Your share",
      yourShareDescription: "100% of calculated amount (commission already deducted)",
      payment: "Payment",
      paymentDescription: "SEPA transfer within 2-3 business days",
      minimumThreshold: "Minimum threshold",
      minimumThresholdDescription: "No minimum threshold"
    },
    admin: {
      clipLink: "Clip link",
      missing: "Missing",
      noTikTokLink: "No TikTok link provided by clipper",
      pendingSubmissions: "Pending submissions",
      approvedSubmissions: "Approved submissions",
      rejectedSubmissions: "Rejected submissions",
      milestones: {
        title: "Milestones Management",
        description: "Review and validate milestone submissions",
        loading: "Loading milestone submissions...",
        noSubmissions: "No milestone submissions found",
        noSubmissionsHelp: "Check if users have submitted any milestones",
        tabs: {
          pending: "Pending",
          approved: "Approved",
          rejected: "Rejected"
        },
        submission: {
          clipLink: "Clip link",
          missing: "Missing",
          noTikTokLink: "No TikTok link provided by clipper",
          views: "Views",
          earnings: "Earnings",
          clipper: "Clipper",
          creator: "Creator",
          mission: "Mission",
          date: "Date",
          status: "Status",
          actions: "Actions"
        },
        actions: {
          approve: "Approve",
          reject: "Reject",
          examine: "Examine",
          approving: "Approving...",
          rejecting: "Rejecting..."
        },
        errors: {
          tableNotFound: "The clip_submissions table does not exist. Please run the SQL creation script.",
          insufficientPermissions: "Insufficient permissions to access clip_submissions. Check RLS policies.",
          accessError: "Error accessing clip_submissions table: ",
          validationError: "Error during validation: "
        }
      }
    },
    onboarding: {
      welcome: {
        title: "Welcome to ClipTokk!",
        subtitle: "What's your goal?"
      },
      roles: {
        creator: {
          title: "I'm a creator / influencer",
          description: "I want to get paid for my views and have my content clipped"
        },
        clipper: {
          title: "I'm a clipper",
          description: "I want to make clips for creators and earn money"
        }
      },
      configuring: "Configuring...",
      roleChangeNote: "You can change this choice later in your settings",
      errors: {
        noRole: "Please select a role",
        updateFailed: "Error updating role: "
      }
    },
    platformPreviews: {
      mission: {
        title: "Available mission",
        expiresIn: "Expires in {days} days",
        reward: "Reward: €{amount} / 1000 views",
        subscribers: "{count}M subscribers",
        keyPoints: {
          title: "Key points to include",
          content: "Gameplay, graphics, fun factor"
        },
        duration: {
          title: "Recommended duration",
          content: "30-60 seconds"
        },
        acceptButton: "Accept mission"
      },
      dashboard: {
        title: "Clipper Dashboard",
        level: "Level: Expert 🏆",
        stats: {
          totalEarnings: "Total earnings",
          totalViews: "Total views",
          postedClips: "Posted clips"
        },
        recentClips: {
          title: "Recent clips",
          timeAgo: "{days} days ago"
        },
        common: {
          loadingDashboard: "Loading your dashboard..."
        },
        clipper: {
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
              description: "Your total earnings from all clips"
            },
            generatedViews: {
              title: "Generated Views",
              description: "Total views across all your clips"
            },
            createdClips: {
              title: "Created Clips",
              description: "Number of clips you've created"
            }
          },
          missions: {
            title: "Available Missions",
            description: "Browse and accept missions from creators",
            filters: {
              allProducts: "All Products",
              entertainment: "Entertainment",
              music: "Music",
              brand: "Brand",
              products: "Products"
            },
            activeMissionsCount: {
              singular: "active mission",
              plural: "active missions"
            },
            gridView: "Grid View",
            listView: "List View"
          }
        },
        creator: {
          missions: {
            activeMissionsCount: {
              singular: "active mission",
              plural: "active missions"
            },
            gridView: "Grid View"
          },
          newMission: {
            title: "Create a New Mission",
            form: {
              title: {
                label: "Mission Title",
                placeholder: "Enter a title for your mission"
              },
              description: {
                label: "Description",
                placeholder: "Describe what you're looking for in this mission"
              },
              contentType: {
                label: "Content Type",
                options: {
                  ugc: "UGC",
                  brand: "Brand",
                  entertainment: "Entertainment",
                  music: "Music"
                }
              },
              category: {
                label: "Category",
                options: {
                  entertainment: "Entertainment",
                  music: "Music",
                  brand: "Brand",
                  products: "Products"
                }
              },
              budget: {
                label: "Total Budget",
                placeholder: "Enter your total budget",
                type: {
                  label: "Budget Type",
                  total: "Total Budget",
                  perView: "Per View"
                }
              },
              reward: {
                label: "Reward per 1k Views",
                placeholder: "Enter reward amount"
              },
              platforms: {
                label: "Platforms",
                tiktok: "TikTok",
                instagram: "Instagram",
                youtube: "YouTube",
                twitter: "Twitter"
              },
              image: {
                label: "Creator Image",
                upload: "Upload Image",
                uploading: "Uploading..."
              },
              logo: {
                label: "Logo URL",
                placeholder: "Enter your logo URL"
              },
              guidelines: {
                label: "Brand Guidelines",
                placeholder: "Enter your brand guidelines"
              },
              video: {
                label: "Video URL",
                placeholder: "Enter your video URL"
              },
              duration: {
                label: "Duration",
                min: "Minimum (seconds)",
                max: "Maximum (seconds)"
              }
            },
            validation: {
              required: "Please fill in all required fields",
              platforms: "Please select at least one platform",
              auth: "Authentication error. Please log in again.",
              session: "Session expired. Please log in again."
            },
            buttons: {
              back: "Back",
              save: "Save Mission",
              saving: "Saving..."
            }
          }
        }
      },
      upload: {
        title: "Submit your clip",
        description: "Just paste your TikTok link, we'll handle the rest",
        tiktokLink: "TikTok link",
        placeholder: "@username/video/1234567890",
        autoDetection: {
          title: "Automatic detection",
          duration: "Duration: {seconds} seconds",
          hashtags: "Required hashtags present",
          mention: "Creator mention included"
        },
        submitButton: "Validate and submit"
      },
      withdraw: {
        title: "Withdraw your earnings",
        description: "Choose amount to withdraw (minimum €10)",
        availableBalance: "Available balance",
        amount: {
          label: "Amount to withdraw",
          placeholder: "0.00",
          max: "MAX"
        }
      },
      creator: {
        title: "Creator Dashboard",
        welcome: "Welcome",
        overview: "Here's an overview of your account",
        stats: {
          totalViews: "Total Views",
          avgViews: "avg. views per clip",
          totalRevenue: "Total Revenue",
          paidMissions: "paid missions",
          activeMissions: "Active Missions",
          createdMissions: "missions created",
          pending: "Pending Validations",
          pendingValidations: "waiting for validation"
        },
        missions: {
          title: "Your Missions",
          stats: {
            totalMissions: "Total Missions",
            active: "active",
            totalBudget: "Total Budget",
            investment: "total investment",
            totalViews: "Total Views",
            avgViews: "avg. views per clip",
            pending: "Pending Validations",
            pendingValidations: "waiting for validation"
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
            title: "No Missions",
            description: "Start by creating your first mission",
            createButton: "Create Mission"
          }
        },
        navigation: {
          newMission: "New Mission"
        }
      }
    },
    clipper: {
      views: {
        exact: 'Exact view count (optional)',
        placeholder: 'Or enter exact number (minimum {count})',
        default: 'If empty, we will use {count} views'
      },
      actions: {
        cancel: 'Cancel',
        confirmPalier: 'Confirm milestone'
      },
      clips: {
        title: "My Clips",
        description: "Manage your submitted clips and track their performance",
        stats: {
          totalSubmissions: "Total submissions",
          totalViews: "Total views",
          totalEarnings: "Total earnings",
          pendingSubmissions: "Pending submissions",
          approvedSubmissions: "Approved submissions",
          rejectedSubmissions: "Rejected submissions",
          activeMissions: "Active missions",
          avgViewsPerClip: "Average views per clip"
        },
        filters: {
          all: "All",
          pending: "Pending",
          approved: "Approved",
          rejected: "Rejected",
          search: "Search clips...",
          noResults: "No clips found matching your filters"
        },
        clip: {
          mission: "Mission",
          creator: "Creator",
          views: "Views",
          earnings: "Earnings",
          date: "Date",
          status: "Status",
          actions: "Actions",
          viewOnTikTok: "View on TikTok",
          declareMilestone: "Declare milestone",
          milestoneForm: {
            title: "Declare a milestone",
            description: "Enter the number of views reached",
            viewCount: "View count",
            exactViews: "Exact view count (optional)",
            viewsPlaceholder: "Or enter exact number (minimum {count})",
            viewsDefault: "If empty, we will use {count} views",
            submit: "Submit milestone"
          }
        }
      }
    },
    nav: {
      howItWorks: 'How it works',
      faq: 'FAQ',
      signIn: 'Sign in',
      language: 'Language'
    },
    // ... rest of English translations
  },
  fr: {
    common: {
      loading: "Chargement...",
      save: "Enregistrer",
      cancel: "Annuler",
      continue: "Continuer",
      confirm: "Confirmer",
      edit: "Modifier",
      delete: "Supprimer",
      examine: "Examiner",
      missing: "Manquant",
      error: "Erreur",
      approve: "Approuver",
      reject: "Rejeter",
      processing: "En cours..."
    },
    views: {
      exact: "Nombre de vues exactes (optionnel)",
      placeholder: "Ou indiquez le nombre exact (minimum {count})",
      default: "Si vide, nous utiliserons {count} vues",
      total: "Vues totales",
      average: "Moyenne de vues par clip"
    },
    actions: {
      cancel: "Annuler",
      confirmPalier: "Confirmer le palier",
      continue: "Continuer",
      approve: "Approuver",
      reject: "Rejeter",
      examine: "Examiner"
    },
    settings: {
      title: "Paramètres",
      description: "Gérez vos informations personnelles et vos préférences de paiement",
      tabs: {
        payment: "Méthode de paiement",
        profile: "Profil",
        security: "Sécurité",
        notifications: "Notifications"
      },
      bankInfo: {
        title: "Informations bancaires",
        description: "Configurez vos informations bancaires pour recevoir vos paiements par virement SEPA"
      },
      paymentHistory: {
        title: "Historique des paiements",
        noPayments: "Aucun paiement pour le moment",
        description: "Vos paiements apparaîtront ici une fois que vos clips seront approuvés et payés"
      },
      paymentInfo: {
        title: "Comment fonctionnent les paiements ?",
        commission: "Commission",
        yourShare: "Votre part",
        calculation: "Calcul",
        payment: "Paiement",
        minimumThreshold: "Seuil minimum",
        details: {
          commission: "10% prélevés lors de la recharge du créateur",
          yourShare: "100% du montant calculé (commission déjà déduite)",
          calculation: "(Nombre de vues ÷ 1000) × Prix par 1k vues",
          payment: "Virement SEPA sous 2-3 jours ouvrés",
          minimumThreshold: "Aucun seuil minimum"
        }
      },
      paymentTitle: "Comment fonctionnent les paiements ?",
      commission: "Commission",
      commissionDescription: "10% prélevés lors de la recharge du créateur",
      calculation: "Calcul",
      calculationDescription: "(Nombre de vues ÷ 1000) × Prix par 1k vues",
      bankInfoDescription: "Configurez vos informations bancaires pour recevoir vos paiements par virement SEPA",
      paymentMethod: "Paiements",
      profile: "Profil",
      security: "Sécurité",
      notifications: "Notifications",
      yourShare: "Votre part",
      yourShareDescription: "100% du montant calculé (commission déjà déduite)",
      payment: "Paiement",
      paymentDescription: "Virement SEPA sous 2-3 jours ouvrés",
      minimumThreshold: "Seuil minimum",
      minimumThresholdDescription: "Aucun seuil minimum"
    },
    admin: {
      clipLink: "Lien du clip",
      missing: "Manquant",
      noTikTokLink: "Aucun lien TikTok fourni par le clippeur",
      pendingSubmissions: "Soumissions en attente",
      approvedSubmissions: "Soumissions approuvées",
      rejectedSubmissions: "Soumissions rejetées",
      milestones: {
        title: "Gestion des paliers",
        description: "Examinez et validez les soumissions de paliers",
        loading: "Chargement des soumissions de paliers...",
        noSubmissions: "Aucune soumission de palier trouvée",
        noSubmissionsHelp: "Vérifiez que des utilisateurs ont soumis des paliers",
        tabs: {
          pending: "En attente",
          approved: "Approuvés",
          rejected: "Rejetés"
        },
        submission: {
          clipLink: "Lien du clip",
          missing: "Manquant",
          noTikTokLink: "Aucun lien TikTok fourni par le clippeur",
          views: "Vues",
          earnings: "Gains",
          clipper: "Clippeur",
          creator: "Créateur",
          mission: "Mission",
          date: "Date",
          status: "Statut",
          actions: "Actions"
        },
        actions: {
          approve: "Approuver",
          reject: "Rejeter",
          examine: "Examiner",
          approving: "Approbation...",
          rejecting: "Rejet..."
        },
        errors: {
          tableNotFound: "La table clip_submissions n'existe pas. Veuillez exécuter le script SQL de création.",
          insufficientPermissions: "Permissions insuffisantes pour accéder à clip_submissions. Vérifiez les politiques RLS.",
          accessError: "Erreur d'accès à la table clip_submissions : ",
          validationError: "Erreur lors de la validation : "
        }
      }
    },
    onboarding: {
      welcome: {
        title: "Bienvenue sur ClipTokk !",
        subtitle: "Quel est ton objectif ?"
      },
      roles: {
        creator: {
          title: "Je suis créateur / influenceur",
          description: "Je veux être payé pour mes vues et faire clipper mon contenu"
        },
        clipper: {
          title: "Je suis clippeur",
          description: "Je veux faire des clips pour les créateurs et gagner de l'argent"
        }
      },
      configuring: "Configuration...",
      roleChangeNote: "Tu pourras modifier ce choix plus tard dans tes paramètres",
      errors: {
        noRole: "Veuillez sélectionner un rôle",
        updateFailed: "Erreur lors de la mise à jour du rôle : "
      }
    },
    platformPreviews: {
      mission: {
        title: "Mission disponible",
        expiresIn: "Expire dans {days} jours",
        reward: "Récompense : {amount}€ / 1000 vues",
        subscribers: "{count}M abonnés",
        keyPoints: {
          title: "Points clés à inclure",
          content: "Gameplay, graphismes, fun factor"
        },
        duration: {
          title: "Durée recommandée",
          content: "30-60 secondes"
        },
        acceptButton: "Accepter la mission"
      },
      dashboard: {
        title: "Dashboard Clippeur",
        level: "Niveau : Expert 🏆",
        stats: {
          totalEarnings: "Gains totaux",
          totalViews: "Vues totales",
          postedClips: "Clips postés"
        },
        recentClips: {
          title: "Derniers clips",
          timeAgo: "Il y a {days} jours"
        },
        common: {
          loadingDashboard: "Chargement de votre tableau de bord...",
          loginRequired: "Connexion Requise",
          loginMessage: "Veuillez vous connecter pour accéder à votre tableau de bord",
          profileSetup: "Configuration du Profil Requise",
          profileMessage: "Veuillez compléter la configuration de votre profil pour continuer",
          setupProfile: "Configurer le Profil",
          error: "Erreur"
        },
        clipper: {
          welcome: {
            title: "Bienvenue",
            description: "Commencez avec ClipTokk et gagnez de l'argent en créant des clips !",
            steps: {
              findMissions: {
                title: "Trouver des Missions",
                description: "Parcourez les missions disponibles des créateurs"
              },
              createClips: {
                title: "Créer des Clips",
                description: "Créez des clips engageants qui suivent les directives de la mission"
              },
              earnMoney: {
                title: "Gagner de l'Argent",
                description: "Soyez payé pour vos vues et vos clips réussis"
              }
            }
          },
          stats: {
            totalEarnings: {
              title: "Gains Totaux",
              description: "Vos gains totaux de tous les clips"
            },
            generatedViews: {
              title: "Vues Générées",
              description: "Total des vues sur tous vos clips"
            },
            createdClips: {
              title: "Clips Créés",
              description: "Nombre de clips que vous avez créés"
            }
          },
          missions: {
            title: "Missions Disponibles",
            description: "Parcourez et acceptez les missions des créateurs",
            filters: {
              allProducts: "Tous les Produits",
              entertainment: "Divertissement",
              music: "Musique",
              brand: "Marque",
              products: "Produits"
            },
            activeMissionsCount: {
              singular: "mission active",
              plural: "missions actives"
            },
            gridView: "Vue en grille",
            listView: "Vue en liste"
          },
          newMission: {
            title: "Créer une Nouvelle Mission",
            form: {
              title: {
                label: "Titre de la Mission",
                placeholder: "Entrez un titre pour votre mission"
              },
              description: {
                label: "Description",
                placeholder: "Décrivez ce que vous recherchez dans cette mission"
              },
              contentType: {
                label: "Type de Contenu",
                options: {
                  ugc: "UGC",
                  brand: "Marque",
                  entertainment: "Divertissement",
                  music: "Musique"
                }
              },
              category: {
                label: "Catégorie",
                options: {
                  entertainment: "Divertissement",
                  music: "Musique",
                  brand: "Marque",
                  products: "Produits"
                }
              },
              budget: {
                label: "Budget Total",
                placeholder: "Entrez votre budget total",
                type: {
                  label: "Type de Budget",
                  total: "Budget Total",
                  perView: "Par Vue"
                }
              },
              reward: {
                label: "Récompense par 1k Vues",
                placeholder: "Entrez le montant de la récompense"
              },
              platforms: {
                label: "Plateformes",
                tiktok: "TikTok",
                instagram: "Instagram",
                youtube: "YouTube",
                twitter: "Twitter"
              },
              image: {
                label: "Image du Créateur",
                upload: "Télécharger une Image",
                uploading: "Téléchargement..."
              },
              logo: {
                label: "URL du Logo",
                placeholder: "Entrez l'URL de votre logo"
              },
              guidelines: {
                label: "Directives de Marque",
                placeholder: "Entrez vos directives de marque"
              },
              video: {
                label: "URL de la Vidéo",
                placeholder: "Entrez l'URL de votre vidéo"
              },
              duration: {
                label: "Durée",
                min: "Minimum (secondes)",
                max: "Maximum (secondes)"
              }
            },
            validation: {
              required: "Veuillez remplir tous les champs obligatoires",
              platforms: "Veuillez sélectionner au moins une plateforme",
              auth: "Erreur d'authentification. Veuillez vous reconnecter.",
              session: "Session expirée. Veuillez vous reconnecter."
            },
            buttons: {
              back: "Retour",
              save: "Enregistrer la Mission",
              saving: "Enregistrement..."
            }
          }
        },
        creator: {
          missions: {
            activeMissionsCount: {
              singular: "mission active",
              plural: "missions actives"
            },
            gridView: "Vue en grille"
          }
        }
      },
      upload: {
        title: "Soumettre ton clip",
        description: "Colle simplement ton lien TikTok, on s'occupe du reste",
        tiktokLink: "Lien TikTok",
        placeholder: "@username/video/1234567890",
        autoDetection: {
          title: "Détection automatique",
          duration: "Durée : {seconds} secondes",
          hashtags: "Hashtags requis présents",
          mention: "Mention du créateur incluse"
        },
        submitButton: "Valider et soumettre"
      },
      withdraw: {
        title: "Retirer tes gains",
        description: "Choisis le montant à retirer (minimum 10€)",
        availableBalance: "Solde disponible",
        amount: {
          label: "Montant à retirer",
          placeholder: "0.00",
          max: "MAX"
        }
      },
      creator: {
        title: "Tableau de Bord Créateur",
        welcome: "Bienvenue",
        overview: "Voici un aperçu de votre compte",
        stats: {
          totalViews: "Vues Totales",
          avgViews: "vues moy. par clip",
          totalRevenue: "Revenus Totaux",
          paidMissions: "missions payées",
          activeMissions: "Missions Actives",
          createdMissions: "missions créées",
          pending: "Validations en Attente",
          pendingValidations: "en attente de validation"
        },
        missions: {
          title: "Vos Missions",
          stats: {
            totalMissions: "Total des Missions",
            active: "actives",
            totalBudget: "Budget Total",
            investment: "investissement total",
            totalViews: "Vues Totales",
            avgViews: "vues moy. par clip",
            pending: "Validations en Attente",
            pendingValidations: "en attente de validation"
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
            title: "Aucune Mission",
            description: "Commencez par créer votre première mission",
            createButton: "Créer une Mission"
          }
        },
        navigation: {
          newMission: "Nouvelle Mission"
        }
      }
    },
    clipper: {
      views: {
        exact: 'Nombre de vues exactes (optionnel)',
        placeholder: 'Ou indiquez le nombre exact (minimum {count})',
        default: 'Si vide, nous utiliserons {count} vues'
      },
      actions: {
        cancel: 'Annuler',
        confirmPalier: 'Confirmer le palier'
      },
      clips: {
        title: "Mes Clips",
        description: "Gérez vos clips soumis et suivez leurs performances",
        stats: {
          totalSubmissions: "Total des soumissions",
          totalViews: "Total des vues",
          totalEarnings: "Gains totaux",
          pendingSubmissions: "Soumissions en attente",
          approvedSubmissions: "Soumissions approuvées",
          rejectedSubmissions: "Soumissions rejetées",
          activeMissions: "Missions actives",
          avgViewsPerClip: "Moyenne de vues par clip"
        },
        filters: {
          all: "Tous",
          pending: "En attente",
          approved: "Approuvés",
          rejected: "Rejetés",
          search: "Rechercher des clips...",
          noResults: "Aucun clip trouvé correspondant à vos filtres"
        },
        clip: {
          mission: "Mission",
          creator: "Créateur",
          views: "Vues",
          earnings: "Gains",
          date: "Date",
          status: "Statut",
          actions: "Actions",
          viewOnTikTok: "Voir sur TikTok",
          declareMilestone: "Déclarer un palier",
          milestoneForm: {
            title: "Déclarer un palier",
            description: "Entrez le nombre de vues atteint",
            viewCount: "Nombre de vues",
            exactViews: "Nombre de vues exactes (optionnel)",
            viewsPlaceholder: "Ou indiquez le nombre exact (minimum {count})",
            viewsDefault: "Si vide, nous utiliserons {count} vues",
            submit: "Soumettre le palier"
          }
        }
      }
    },
    nav: {
      howItWorks: 'Comment ça marche',
      faq: 'FAQ',
      signIn: 'Connexion',
      language: 'Langue'
    },
    // ... rest of French translations
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
    // ... rest of Spanish translations
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
    // ... rest of Italian translations
  }
} as const; 