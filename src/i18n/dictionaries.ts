import { defaultLocale, Locale } from '@/i18n/config';

const dictionaries = {
  en: {
    common: {
      brand: 'ChronoLivre',
      aiHistoryResearch: 'AI History Research',
      archiveEdition: 'Archive Edition',
      query: 'Query',
      search: 'Search',
      saved: 'Saved',
      openDossier: 'Open dossier',
      fullDossier: 'Full dossier',
      savedToLibrary: 'Saved to your library',
      closeOverlays: 'Close overlays',
      language: 'Language',
    },
    nav: {
      home: 'Home',
      search: 'Search',
      library: 'Library',
      startResearch: 'Start Research',
      directSearch: 'Direct Search',
      searchArchive: 'Search the archive',
      searchArchiveDescription:
        'Jump straight to a figure, civilization, event, or war and open a structured historical dossier.',
      searchPlaceholder:
        'Search a civilization, leader, conflict, or timeline...',
      prompts: ['Ottoman Empire', 'Renaissance Florence', 'World War I'],
    },
    footer: {
      description:
        'A calmer way to research history with AI. Explore a topic, understand the timeline, and keep your dossiers organized in one personal archive.',
      navigate: 'Navigate',
      experience: 'Experience',
      experienceItems: [
        'Curated discovery flows',
        'Structured AI summaries',
        'Persistent research library',
      ],
      copyright: 'Copyright {year} ChronoLivre. All rights reserved.',
      tagline:
        'Designed for clarity, continuity, and focused historical research.',
    },
    home: {
      heroEyebrow: 'Professional AI History Research',
      heroTitle: 'Explore world history with more structure, less noise.',
      heroDescription:
        'Search people, empires, wars, and turning points. ChronoLivre turns each question into a clean historical dossier with timelines, context, and related paths to keep exploring.',
      heroSearchPlaceholder:
        'Try: Roman Empire, Cleopatra, Silk Road, World War I...',
      heroSuggestions: [
        'Library of Alexandria',
        'History of Algeria',
        'Kingdom of Morocco',
        "Pompeii's Last Day",
      ],
      whatYouGet: 'What You Get',
      whatYouGetItems: [
        'A concise overview to orient you quickly',
        'A timeline of major shifts and turning points',
        'Connected people, events, and follow-up topics',
      ],
      stats: [
        { value: '5000+', label: 'Years to explore' },
        { value: '4', label: 'Core research views' },
        { value: '1', label: 'Saved library per user' },
      ],
      categoriesEyebrow: 'Explore By Category',
      categoriesTitle: 'Start with a clear lens',
      categoriesDescription:
        'Choose a research direction and jump straight into a focused search flow.',
      categories: [
        {
          label: 'Historical Figures',
          description:
            'Search for Alexander the Great and open a curated dossier with context and related material.',
          query: 'Alexander the Great',
        },
        {
          label: 'Wars and Conflicts',
          description:
            'Search for Hundred Years War and open a curated dossier with context and related material.',
          query: 'Hundred Years War',
        },
        {
          label: 'Civilizations',
          description:
            'Search for Ancient Egypt and open a curated dossier with context and related material.',
          query: 'Ancient Egypt',
        },
        {
          label: 'Empires and Kingdoms',
          description:
            'Search for Ottoman Empire and open a curated dossier with context and related material.',
          query: 'Ottoman Empire',
        },
      ],
      whyEyebrow: 'Why It Feels Better',
      whyTitle: 'Designed like a research desk, not a noisy feed.',
      whyDescription:
        'The experience is built around orientation first. You always know what you are looking at, what matters most, and what to explore next.',
      features: [
        {
          title: 'Clear narrative structure',
          description:
            'Every dossier is organized into summary, key figures, related events, and a readable timeline.',
        },
        {
          title: 'Fast natural-language search',
          description:
            'Ask in plain English and move quickly from a question to a focused historical overview.',
        },
        {
          title: 'Persistent research library',
          description:
            'Keep the topics you explore and return to them later in a clean personal archive.',
        },
      ],
      collectionsEyebrow: 'Featured Collections',
      collectionsTitle: 'Start with enduring civilizations',
      collectionsAction: 'View more starting points',
      featuredCivilizations: [
        {
          name: 'The Kingdom of Kemet',
          description:
            'An odyssey through the architecture of the afterlife and the divine pharaohs.',
        },
        {
          name: 'Edo Transcendence',
          description:
            'The era of the Shogunate, the floating world, and the birth of modern Kyoto.',
        },
        {
          name: 'Celestial Architects',
          description:
            'Decoding the astronomy and deep-jungle engineering of the Mayan kings.',
        },
      ],
      ctaEyebrow: 'Ready To Begin',
      ctaTitle: 'Ask a question and let the archive organize the past for you.',
      ctaDescription:
        'Move from curiosity to comprehension with an interface built to keep research readable and decisions obvious.',
      ctaSuggestions: [
        'Roman Empire',
        'Napoleon Bonaparte',
        'Library of Alexandria',
      ],
    },
    searchPage: {
      eyebrow: 'Search Workspace',
      title: 'Research any historical topic with a cleaner workflow.',
      description:
        'Search once and get a structured dossier with summary, quick facts, timeline, and connected topics.',
      searchPlaceholder:
        'Search a civilization, leader, conflict, or turning point...',
      scopes: ['Figures', 'Civilizations', 'Conflicts', 'Timelines'],
      suggestedPrompts: 'Suggested Prompts',
      promptExamples: [
        'Explain how the Ottoman Empire bridged three continents',
        'Summarize the political context of World War I',
        'Trace the turning points of Ancient Egypt',
        'Who shaped the Renaissance in Florence?',
      ],
      loading: 'Searching...',
      error:
        'The archive could not complete this dossier. Please try again.',
      tryAgain: 'Try again',
      timelineEyebrow: 'Timeline',
      timelineTitle: 'Key turning points',
      relatedEyebrow: 'Continue Exploring',
      relatedTitle: 'Related topics',
      quickFacts: 'Quick facts',
      period: 'Period',
      region: 'Region',
      category: 'Category',
      keyFigures: 'Key figures',
      relatedEvents: 'Related events',
      openFullDossier: 'Open full dossier',
      emptyTitle: 'Begin your research',
      emptyDescription:
        'Enter a topic above and ChronoLivre will assemble a readable dossier you can return to later in your library.',
      emptySuggestions: [
        'Napoleon Bonaparte',
        'Ottoman Empire',
        'Ancient Egypt',
        'Roman Empire',
      ],
      loadingMessage: 'Loading search...',
    },
    libraryPage: {
      eyebrow: 'Personal Archive',
      title: 'Your saved history research, organized in one place.',
      description:
        'Every topic you open can live here as a reusable dossier, so you can return to ideas, compare periods, and continue researching without starting over.',
      dossiers: 'Dossiers',
      categories: 'Categories',
      latest: 'Latest',
      noSavedDossierYet: 'No saved dossier yet',
      overviewEyebrow: 'Library Overview',
      overviewTitle: 'Continue where you left off',
      researchNewTopic: 'Research a new topic',
      emptyTitle: 'Your archive is empty',
      emptyDescription:
        'Search any historical topic and ChronoLivre will save the resulting dossier here for future reference.',
      emptySuggestions: [
        'Napoleon Bonaparte',
        'Ancient Egypt',
        'Byzantine Empire',
      ],
      startResearching: 'Start researching',
      openingArchive: 'Opening your archive...',
      latestAddition: 'Latest addition',
      openLatestDossier: 'Open latest dossier',
    },
    topicPage: {
      notFoundTitle: 'Dossier not found',
      notFoundDescription:
        'This topic has not been preserved yet. Search for it and ChronoLivre will prepare a new historical record.',
      searchThisTopic: 'Search this topic',
      back: 'Back',
      overview: 'Topic overview',
      period: 'Period',
      region: 'Region',
      category: 'Category',
      fullDossierEyebrow: 'Full dossier',
      fullDossierTitle: 'Complete chronicle',
      researchActions: 'Research actions',
      searchRelatedMaterial: 'Search related material',
      openYourLibrary: 'Open your library',
      relatedTopics: 'Related topics',
      keyFiguresEyebrow: 'Key figures',
      keyFiguresTitle: 'People who shaped this topic',
      timelineEyebrow: 'Timeline',
      timelineTitle: 'Major milestones',
      continueEyebrow: 'Continue exploring',
      continueTitle: 'More paths from this dossier',
      ctaTitle: 'Keep exploring from here',
      ctaDescription:
        'Use this topic as a starting point and branch into the people, events, and neighboring eras around it.',
      ctaButton: 'Explore another topic',
    },
  },
  fr: {
    common: {
      brand: 'ChronoLivre',
      aiHistoryResearch: "Recherche historique par IA",
      archiveEdition: "Édition d'archive",
      query: 'Requête',
      search: 'Rechercher',
      saved: 'Enregistré',
      openDossier: 'Ouvrir le dossier',
      fullDossier: 'Dossier complet',
      savedToLibrary: 'Enregistré dans votre bibliothèque',
      closeOverlays: 'Fermer les panneaux',
      language: 'Langue',
    },
    nav: {
      home: 'Accueil',
      search: 'Recherche',
      library: 'Bibliothèque',
      startResearch: 'Commencer',
      directSearch: 'Recherche directe',
      searchArchive: "Rechercher dans l'archive",
      searchArchiveDescription:
        "Accédez directement à une figure, une civilisation, un événement ou une guerre et ouvrez un dossier historique structuré.",
      searchPlaceholder:
        'Rechercher une civilisation, un dirigeant, un conflit ou une chronologie...',
      prompts: ['Empire ottoman', 'Florence de la Renaissance', 'Première Guerre mondiale'],
    },
    footer: {
      description:
        "Une manière plus calme de faire de la recherche historique avec l'IA. Explorez un sujet, comprenez la chronologie et gardez vos dossiers bien organisés dans une archive personnelle.",
      navigate: 'Navigation',
      experience: 'Expérience',
      experienceItems: [
        'Parcours de découverte guidés',
        'Synthèses IA structurées',
        'Bibliothèque de recherche persistante',
      ],
      copyright: 'Copyright {year} ChronoLivre. Tous droits réservés.',
      tagline:
        'Conçu pour la clarté, la continuité et une recherche historique plus précise.',
    },
    home: {
      heroEyebrow: 'Recherche historique professionnelle par IA',
      heroTitle:
        "Explorez l'histoire du monde avec plus de structure et moins de bruit.",
      heroDescription:
        "Recherchez des personnages, des empires, des guerres et des tournants historiques. ChronoLivre transforme chaque question en dossier clair avec chronologie, contexte et pistes de découverte.",
      heroSearchPlaceholder:
        'Ex. : Empire romain, Cléopâtre, Route de la soie, Première Guerre mondiale...',
      heroSuggestions: [
        "Bibliothèque d'Alexandrie",
        "Histoire de l'Algérie",
        'Royaume du Maroc',
        'Le dernier jour de Pompéi',
      ],
      whatYouGet: 'Ce que vous obtenez',
      whatYouGetItems: [
        'Une vue d’ensemble concise pour vous orienter rapidement',
        'Une chronologie des grands tournants historiques',
        'Des personnages, événements et pistes liées pour aller plus loin',
      ],
      stats: [
        { value: '5000+', label: 'Années à explorer' },
        { value: '4', label: 'Vues de recherche principales' },
        { value: '1', label: 'Bibliothèque enregistrée par utilisateur' },
      ],
      categoriesEyebrow: 'Explorer par catégorie',
      categoriesTitle: 'Commencez avec un angle clair',
      categoriesDescription:
        'Choisissez une direction de recherche et entrez directement dans un flux plus ciblé.',
      categories: [
        {
          label: 'Figures historiques',
          description:
            'Recherchez Alexandre le Grand et ouvrez un dossier structuré avec contexte et contenus liés.',
          query: 'Alexander the Great',
        },
        {
          label: 'Guerres et conflits',
          description:
            'Recherchez la guerre de Cent Ans et ouvrez un dossier structuré avec contexte et contenus liés.',
          query: 'Hundred Years War',
        },
        {
          label: 'Civilisations',
          description:
            "Recherchez l'Égypte antique et ouvrez un dossier structuré avec contexte et contenus liés.",
          query: 'Ancient Egypt',
        },
        {
          label: 'Empires et royaumes',
          description:
            "Recherchez l'Empire ottoman et ouvrez un dossier structuré avec contexte et contenus liés.",
          query: 'Ottoman Empire',
        },
      ],
      whyEyebrow: "Pourquoi c'est meilleur",
      whyTitle:
        'Pensé comme un bureau de recherche, pas comme un flux encombré.',
      whyDescription:
        "L'expérience donne la priorité à l'orientation. Vous savez toujours ce que vous regardez, ce qui est important et quoi explorer ensuite.",
      features: [
        {
          title: 'Structure narrative claire',
          description:
            'Chaque dossier est organisé en résumé, personnages clés, événements liés et chronologie lisible.',
        },
        {
          title: 'Recherche en langage naturel',
          description:
            'Posez votre question simplement et obtenez rapidement une vue historique ciblée.',
        },
        {
          title: 'Bibliothèque persistante',
          description:
            'Conservez vos sujets explorés et revenez-y plus tard dans une archive personnelle propre.',
        },
      ],
      collectionsEyebrow: 'Collections mises en avant',
      collectionsTitle: 'Commencez par des civilisations majeures',
      collectionsAction: 'Voir plus de points de départ',
      featuredCivilizations: [
        {
          name: 'Le royaume de Kemet',
          description:
            "Une odyssée à travers l'architecture de l'au-delà et les pharaons divins.",
        },
        {
          name: "La transcendance d'Edo",
          description:
            "L'époque du shogunat, du monde flottant et de la naissance du Kyoto moderne.",
        },
        {
          name: 'Architectes célestes',
          description:
            "Décoder l'astronomie et l'ingénierie de la jungle profonde chez les rois mayas.",
        },
      ],
      ctaEyebrow: 'Prêt à commencer',
      ctaTitle:
        "Posez une question et laissez l'archive organiser le passé pour vous.",
      ctaDescription:
        'Passez de la curiosité à la compréhension grâce à une interface conçue pour garder la recherche lisible et claire.',
      ctaSuggestions: [
        'Empire romain',
        'Napoléon Bonaparte',
        "Bibliothèque d'Alexandrie",
      ],
    },
    searchPage: {
      eyebrow: 'Espace de recherche',
      title: 'Recherchez n’importe quel sujet historique avec un flux plus clair.',
      description:
        'Une seule recherche suffit pour obtenir un dossier structuré avec résumé, faits rapides, chronologie et sujets liés.',
      searchPlaceholder:
        'Rechercher une civilisation, un dirigeant, un conflit ou un tournant historique...',
      scopes: ['Figures', 'Civilisations', 'Conflits', 'Chronologies'],
      suggestedPrompts: 'Suggestions de requêtes',
      promptExamples: [
        "Expliquez comment l'Empire ottoman a relié trois continents",
        'Résumez le contexte politique de la Première Guerre mondiale',
        "Retracez les tournants de l'Égypte antique",
        'Qui a façonné la Renaissance à Florence ?',
      ],
      loading: 'Recherche en cours...',
      error:
        "L'archive n'a pas pu compléter ce dossier. Veuillez réessayer.",
      tryAgain: 'Réessayer',
      timelineEyebrow: 'Chronologie',
      timelineTitle: 'Tournants majeurs',
      relatedEyebrow: 'Continuer à explorer',
      relatedTitle: 'Sujets liés',
      quickFacts: 'Repères rapides',
      period: 'Période',
      region: 'Région',
      category: 'Catégorie',
      keyFigures: 'Personnages clés',
      relatedEvents: 'Événements liés',
      openFullDossier: 'Ouvrir le dossier complet',
      emptyTitle: 'Commencez votre recherche',
      emptyDescription:
        'Saisissez un sujet ci-dessus et ChronoLivre préparera un dossier lisible que vous pourrez retrouver plus tard dans votre bibliothèque.',
      emptySuggestions: [
        'Napoléon Bonaparte',
        'Empire ottoman',
        'Égypte antique',
        'Empire romain',
      ],
      loadingMessage: 'Chargement de la recherche...',
    },
    libraryPage: {
      eyebrow: 'Archive personnelle',
      title: 'Vos recherches historiques enregistrées, bien organisées.',
      description:
        'Chaque sujet consulté peut être conservé ici comme dossier réutilisable afin de revenir sur des idées, comparer des périodes et poursuivre vos recherches sans repartir de zéro.',
      dossiers: 'Dossiers',
      categories: 'Catégories',
      latest: 'Dernier',
      noSavedDossierYet: 'Aucun dossier enregistré',
      overviewEyebrow: 'Vue de la bibliothèque',
      overviewTitle: 'Reprenez là où vous vous êtes arrêté',
      researchNewTopic: 'Rechercher un nouveau sujet',
      emptyTitle: 'Votre archive est vide',
      emptyDescription:
        'Recherchez un sujet historique et ChronoLivre enregistrera ici le dossier correspondant pour consultation future.',
      emptySuggestions: [
        'Napoléon Bonaparte',
        'Égypte antique',
        'Empire byzantin',
      ],
      startResearching: 'Commencer la recherche',
      openingArchive: "Ouverture de votre archive...",
      latestAddition: 'Dernier ajout',
      openLatestDossier: 'Ouvrir le dernier dossier',
    },
    topicPage: {
      notFoundTitle: 'Dossier introuvable',
      notFoundDescription:
        "Ce sujet n'a pas encore été archivé. Recherchez-le et ChronoLivre préparera un nouveau dossier historique.",
      searchThisTopic: 'Rechercher ce sujet',
      back: 'Retour',
      overview: 'Vue du sujet',
      period: 'Période',
      region: 'Région',
      category: 'Catégorie',
      fullDossierEyebrow: 'Dossier complet',
      fullDossierTitle: 'Chronique complète',
      researchActions: 'Actions de recherche',
      searchRelatedMaterial: 'Rechercher du contenu lié',
      openYourLibrary: 'Ouvrir votre bibliothèque',
      relatedTopics: 'Sujets liés',
      keyFiguresEyebrow: 'Personnages clés',
      keyFiguresTitle: 'Les personnes qui ont façonné ce sujet',
      timelineEyebrow: 'Chronologie',
      timelineTitle: 'Jalons majeurs',
      continueEyebrow: 'Continuer à explorer',
      continueTitle: 'Autres pistes depuis ce dossier',
      ctaTitle: 'Continuez à explorer à partir d’ici',
      ctaDescription:
        'Utilisez ce sujet comme point de départ et développez vers les personnes, événements et périodes voisines.',
      ctaButton: 'Explorer un autre sujet',
    },
  },
  ar: {
    common: {
      brand: 'ChronoLivre',
      aiHistoryResearch: 'بحث تاريخي بالذكاء الاصطناعي',
      archiveEdition: 'نسخة أرشيفية',
      query: 'الاستعلام',
      search: 'بحث',
      saved: 'محفوظ',
      openDossier: 'فتح الملف',
      fullDossier: 'الملف الكامل',
      savedToLibrary: 'تم الحفظ في مكتبتك',
      closeOverlays: 'إغلاق اللوحات',
      language: 'اللغة',
    },
    nav: {
      home: 'الرئيسية',
      search: 'البحث',
      library: 'المكتبة',
      startResearch: 'ابدأ البحث',
      directSearch: 'بحث مباشر',
      searchArchive: 'ابحث في الأرشيف',
      searchArchiveDescription:
        'انتقل مباشرة إلى شخصية أو حضارة أو حدث أو حرب وافتح ملفًا تاريخيًا منظمًا.',
      searchPlaceholder: 'ابحث عن حضارة أو قائد أو صراع أو خط زمني...',
      prompts: ['الدولة العثمانية', 'فلورنسا عصر النهضة', 'الحرب العالمية الأولى'],
    },
    footer: {
      description:
        'طريقة أكثر هدوءًا لإجراء البحث التاريخي باستخدام الذكاء الاصطناعي. استكشف موضوعًا وافهم التسلسل الزمني واحتفظ بملفاتك منظمة داخل أرشيفك الشخصي.',
      navigate: 'التنقل',
      experience: 'التجربة',
      experienceItems: [
        'مسارات اكتشاف منسقة',
        'ملخصات منظمة بالذكاء الاصطناعي',
        'مكتبة بحث دائمة',
      ],
      copyright: 'حقوق النشر {year} ChronoLivre. جميع الحقوق محفوظة.',
      tagline: 'مصمم للوضوح والاستمرارية وبحث تاريخي أكثر تركيزًا.',
    },
    home: {
      heroEyebrow: 'بحث تاريخي احترافي بالذكاء الاصطناعي',
      heroTitle: 'استكشف تاريخ العالم بتنظيم أوضح وضوضاء أقل.',
      heroDescription:
        'ابحث عن الشخصيات والإمبراطوريات والحروب والمنعطفات التاريخية. يحول ChronoLivre كل سؤال إلى ملف واضح يضم تسلسلًا زمنيًا وسياقًا ومسارات متابعة.',
      heroSearchPlaceholder:
        'مثال: الإمبراطورية الرومانية، كليوباترا، طريق الحرير، الحرب العالمية الأولى...',
      heroSuggestions: [
        'مكتبة الإسكندرية',
        'تاريخ الجزائر',
        'مملكة المغرب',
        'اليوم الأخير في بومبي',
      ],
      whatYouGet: 'ما الذي ستحصل عليه',
      whatYouGetItems: [
        'نظرة عامة مختصرة تساعدك على الفهم بسرعة',
        'خط زمني لأهم التحولات والمنعطفات',
        'شخصيات وأحداث وموضوعات مرتبطة لمواصلة الاستكشاف',
      ],
      stats: [
        { value: '5000+', label: 'سنة قابلة للاستكشاف' },
        { value: '4', label: 'واجهات بحث أساسية' },
        { value: '1', label: 'مكتبة محفوظة لكل مستخدم' },
      ],
      categoriesEyebrow: 'استكشف حسب الفئة',
      categoriesTitle: 'ابدأ بعدسة بحث واضحة',
      categoriesDescription:
        'اختر اتجاهًا بحثيًا وادخل مباشرة في مسار أكثر تركيزًا.',
      categories: [
        {
          label: 'الشخصيات التاريخية',
          description:
            'ابحث عن الإسكندر الأكبر وافتح ملفًا منظمًا مع السياق والمواد المرتبطة.',
          query: 'Alexander the Great',
        },
        {
          label: 'الحروب والصراعات',
          description:
            'ابحث عن حرب المئة عام وافتح ملفًا منظمًا مع السياق والمواد المرتبطة.',
          query: 'Hundred Years War',
        },
        {
          label: 'الحضارات',
          description:
            'ابحث عن مصر القديمة وافتح ملفًا منظمًا مع السياق والمواد المرتبطة.',
          query: 'Ancient Egypt',
        },
        {
          label: 'الإمبراطوريات والممالك',
          description:
            'ابحث عن الدولة العثمانية وافتح ملفًا منظمًا مع السياق والمواد المرتبطة.',
          query: 'Ottoman Empire',
        },
      ],
      whyEyebrow: 'لماذا تبدو التجربة أفضل',
      whyTitle: 'مصمم مثل مكتب بحث، لا مثل موجز مزدحم.',
      whyDescription:
        'التجربة مبنية على الوضوح أولًا. تعرف دائمًا ما الذي تنظر إليه، وما الأهم، وما الذي يجب استكشافه بعد ذلك.',
      features: [
        {
          title: 'بنية سردية واضحة',
          description:
            'كل ملف منظم إلى ملخص وشخصيات أساسية وأحداث مرتبطة وخط زمني سهل القراءة.',
        },
        {
          title: 'بحث سريع باللغة الطبيعية',
          description:
            'اطرح سؤالك بلغتك الطبيعية وانتقل بسرعة إلى نظرة تاريخية مركزة.',
        },
        {
          title: 'مكتبة بحث دائمة',
          description:
            'احتفظ بالموضوعات التي تستكشفها وارجع إليها لاحقًا داخل أرشيف شخصي منظم.',
        },
      ],
      collectionsEyebrow: 'مجموعات مميزة',
      collectionsTitle: 'ابدأ بحضارات راسخة',
      collectionsAction: 'عرض المزيد من نقاط البداية',
      featuredCivilizations: [
        {
          name: 'مملكة كيميت',
          description:
            'رحلة عبر عمارة العالم الآخر والفراعنة ذوي الصفة الإلهية.',
        },
        {
          name: 'سمو إيدو',
          description:
            'عصر الشوغونية والعالم العائم وبداية كيوتو الحديثة.',
        },
        {
          name: 'معماريون سماويون',
          description:
            'فك أسرار علم الفلك والهندسة العميقة لدى ملوك المايا.',
        },
      ],
      ctaEyebrow: 'جاهز للبدء',
      ctaTitle: 'اطرح سؤالًا ودع الأرشيف ينظم الماضي من أجلك.',
      ctaDescription:
        'انتقل من الفضول إلى الفهم عبر واجهة صممت لتبقي البحث واضحًا والقرارات سهلة.',
      ctaSuggestions: [
        'الإمبراطورية الرومانية',
        'نابليون بونابرت',
        'مكتبة الإسكندرية',
      ],
    },
    searchPage: {
      eyebrow: 'مساحة البحث',
      title: 'ابحث في أي موضوع تاريخي عبر تجربة أوضح.',
      description:
        'عملية بحث واحدة تمنحك ملفًا منظمًا يضم ملخصًا وحقائق سريعة وخطًا زمنيًا وموضوعات مرتبطة.',
      searchPlaceholder:
        'ابحث عن حضارة أو قائد أو صراع أو منعطف تاريخي...',
      scopes: ['شخصيات', 'حضارات', 'صراعات', 'خطوط زمنية'],
      suggestedPrompts: 'اقتراحات جاهزة',
      promptExamples: [
        'اشرح كيف ربطت الدولة العثمانية بين ثلاث قارات',
        'لخص السياق السياسي للحرب العالمية الأولى',
        'تتبع المنعطفات الأساسية في مصر القديمة',
        'من الذي شكّل عصر النهضة في فلورنسا؟',
      ],
      loading: 'جارٍ البحث...',
      error: 'لم يتمكن الأرشيف من إكمال هذا الملف. حاول مرة أخرى.',
      tryAgain: 'أعد المحاولة',
      timelineEyebrow: 'الخط الزمني',
      timelineTitle: 'أهم المنعطفات',
      relatedEyebrow: 'واصل الاستكشاف',
      relatedTitle: 'موضوعات مرتبطة',
      quickFacts: 'حقائق سريعة',
      period: 'الفترة',
      region: 'المنطقة',
      category: 'الفئة',
      keyFigures: 'الشخصيات الأساسية',
      relatedEvents: 'أحداث مرتبطة',
      openFullDossier: 'افتح الملف الكامل',
      emptyTitle: 'ابدأ بحثك',
      emptyDescription:
        'أدخل موضوعًا في الأعلى وسيقوم ChronoLivre بإعداد ملف واضح يمكنك العودة إليه لاحقًا في مكتبتك.',
      emptySuggestions: [
        'نابليون بونابرت',
        'الدولة العثمانية',
        'مصر القديمة',
        'الإمبراطورية الرومانية',
      ],
      loadingMessage: 'جارٍ تحميل البحث...',
    },
    libraryPage: {
      eyebrow: 'الأرشيف الشخصي',
      title: 'أبحاثك التاريخية المحفوظة، منظمة في مكان واحد.',
      description:
        'يمكن حفظ كل موضوع تفتحه هنا كملف قابل لإعادة الاستخدام حتى تعود إلى الأفكار وتقارن بين الفترات وتواصل البحث دون البدء من الصفر.',
      dossiers: 'الملفات',
      categories: 'الفئات',
      latest: 'الأحدث',
      noSavedDossierYet: 'لا يوجد ملف محفوظ بعد',
      overviewEyebrow: 'نظرة عامة على المكتبة',
      overviewTitle: 'تابع من حيث توقفت',
      researchNewTopic: 'ابحث عن موضوع جديد',
      emptyTitle: 'أرشيفك فارغ',
      emptyDescription:
        'ابحث عن أي موضوع تاريخي وسيقوم ChronoLivre بحفظ الملف الناتج هنا للرجوع إليه لاحقًا.',
      emptySuggestions: [
        'نابليون بونابرت',
        'مصر القديمة',
        'الإمبراطورية البيزنطية',
      ],
      startResearching: 'ابدأ البحث',
      openingArchive: 'جارٍ فتح أرشيفك...',
      latestAddition: 'أحدث إضافة',
      openLatestDossier: 'افتح أحدث ملف',
    },
    topicPage: {
      notFoundTitle: 'الملف غير موجود',
      notFoundDescription:
        'هذا الموضوع لم يُحفَظ بعد. ابحث عنه وسيقوم ChronoLivre بإعداد سجل تاريخي جديد.',
      searchThisTopic: 'ابحث عن هذا الموضوع',
      back: 'رجوع',
      overview: 'نظرة عامة على الموضوع',
      period: 'الفترة',
      region: 'المنطقة',
      category: 'الفئة',
      fullDossierEyebrow: 'الملف الكامل',
      fullDossierTitle: 'السرد الكامل',
      researchActions: 'إجراءات البحث',
      searchRelatedMaterial: 'ابحث عن مواد مرتبطة',
      openYourLibrary: 'افتح مكتبتك',
      relatedTopics: 'موضوعات مرتبطة',
      keyFiguresEyebrow: 'شخصيات أساسية',
      keyFiguresTitle: 'الأشخاص الذين شكّلوا هذا الموضوع',
      timelineEyebrow: 'الخط الزمني',
      timelineTitle: 'المحطات الرئيسية',
      continueEyebrow: 'واصل الاستكشاف',
      continueTitle: 'مسارات أخرى انطلاقًا من هذا الملف',
      ctaTitle: 'واصل الاستكشاف من هنا',
      ctaDescription:
        'استخدم هذا الموضوع كنقطة بداية وتفرع إلى الأشخاص والأحداث والفترات المجاورة له.',
      ctaButton: 'استكشف موضوعًا آخر',
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[typeof defaultLocale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
