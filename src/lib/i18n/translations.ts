export interface Translation {
  // Navigation
  nav: {
    howItWorks: string;
    missions: string;
    login: string;
    becomeClipper: string;
  };
  
  // Hero Section
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: {
      activeClippers: string;
      viewsGenerated: string;
    };
  };
  
  // How it works
  howItWorks: {
    title: string;
    subtitle: string;
    steps: {
      step1: {
        title: string;
        description: string;
      };
      step2: {
        title: string;
        description: string;
      };
      step3: {
        title: string;
        description: string;
      };
    };
  };
  
  // Pricing
  pricing: {
    title: string;
    subtitle: string;
    plans: {
      starter: {
        price: string;
        views: string;
        description: string;
      };
      pro: {
        price: string;
        views: string;
        description: string;
      };
      expert: {
        price: string;
        views: string;
        description: string;
      };
    };
  };
  
  // Trending
  trending: {
    badge: string;
    title: string;
    subtitle: string;
  };
  
  // Testimonials
  testimonials: {
    title: string;
    subtitle: string;
    reviews: {
      lucas: {
        name: string;
        role: string;
        text: string;
        earnings: string;
      };
      sarah: {
        name: string;
        role: string;
        text: string;
        views: string;
      };
      thomas: {
        name: string;
        role: string;
        text: string;
        earnings: string;
      };
    };
  };
  
  // FAQ
  faq: {
    title: string;
    subtitle: string;
    questions: {
      q1: {
        question: string;
        answer: string;
      };
      q2: {
        question: string;
        answer: string;
      };
      q3: {
        question: string;
        answer: string;
      };
      q4: {
        question: string;
        answer: string;
      };
    };
  };
  
  // CTA Final
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  
  // Footer
  footer: {
    description: string;
    platform: {
      title: string;
      howItWorks: string;
      missions: string;
      pricing: string;
      stories: string;
    };
    support: {
      title: string;
      help: string;
      contact: string;
      terms: string;
      privacy: string;
    };
    copyright: string;
  };
}

