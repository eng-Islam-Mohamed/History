import { Locale } from '@/i18n/config';
import { HistoricalMapCategory } from '@/types/experience';

type MapCopy = {
  eyebrow: string;
  title: string;
  description: string;
  activeYear: string;
  yearHint: string;
  searchPlaceholder: string;
  clearSearch: string;
  noOverlay: string;
  interpretiveSurface: string;
  presetsLabel: string;
  filtersLabel: string;
  activeOverlays: string;
  detailsPanel: string;
  legendTitle: string;
  researchCta: string;
  significance: string;
  presentDay: string;
  relatedQueries: string;
  quickFacts: string;
  categoryAll: string;
  presetLabels: Record<string, string>;
  liveNodes: (count: number) => string;
  historicAnchors: (count: number) => string;
  activeRange: (start: string, end: string) => string;
  matchingResults: (count: number) => string;
  eraJump: (label: string) => string;
  categories: Record<'all' | HistoricalMapCategory, string>;
  eras: {
    bce: string;
    ce: string;
  };
  routes: {
    mediterranean: string;
    sahara: string;
    mesopotamia: string;
    atlantic: string;
    indian: string;
  };
};

const mapCopy: Record<Locale, MapCopy> = {
  en: {
    eyebrow: 'Living World Map',
    title: 'A richer atlas of power, exchange, and historical movement.',
    description:
      'Use the historical slider, jump between curated eras, filter overlays, and open dossiers from a premium atlas surface built for connected world history.',
    activeYear: 'Active year',
    yearHint: 'Move through time to reveal which empires, routes, and conflict zones are active.',
    searchPlaceholder: 'Filter overlays by empire, region, route, or conflict...',
    clearSearch: 'Clear search',
    noOverlay: 'No curated overlay matches this year and filter set. Move the slider or change the active filter.',
    interpretiveSurface: 'Interpretive atlas surface',
    presetsLabel: 'Curated eras',
    filtersLabel: 'Overlay filters',
    activeOverlays: 'Active overlays',
    detailsPanel: 'Selected overlay',
    legendTitle: 'Atlas legend',
    researchCta: 'Open dossier',
    significance: 'Why it matters',
    presentDay: 'Present-day links',
    relatedQueries: 'Continue with',
    quickFacts: 'Quick facts',
    categoryAll: 'All overlays',
    presetLabels: {
      'bronze-age': 'Late Bronze Age',
      'classical-mediterranean': 'Classical Mediterranean',
      'late-antiquity': 'Late Antiquity',
      'islamic-cosmopolis': 'Islamic Cosmopolis',
      'mongol-moment': 'Mongol Moment',
      'gunpowder-empires': 'Gunpowder Empires',
      'industrial-empires': 'Industrial Empires',
      'world-war-age': 'World War Age',
    },
    liveNodes: (count) => `${count} active overlays`,
    historicAnchors: (count) => `${count} archived anchors`,
    activeRange: (start, end) => `Active from ${start} to ${end}`,
    matchingResults: (count) => `${count} overlays match the current year and filters`,
    eraJump: (label) => `Jump to ${label}`,
    categories: {
      all: 'All',
      figure: 'Figures',
      war: 'Wars',
      kingdom: 'Kingdoms',
      country: 'Countries',
      civilization: 'Civilizations',
      event: 'Events',
      empire: 'Empires',
      dynasty: 'Dynasties',
      era: 'Eras',
      route: 'Routes',
      conflict: 'Conflicts',
    },
    eras: {
      bce: 'BCE',
      ce: 'CE',
    },
    routes: {
      mediterranean: 'Mediterranean',
      sahara: 'Sahara corridors',
      mesopotamia: 'Mesopotamia',
      atlantic: 'Atlantic world',
      indian: 'Indian Ocean',
    },
  },
  fr: {
    eyebrow: 'Carte vivante du monde',
    title: 'Un atlas plus riche des pouvoirs, des échanges et des circulations historiques.',
    description:
      'Utilisez le curseur chronologique, sautez entre des périodes guidées, filtrez les couches et ouvrez des dossiers depuis une surface cartographique pensée pour une histoire mondiale connectée.',
    activeYear: 'Année active',
    yearHint: 'Faites défiler le temps pour révéler les empires, routes et zones de conflit actifs.',
    searchPlaceholder: 'Filtrer les couches par empire, région, route ou conflit...',
    clearSearch: 'Effacer la recherche',
    noOverlay: "Aucune couche organisée ne correspond à cette année et à ces filtres. Déplacez le curseur ou changez le filtre actif.",
    interpretiveSurface: 'Surface atlas interprétative',
    presetsLabel: 'Périodes guidées',
    filtersLabel: 'Filtres de couches',
    activeOverlays: 'Couches actives',
    detailsPanel: 'Couche sélectionnée',
    legendTitle: "Légende de l'atlas",
    researchCta: 'Ouvrir le dossier',
    significance: 'Pourquoi cela compte',
    presentDay: 'Liens actuels',
    relatedQueries: 'Poursuivre avec',
    quickFacts: 'Repères rapides',
    categoryAll: 'Toutes les couches',
    presetLabels: {
      'bronze-age': 'Fin de l’âge du bronze',
      'classical-mediterranean': 'Méditerranée classique',
      'late-antiquity': 'Antiquité tardive',
      'islamic-cosmopolis': 'Cosmopolis islamique',
      'mongol-moment': 'Moment mongol',
      'gunpowder-empires': 'Empires à poudre',
      'industrial-empires': 'Empires industriels',
      'world-war-age': 'Âge des guerres mondiales',
    },
    liveNodes: (count) => `${count} couches actives`,
    historicAnchors: (count) => `${count} repères archivés`,
    activeRange: (start, end) => `Actif de ${start} à ${end}`,
    matchingResults: (count) => `${count} couches correspondent à l'année et aux filtres`,
    eraJump: (label) => `Aller à ${label}`,
    categories: {
      all: 'Tout',
      figure: 'Figures',
      war: 'Guerres',
      kingdom: 'Royaumes',
      country: 'Pays',
      civilization: 'Civilisations',
      event: 'Événements',
      empire: 'Empires',
      dynasty: 'Dynasties',
      era: 'Époques',
      route: 'Routes',
      conflict: 'Conflits',
    },
    eras: {
      bce: 'av. J.-C.',
      ce: 'apr. J.-C.',
    },
    routes: {
      mediterranean: 'Méditerranée',
      sahara: 'Corridors sahariens',
      mesopotamia: 'Mésopotamie',
      atlantic: 'Monde atlantique',
      indian: 'Océan Indien',
    },
  },
  ar: {
    eyebrow: 'الخريطة الحية للعالم',
    title: 'أطلس أغنى للنفوذ والتبادل والحركة التاريخية.',
    description:
      'استخدم المنزلق الزمني، وانتقل بين حقب منسقة، وفلتر الطبقات، وافتح الملفات البحثية من سطح أطلس مصمم لقراءة التاريخ العالمي المترابط.',
    activeYear: 'السنة النشطة',
    yearHint: 'حرّك الزمن لتظهر الإمبراطوريات والطرق ومناطق الصراع النشطة في تلك الفترة.',
    searchPlaceholder: 'فلتر الطبقات حسب الإمبراطورية أو المنطقة أو الطريق أو الصراع...',
    clearSearch: 'امسح البحث',
    noOverlay: 'لا توجد طبقة منسقة تطابق هذه السنة والفلاتر الحالية. حرّك المؤشر أو غيّر الفلتر النشط.',
    interpretiveSurface: 'سطح أطلس تأويلي',
    presetsLabel: 'حقب منسقة',
    filtersLabel: 'فلاتر الطبقات',
    activeOverlays: 'الطبقات النشطة',
    detailsPanel: 'الطبقة المحددة',
    legendTitle: 'مفتاح الأطلس',
    researchCta: 'افتح الملف',
    significance: 'لماذا يهم',
    presentDay: 'امتدادات معاصرة',
    relatedQueries: 'واصل مع',
    quickFacts: 'حقائق سريعة',
    categoryAll: 'كل الطبقات',
    presetLabels: {
      'bronze-age': 'أواخر العصر البرونزي',
      'classical-mediterranean': 'المتوسط الكلاسيكي',
      'late-antiquity': 'العصور القديمة المتأخرة',
      'islamic-cosmopolis': 'العالم الإسلامي الكوزموبوليتي',
      'mongol-moment': 'اللحظة المغولية',
      'gunpowder-empires': 'إمبراطوريات البارود',
      'industrial-empires': 'الإمبراطوريات الصناعية',
      'world-war-age': 'عصر الحرب العالمية',
    },
    liveNodes: (count) => `${count} طبقة نشطة`,
    historicAnchors: (count) => `${count} مرساة تاريخية`,
    activeRange: (start, end) => `نشط من ${start} إلى ${end}`,
    matchingResults: (count) => `${count} طبقة تطابق السنة والفلاتر الحالية`,
    eraJump: (label) => `انتقل إلى ${label}`,
    categories: {
      all: 'الكل',
      figure: 'شخصيات',
      war: 'حروب',
      kingdom: 'ممالك',
      country: 'دول',
      civilization: 'حضارات',
      event: 'أحداث',
      empire: 'إمبراطوريات',
      dynasty: 'سلالات',
      era: 'حقب',
      route: 'طرق',
      conflict: 'صراعات',
    },
    eras: {
      bce: 'ق.م',
      ce: 'م',
    },
    routes: {
      mediterranean: 'البحر المتوسط',
      sahara: 'ممرات الصحراء',
      mesopotamia: 'بلاد الرافدين',
      atlantic: 'العالم الأطلسي',
      indian: 'المحيط الهندي',
    },
  },
};

export function getMapCopy(locale: Locale): MapCopy {
  return mapCopy[locale];
}
