import { Language, HomeTranslations } from './types/translations';

export const homeTranslations: Record<Language, HomeTranslations> = {
  en: {
    nav: {
      howItWorks: "How it works",
      faq: "FAQ",
      signIn: "Sign in"
    },
    hero: {
      challenge: {
        ongoing: "Ongoing challenge",
        earned: "Earned so far",
        joinNow: "Join now"
      },
      badge: "Featured on TikTok",
      title: {
        part1: "Turn your TikTok skills",
        part2: "into earnings"
      },
      description: "Join our community of clippers and start earning money by creating engaging content for top creators",
      cta: {
        missions: "Browse missions",
        becomeClipper: "Become a clipper"
      },
      stats: {
        clippers: "Active clippers",
        views: "Total views"
      }
    },
    howItWorks: {
      title: "How it works",
      subtitle: "Start earning in 3 simple steps",
      steps: {
        mission: {
          title: "Choose a mission",
          description: "Browse available missions from creators and pick the ones that match your style"
        },
        create: {
          title: "Create content",
          description: "Create engaging clips following the mission guidelines"
        },
        paid: {
          title: "Get paid",
          description: "Earn money based on your clip's performance"
        }
      }
    },
    platform: {
      title: "Our platform",
      subtitle: "Everything you need to succeed",
      sections: {
        mission: {
          title: "Mission details",
          subtitle: "Clear guidelines for success",
          followers: "Followers",
          rate: "Rate per 1k views",
          duration: "Duration",
          expires: "Expires in"
        },
        performance: {
          title: "Performance tracking",
          subtitle: "Monitor your success",
          stats: {
            earnings: "Total earnings",
            views: "Total views"
          }
        },
        submission: {
          title: "Easy submission",
          subtitle: "Simple validation process",
          checks: {
            duration: "Duration check",
            hashtags: "Hashtags check",
            mention: "Mention check"
          }
        },
        withdrawal: {
          title: "Fast payments",
          subtitle: "Get paid quickly and securely",
          balance: "Current balance",
          stripe: {
            title: "Stripe Connect",
            subtitle: "Secure payment processing"
          },
          transfer: {
            time: "2-3 business days",
            subtitle: "Average transfer time"
          }
        }
      },
      cta: "Start earning now"
    }
  },
  fr: {
    nav: {
      howItWorks: "Comment ça marche",
      faq: "FAQ",
      signIn: "Connexion"
    },
    hero: {
      challenge: {
        ongoing: "Défi en cours",
        earned: "Gagné jusqu'à présent",
        joinNow: "Rejoindre"
      },
      badge: "Mis en avant sur TikTok",
      title: {
        part1: "Transformez vos compétences TikTok",
        part2: "en revenus"
      },
      description: "Rejoignez notre communauté de clippers et commencez à gagner de l'argent en créant du contenu engageant pour les meilleurs créateurs",
      cta: {
        missions: "Parcourir les missions",
        becomeClipper: "Devenir clipper"
      },
      stats: {
        clippers: "Clippers actifs",
        views: "Vues totales"
      }
    },
    howItWorks: {
      title: "Comment ça marche",
      subtitle: "Commencez à gagner en 3 étapes simples",
      steps: {
        mission: {
          title: "Choisissez une mission",
          description: "Parcourez les missions disponibles des créateurs et choisissez celles qui correspondent à votre style"
        },
        create: {
          title: "Créez du contenu",
          description: "Créez des clips engageants en suivant les directives de la mission"
        },
        paid: {
          title: "Soyez payé",
          description: "Gagnez de l'argent en fonction des performances de vos clips"
        }
      }
    },
    platform: {
      title: "Notre plateforme",
      subtitle: "Tout ce dont vous avez besoin pour réussir",
      sections: {
        mission: {
          title: "Détails de la mission",
          subtitle: "Des directives claires pour réussir",
          followers: "Abonnés",
          rate: "Taux par 1k vues",
          duration: "Durée",
          expires: "Expire dans"
        },
        performance: {
          title: "Suivi des performances",
          subtitle: "Surveillez votre succès",
          stats: {
            earnings: "Gains totaux",
            views: "Vues totales"
          }
        },
        submission: {
          title: "Soumission facile",
          subtitle: "Processus de validation simple",
          checks: {
            duration: "Vérification de la durée",
            hashtags: "Vérification des hashtags",
            mention: "Vérification de la mention"
          }
        },
        withdrawal: {
          title: "Paiements rapides",
          subtitle: "Soyez payé rapidement et en toute sécurité",
          balance: "Solde actuel",
          stripe: {
            title: "Stripe Connect",
            subtitle: "Traitement sécurisé des paiements"
          },
          transfer: {
            time: "2-3 jours ouvrés",
            subtitle: "Délai moyen de transfert"
          }
        }
      },
      cta: "Commencez à gagner maintenant"
    }
  }
}; 