export type Language = 'en' | 'fr' | 'es' | 'it';

export interface HomeTranslations {
  nav: {
    howItWorks: string;
    faq: string;
    signIn: string;
  };
  hero: {
    challenge: {
      ongoing: string;
      earned: string;
      joinNow: string;
    };
    badge: string;
    title: {
      part1: string;
      part2: string;
    };
    description: string;
    cta: {
      missions: string;
      becomeClipper: string;
    };
    stats: {
      clippers: string;
      views: string;
    };
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: {
      mission: {
        title: string;
        description: string;
      };
      create: {
        title: string;
        description: string;
      };
      paid: {
        title: string;
        description: string;
      };
    };
  };
  platform: {
    title: string;
    subtitle: string;
    sections: {
      mission: {
        title: string;
        subtitle: string;
        followers: string;
        rate: string;
        duration: string;
        expires: string;
      };
      performance: {
        title: string;
        subtitle: string;
        stats: {
          earnings: string;
          views: string;
        };
      };
      submission: {
        title: string;
        subtitle: string;
        checks: {
          duration: string;
          hashtags: string;
          mention: string;
        };
      };
      withdrawal: {
        title: string;
        subtitle: string;
        balance: string;
        stripe: {
          title: string;
          subtitle: string;
        };
        transfer: {
          time: string;
          subtitle: string;
        };
      };
    };
    cta: string;
  };
} 