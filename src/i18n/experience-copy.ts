import { Locale } from '@/i18n/config';
import { ConfidenceLevel, PerspectiveLens } from '@/types/experience';
import { CoverTheme, TopicCategory } from '@/types';

type CardCategoryKey = TopicCategory | 'path' | 'comparison' | 'research';

type ExperienceCopyShape = {
  pages: {
    compare: string;
    timeline: string;
    map: string;
    paths: string;
    collections: string;
    socials: string;
  };
  homePremium: {
    eyebrow: string;
    title: string;
    description: string;
    open: string;
    cards: Array<{
      title: string;
      description: string;
    }>;
  };
  footer: {
    socials: string;
    featureCards: string[];
  };
  compare: {
    eyebrow: string;
    title: string;
    description: string;
    leftQuery: string;
    rightQuery: string;
    prompt: string;
    swap: string;
    compare: string;
    another: string;
    loading: string;
    save: string;
    saved: string;
    saveError: string;
    emptyTitle: string;
    emptyDescription: string;
    similarities: string;
    differences: string;
    addToCollection: string;
    addTopicToCollection: string;
    structured: string;
    comparisonAdded: string;
    addTopicError: string;
    addTopicSuccess: (title: string) => string;
  };
  timeline: {
    eyebrow: string;
    title: string;
    description: string;
    engineEyebrow: string;
    zoomCentury: string;
    zoomDecade: string;
    zoomYear: string;
    all: string;
    categories: Record<string, string>;
  };
  map: {
    eyebrow: string;
    title: string;
    description: string;
    activeYear: string;
    interpretiveSurface: string;
    liveNodes: (count: number) => string;
    historicAnchors: (count: number) => string;
    activeOverlays: (count: number) => string;
    noOverlay: string;
    activeRange: (start: string, end: string) => string;
    routes: {
      mediterranean: string;
      sahara: string;
      mesopotamia: string;
      atlantic: string;
    };
    eras: {
      bce: string;
      ce: string;
    };
  };
  collections: {
    eyebrow: string;
    title: string;
    description: string;
    titleField: string;
    descriptionField: string;
    themeField: string;
    create: string;
    save: string;
    delete: string;
    remove: string;
    openLibrary: string;
    emptyTitle: string;
    emptyDescription: string;
    detailEyebrow: string;
    shelfSummary: string;
    curatedShelf: string;
    collectionItem: string;
    itemSummary: string;
    itemCount: (count: number) => string;
    themeLabels: Record<CoverTheme, string>;
  };
  paths: {
    eyebrow: string;
    title: string;
    description: string;
    chapters: (count: number) => string;
    minutes: (count: number) => string;
    theme: string;
    depth: string;
    progress: string;
    chaptersLeft: (count: number) => string;
    openChapter: string;
    markComplete: string;
    completed: string;
    completedTitle: string;
    completedDescription: string;
    difficultyLabels: Record<'Introductory' | 'Intermediate' | 'Advanced', string>;
  };
  topic: {
    readingMode: string;
    standardMode: string;
    sourceConfidence: string;
    perspectives: string;
    perspectiveHeading: string;
    perspectiveTitle: string;
    debate: string;
    debateHeading: string;
    askEra: string;
    askEraTitle: string;
    notes: string;
    bookmarks: string;
    recommendations: string;
    recommendationsHeading: string;
    addToCollection: string;
    addBookmark: string;
    addNote: string;
    saveNote: string;
    updateNote: string;
    deleteNote: string;
    bookmarkSaved: string;
    bookmarkRemoved: string;
    notePlaceholder: string;
    timelineDescription: string;
    legacy: string;
    consensus: string;
    addToCollectionSuccess: string;
    addToCollectionError: string;
  };
  knowledge: {
    title: string;
    description: string;
    streak: string;
    favoriteEras: string;
    favoriteRegions: string;
    readingDepth: string;
    completedPaths: string;
    comparisons: string;
    collections: string;
    savedBooks: string;
    continueExploring: string;
    quests: string;
    badges: string;
  };
  confidence: Record<ConfidenceLevel, string>;
  askEra: {
    defaultPrompt: string;
    generate: string;
    generating: string;
    caution: string;
    presets: string[];
  };
  card: {
    collectible: string;
    categories: Record<CardCategoryKey, string>;
  };
  lenses: Record<PerspectiveLens, string>;
};

