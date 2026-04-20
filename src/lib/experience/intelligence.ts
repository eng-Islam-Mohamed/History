import { mockTopics } from '@/data/mockTopics';
import { defaultLocale, Locale } from '@/i18n/config';
import { getExperienceCopy } from '@/i18n/experience-copy';
import {
  AskEraResponse,
  CompareSection,
  CompareSectionId,
  ComparisonExperience,
  ConfidenceLevel,
  DebateBlockData,
  PerspectiveLens,
  PerspectivePanel,
  RecommendationItem,
  TimelineCategory,
  TimelineEngineEvent,
} from '@/types/experience';
import { HistoryTopic, RelatedEntity, TopicCategory } from '@/types';
import { cleanText, getCoverThemeForCategory, slugify } from '@/lib/utils';

function extractParagraphs(text: string) {
  return cleanText(text)
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function firstSentence(text: string) {
  const sentence = cleanText(text).split(/(?<=[.!?])\s+/)[0]?.trim();
  return sentence || cleanText(text);
}

function parseYear(value: string) {
  const cleaned = cleanText(value).replace(/,/g, '').trim();
  const numeric = cleaned.match(/-?\d+/)?.[0];

  if (!numeric) {
    return 0;
  }

  const parsed = Number.parseInt(numeric, 10);
  return /bc/i.test(cleaned) ? -Math.abs(parsed) : parsed;
}

function formatCategory(topic: HistoryTopic, locale: Locale) {
  return (
    getExperienceCopy(locale).card.categories[topic.category] ??
    topic.category.replace(/-/g, ' ')
  );
}

function normaliseLabel(level: ConfidenceLevel, locale: Locale = defaultLocale) {
  return getExperienceCopy(locale).confidence[level];
}

function confidenceNote(level: ConfidenceLevel, locale: Locale) {
  switch (locale) {
    case 'fr':
      switch (level) {
        case 'debated':
          return "La chronologie générale est reconnue, mais les historiens discutent encore les causes, l'accent interprétatif et la portée à long terme.";
        case 'uncertain':
          return 'Ce dossier reste lisible, mais certaines sections reposent davantage sur une synthèse large que sur un appui documentaire dense dans la version actuelle.';
        case 'approximate':
          return 'Les bornes chronologiques et l’étendue territoriale doivent ici être lues comme des repères interprétatifs plutôt que comme des limites exactes.';
        default:
          return 'Ce dossier repose sur une chronologie largement attestée et sur des cadres interprétatifs bien établis.';
      }
    case 'ar':
      switch (level) {
        case 'debated':
          return 'التسلسل الزمني العام معروف، لكن المؤرخين ما زالوا يناقشون الأسباب ومواضع التركيز ودلالة الأثر البعيد.';
        case 'uncertain':
          return 'هذا الملف قابل للقراءة، لكن بعض أجزائه تعتمد على تركيب عام أكثر من اعتمادها على دعم وثائقي كثيف في النسخة الحالية.';
        case 'approximate':
          return 'يجب قراءة الحدود الزمنية أو الامتداد الجغرافي هنا باعتبارها تقريبية وتأويلية أكثر من كونها حدودًا دقيقة.';
        default:
          return 'يعتمد هذا الملف على تسلسل زمني موثق على نطاق واسع وعلى أطر تفسيرية مستقرة نسبيًا.';
      }
    default:
      switch (level) {
        case 'debated':
          return 'The chronology is broadly understood, but historians continue to debate causation, emphasis, and long-term significance.';
        case 'uncertain':
          return 'This topic is readable, but some sections rely on broader synthesis rather than dense documentary support in the current dossier.';
        case 'approximate':
          return 'Period labels and territorial reach are interpretive here and should be read as approximate rather than exact.';
        default:
          return 'This dossier is grounded in widely attested chronology and well-known interpretive frames.';
      }
  }
}

function formatTimelineCategory(category: TopicCategory): TimelineCategory {
  switch (category) {
    case 'war':
      return 'war';
    case 'figure':
      return 'ruler';
    case 'dynasty':
      return 'dynasty';
    case 'civilization':
      return 'society';
    case 'event':
      return 'political';
    default:
      return 'expansion';
  }
}

export function deriveConfidence(
  topic: HistoryTopic,
  locale: Locale = defaultLocale
) {
  const timelineDensity = topic.timelineEvents.length;
  const figureDensity = topic.keyFigures.length;
  let level: ConfidenceLevel = 'commonly-accepted';

  if (topic.category === 'era' || topic.category === 'event') {
    level = 'approximate';
  }

  if (timelineDensity < 3 || figureDensity === 0) {
    level = 'uncertain';
  }

  if (/legacy|revolution|collapse|decline|renaissance/i.test(topic.title)) {
    level = level === 'uncertain' ? level : 'debated';
  }

  return {
    level,
    label: normaliseLabel(level, locale),
    note: confidenceNote(level, locale),
    citations: topic.relatedTopics.slice(0, 3).map((entry) => entry.name),
  };
}

function buildLensSummary(
  topic: HistoryTopic,
  lens: PerspectiveLens,
  locale: Locale = defaultLocale
) {
  const paragraphs = extractParagraphs(topic.fullContent || topic.summary);
  const opening = paragraphs[0] || topic.summary;
  const secondary = paragraphs[1] || topic.summary;
  const copy = getExperienceCopy(locale);
  const lensTitle = copy.lenses[lens];
  const keyFigures =
    topic.keyFigures.slice(0, 2).map((figure) => figure.name).join(' and ') ||
    (locale === 'fr'
      ? 'ses institutions dominantes'
      : locale === 'ar'
        ? 'مؤسساته الأساسية'
        : 'its leading institutions');

  switch (locale) {
    case 'fr':
      switch (lens) {
        case 'political':
          return {
            title: lensTitle,
            summary: `${topic.title} peut se lire politiquement comme une histoire d’autorité, de légitimité et de cohérence du pouvoir dans ${topic.region}.`,
            bullets: [
              firstSentence(opening),
              `Le dossier l’inscrit dans ${topic.era}, ce qui aide à lire la transformation du pouvoir dans la durée.`,
              `Les figures clés pour cette lecture sont ${keyFigures}.`,
            ],
          };
        case 'military':
          return {
            title: lensTitle,
            summary: `${topic.title} révèle, sous un angle militaire, comment la force, la campagne ou la contrainte ont modifié l’équilibre historique.`,
            bullets: [
              firstSentence(secondary),
              topic.relatedEvents[0]
                ? `Un ancrage conflictuel utile ici est ${topic.relatedEvents[0].name}.`
                : 'Même lorsqu’il ne s’agit pas d’un dossier de guerre, la contrainte reste une dimension structurante.',
              `La chronologie aide à suivre les accélérations et tournants majeurs.`,
            ],
          };
        case 'social':
          return {
            title: lensTitle,
            summary: `${topic.title} se lit socialement comme une histoire d’ordre vécu, de statut et d’adaptation des communautés au changement.`,
            bullets: [
              `Le cadre régional, ${topic.region}, rend visible l’effet concret des décisions de pouvoir.`,
              'La continuité sociale dépasse souvent les ruptures politiques les plus spectaculaires.',
              topic.relatedTopics[0]
                ? `Une comparaison sociale proche est ${topic.relatedTopics[0].name}.`
                : 'Le dossier s’inscrit dans un paysage social plus large qu’un seul événement.',
            ],
          };
        case 'economic':
          return {
            title: lensTitle,
            summary: `${topic.title} peut aussi se lire à travers les ressources, la logistique, le commerce et les moyens matériels de durer.`,
            bullets: [
              `Une période longue comme ${topic.era} implique presque toujours fiscalité, circulation et capacité d’entretien.`,
              firstSentence(opening),
              'Les récits de déclin ou de transformation passent souvent aussi par la pression économique.',
            ],
          };
        case 'religious':
          return {
            title: lensTitle,
            summary: `${topic.title} éclaire la manière dont la croyance, l’autorité sacrée et la légitimation morale structurent le sens historique.`,
            bullets: [
              'La religion apparaît ici comme source de cohésion autant que de contestation.',
              topic.keyFigures[0]
                ? `${topic.keyFigures[0].name} aide à suivre l’articulation entre autorité politique et autorité morale.`
                : 'Même sans figure dominante unique, le dossier suggère un horizon moral plus large que la seule politique.',
              'La mémoire religieuse prolonge souvent la vie d’un sujet au-delà des institutions formelles.',
            ],
          };
        default:
          return {
            title: lensTitle,
            summary: `${topic.title} se comprend culturellement à travers les symboles, la mémoire, le savoir et les formes de transmission qui survivent à l’époque elle-même.`,
            bullets: [
              'Le dossier possède déjà une identité culturelle forte à travers son époque, sa région et ses figures associées.',
              topic.quote
                ? `La citation retenue montre aussi comment ce sujet a été retenu en mémoire : ${topic.quote}`
                : 'La longue postérité du sujet fait partie de ce qui le rend collectionnable et durable.',
              'ChronoLivre traite l’héritage comme une histoire culturelle autant que politique.',
            ],
          };
      }
    case 'ar':
      switch (lens) {
        case 'political':
          return {
            title: lensTitle,
            summary: `يُقرأ ${topic.title} سياسيًا بوصفه قصة سلطة وشرعية وتماسك في بنية الحكم داخل ${topic.region}.`,
            bullets: [
              firstSentence(opening),
              `إدراج الموضوع ضمن ${topic.era} يساعد على فهم تحولات الحكم عبر الزمن.`,
              `ومن الشخصيات المفتاحية لهذه القراءة: ${keyFigures}.`,
            ],
          };
        case 'military':
          return {
            title: lensTitle,
            summary: `يكشف ${topic.title} من زاوية عسكرية كيف غيّرت القوة أو الحملات أو الردع ميزان التاريخ.`,
            bullets: [
              firstSentence(secondary),
              topic.relatedEvents[0]
                ? `ومن نقاط الارتكاز الصراعية هنا: ${topic.relatedEvents[0].name}.`
                : 'حتى عندما لا يكون الملف حربًا بحد ذاته، تبقى القوة القسرية عنصرًا مفسرًا.',
              'يساعد الخط الزمني على تتبع التصعيد والمنعطفات الكبرى.',
            ],
          };
        case 'social':
          return {
            title: lensTitle,
            summary: `اجتماعيًا، يُقرأ ${topic.title} بوصفه قصة عن النظام المعيش والمكانة وكيف استوعبت الجماعات التغير التاريخي.`,
            bullets: [
              `يُظهر الإطار الإقليمي ${topic.region} الأثر الملموس للقرارات الكبرى على الحياة اليومية.`,
              'غالبًا ما يستمر التماسك الاجتماعي بعد الانقطاعات السياسية الحادة.',
              topic.relatedTopics[0]
                ? `ومن المقارنات الاجتماعية القريبة: ${topic.relatedTopics[0].name}.`
                : 'يعرض الملف الموضوع ضمن مشهد اجتماعي أوسع من الحدث المفرد.',
            ],
          };
        case 'economic':
          return {
            title: lensTitle,
            summary: `اقتصاديًا، يتشكل ${topic.title} عبر الموارد والضرائب واللوجستيات والقدرة على الاستمرار بمرور الزمن.`,
            bullets: [
              `الفترات الطويلة مثل ${topic.era} توحي دائمًا بأهمية التجارة والإدارة والتمويل.`,
              firstSentence(opening),
              'وعندما يتجه السرد إلى التراجع أو التحول، يظهر العامل الاقتصادي ضمن التفسير.',
            ],
          };
        case 'religious':
          return {
            title: lensTitle,
            summary: `دينيًا، يكشف ${topic.title} كيف صاغ الاعتقاد والشرعية المقدسة والهوية الرمزية معنى الحدث أو الكيان.`,
            bullets: [
              'تظهر البنية الدينية هنا كمصدر للتماسك وكعامل للخلاف في الوقت نفسه.',
              topic.keyFigures[0]
                ? `وتساعد شخصية ${topic.keyFigures[0].name} على تتبع الصلة بين السلطة السياسية والمرجعية الأخلاقية.`
                : 'حتى من دون شخصية مهيمنة، يوحي الملف بعالم قيمي يتجاوز السياسة المجردة.',
              'غالبًا ما يطيل التذكر الديني عمر الموضوع بعد زوال مؤسساته الرسمية.',
            ],
          };
        default:
          return {
            title: lensTitle,
            summary: `ثقافيًا، يُقرأ ${topic.title} عبر الرموز والذاكرة والمعرفة وأشكال التمثيل التي تبقيه حاضرًا بعد عصره المباشر.`,
            bullets: [
              'يملك الملف أصلًا هوية ثقافية واضحة من خلال العصر والمنطقة والشخصيات المرتبطة به.',
              topic.quote
                ? `وتكشف العبارة المقتبسة كيف استقر الموضوع في الذاكرة: ${topic.quote}`
                : 'إن طول الأثر الثقافي جزء مما يجعل هذا الموضوع قابلًا للجمع والعودة إليه.',
              'يتعامل ChronoLivre مع الإرث بوصفه سردًا ثقافيًا بقدر ما هو سياسي.',
            ],
          };
      }
    default:
      switch (lens) {
        case 'political':
          return {
            title: lensTitle,
            summary: `${topic.title} reads politically as a story of authority, legitimacy, and the institutions that kept power coherent across ${topic.region}.`,
            bullets: [
              firstSentence(opening),
              `The dossier frames the subject within ${topic.era}, which helps track how rule changed over time.`,
              `Key political figures in this reading include ${keyFigures}.`,
            ],
          };
        case 'military':
          return {
            title: lensTitle,
            summary: `${topic.title} reveals, through a military lens, how force, campaigns, or coercion altered the balance of power.`,
            bullets: [
              firstSentence(secondary),
              topic.relatedEvents[0]
                ? `A useful conflict anchor here is ${topic.relatedEvents[0].name}.`
                : 'Even when this is not primarily a war dossier, coercive power remains part of the explanation.',
              'The timeline helps track escalation and major turning points.',
            ],
          };
        case 'social':
          return {
            title: lensTitle,
            summary: `${topic.title} reads socially as a story about everyday order, status, and the way communities absorbed historical change.`,
            bullets: [
              `The regional frame, ${topic.region}, makes the lived consequences of power more visible.`,
              'Social continuity often lasts longer than dramatic political rupture.',
              topic.relatedTopics[0]
                ? `A nearby social comparison is ${topic.relatedTopics[0].name}.`
                : 'The dossier belongs to a wider social landscape rather than an isolated episode.',
            ],
          };
        case 'economic':
          return {
            title: lensTitle,
            summary: `${topic.title} can also be read through resources, logistics, trade, and the material capacity to endure over time.`,
            bullets: [
              `Long spans like ${topic.era} almost always imply taxation, circulation, and administrative maintenance.`,
              firstSentence(opening),
              'When the dossier turns toward decline or transition, economic strain is often part of the story.',
            ],
          };
        case 'religious':
          return {
            title: lensTitle,
            summary: `${topic.title} reveals how belief, sacred legitimacy, and moral authority shape historical meaning.`,
            bullets: [
              'Religion appears here as a source of cohesion as well as contestation.',
              topic.keyFigures[0]
                ? `${topic.keyFigures[0].name} helps trace the overlap between political and moral authority.`
                : 'Even without one dominant figure, the dossier suggests a moral world larger than statecraft alone.',
              'Religious memory often outlives formal institutions.',
            ],
          };
        default:
          return {
            title: lensTitle,
            summary: `${topic.title} can be understood culturally through symbols, memory, scholarship, and the forms of transmission that survive the era itself.`,
            bullets: [
              'The dossier already carries a strong cultural identity through its era, region, and associated figures.',
              topic.quote
                ? `The quoted passage also shows how the subject has been remembered: ${topic.quote}`
                : 'Its cultural afterlife is part of what makes the subject collectible and durable.',
              'ChronoLivre treats legacy as a cultural story as much as a political one.',
            ],
          };
      }
  }
}

export function buildPerspectivePanels(
  topic: HistoryTopic,
  locale: Locale = defaultLocale
): PerspectivePanel[] {
  const lenses: PerspectiveLens[] = [
    'political',
    'military',
    'social',
    'economic',
    'cultural',
    'religious',
  ];

  return lenses.map((lens) => ({ lens, ...buildLensSummary(topic, lens, locale) }));
}

export function buildDebateBlock(
  topic: HistoryTopic,
  locale: Locale = defaultLocale
): DebateBlockData {
  const confidence = deriveConfidence(topic, locale);
  const paragraphs = extractParagraphs(topic.fullContent || topic.summary);

  switch (locale) {
    case 'fr':
      return {
        question:
          topic.category === 'figure'
            ? `${topic.title} relève-t-il d’abord de la réforme ou de la conquête du pouvoir ?`
            : topic.category === 'war'
              ? `${topic.title} a-t-il surtout transformé l’histoire par la destruction ou par le réagencement politique ?`
              : `Faut-il comprendre ${topic.title} principalement par sa gouvernance ou par son héritage ?`,
        consensus:
          'La majorité des historiens reconnaît la trame chronologique, mais l’importance relative des institutions, des idées, de la violence et des héritages reste discutée.',
        uncertainty:
          'Ce bloc de débat présente des accentuations concurrentes plutôt qu’une conclusion définitive.',
        confidence,
        sides: [
          {
            title: 'Lecture institutionnelle',
            argument: `${topic.title} peut être lu comme une histoire de structures, d’administration et de continuités durables plus que comme une simple affaire de personnalités.`,
            evidence: [
              firstSentence(paragraphs[0] || topic.summary),
              `Le dossier suggère une continuité de long terme sur ${topic.era}.`,
              topic.relatedTopics[0]
                ? `Comparaison utile : ${topic.relatedTopics[0].name}.`
                : 'La persistance institutionnelle reste centrale dans cette lecture.',
            ],
          },
          {
            title: 'Lecture de la contingence',
            argument: `${topic.title} peut aussi être compris à travers les tournants, les décisions humaines et la fragilité des bifurcations historiques.`,
            evidence: [
              topic.timelineEvents[0]
                ? `${topic.timelineEvents[0].title} marque ici un premier moment de bascule.`
                : 'La chronologie suggère elle-même des phases de changement rapide.',
              topic.keyFigures[0]
                ? `${topic.keyFigures[0].name} devient central dans cette interprétation.`
                : 'La question demeure celle de la marge d’action des individus dans une structure plus large.',
              firstSentence(paragraphs[1] || topic.summary),
            ],
          },
        ],
      };
    case 'ar':
      return {
        question:
          topic.category === 'figure'
            ? `هل يُفهم ${topic.title} أولًا بوصفه إصلاحًا أم بوصفه أداة للهيمنة؟`
            : topic.category === 'war'
              ? `هل غيّر ${topic.title} التاريخ عبر الدمار أكثر أم عبر إعادة تشكيل السياسة؟`
              : `هل ينبغي فهم ${topic.title} من خلال الحكم أكثر أم من خلال الإرث؟`,
        consensus:
          'يتفق معظم المؤرخين على البنية الزمنية العامة، لكنهم يختلفون في وزن المؤسسات والأفكار والعنف والآثار البعيدة.',
        uncertainty:
          'يعرض هذا القسم زوايا تفسيرية متعارضة، ولا يدّعي حسمًا نهائيًا.',
        confidence,
        sides: [
          {
            title: 'قراءة مؤسسية',
            argument: `يمكن فهم ${topic.title} بوصفه قصة بنى إدارية ومؤسسات واستمرارية طويلة أكثر من كونه قصة شخصيات فقط.`,
            evidence: [
              firstSentence(paragraphs[0] || topic.summary),
              `يوحي الملف باستمرارية طويلة عبر ${topic.era}.`,
              topic.relatedTopics[0]
                ? `ومن المقارنات المفيدة: ${topic.relatedTopics[0].name}.`
                : 'يبقى استمرار البنية المؤسسية محورًا أساسيًا في هذه القراءة.',
            ],
          },
          {
            title: 'قراءة الاحتمال والتحول',
            argument: `يمكن أيضًا قراءة ${topic.title} عبر المنعطفات والقرارات البشرية وهشاشة اللحظات التي كان يمكن أن تسلك مسارًا آخر.`,
            evidence: [
              topic.timelineEvents[0]
                ? `يمثل ${topic.timelineEvents[0].title} نقطة انعطاف مبكرة في هذا التصور.`
                : 'تشير البنية الزمنية نفسها إلى لحظات تغير سريع.',
              topic.keyFigures[0]
                ? `وتصبح شخصية ${topic.keyFigures[0].name} أكثر مركزية في هذا التفسير.`
                : 'ويبقى السؤال متعلقًا بهامش الفعل الفردي داخل البنى الكبرى.',
              firstSentence(paragraphs[1] || topic.summary),
            ],
          },
        ],
      };
    default:
      return {
        question:
          topic.category === 'figure'
            ? `Was ${topic.title} primarily a reformer or an instrument of power?`
            : topic.category === 'war'
              ? `Did ${topic.title} transform history more through destruction or political reordering?`
              : `Should ${topic.title} be understood more through governance or through legacy?`,
        consensus:
          'Most historians accept the broad chronology, but they still differ on how much weight to give institutions, ideas, violence, and long-term afterlives.',
        uncertainty:
          'This debate block presents competing emphases rather than a single final verdict.',
        confidence,
        sides: [
          {
            title: 'Institutional reading',
            argument: `${topic.title} can be read as a story of structures, administration, and durable continuity more than a story of personalities alone.`,
            evidence: [
              firstSentence(paragraphs[0] || topic.summary),
              `The dossier suggests long-duration continuity across ${topic.era}.`,
              topic.relatedTopics[0]
                ? `Useful comparison: ${topic.relatedTopics[0].name}.`
                : 'Institutional persistence remains central to this reading.',
            ],
          },
          {
            title: 'Contingency reading',
            argument: `${topic.title} can also be understood through turning points, human decisions, and the fragility of historical outcomes.`,
            evidence: [
              topic.timelineEvents[0]
                ? `${topic.timelineEvents[0].title} anchors an early moment of contingency.`
                : 'The chronology itself suggests moments of rapid change.',
              topic.keyFigures[0]
                ? `${topic.keyFigures[0].name} becomes more central in this interpretation.`
                : 'The question remains how much agency individuals retained within larger structures.',
              firstSentence(paragraphs[1] || topic.summary),
            ],
          },
        ],
      };
  }
}

function overlapScore(left: HistoryTopic, right: HistoryTopic) {
  let score = 0;

  if (left.category === right.category) score += 3;
  if (left.region === right.region) score += 2;
  if (
    left.relatedTopics.some((entry) =>
      right.title.toLowerCase().includes(entry.name.toLowerCase())
    )
  ) {
    score += 4;
  }

  const leftTerms = new Set(left.title.toLowerCase().split(/\s+/));
  const rightTerms = new Set(right.title.toLowerCase().split(/\s+/));
  leftTerms.forEach((term) => {
    if (term.length > 3 && rightTerms.has(term)) {
      score += 1;
    }
  });

  return score;
}

function recommendationReason(
  topic: HistoryTopic,
  candidate: HistoryTopic,
  locale: Locale
) {
  const key =
    candidate.region === topic.region
      ? 'same-region'
      : candidate.category === topic.category
        ? 'parallel'
        : topic.relatedTopics.some((related) =>
              candidate.title.toLowerCase().includes(related.name.toLowerCase())
            )
          ? 'connected'
          : 'adjacent';

  switch (locale) {
    case 'fr':
      return key === 'same-region'
        ? 'Même région, autre angle'
        : key === 'parallel'
          ? 'Forme historique parallèle'
          : key === 'connected'
            ? 'Lié explicitement dans le dossier'
            : 'Voie adjacente à explorer ensuite';
    case 'ar':
      return key === 'same-region'
        ? 'المنطقة نفسها بمنظور مختلف'
        : key === 'parallel'
          ? 'شكل تاريخي موازٍ'
          : key === 'connected'
            ? 'مرتبط صراحة داخل الملف'
            : 'مسار مجاور يستحق الاستكشاف';
    default:
      return key === 'same-region'
        ? 'Same region, different lens'
        : key === 'parallel'
          ? 'Parallel historical form'
          : key === 'connected'
            ? 'Explicitly connected in the dossier'
            : 'Adjacent path worth exploring next';
  }
}

export function buildRecommendations(
  topic: HistoryTopic,
  locale: Locale = defaultLocale
): RecommendationItem[] {
  return mockTopics
    .filter((candidate) => candidate.slug !== topic.slug)
    .map((candidate) => ({
      candidate: {
        slug: candidate.slug,
        title: candidate.title,
        category: candidate.category,
        era: candidate.era,
        region: candidate.region,
        summary: candidate.summary,
        query: candidate.query,
        coverTheme: candidate.coverTheme,
        reason: recommendationReason(topic, candidate, locale),
      } satisfies RecommendationItem,
      score: overlapScore(topic, candidate),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((entry) => entry.candidate);
}

function joinEntityNames(entities: RelatedEntity[], fallback: string) {
  const names = entities.slice(0, 3).map((entry) => entry.name);
  return names.length > 0 ? names.join(', ') : fallback;
}

function getOriginNarrative(topic: HistoryTopic, locale: Locale) {
  if (topic.timelineEvents[0]) {
    return `${topic.timelineEvents[0].year}: ${topic.timelineEvents[0].title}. ${topic.timelineEvents[0].description}`;
  }

  if (locale === 'fr') {
    return extractParagraphs(topic.fullContent || topic.summary)[0] || topic.summary;
  }

  if (locale === 'ar') {
    return extractParagraphs(topic.fullContent || topic.summary)[0] || topic.summary;
  }

  return extractParagraphs(topic.fullContent || topic.summary)[0] || topic.summary;
}

function getTimelineNarrative(topic: HistoryTopic, locale: Locale) {
  if (topic.timelineEvents.length === 0) {
    switch (locale) {
      case 'fr':
        return `ChronoLivre présente actuellement ${topic.title} à travers ${topic.era} sans registre événementiel plus dense.`;
      case 'ar':
        return `يعرض ChronoLivre حاليًا ${topic.title} عبر ${topic.era} من دون سجل أحداث أكثر كثافة.`;
      default:
        return `ChronoLivre currently frames ${topic.title} across ${topic.era} without a denser event register.`;
    }
  }

  return topic.timelineEvents
    .slice(0, 4)
    .map((event) => `${event.year}: ${event.title}`)
    .join(' • ');
}

function getPoliticalNarrative(topic: HistoryTopic, locale: Locale) {
  const leaders = joinEntityNames(
    topic.keyFigures,
    locale === 'fr'
      ? 'ses institutions dominantes'
      : locale === 'ar'
        ? 'مؤسساته الأساسية'
        : 'its leading institutions'
  );

  switch (locale) {
    case 'fr':
      return `${topic.title} est présenté comme un ${formatCategory(topic, locale).toLowerCase()} dont la forme politique se lit à travers ${topic.region}, ${topic.era} et le rôle de ${leaders}.`;
    case 'ar':
      return `يُقدَّم ${topic.title} بوصفه ${formatCategory(topic, locale)} تُقرأ بنيته السياسية من خلال ${topic.region} و${topic.era} ودور ${leaders}.`;
    default:
      return `${topic.title} is framed as a ${topic.category} whose political shape is best read through ${topic.region}, ${topic.era}, and the role of ${leaders}.`;
  }
}

function getMilitaryNarrative(topic: HistoryTopic, locale: Locale) {
  if (topic.category === 'war') {
    switch (locale) {
      case 'fr':
        return `${topic.title} est lui-même un dossier militaire : le conflit y constitue la logique centrale plus qu’une dimension secondaire.`;
      case 'ar':
        return `${topic.title} هو في ذاته ملف عسكري؛ فالصراع فيه هو المبدأ المنظم لا مجرد طبقة مساندة.`;
      default:
        return `${topic.title} is itself a military dossier, so conflict is the organizing principle rather than a supporting dimension.`;
    }
  }

  const related = joinEntityNames(
    topic.relatedEvents,
    locale === 'fr'
      ? 'ses tournants et les pressions coercitives associées'
      : locale === 'ar'
        ? 'منعطفاته وضغوطه القسرية'
        : 'its turning points and coercive pressure'
  );

  switch (locale) {
    case 'fr':
      return `${topic.title} se relie au fait militaire à travers ${related}.`;
    case 'ar':
      return `يرتبط ${topic.title} بالبنية العسكرية من خلال ${related}.`;
    default:
      return `${topic.title} is linked to conflict through ${related}.`;
  }
}

function getEconomyNarrative(topic: HistoryTopic, locale: Locale) {
  switch (locale) {
    case 'fr':
      return `La lecture économique insiste sur l’endurance : des durées comme ${topic.era} supposent logistique, fiscalité, commerce ou gestion des ressources même si le récit met d’abord l’accent sur la politique.`;
    case 'ar':
      return `تؤكد القراءة الاقتصادية عامل الاستمرار: فالفترات الطويلة مثل ${topic.era} توحي باللوجستيات والضرائب والتجارة أو إدارة الموارد حتى عندما يبرز السرد البعد السياسي أولًا.`;
    default:
      return `Economic reading emphasizes endurance: long spans like ${topic.era} imply logistics, taxation, trade, or resource management even when the dossier foregrounds politics.`;
  }
}

function getCultureNarrative(topic: HistoryTopic, locale: Locale) {
  const related = joinEntityNames(
    topic.relatedTopics,
    locale === 'fr'
      ? 'les traditions et dossiers apparentés'
      : locale === 'ar'
        ? 'التقاليد والملفات المرتبطة'
        : 'related dossiers and traditions'
  );

  switch (locale) {
    case 'fr':
      return `${topic.title} possède une longue postérité culturelle à travers la mémoire, la représentation et les imaginaires attachés à ${related}.`;
    case 'ar':
      return `يمتلك ${topic.title} أثرًا ثقافيًا طويلًا عبر الذاكرة والتمثيل والرموز المرتبطة بـ ${related}.`;
    default:
      return `${topic.title} carries a cultural afterlife through memory, representation, and the symbolic legacy attached to ${related}.`;
  }
}

function getLegacyNarrative(topic: HistoryTopic, locale: Locale) {
  switch (locale) {
    case 'fr':
      return `Le dossier lit l’héritage de ${topic.title} à travers ses effets ultérieurs, surtout dans ${topic.region}, et la persistance des noms, institutions et récits qui lui restent liés.`;
    case 'ar':
      return `يقرأ الملف إرث ${topic.title} من خلال آثاره اللاحقة، خصوصًا في ${topic.region}، ومن خلال دوام الأسماء والمؤسسات والسرديات المرتبطة به.`;
    default:
      return `The dossier frames legacy through later influence, especially in ${topic.region}, and through the durability of names, institutions, and narratives tied to ${topic.title}.`;
  }
}

function compareSectionMeta(
  locale: Locale,
  id: CompareSectionId
): Pick<CompareSection, 'label' | 'summary'> {
  const entries: Record<
    Locale,
    Record<CompareSectionId, Pick<CompareSection, 'label' | 'summary'>>
  > = {
    en: {
      overview: {
        label: 'Overview',
        summary:
          'Both dossiers are introduced through narrative synthesis rather than bare chronology.',
      },
      origin: {
        label: 'Origin / formation',
        summary:
          'Formation reveals whether each subject begins as an institution, a rupture, a conquest, or a long social build-up.',
      },
      timeline: {
        label: 'Timeline',
        summary:
          'Chronology makes scale visible: one subject may move in sudden turns while the other unfolds over longer duration.',
      },
      'political-structure': {
        label: 'Political structure',
        summary:
          'This section compares how rule, legitimacy, and institutional control are presented in each dossier.',
      },
      'military-power': {
        label: 'Military power',
        summary:
          'Military analysis distinguishes a subject organized around force from one merely shaped by it.',
      },
      economy: {
        label: 'Economy',
        summary:
          'Economic capacity often explains what political narratives alone cannot sustain.',
      },
      'culture-society': {
        label: 'Culture / religion / society',
        summary:
          'Cultural comparison helps read how each subject survives in memory and collective identity.',
      },
      'key-figures': {
        label: 'Key figures',
        summary:
          'Leadership concentration often indicates whether a subject is remembered personally or structurally.',
      },
      'turning-points': {
        label: 'Turning points',
        summary:
          'Turning points show where continuity broke, accelerated, or was reinterpreted.',
      },
      'major-conflicts': {
        label: 'Major conflicts',
        summary:
          'Conflict clarifies what each subject had to resist, absorb, or unleash.',
      },
      'decline-legacy': {
        label: 'Decline / legacy',
        summary:
          'Historical importance often lies as much in afterlife as in peak power.',
      },
      influence: {
        label: 'Influence on later history',
        summary:
          'Influence reveals where a subject remains active in the historical imagination.',
      },
    },
    fr: {
      overview: {
        label: "Vue d'ensemble",
        summary:
          'Les deux dossiers commencent par une synthèse narrative plutôt que par une simple succession de dates.',
      },
      origin: {
        label: 'Origine / formation',
        summary:
          'La formation indique si chaque sujet commence comme institution, rupture, conquête ou construction progressive.',
      },
      timeline: {
        label: 'Chronologie',
        summary:
          'La chronologie rend visible l’échelle : un sujet peut basculer vite, l’autre se déployer sur la longue durée.',
      },
      'political-structure': {
        label: 'Structure politique',
        summary:
          'Cette section compare la manière dont pouvoir, légitimité et contrôle institutionnel apparaissent dans chaque dossier.',
      },
      'military-power': {
        label: 'Puissance militaire',
        summary:
          'L’analyse militaire distingue un sujet organisé autour de la force d’un sujet seulement façonné par elle.',
      },
      economy: {
        label: 'Économie',
        summary:
          'La capacité économique éclaire souvent ce que le récit politique seul ne suffit pas à expliquer.',
      },
      'culture-society': {
        label: 'Culture / religion / société',
        summary:
          'La comparaison culturelle aide à lire comment chaque sujet survit dans la mémoire et l’identité collective.',
      },
      'key-figures': {
        label: 'Figures clés',
        summary:
          'La concentration du leadership indique souvent si le sujet est retenu de manière personnelle ou structurelle.',
      },
      'turning-points': {
        label: 'Tournants',
        summary:
          'Les tournants montrent où la continuité s’est brisée, accélérée ou reconfigurée.',
      },
      'major-conflicts': {
        label: 'Conflits majeurs',
        summary:
          'Le conflit précise ce que chaque sujet a dû contenir, absorber ou déclencher.',
      },
      'decline-legacy': {
        label: 'Déclin / héritage',
        summary:
          'L’importance historique se joue souvent autant dans l’après-vie que dans l’apogée.',
      },
      influence: {
        label: 'Influence sur l’histoire ultérieure',
        summary:
          'L’influence montre où un sujet reste actif dans l’imaginaire historique.',
      },
    },
    ar: {
      overview: {
        label: 'نظرة عامة',
        summary:
          'يبدأ الملفان بسرد تركيبي منظم بدل الاكتفاء بخط زمني مجرد.',
      },
      origin: {
        label: 'النشأة / التكوين',
        summary:
          'تكشف مرحلة التكوين ما إذا كان كل موضوع يبدأ كمؤسسة أو قطيعة أو فتح أو تراكم اجتماعي طويل.',
      },
      timeline: {
        label: 'الخط الزمني',
        summary:
          'يوضح التسلسل الزمني الفارق في المدى: فقد يتحرك أحد الموضوعين عبر انعطافات حادة بينما يتشكل الآخر على امتداد أطول.',
      },
      'political-structure': {
        label: 'البنية السياسية',
        summary:
          'تقارن هذه الفقرة كيفية عرض الحكم والشرعية والسيطرة المؤسسية في كل ملف.',
      },
      'military-power': {
        label: 'القوة العسكرية',
        summary:
          'تميّز القراءة العسكرية بين موضوع يقوم على القوة وآخر تشكّله القوة من الخارج.',
      },
      economy: {
        label: 'الاقتصاد',
        summary:
          'تفسر القدرة الاقتصادية كثيرًا مما لا يكفي السرد السياسي وحده لشرحه.',
      },
      'culture-society': {
        label: 'الثقافة / الدين / المجتمع',
        summary:
          'تساعد المقارنة الثقافية على فهم كيف يستمر كل موضوع في الذاكرة والهوية الجماعية.',
      },
      'key-figures': {
        label: 'الشخصيات المحورية',
        summary:
          'يكشف تركز القيادة غالبًا ما إذا كان الموضوع يُتذكر عبر الأشخاص أم عبر البنى.',
      },
      'turning-points': {
        label: 'المنعطفات',
        summary:
          'تُظهر المنعطفات أين انكسرت الاستمرارية أو تسارعت أو أُعيد تأويلها.',
      },
      'major-conflicts': {
        label: 'الصراعات الكبرى',
        summary:
          'يوضح الصراع ما الذي كان على كل موضوع مقاومته أو استيعابه أو إطلاقه.',
      },
      'decline-legacy': {
        label: 'التراجع / الإرث',
        summary:
          'تكمن الأهمية التاريخية كثيرًا في الأثر اللاحق بقدر ما تكمن في ذروة القوة.',
      },
      influence: {
        label: 'التأثير في التاريخ اللاحق',
        summary:
          'يكشف التأثير أين يبقى الموضوع فاعلًا في الخيال التاريخي.',
      },
    },
  };

  return entries[locale][id];
}

export function buildComparisonExperience(
  left: HistoryTopic,
  right: HistoryTopic,
  locale: Locale = defaultLocale
): ComparisonExperience {
  const confidence = {
    level: 'debated' as const,
    label: normaliseLabel('debated', locale),
    note: confidenceNote('debated', locale),
  };

  const sections: CompareSection[] = [
    {
      id: 'overview',
      ...compareSectionMeta(locale, 'overview'),
      left: left.summary,
      right: right.summary,
    },
    {
      id: 'origin',
      ...compareSectionMeta(locale, 'origin'),
      left: getOriginNarrative(left, locale),
      right: getOriginNarrative(right, locale),
    },
    {
      id: 'timeline',
      ...compareSectionMeta(locale, 'timeline'),
      left: getTimelineNarrative(left, locale),
      right: getTimelineNarrative(right, locale),
    },
    {
      id: 'political-structure',
      ...compareSectionMeta(locale, 'political-structure'),
      left: getPoliticalNarrative(left, locale),
      right: getPoliticalNarrative(right, locale),
    },
    {
      id: 'military-power',
      ...compareSectionMeta(locale, 'military-power'),
      left: getMilitaryNarrative(left, locale),
      right: getMilitaryNarrative(right, locale),
    },
    {
      id: 'economy',
      ...compareSectionMeta(locale, 'economy'),
      left: getEconomyNarrative(left, locale),
      right: getEconomyNarrative(right, locale),
    },
    {
      id: 'culture-society',
      ...compareSectionMeta(locale, 'culture-society'),
      left: getCultureNarrative(left, locale),
      right: getCultureNarrative(right, locale),
    },
    {
      id: 'key-figures',
      ...compareSectionMeta(locale, 'key-figures'),
      left: joinEntityNames(
        left.keyFigures,
        locale === 'fr'
          ? 'Aucune figure unique ne domine ce dossier.'
          : locale === 'ar'
            ? 'لا تهيمن شخصية واحدة على هذا الملف.'
            : 'No single figure dominates the current dossier.'
      ),
      right: joinEntityNames(
        right.keyFigures,
        locale === 'fr'
          ? 'Aucune figure unique ne domine ce dossier.'
          : locale === 'ar'
            ? 'لا تهيمن شخصية واحدة على هذا الملف.'
            : 'No single figure dominates the current dossier.'
      ),
    },
    {
      id: 'turning-points',
      ...compareSectionMeta(locale, 'turning-points'),
      left: joinEntityNames(left.relatedEvents, getTimelineNarrative(left, locale)),
      right: joinEntityNames(right.relatedEvents, getTimelineNarrative(right, locale)),
    },
    {
      id: 'major-conflicts',
      ...compareSectionMeta(locale, 'major-conflicts'),
      left: joinEntityNames(
        left.relatedEvents,
        locale === 'fr'
          ? 'Le conflit reste ici une couche secondaire du dossier.'
          : locale === 'ar'
            ? 'يبقى الصراع هنا طبقة ثانوية داخل الملف.'
            : 'Conflict remains a secondary layer in this dossier.'
      ),
      right: joinEntityNames(
        right.relatedEvents,
        locale === 'fr'
          ? 'Le conflit reste ici une couche secondaire du dossier.'
          : locale === 'ar'
            ? 'يبقى الصراع هنا طبقة ثانوية داخل الملف.'
            : 'Conflict remains a secondary layer in this dossier.'
      ),
    },
    {
      id: 'decline-legacy',
      ...compareSectionMeta(locale, 'decline-legacy'),
      left: getLegacyNarrative(left, locale),
      right: getLegacyNarrative(right, locale),
    },
    {
      id: 'influence',
      ...compareSectionMeta(locale, 'influence'),
      left:
        locale === 'fr'
          ? `L’enquête ultérieure sur ${left.title} conduit souvent vers ${joinEntityNames(left.relatedTopics, 'ses résonances institutionnelles et culturelles en aval')}.`
          : locale === 'ar'
            ? `يقود البحث اللاحق في ${left.title} غالبًا إلى ${joinEntityNames(left.relatedTopics, 'أصدائه المؤسسية والثقافية اللاحقة')}.`
            : `Later inquiry into ${left.title} usually moves toward ${joinEntityNames(left.relatedTopics, 'its downstream institutional and cultural echoes')}.`,
      right:
        locale === 'fr'
          ? `L’enquête ultérieure sur ${right.title} conduit souvent vers ${joinEntityNames(right.relatedTopics, 'ses résonances institutionnelles et culturelles en aval')}.`
          : locale === 'ar'
            ? `يقود البحث اللاحق في ${right.title} غالبًا إلى ${joinEntityNames(right.relatedTopics, 'أصدائه المؤسسية والثقافية اللاحقة')}.`
            : `Later inquiry into ${right.title} usually moves toward ${joinEntityNames(right.relatedTopics, 'its downstream institutional and cultural echoes')}.`,
    },
  ];

  if (locale === 'fr') {
    return {
      title: `${left.title} et ${right.title}`,
      subtitle:
        'Une comparaison archivistique structurée autour de la formation, de la chronologie, du pouvoir, de la société, du conflit et de la postérité historique.',
      leftTitle: left.title,
      rightTitle: right.title,
      confidence,
      similarities: [
        `${left.title} et ${right.title} se lisent tous deux à travers la chronologie, le contexte régional et les personnalités qui leur sont liées.`,
        'Les deux dossiers produisent une postérité qui dépasse leur moment historique immédiat.',
        'Chaque sujet devient plus net lorsque la structure politique est lue avec la mémoire culturelle.',
      ],
      differences: [
        `${left.title} est présenté principalement comme ${formatCategory(left, locale).toLowerCase()}, tandis que ${right.title} relève davantage de ${formatCategory(right, locale).toLowerCase()}.`,
        `${left.region} et ${right.region} situent ces dossiers dans des théâtres géographiques différents.`,
        `L’échelle temporelle de ${left.title} (${left.era}) diffère de celle de ${right.title} (${right.era}).`,
      ],
      sections,
    };
  }

  if (locale === 'ar') {
    return {
      title: `${left.title} و${right.title}`,
      subtitle:
        'مقارنة أرشيفية منظمة عبر التكوين والتسلسل الزمني والقوة والمجتمع والصراع والأثر التاريخي اللاحق.',
      leftTitle: left.title,
      rightTitle: right.title,
      confidence,
      similarities: [
        `يمكن قراءة كل من ${left.title} و${right.title} عبر الزمن والسياق الإقليمي والشخصيات المرتبطة بهما.`,
        'ينتج الملفان أثرًا ممتدًا يتجاوز لحظتهما التاريخية المباشرة.',
        'يتضح كل موضوع أكثر حين تُقرأ البنية السياسية مع الذاكرة الثقافية.',
      ],
      differences: [
        `يُعرض ${left.title} أساسًا بوصفه ${formatCategory(left, locale)}، بينما يُعرض ${right.title} بوصفه ${formatCategory(right, locale)}.`,
        `يضع ${left.region} و${right.region} هذين الملفين في مسارين جغرافيين مختلفين.`,
        `يختلف المدى الزمني لـ ${left.title} (${left.era}) عن المدى الزمني لـ ${right.title} (${right.era}).`,
      ],
      sections,
    };
  }

  return {
    title: `${left.title} and ${right.title}`,
    subtitle:
      'A structured archival comparison across formation, chronology, power, society, conflict, and historical afterlife.',
    leftTitle: left.title,
    rightTitle: right.title,
    confidence,
    similarities: [
      `${left.title} and ${right.title} are both readable through chronology, regional context, and the personalities attached to them.`,
      'Both dossiers produce a long afterlife that extends beyond their immediate historical moment.',
      'Each subject becomes clearer when political structure is read together with cultural memory.',
    ],
    differences: [
      `${left.title} is framed primarily as a ${formatCategory(left, locale).toLowerCase()}, while ${right.title} is framed as a ${formatCategory(right, locale).toLowerCase()}.`,
      `${left.region} and ${right.region} place these dossiers in different geographic theaters of consequence.`,
      `The active timeline of ${left.title} (${left.era}) differs in scale and duration from ${right.title} (${right.era}).`,
    ],
    sections,
  };
}

export function buildTimelineEvents(
  topic: HistoryTopic,
  locale: Locale = defaultLocale
): TimelineEngineEvent[] {
  const confidence = deriveConfidence(topic, locale);

  return topic.timelineEvents.map((event, index) => ({
    id: `${topic.slug}-${index}`,
    title: event.title,
    description: event.description,
    yearLabel: event.year,
    startYear: parseYear(event.year),
    endYear: null,
    category: formatTimelineCategory(topic.category),
    region: topic.region,
    importance: Math.max(1, Math.min(5, 5 - index)) as 1 | 2 | 3 | 4 | 5,
    relatedTopics: topic.relatedTopics.map((related) => related.name),
    confidence,
  }));
}

export function buildAskEraFallback(
  topic: HistoryTopic,
  perspective: string,
  locale: Locale = defaultLocale
): AskEraResponse {
  const caution = getExperienceCopy(locale).askEra.caution;

  if (locale === 'fr') {
    return {
      title: `${topic.title} vu à travers ${perspective}`,
      perspective,
      response: `Depuis ${topic.era}, un narrateur façonné par ${perspective} comprendrait sans doute ${topic.title} à partir de l’ordre, du risque et de la survie plutôt qu’à partir d’une lecture rétrospective achevée. Le sujet apparaîtrait moins comme un chapitre clos que comme un présent instable encore débattu dans les cours, les marchés, les casernes et les foyers.`,
      caution,
    };
  }

  if (locale === 'ar') {
    return {
      title: `${topic.title} من منظور ${perspective}`,
      perspective,
      response: `من داخل ${topic.era}، سيفهم راوٍ يتشكل عبر ${perspective} موضوع ${topic.title} من خلال النظام والمخاطرة والبقاء أكثر من فهمه عبر نظرة لاحقة مكتملة. لن يبدو الموضوع فصلًا مغلقًا، بل حاضرًا مضطربًا ما زال معناه موضع نقاش في الأسواق والقصور والثكنات والبيوت.`,
      caution,
    };
  }

  return {
    title: `${topic.title} through the voice of ${perspective}`,
    perspective,
    response: `From within ${topic.era}, a narrator shaped by ${perspective} would likely understand ${topic.title} through order, risk, and survival rather than hindsight. The subject would not feel like a completed chapter, but like an unstable present whose meaning was still being argued in markets, courts, barracks, and households.`,
    caution,
  };
}

export function buildComparisonSlug(left: HistoryTopic, right: HistoryTopic) {
  return slugify(`${left.slug}-${right.slug}`);
}

export function topicToRecommendation(topic: HistoryTopic, reason: string): RecommendationItem {
  return {
    slug: topic.slug,
    title: topic.title,
    category: topic.category,
    era: topic.era,
    region: topic.region,
    summary: topic.summary,
    reason,
    query: topic.query,
    coverTheme: topic.coverTheme || getCoverThemeForCategory(topic.category),
  };
}