export const translations: Record<string, Translation> = {
  fr: {
    nav: {
      howItWorks: "Comment ça marche",
      missions: "Voir les missions",
      login: "Se connecter",
      becomeClipper: "Devenir clippeur"
    },
    hero: {
      badge: "● 500+ clippeurs actifs cette semaine",
      title: "Gagne de l'argent en postant des TikToks viraux",
      subtitle: "Tu postes des clips ? On te paie pour chaque vue. Rejoins des missions, publie sur TikTok, gagne de l'argent à la performance.",
      ctaPrimary: "Voir les missions disponibles →",
      ctaSecondary: "Devenir clippeur →",
      stats: {
        activeClippers: "500+ clippeurs actifs",
        viewsGenerated: "2,3M vues générées"
      }
    },
    howItWorks: {
      title: "Comment ça marche ?",
      subtitle: "3 étapes simples pour commencer à gagner",
      steps: {
        step1: {
          title: "1. Choisis une mission",
          description: "Parcours les missions disponibles et sélectionne celles qui t'intéressent. Chaque mission précise le thème et la rémunération."
        },
        step2: {
          title: "2. Crée ton clip",
          description: "Réalise et publie ton TikTok en suivant les consignes de la mission. Notre système détecte automatiquement tes vues."
        },
        step3: {
          title: "3. Reçois tes gains",
          description: "Suis tes revenus en temps réel et retire ton argent dès 10€. Paiements rapides et sécurisés via Stripe."
        }
      }
    },
    pricing: {
      title: "Combien peux-tu gagner ?",
      subtitle: "La rémunération dépend du nombre de vues. Voici un exemple :",
      plans: {
        starter: {
          price: "10€",
          views: "Pour 100K vues",
          description: "Plus tu génères de vues, plus tu gagnes ! Commence avec un objectif réaliste et progresse !"
        },
        pro: {
          price: "50€",
          views: "Pour 500K vues",
          description: "Plus tu génères de vues, plus tu gagnes ! Commence avec un objectif réaliste et progresse !"
        },
        expert: {
          price: "100€",
          views: "Pour 1M vues",
          description: "Plus tu génères de vues, plus tu gagnes ! Commence avec un objectif réaliste et progresse !"
        }
      }
    },
    trending: {
      badge: "🔥 Tendance cette semaine",
      title: "Les clips qui cartonnent",
      subtitle: "Clips en action"
    },
    testimonials: {
      title: "Ils génèrent déjà",
      subtitle: "Découvre les success stories de nos clippeurs",
      reviews: {
        lucas: {
          name: "Lucas M.",
          role: "Étudiant",
          text: "J'ai atteint 847€ avec seulement 9 clips ce mois-ci. C'est devenu une source de revenus stable !",
          earnings: "847€ gagnés en Mars 2024"
        },
        sarah: {
          name: "Sarah K.",
          role: "Freelance",
          text: "1,2M de vues en 3 semaines ! Je ne m'attendais pas à un tel succès sur mes premiers clips.",
          views: "1,2M vues en 3 semaines"
        },
        thomas: {
          name: "Thomas R.",
          role: "Créateur",
          text: "Je gagne maintenant plus avec ClipTokk qu'avec mon ancien job ! Les missions sont variées et bien payées.",
          earnings: "2 340€ depuis janvier"
        }
      }
    },
    faq: {
      title: "Questions fréquentes",
      subtitle: "Tout ce que tu dois savoir pour commencer",
      questions: {
        q1: {
          question: "😊 Comment sont calculés les gains ?",
          answer: "Tes gains sont calculés en fonction du nombre de vues réelles de ton clip TikTok. Plus ton clip génère de vues, plus tu gagnes. Le taux de rémunération est précisé dans chaque mission."
        },
        q2: {
          question: "💰 Quand suis-je payé ?",
          answer: "Tu peux retirer tes gains dès que tu atteins 10€. Les paiements sont effectués sous 48h via Stripe Connect directement sur ton compte bancaire."
        },
        q3: {
          question: "🎯 Combien de missions puis-je accepter ?",
          answer: "Il n'y a pas de limite ! Tu peux accepter autant de missions que tu veux. Plus tu en fais, plus tu gagnes. Certains clippeurs font 20+ missions par mois."
        },
        q4: {
          question: "📱 Ai-je besoin d'un gros compte TikTok ?",
          answer: "Non ! Même avec 0 abonné, tu peux créer des clips viraux. Notre algorithme aide tes clips à être vus. Beaucoup de nos clippeurs ont commencé avec de petits comptes."
        }
      }
    },
    cta: {
      title: "Tu veux commencer à gagner tes premiers euros dès ce soir ?",
      subtitle: "Rejoins ClipTokk maintenant et commence à monétiser tes TikToks. C'est gratuit et sans engagement.",
      button: "Je commence à gagner avec mes TikToks"
    },
    footer: {
      description: "ClipTokk est la première plateforme qui te permet de gagner de l'argent en postant des TikToks viraux. Rejoins une communauté de créateurs passionnés et monétise ton contenu.",
      platform: {
        title: "Plateforme",
        howItWorks: "Comment ça marche",
        missions: "Missions",
        pricing: "Tarifs",
        stories: "Success stories"
      },
      support: {
        title: "Support",
        help: "Centre d'aide",
        contact: "Contact",
        terms: "Conditions d'utilisation",
        privacy: "Politique de confidentialité"
      },
      copyright: "© 2024 ClipTokk. Tous droits réservés. Fait avec ❤️ en France."
    }
  },
  
  en: {
    nav: {
      howItWorks: "How it works",
      missions: "View missions",
      login: "Login",
      becomeClipper: "Become a clipper"
    },
    hero: {
      badge: "● 500+ active clippers this week",
      title: "Earn money by posting viral TikToks",
      subtitle: "You post clips? We pay you for every view. Join missions, publish on TikTok, earn money based on performance.",
      ctaPrimary: "View available missions →",
      ctaSecondary: "Become a clipper →",
      stats: {
        activeClippers: "500+ active clippers",
        viewsGenerated: "2.3M views generated"
      }
    },
    howItWorks: {
      title: "How it works?",
      subtitle: "3 simple steps to start earning",
      steps: {
        step1: {
          title: "1. Choose a mission",
          description: "Browse available missions and select those that interest you. Each mission specifies the theme and compensation."
        },
        step2: {
          title: "2. Create your clip",
          description: "Create and publish your TikTok following the mission guidelines. Our system automatically detects your views."
        },
        step3: {
          title: "3. Receive your earnings",
          description: "Track your revenue in real-time and withdraw your money from €10. Fast and secure payments via Stripe."
        }
      }
    },
    pricing: {
      title: "How much can you earn?",
      subtitle: "Compensation depends on the number of views. Here's an example:",
      plans: {
        starter: {
          price: "€10",
          views: "For 100K views",
          description: "The more views you generate, the more you earn! Start with a realistic goal and progress!"
        },
        pro: {
          price: "€50",
          views: "For 500K views",
          description: "The more views you generate, the more you earn! Start with a realistic goal and progress!"
        },
        expert: {
          price: "€100",
          views: "For 1M views",
          description: "The more views you generate, the more you earn! Start with a realistic goal and progress!"
        }
      }
    },
    trending: {
      badge: "🔥 Trending this week",
      title: "Trending clips",
      subtitle: "Clips in action"
    },
    testimonials: {
      title: "They're already generating",
      subtitle: "Discover our clippers' success stories",
      reviews: {
        lucas: {
          name: "Lucas M.",
          role: "Student",
          text: "I reached €847 with only 9 clips this month. It's become a stable source of income!",
          earnings: "€847 earned in March 2024"
        },
        sarah: {
          name: "Sarah K.",
          role: "Freelancer",
          text: "1.2M views in 3 weeks! I didn't expect such success on my first clips.",
          views: "1.2M views in 3 weeks"
        },
        thomas: {
          name: "Thomas R.",
          role: "Creator",
          text: "I now earn more with ClipTokk than my old job! The missions are varied and well paid.",
          earnings: "€2,340 since January"
        }
      }
    },
    faq: {
      title: "Frequently asked questions",
      subtitle: "Everything you need to know to get started",
      questions: {
        q1: {
          question: "😊 How are earnings calculated?",
          answer: "Your earnings are calculated based on the real number of views of your TikTok clip. The more views your clip generates, the more you earn. The compensation rate is specified in each mission."
        },
        q2: {
          question: "💰 When do I get paid?",
          answer: "You can withdraw your earnings once you reach €10. Payments are made within 48h via Stripe Connect directly to your bank account."
        },
        q3: {
          question: "🎯 How many missions can I accept?",
          answer: "There's no limit! You can accept as many missions as you want. The more you do, the more you earn. Some clippers do 20+ missions per month."
        },
        q4: {
          question: "📱 Do I need a big TikTok account?",
          answer: "No! Even with 0 followers, you can create viral clips. Our algorithm helps your clips get seen. Many of our clippers started with small accounts."
        }
      }
    },
    cta: {
      title: "Want to start earning your first euros tonight?",
      subtitle: "Join ClipTokk now and start monetizing your TikToks. It's free and without commitment.",
      button: "I start earning with my TikToks"
    },
    footer: {
      description: "ClipTokk is the first platform that allows you to earn money by posting viral TikToks. Join a community of passionate creators and monetize your content.",
      platform: {
        title: "Platform",
        howItWorks: "How it works",
        missions: "Missions",
        pricing: "Pricing",
        stories: "Success stories"
      },
      support: {
        title: "Support",
        help: "Help center",
        contact: "Contact",
        terms: "Terms of use",
        privacy: "Privacy policy"
      },
      copyright: "© 2024 ClipTokk. All rights reserved. Made with ❤️ in France."
    }
  },
  
  es: {
    nav: {
      howItWorks: "Cómo funciona",
      missions: "Ver misiones",
      login: "Iniciar sesión",
      becomeClipper: "Ser clipper"
    },
    hero: {
      badge: "● 500+ clippers activos esta semana",
      title: "Gana dinero publicando TikToks virales",
      subtitle: "¿Publicas clips? Te pagamos por cada visualización. Únete a misiones, publica en TikTok, gana dinero por rendimiento.",
      ctaPrimary: "Ver misiones disponibles →",
      ctaSecondary: "Ser clipper →",
      stats: {
        activeClippers: "500+ clippers activos",
        viewsGenerated: "2,3M visualizaciones generadas"
      }
    },
    howItWorks: {
      title: "¿Cómo funciona?",
      subtitle: "3 pasos simples para empezar a ganar",
      steps: {
        step1: {
          title: "1. Elige una misión",
          description: "Explora las misiones disponibles y selecciona las que te interesen. Cada misión especifica el tema y la remuneración."
        },
        step2: {
          title: "2. Crea tu clip",
          description: "Realiza y publica tu TikTok siguiendo las pautas de la misión. Nuestro sistema detecta automáticamente tus visualizaciones."
        },
        step3: {
          title: "3. Recibe tus ganancias",
          description: "Sigue tus ingresos en tiempo real y retira tu dinero desde 10€. Pagos rápidos y seguros vía Stripe."
        }
      }
    },
    pricing: {
      title: "¿Cuánto puedes ganar?",
      subtitle: "La remuneración depende del número de visualizaciones. Aquí tienes un ejemplo:",
      plans: {
        starter: {
          price: "10€",
          views: "Por 100K visualizaciones",
          description: "¡Cuantas más visualizaciones generes, más ganas! ¡Empieza con un objetivo realista y progresa!"
        },
        pro: {
          price: "50€",
          views: "Por 500K visualizaciones",
          description: "¡Cuantas más visualizaciones generes, más ganas! ¡Empieza con un objetivo realista y progresa!"
        },
        expert: {
          price: "100€",
          views: "Por 1M visualizaciones",
          description: "¡Cuantas más visualizaciones generes, más ganas! ¡Empieza con un objetivo realista y progresa!"
        }
      }
    },
    trending: {
      badge: "🔥 Tendencia esta semana",
      title: "Los clips que triunfan",
      subtitle: "Clips en acción"
    },
    testimonials: {
      title: "Ya están generando",
      subtitle: "Descubre las historias de éxito de nuestros clippers",
      reviews: {
        lucas: {
          name: "Lucas M.",
          role: "Estudiante",
          text: "Alcancé 847€ con solo 9 clips este mes. ¡Se ha convertido en una fuente de ingresos estable!",
          earnings: "847€ ganados en Marzo 2024"
        },
        sarah: {
          name: "Sarah K.",
          role: "Freelancer",
          text: "¡1,2M de visualizaciones en 3 semanas! No esperaba tal éxito en mis primeros clips.",
          views: "1,2M visualizaciones en 3 semanas"
        },
        thomas: {
          name: "Thomas R.",
          role: "Creador",
          text: "¡Ahora gano más con ClipTokk que en mi trabajo anterior! Las misiones son variadas y bien pagadas.",
          earnings: "2.340€ desde enero"
        }
      }
    },
    faq: {
      title: "Preguntas frecuentes",
      subtitle: "Todo lo que necesitas saber para empezar",
      questions: {
        q1: {
          question: "😊 ¿Cómo se calculan las ganancias?",
          answer: "Tus ganancias se calculan según el número real de visualizaciones de tu clip de TikTok. Cuantas más visualizaciones genere tu clip, más ganas. La tasa de remuneración se especifica en cada misión."
        },
        q2: {
          question: "💰 ¿Cuándo me pagan?",
          answer: "Puedes retirar tus ganancias una vez que alcances 10€. Los pagos se realizan en 48h vía Stripe Connect directamente a tu cuenta bancaria."
        },
        q3: {
          question: "🎯 ¿Cuántas misiones puedo aceptar?",
          answer: "¡No hay límite! Puedes aceptar tantas misiones como quieras. Cuantas más hagas, más ganas. Algunos clippers hacen 20+ misiones por mes."
        },
        q4: {
          question: "📱 ¿Necesito una cuenta grande de TikTok?",
          answer: "¡No! Incluso con 0 seguidores, puedes crear clips virales. Nuestro algoritmo ayuda a que tus clips sean vistos. Muchos de nuestros clippers empezaron con cuentas pequeñas."
        }
      }
    },
    cta: {
      title: "¿Quieres empezar a ganar tus primeros euros esta noche?",
      subtitle: "Únete a ClipTokk ahora y comienza a monetizar tus TikToks. Es gratis y sin compromiso.",
      button: "Empiezo a ganar con mis TikToks"
    },
    footer: {
      description: "ClipTokk es la primera plataforma que te permite ganar dinero publicando TikToks virales. Únete a una comunidad de creadores apasionados y monetiza tu contenido.",
      platform: {
        title: "Plataforma",
        howItWorks: "Cómo funciona",
        missions: "Misiones",
        pricing: "Precios",
        stories: "Historias de éxito"
      },
      support: {
        title: "Soporte",
        help: "Centro de ayuda",
        contact: "Contacto",
        terms: "Términos de uso",
        privacy: "Política de privacidad"
      },
      copyright: "© 2024 ClipTokk. Todos los derechos reservados. Hecho con ❤️ en Francia."
    }
  },
  
  it: {
    nav: {
      howItWorks: "Come funziona",
      missions: "Vedi missioni",
      login: "Accedi",
      becomeClipper: "Diventa clipper"
    },
    hero: {
      badge: "● 500+ clipper attivi questa settimana",
      title: "Guadagna pubblicando TikTok virali",
      subtitle: "Pubblichi clip? Ti paghiamo per ogni visualizzazione. Unisciti alle missioni, pubblica su TikTok, guadagna in base alle performance.",
      ctaPrimary: "Vedi missioni disponibili →",
      ctaSecondary: "Diventa clipper →",
      stats: {
        activeClippers: "500+ clipper attivi",
        viewsGenerated: "2,3M visualizzazioni generate"
      }
    },
    howItWorks: {
      title: "Come funziona?",
      subtitle: "3 semplici passi per iniziare a guadagnare",
      steps: {
        step1: {
          title: "1. Scegli una missione",
          description: "Esplora le missioni disponibili e seleziona quelle che ti interessano. Ogni missione specifica il tema e la remunerazione."
        },
        step2: {
          title: "2. Crea il tuo clip",
          description: "Realizza e pubblica il tuo TikTok seguendo le linee guida della missione. Il nostro sistema rileva automaticamente le tue visualizzazioni."
        },
        step3: {
          title: "3. Ricevi i tuoi guadagni",
          description: "Monitora le tue entrate in tempo reale e preleva i tuoi soldi da 10€. Pagamenti rapidi e sicuri tramite Stripe."
        }
      }
    },
    pricing: {
      title: "Quanto puoi guadagnare?",
      subtitle: "La remunerazione dipende dal numero di visualizzazioni. Ecco un esempio:",
      plans: {
        starter: {
          price: "10€",
          views: "Per 100K visualizzazioni",
          description: "Più visualizzazioni generi, più guadagni! Inizia con un obiettivo realistico e progredisci!"
        },
        pro: {
          price: "50€",
          views: "Per 500K visualizzazioni",
          description: "Più visualizzazioni generi, più guadagni! Inizia con un obiettivo realistico e progredisci!"
        },
        expert: {
          price: "100€",
          views: "Per 1M visualizzazioni",
          description: "Più visualizzazioni generi, più guadagni! Inizia con un obiettivo realistico e progredisci!"
        }
      }
    },
    trending: {
      badge: "🔥 Tendenza questa settimana",
      title: "I clip che spaccano",
      subtitle: "Clip in azione"
    },
    testimonials: {
      title: "Stanno già generando",
      subtitle: "Scopri le storie di successo dei nostri clipper",
      reviews: {
        lucas: {
          name: "Lucas M.",
          role: "Studente",
          text: "Ho raggiunto 847€ con solo 9 clip questo mese. È diventata una fonte di reddito stabile!",
          earnings: "847€ guadagnati a Marzo 2024"
        },
        sarah: {
          name: "Sarah K.",
          role: "Freelancer",
          text: "1,2M di visualizzazioni in 3 settimane! Non mi aspettavo un tale successo sui miei primi clip.",
          views: "1,2M visualizzazioni in 3 settimane"
        },
        thomas: {
          name: "Thomas R.",
          role: "Creatore",
          text: "Ora guadagno di più con ClipTokk che nel mio vecchio lavoro! Le missioni sono varie e ben pagate.",
          earnings: "2.340€ da gennaio"
        }
      }
    },
    faq: {
      title: "Domande frequenti",
      subtitle: "Tutto quello che devi sapere per iniziare",
      questions: {
        q1: {
          question: "😊 Come vengono calcolati i guadagni?",
          answer: "I tuoi guadagni sono calcolati in base al numero reale di visualizzazioni del tuo clip TikTok. Più visualizzazioni genera il tuo clip, più guadagni. Il tasso di remunerazione è specificato in ogni missione."
        },
        q2: {
          question: "💰 Quando vengo pagato?",
          answer: "Puoi prelevare i tuoi guadagni una volta raggiunto i 10€. I pagamenti vengono effettuati entro 48h tramite Stripe Connect direttamente sul tuo conto bancario."
        },
        q3: {
          question: "🎯 Quante missioni posso accettare?",
          answer: "Non c'è limite! Puoi accettare tutte le missioni che vuoi. Più ne fai, più guadagni. Alcuni clipper fanno 20+ missioni al mese."
        },
        q4: {
          question: "📱 Ho bisogno di un account TikTok grande?",
          answer: "No! Anche con 0 follower, puoi creare clip virali. Il nostro algoritmo aiuta i tuoi clip ad essere visti. Molti dei nostri clipper hanno iniziato con account piccoli."
        }
      }
    },
    cta: {
      title: "Vuoi iniziare a guadagnare i tuoi primi euro stasera?",
      subtitle: "Unisciti a ClipTokk ora e inizia a monetizzare i tuoi TikTok. È gratis e senza impegno.",
      button: "Inizio a guadagnare con i miei TikTok"
    },
    footer: {
      description: "ClipTokk è la prima piattaforma che ti permette di guadagnare pubblicando TikTok virali. Unisciti a una comunità di creatori appassionati e monetizza i tuoi contenuti.",
      platform: {
        title: "Piattaforma",
        howItWorks: "Come funziona",
        missions: "Missioni",
        pricing: "Prezzi",
        stories: "Storie di successo"
      },
      support: {
        title: "Supporto",
        help: "Centro assistenza",
        contact: "Contatto",
        terms: "Termini di utilizzo",
        privacy: "Politica della privacy"
      },
      copyright: "© 2024 ClipTokk. Tutti i diritti riservati. Fatto con ❤️ in Francia."
    }
  }
}; 