const experienceCopy: Record<Locale, ExperienceCopyShape> = {
  en: {
    pages: {
      compare: 'Compare',
      timeline: 'Timeline',
      map: 'Map',
      paths: 'Paths',
      collections: 'Collections',
      socials: 'Socials',
    },
    homePremium: {
      eyebrow: 'Premium experiences',
      title: 'Explore the upgraded archive',
      description:
        'The platform now extends beyond search into compare workflows, timeline study, map exploration, shelves, and guided research paths.',
      open: 'Open experience',
      cards: [
        {
          title: 'Compare Mode',
          description:
            'Place two historical dossiers side by side and read the differences with structure.',
        },
        {
          title: 'Interactive Timeline',
          description:
            'Shift between clustered turning points and historical density without losing chronology.',
        },
        {
          title: 'Living World Map',
          description:
            'Use a stylized atlas layer to view imperial zones, routes, and historical overlays.',
        },
        {
          title: 'Deep Dive Paths',
          description:
            'Follow collectible guided journeys that now track completion in your profile.',
        },
      ],
    },
    footer: {
      socials: 'Socials',
      featureCards: [
        'Curated discovery routes',
        'Cinematic archival reading',
        'Collectible intelligent shelves',
      ],
    },
    compare: {
      eyebrow: 'Compare Mode',
      title: 'Place two historical dossiers in dialogue.',
      description:
        'Search two topics, let the archive align them, and read through their similarities, turning points, and long-term influence side by side.',
      leftQuery: 'Left topic',
      rightQuery: 'Right topic',
      prompt: 'Search for a figure, empire, war, civilization, or country...',
      swap: 'Swap sides',
      compare: 'Compare',
      another: 'Compare another',
      loading: 'Building comparison...',
      save: 'Save comparison',
      saved: 'Saved to your archive',
      saveError: 'This comparison could not be saved right now.',
      emptyTitle: 'Build an intelligent comparison',
      emptyDescription:
        'Start with two topics and ChronoLivre will structure the relationship across origin, power, conflict, legacy, and downstream influence.',
      similarities: 'Key similarities',
      differences: 'Key differences',
      addToCollection: 'Add comparison to shelf',
      addTopicToCollection: 'Add topic to shelf',
      structured: 'Structured comparison',
      comparisonAdded: 'Comparison added to shelf.',
      addTopicError: 'This dossier could not be added to the shelf right now.',
      addTopicSuccess: (title) => `${title} added to shelf.`,
    },
    timeline: {
      eyebrow: 'Interactive Timeline',
      title: 'World history through clustered turning points',
      description:
        'This shared timeline engine powers topic pages, compare mode, and deep-dive paths. Use it here as a global surface for political, cultural, military, and civilizational shifts.',
      engineEyebrow: 'Interactive timeline engine',
      zoomCentury: 'Century',
      zoomDecade: 'Decade',
      zoomYear: 'Year',
      all: 'All',
      categories: {
        all: 'All',
        war: 'Wars',
        ruler: 'Rulers',
        political: 'Political',
        cultural: 'Culture',
        invention: 'Inventions',
        dynasty: 'Dynasties',
        society: 'Society',
        expansion: 'Expansion',
      },
    },
    map: {
      eyebrow: 'Living World Map',
      title: 'A stylized atlas of influence and movement.',
      description:
        'This staged map layer is intentionally restrained: it highlights historically relevant zones and routes without pretending to full border precision when the source layer is still interpretive.',
      activeYear: 'Active year',
      interpretiveSurface: 'Interpretive atlas surface',
      liveNodes: (count) => `${count} live nodes`,
      historicAnchors: (count) => `${count} historic anchors`,
      activeOverlays: (count) => `${count} active overlays`,
      noOverlay: 'No curated overlay is active for this year. Move the slider to a different period.',
      activeRange: (start, end) => `Active from ${start} to ${end}`,
      routes: {
        mediterranean: 'Mediterranean',
        sahara: 'Sahara corridors',
        mesopotamia: 'Mesopotamia',
        atlantic: 'Atlantic',
      },
      eras: {
        bce: 'BCE',
        ce: 'CE',
      },
    },
    collections: {
      eyebrow: 'Collections',
      title: 'Curate premium shelves for your archive.',
      description:
        'Create named shelves for figures, wars, empires, comparisons, and guided paths. These shelves power the collectible side of ChronoLivre.',
      titleField: 'Shelf title',
      descriptionField: 'Description',
      themeField: 'Cover theme',
      create: 'Create shelf',
      save: 'Save shelf',
      delete: 'Delete shelf',
      remove: 'Remove',
      openLibrary: 'Open library',
      emptyTitle: 'No shelves yet',
      emptyDescription:
        'Create your first shelf to start organizing saved dossiers and premium comparisons.',
      detailEyebrow: 'Collection detail',
      shelfSummary: 'A curated shelf inside your historical archive.',
      curatedShelf: 'Curated shelf',
      collectionItem: 'Collection item',
      itemSummary: 'A saved object from your premium archive.',
      itemCount: (count) => `${count} items`,
      themeLabels: {
        'imperial-navy': 'Imperial navy',
        'ancient-sand': 'Ancient sand',
        'obsidian-industrial': 'Obsidian industrial',
        'emerald-dynasty': 'Emerald dynasty',
        'royal-purple': 'Royal purple',
        'bronze-civilization': 'Bronze civilization',
        'midnight-scholar': 'Midnight scholar',
        'oxblood-war': 'Oxblood war',
      },
    },
    paths: {
      eyebrow: 'Deep Dive Paths',
      title: 'Guided historical journeys with collectible structure.',
      description:
        'These curated paths turn the archive into an intelligent museum route: part learning sequence, part collectible reading list, part progression system.',
      chapters: (count) => `${count} chapters`,
      minutes: (count) => `${count} min`,
      theme: 'Theme',
      depth: 'Depth',
      progress: 'Progress',
      chaptersLeft: (count) => `${count} chapters left`,
      openChapter: 'Open chapter',
      markComplete: 'Mark chapter complete',
      completed: 'Completed',
      completedTitle: 'Path completed',
      completedDescription:
        'This path now feeds your knowledge profile, quest progress, and historical badge system.',
      difficultyLabels: {
        Introductory: 'Introductory',
        Intermediate: 'Intermediate',
        Advanced: 'Advanced',
      },
    },
    topic: {
      readingMode: 'Reading mode',
      standardMode: 'Standard mode',
      sourceConfidence: 'Source confidence',
      perspectives: 'Perspective mode',
      perspectiveHeading: 'Perspective mode',
      perspectiveTitle: 'Multiple analytical lenses',
      debate: 'Debate mode',
      debateHeading: 'Debate mode',
      askEra: 'Ask the era',
      askEraTitle: 'Historical perspective simulation',
      notes: 'Notes',
      bookmarks: 'Bookmarks',
      recommendations: 'Smart recommendations',
      recommendationsHeading: 'Curated next steps',
      addToCollection: 'Add dossier to shelf',
      addBookmark: 'Bookmark section',
      addNote: 'Add note',
      saveNote: 'Save note',
      updateNote: 'Update note',
      deleteNote: 'Delete note',
      bookmarkSaved: 'Section bookmarked',
      bookmarkRemoved: 'Bookmark removed',
      notePlaceholder:
        'Capture an argument, a date, a question, or a connection you want to revisit later.',
      timelineDescription:
        'Use the shared engine to trace this dossier through turning points, clusters, and filtered historical themes.',
      legacy: 'Legacy',
      consensus: 'Consensus',
      addToCollectionSuccess: 'Dossier added to shelf.',
      addToCollectionError: 'This dossier could not be attached to a shelf right now.',
    },
    knowledge: {
      title: 'Personal knowledge profile',
      description:
        'A living picture of your historical taste, study rhythm, and long-term exploration patterns.',
      streak: 'Explorer streak',
      favoriteEras: 'Favorite eras',
      favoriteRegions: 'Favorite regions',
      readingDepth: 'Reading depth',
      completedPaths: 'Completed paths',
      comparisons: 'Comparisons',
      collections: 'Shelves',
      savedBooks: 'Saved dossiers',
      continueExploring: 'Continue exploring',
      quests: 'Historical quests',
      badges: 'Era badges',
    },
    confidence: {
      'commonly-accepted': 'Commonly accepted',
      debated: 'Debated',
      uncertain: 'Uncertain',
      approximate: 'Approximate',
    },
    askEra: {
      defaultPrompt: 'How would a citizen of this era interpret the event?',
      generate: 'Generate perspective',
      generating: 'Generating...',
      caution:
        'Perspective mode is a historically informed simulation, not a literal eyewitness account.',
      presets: [
        'a citizen living in the era',
        'a court scholar',
        'a military observer',
        'a merchant moving across the region',
      ],
    },
    card: {
      collectible: 'Collectible dossier',
      categories: {
        figure: 'Figure',
        war: 'War',
        empire: 'Empire',
        civilization: 'Civilization',
        country: 'Country',
        event: 'Event',
        era: 'Era',
        dynasty: 'Dynasty',
        kingdom: 'Kingdom',
        path: 'Path',
        comparison: 'Comparison',
        research: 'Research',
      },
    },
    lenses: {
      political: 'Political',
      military: 'Military',
      social: 'Social',
      economic: 'Economic',
      cultural: 'Cultural',
      religious: 'Religious',
    },
  },
  fr: {
    pages: {
      compare: 'Comparer',
      timeline: 'Chronologie',
      map: 'Carte',
      paths: 'Parcours',
      collections: 'Collections',
      socials: 'Réseaux',
    },
    homePremium: {
      eyebrow: 'Expériences premium',
      title: "Explorez l'archive enrichie",
      description:
        'La plateforme va désormais au-delà de la recherche classique avec des comparaisons, une chronologie, une carte, des étagères et des parcours guidés.',
      open: "Ouvrir l'expérience",
      cards: [
        {
          title: 'Mode comparaison',
          description:
            'Placez deux dossiers historiques côte à côte et lisez leurs différences avec structure.',
        },
        {
          title: 'Chronologie interactive',
          description:
            'Naviguez entre tournants regroupés et densité historique sans perdre la chronologie.',
        },
        {
          title: 'Carte vivante du monde',
          description:
            'Utilisez une couche d’atlas stylisée pour observer zones impériales, routes et superpositions historiques.',
        },
        {
          title: 'Parcours guidés',
          description:
            'Suivez des itinéraires collectifs qui enregistrent maintenant votre progression dans le profil.',
        },
      ],
    },
    footer: {
      socials: 'Réseaux',
      featureCards: [
        'Itinéraires de découverte guidés',
        'Lecture archivistique cinématographique',
        'Étagères intelligentes à collectionner',
      ],
    },
    compare: {
      eyebrow: 'Mode comparaison',
      title: 'Placez deux dossiers historiques en dialogue.',
      description:
        "Recherchez deux sujets, laissez l'archive les aligner, puis lisez leurs ressemblances, leurs tournants et leur influence à long terme côte à côte.",
      leftQuery: 'Sujet de gauche',
      rightQuery: 'Sujet de droite',
      prompt:
        'Recherchez une figure, un empire, une guerre, une civilisation ou un pays...',
      swap: 'Inverser',
      compare: 'Comparer',
      another: 'Comparer autre chose',
      loading: 'Construction de la comparaison...',
      save: 'Enregistrer la comparaison',
      saved: "Enregistré dans votre archive",
      saveError: "Cette comparaison ne peut pas être enregistrée pour l'instant.",
      emptyTitle: 'Construisez une comparaison intelligente',
      emptyDescription:
        "Commencez avec deux sujets et ChronoLivre structurera leur relation à travers l'origine, le pouvoir, le conflit, l'héritage et l'influence ultérieure.",
      similarities: 'Points communs',
      differences: 'Différences clés',
      addToCollection: 'Ajouter la comparaison à une étagère',
      addTopicToCollection: 'Ajouter le sujet à une étagère',
      structured: 'Comparaison structurée',
      comparisonAdded: "Comparaison ajoutée à l'étagère.",
      addTopicError: "Ce dossier n'a pas pu être ajouté à l'étagère pour le moment.",
      addTopicSuccess: (title) => `${title} a été ajouté à l'étagère.`,
    },
    timeline: {
      eyebrow: 'Chronologie interactive',
      title: "L'histoire du monde à travers des tournants regroupés",
      description:
        'Ce moteur de chronologie alimente les pages sujet, les comparaisons et les parcours guidés. Utilisez-le ici comme surface globale pour les mutations politiques, culturelles, militaires et civilisationnelles.',
      engineEyebrow: 'Moteur de chronologie interactive',
      zoomCentury: 'Siècle',
      zoomDecade: 'Décennie',
      zoomYear: 'Année',
      all: 'Tout',
      categories: {
        all: 'Tout',
        war: 'Guerres',
        ruler: 'Dirigeants',
        political: 'Politique',
        cultural: 'Culture',
        invention: 'Inventions',
        dynasty: 'Dynasties',
        society: 'Société',
        expansion: 'Expansion',
      },
    },
    map: {
      eyebrow: 'Carte vivante du monde',
      title: "Un atlas stylisé de l'influence et du mouvement.",
      description:
        'Cette couche cartographique reste volontairement mesurée : elle met en valeur des zones et routes historiquement pertinentes sans prétendre à une précision frontalière totale lorsque la source reste interprétative.',
      activeYear: 'Année active',
      interpretiveSurface: "Surface d'atlas interprétative",
      liveNodes: (count) => `${count} nœuds actifs`,
      historicAnchors: (count) => `${count} repères historiques`,
      activeOverlays: (count) => `${count} superpositions actives`,
      noOverlay:
        "Aucune superposition organisée n'est active pour cette année. Déplacez le curseur vers une autre période.",
      activeRange: (start, end) => `Actif de ${start} à ${end}`,
      routes: {
        mediterranean: 'Méditerranée',
        sahara: 'Corridors sahariens',
        mesopotamia: 'Mésopotamie',
        atlantic: 'Atlantique',
      },
      eras: {
        bce: 'av. J.-C.',
        ce: 'apr. J.-C.',
      },
    },
    collections: {
      eyebrow: 'Collections',
      title: 'Composez des étagères premium pour votre archive.',
      description:
        'Créez des étagères nommées pour les figures, les guerres, les empires, les comparaisons et les parcours guidés. Elles alimentent désormais la dimension collectible de ChronoLivre.',
      titleField: "Titre de l'étagère",
      descriptionField: 'Description',
      themeField: 'Thème de couverture',
      create: "Créer l'étagère",
      save: "Enregistrer l'étagère",
      delete: "Supprimer l'étagère",
      remove: 'Retirer',
      openLibrary: 'Ouvrir la bibliothèque',
      emptyTitle: 'Aucune étagère pour le moment',
      emptyDescription:
        'Créez votre première étagère pour organiser les dossiers sauvegardés et les comparaisons premium.',
      detailEyebrow: "Détail de la collection",
      shelfSummary: 'Une étagère organisée à l’intérieur de votre archive historique.',
      curatedShelf: 'Étagère organisée',
      collectionItem: 'Élément de collection',
      itemSummary: 'Un objet sauvegardé de votre archive premium.',
      itemCount: (count) => `${count} éléments`,
      themeLabels: {
        'imperial-navy': 'Marine impériale',
        'ancient-sand': 'Sable antique',
        'obsidian-industrial': 'Obsidienne industrielle',
        'emerald-dynasty': 'Dynastie émeraude',
        'royal-purple': 'Pourpre royal',
        'bronze-civilization': 'Civilisation de bronze',
        'midnight-scholar': 'Savant nocturne',
        'oxblood-war': 'Oxblood guerrier',
      },
    },
    paths: {
      eyebrow: 'Parcours guidés',
      title: 'Voyages historiques guidés à la structure collectible.',
      description:
        "Ces parcours transforment l'archive en itinéraire de musée intelligent : séquence d'apprentissage, liste de lecture collectible et système de progression.",
      chapters: (count) => `${count} chapitres`,
      minutes: (count) => `${count} min`,
      theme: 'Thème',
      depth: 'Niveau',
      progress: 'Progression',
      chaptersLeft: (count) => `${count} chapitres restants`,
      openChapter: 'Ouvrir le chapitre',
      markComplete: 'Marquer comme terminé',
      completed: 'Terminé',
      completedTitle: 'Parcours terminé',
      completedDescription:
        'Ce parcours alimente désormais votre profil de connaissances, votre progression de quête et votre système de badges historiques.',
      difficultyLabels: {
        Introductory: 'Introductif',
        Intermediate: 'Intermédiaire',
        Advanced: 'Avancé',
      },
    },
    topic: {
      readingMode: 'Mode lecture',
      standardMode: 'Mode standard',
      sourceConfidence: 'Niveau de confiance',
      perspectives: 'Mode perspective',
      perspectiveHeading: 'Mode perspective',
      perspectiveTitle: 'Multiples angles d’analyse',
      debate: 'Mode débat',
      debateHeading: 'Mode débat',
      askEra: "Interroger l'époque",
      askEraTitle: 'Simulation de perspective historique',
      notes: 'Notes',
      bookmarks: 'Repères',
      recommendations: 'Recommandations intelligentes',
      recommendationsHeading: 'Étapes suivantes recommandées',
      addToCollection: "Ajouter le dossier à l'étagère",
      addBookmark: 'Ajouter un repère',
      addNote: 'Ajouter une note',
      saveNote: 'Enregistrer la note',
      updateNote: 'Mettre à jour la note',
      deleteNote: 'Supprimer la note',
      bookmarkSaved: 'Section marquée',
      bookmarkRemoved: 'Repère supprimé',
      notePlaceholder:
        'Notez un argument, une date, une question ou un lien à retrouver plus tard.',
      timelineDescription:
        'Utilisez le moteur partagé pour suivre ce dossier à travers les tournants, regroupements et thèmes historiques filtrés.',
      legacy: 'Héritage',
      consensus: 'Consensus',
      addToCollectionSuccess: "Dossier ajouté à l'étagère.",
      addToCollectionError: "Ce dossier n'a pas pu être rattaché à une étagère pour le moment.",
    },
    knowledge: {
      title: 'Profil de connaissance personnel',
      description:
        'Un portrait vivant de vos goûts historiques, de votre rythme de lecture et de vos schémas d’exploration à long terme.',
      streak: "Série d'exploration",
      favoriteEras: 'Époques favorites',
      favoriteRegions: 'Régions favorites',
      readingDepth: 'Profondeur de lecture',
      completedPaths: 'Parcours terminés',
      comparisons: 'Comparaisons',
      collections: 'Étagères',
      savedBooks: 'Dossiers sauvegardés',
      continueExploring: 'Continuer à explorer',
      quests: 'Quêtes historiques',
      badges: "Badges d'époque",
    },
    confidence: {
      'commonly-accepted': 'Largement admis',
      debated: 'Débattu',
      uncertain: 'Incertain',
      approximate: 'Approximatif',
    },
    askEra: {
      defaultPrompt: "Comment un habitant de cette époque interpréterait-il cet événement ?",
      generate: 'Générer la perspective',
      generating: 'Génération...',
      caution:
        'Le mode perspective est une simulation historiquement informée, pas un témoignage littéral.',
      presets: [
        "un habitant vivant à cette époque",
        'un érudit de cour',
        'un observateur militaire',
        'un marchand traversant la région',
      ],
    },
    card: {
      collectible: 'Dossier collectible',
      categories: {
        figure: 'Figure',
        war: 'Guerre',
        empire: 'Empire',
        civilization: 'Civilisation',
        country: 'Pays',
        event: 'Événement',
        era: 'Époque',
        dynasty: 'Dynastie',
        kingdom: 'Royaume',
        path: 'Parcours',
        comparison: 'Comparaison',
        research: 'Recherche',
      },
    },
    lenses: {
      political: 'Politique',
      military: 'Militaire',
      social: 'Social',
      economic: 'Économique',
      cultural: 'Culturel',
      religious: 'Religieux',
    },
  },
  ar: {
    pages: {
      compare: 'المقارنة',
      timeline: 'الخط الزمني',
      map: 'الخريطة',
      paths: 'المسارات',
      collections: 'المجموعات',
      socials: 'الروابط',
    },
    homePremium: {
      eyebrow: 'تجارب مميزة',
      title: 'استكشف الأرشيف المطور',
      description:
        'تتجاوز المنصة الآن البحث التقليدي إلى المقارنة والخط الزمني والخريطة والأرفف ومسارات البحث الموجهة.',
      open: 'افتح التجربة',
      cards: [
        {
          title: 'وضع المقارنة',
          description:
            'ضع ملفين تاريخيين جنبًا إلى جنب واقرأ الفروق بينهما ضمن بنية واضحة.',
        },
        {
          title: 'الخط الزمني التفاعلي',
          description:
            'تنقل بين المنعطفات التاريخية والكثافة الزمنية دون فقدان التسلسل.',
        },
        {
          title: 'الخريطة الحية للعالم',
          description:
            'استخدم طبقة أطلس منمقة لعرض مناطق النفوذ والطرق والطبقات التاريخية.',
        },
        {
          title: 'مسارات التعمق',
          description:
            'اتبع رحلات موجهة قابلة للجمع تحفظ تقدمك داخل الملف الشخصي.',
        },
      ],
    },
    footer: {
      socials: 'الروابط',
      featureCards: [
        'مسارات اكتشاف منسقة',
        'قراءة أرشيفية سينمائية',
        'أرفف ذكية قابلة للجمع',
      ],
    },
    compare: {
      eyebrow: 'وضع المقارنة',
      title: 'ضع ملفين تاريخيين في حوار واحد.',
      description:
        'ابحث عن موضوعين، ثم دع الأرشيف ينسق بينهما واقرأ التشابهات والمنعطفات والتأثيرات بعيدة المدى جنبًا إلى جنب.',
      leftQuery: 'الموضوع الأيسر',
      rightQuery: 'الموضوع الأيمن',
      prompt: 'ابحث عن شخصية أو إمبراطورية أو حرب أو حضارة أو دولة...',
      swap: 'بدّل الجانبين',
      compare: 'قارن',
      another: 'قارن موضوعًا آخر',
      loading: 'جارٍ بناء المقارنة...',
      save: 'احفظ المقارنة',
      saved: 'تم الحفظ في أرشيفك',
      saveError: 'تعذر حفظ هذه المقارنة حاليًا.',
      emptyTitle: 'ابنِ مقارنة ذكية',
      emptyDescription:
        'ابدأ بموضوعين وسيقوم ChronoLivre ببناء العلاقة بينهما عبر النشأة والقوة والصراع والإرث والتأثير اللاحق.',
      similarities: 'أوجه التشابه',
      differences: 'أهم الفروق',
      addToCollection: 'أضف المقارنة إلى رف',
      addTopicToCollection: 'أضف الموضوع إلى رف',
      structured: 'مقارنة منظمة',
      comparisonAdded: 'تمت إضافة المقارنة إلى الرف.',
      addTopicError: 'تعذر إضافة هذا الملف إلى الرف حاليًا.',
      addTopicSuccess: (title) => `تمت إضافة ${title} إلى الرف.`,
    },
    timeline: {
      eyebrow: 'الخط الزمني التفاعلي',
      title: 'تاريخ العالم عبر منعطفات متجمعة',
      description:
        'يشغّل هذا المحرك صفحات الموضوع والمقارنة ومسارات التعمق. استخدمه هنا كمساحة عامة للتحولات السياسية والثقافية والعسكرية والحضارية.',
      engineEyebrow: 'محرك الخط الزمني التفاعلي',
      zoomCentury: 'قرن',
      zoomDecade: 'عقد',
      zoomYear: 'سنة',
      all: 'الكل',
      categories: {
        all: 'الكل',
        war: 'الحروب',
        ruler: 'الحكام',
        political: 'السياسة',
        cultural: 'الثقافة',
        invention: 'الابتكارات',
        dynasty: 'السلالات',
        society: 'المجتمع',
        expansion: 'التوسع',
      },
    },
    map: {
      eyebrow: 'الخريطة الحية للعالم',
      title: 'أطلس منمق للنفوذ والحركة.',
      description:
        'تظل طبقة الخريطة هذه متزنة عمدًا: فهي تبرز المناطق والطرق التاريخية المهمة دون الادعاء بدقة حدود كاملة عندما تكون الطبقة المصدرية تأويلية.',
      activeYear: 'السنة النشطة',
      interpretiveSurface: 'سطح أطلس تأويلي',
      liveNodes: (count) => `${count} عقدة نشطة`,
      historicAnchors: (count) => `${count} مرساة تاريخية`,
      activeOverlays: (count) => `${count} طبقة نشطة`,
      noOverlay: 'لا توجد طبقة منسقة نشطة لهذه السنة. حرّك المؤشر إلى فترة أخرى.',
      activeRange: (start, end) => `نشط من ${start} إلى ${end}`,
      routes: {
        mediterranean: 'البحر المتوسط',
        sahara: 'ممرات الصحراء',
        mesopotamia: 'بلاد الرافدين',
        atlantic: 'الأطلسي',
      },
      eras: {
        bce: 'ق.م',
        ce: 'م',
      },
    },
    collections: {
      eyebrow: 'المجموعات',
      title: 'نسّق أرففًا مميزة لأرشيفك.',
      description:
        'أنشئ أرففًا مخصصة للشخصيات والحروب والإمبراطوريات والمقارنات والمسارات الموجهة. هذه الأرفف تدعم الآن الجانب القابل للجمع في ChronoLivre.',
      titleField: 'عنوان الرف',
      descriptionField: 'الوصف',
      themeField: 'سمة الغلاف',
      create: 'إنشاء رف',
      save: 'حفظ الرف',
      delete: 'حذف الرف',
      remove: 'إزالة',
      openLibrary: 'افتح المكتبة',
      emptyTitle: 'لا توجد أرفف بعد',
      emptyDescription:
        'أنشئ رفك الأول لبدء تنظيم الملفات المحفوظة والمقارنات المميزة.',
      detailEyebrow: 'تفاصيل المجموعة',
      shelfSummary: 'رف منسق داخل أرشيفك التاريخي.',
      curatedShelf: 'رف منسق',
      collectionItem: 'عنصر مجموعة',
      itemSummary: 'عنصر محفوظ من أرشيفك المميز.',
      itemCount: (count) => `${count} عناصر`,
      themeLabels: {
        'imperial-navy': 'أزرق إمبراطوري',
        'ancient-sand': 'رمال قديمة',
        'obsidian-industrial': 'سبج صناعي',
        'emerald-dynasty': 'سلالة زمردية',
        'royal-purple': 'أرجوان ملكي',
        'bronze-civilization': 'حضارة برونزية',
        'midnight-scholar': 'باحث ليلي',
        'oxblood-war': 'أحمر الحرب',
      },
    },
    paths: {
      eyebrow: 'مسارات التعمق',
      title: 'رحلات تاريخية موجهة ببنية قابلة للجمع.',
      description:
        'تحول هذه المسارات الأرشيف إلى طريق متحفي ذكي: تسلسل تعلمي وقائمة قراءة قابلة للجمع ونظام تقدم.',
      chapters: (count) => `${count} فصول`,
      minutes: (count) => `${count} دقيقة`,
      theme: 'الموضوع',
      depth: 'المستوى',
      progress: 'التقدم',
      chaptersLeft: (count) => `${count} فصول متبقية`,
      openChapter: 'افتح الفصل',
      markComplete: 'علّم الفصل كمكتمل',
      completed: 'مكتمل',
      completedTitle: 'اكتمل المسار',
      completedDescription:
        'أصبح هذا المسار يغذي الآن ملف المعرفة الشخصي وتقدم المهام ونظام الشارات التاريخية.',
      difficultyLabels: {
        Introductory: 'تمهيدي',
        Intermediate: 'متوسط',
        Advanced: 'متقدم',
      },
    },
    topic: {
      readingMode: 'وضع القراءة',
      standardMode: 'الوضع العادي',
      sourceConfidence: 'درجة الثقة',
      perspectives: 'وضع المنظور',
      perspectiveHeading: 'وضع المنظور',
      perspectiveTitle: 'عدسات تحليلية متعددة',
      debate: 'وضع النقاش',
      debateHeading: 'وضع النقاش',
      askEra: 'اسأل العصر',
      askEraTitle: 'محاكاة منظور تاريخي',
      notes: 'ملاحظات',
      bookmarks: 'علامات',
      recommendations: 'توصيات ذكية',
      recommendationsHeading: 'خطوات مقترحة تالية',
      addToCollection: 'أضف الملف إلى رف',
      addBookmark: 'علّم القسم',
      addNote: 'أضف ملاحظة',
      saveNote: 'احفظ الملاحظة',
      updateNote: 'حدّث الملاحظة',
      deleteNote: 'احذف الملاحظة',
      bookmarkSaved: 'تم وضع علامة على القسم',
      bookmarkRemoved: 'تمت إزالة العلامة',
      notePlaceholder:
        'دوّن فكرة أو تاريخًا أو سؤالًا أو رابطًا تريد العودة إليه لاحقًا.',
      timelineDescription:
        'استخدم المحرك المشترك لتتبع هذا الملف عبر المنعطفات والتجمعات والموضوعات التاريخية المفلترة.',
      legacy: 'الإرث',
      consensus: 'الرأي الغالب',
      addToCollectionSuccess: 'تمت إضافة الملف إلى الرف.',
      addToCollectionError: 'تعذر ربط هذا الملف برف في الوقت الحالي.',
    },
    knowledge: {
      title: 'ملف المعرفة الشخصي',
      description:
        'صورة حية لذوقك التاريخي وإيقاع دراستك وأنماط استكشافك طويلة المدى.',
      streak: 'سلسلة الاستكشاف',
      favoriteEras: 'العصور المفضلة',
      favoriteRegions: 'المناطق المفضلة',
      readingDepth: 'عمق القراءة',
      completedPaths: 'المسارات المكتملة',
      comparisons: 'المقارنات',
      collections: 'الأرفف',
      savedBooks: 'الملفات المحفوظة',
      continueExploring: 'واصل الاستكشاف',
      quests: 'المهام التاريخية',
      badges: 'شارات العصور',
    },
    confidence: {
      'commonly-accepted': 'مقبول على نطاق واسع',
      debated: 'موضع نقاش',
      uncertain: 'غير محسوم',
      approximate: 'تقريبي',
    },
    askEra: {
      defaultPrompt: 'كيف يمكن لمواطن من هذه الحقبة أن يفسر هذا الحدث؟',
      generate: 'أنشئ المنظور',
      generating: 'جارٍ الإنشاء...',
      caution:
        'وضع المنظور هو محاكاة مبنية على فهم تاريخي، وليس شهادة حرفية من شاهد عيان.',
      presets: [
        'مواطن يعيش في تلك الحقبة',
        'عالم من البلاط',
        'مراقب عسكري',
        'تاجر يتنقل عبر المنطقة',
      ],
    },
    card: {
      collectible: 'ملف قابل للجمع',
      categories: {
        figure: 'شخصية',
        war: 'حرب',
        empire: 'إمبراطورية',
        civilization: 'حضارة',
        country: 'دولة',
        event: 'حدث',
        era: 'حقبة',
        dynasty: 'سلالة',
        kingdom: 'مملكة',
        path: 'مسار',
        comparison: 'مقارنة',
        research: 'بحث',
      },
    },
    lenses: {
      political: 'سياسي',
      military: 'عسكري',
      social: 'اجتماعي',
      economic: 'اقتصادي',
      cultural: 'ثقافي',
      religious: 'ديني',
    },
  },
};

export type ExperienceCopy = (typeof experienceCopy)[Locale];

export function getExperienceCopy(locale: Locale): ExperienceCopy {
  return experienceCopy[locale];
}
