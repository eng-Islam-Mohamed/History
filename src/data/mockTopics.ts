import { HistoryTopic } from '@/types';

export const mockTopics: HistoryTopic[] = [
  {
    id: 'napoleon-bonaparte',
    title: 'The Napoleonic Ascendance',
    slug: 'napoleon-bonaparte',
    query: 'Napoleon Bonaparte',
    category: 'figure',
    era: '1769 – 1821 AD',
    summary: 'From Corsican cadet to Emperor of the French, Napoleon Bonaparte reshaped the map of Europe through military genius and administrative reform, leaving a legacy that echoes through modern law, governance, and warfare.',
    fullContent: `Napoleon Bonaparte, born on August 15, 1769, in Ajaccio, Corsica, rose from modest origins to become one of the most consequential figures in Western history. His meteoric ascent through the ranks of the French military during the chaos of the Revolution was fueled by a combination of tactical brilliance, political acumen, and an almost preternatural ability to read the zeitgeist of post-revolutionary France.

His coronation as Emperor in December 1804 at Notre-Dame de Paris was a deliberate act of political theatre — by crowning himself, he signaled that his authority derived not from the Church or the old aristocracy, but from his own will and the consent of the people.

The Napoleonic Code, promulgated in 1804, remains perhaps his most enduring legacy. It swept away centuries of feudal law and established principles of civil equality, property rights, and secular governance that still form the backbone of legal systems across continental Europe and beyond.

Yet Napoleon was, above all, a soldier. His campaigns across Europe — from the sun-bleached plains of Austerlitz to the frozen wastes of Russia — rewrote the art of warfare. The Grande Armée, at its zenith, was the most formidable military instrument the world had ever seen.

His final exile to Saint Helena, a wind-swept rock in the South Atlantic, transformed him from a fallen emperor into a romantic legend — the Prometheus of the modern age, chained to his rock, dictating his memoirs to the salt wind.`,
    timelineEvents: [
      { year: '1769', title: 'Birth in Corsica', description: 'Napoleon Bonaparte is born in Ajaccio, Corsica, just one year after the island was ceded to France by the Republic of Genoa.' },
      { year: '1799', title: 'Coup of 18 Brumaire', description: 'Napoleon seizes power in a coup d\'état, establishing the Consulate and effectively ending the French Revolution.' },
      { year: '1804', title: 'Coronation as Emperor', description: 'Napoleon crowns himself Emperor of the French at Notre-Dame de Paris, establishing the First French Empire.' },
      { year: '1805', title: 'Battle of Austerlitz', description: 'Napoleon achieves his greatest military victory, defeating the combined forces of Austria and Russia in the "Battle of the Three Emperors."' },
      { year: '1812', title: 'Invasion of Russia', description: 'The catastrophic Russian campaign begins. The Grande Armée of 600,000 men enters Russia; fewer than 100,000 return.' },
      { year: '1815', title: 'Battle of Waterloo', description: 'Napoleon\'s final defeat at the hands of Wellington and Blücher marks the end of the Napoleonic era.' },
    ],
    keyFigures: [
      { name: 'Joséphine de Beauharnais', type: 'figure', shortDescription: 'First wife and Empress, a Creole aristocrat who captivated Napoleon\'s heart.', role: 'Empress Consort' },
      { name: 'Duke of Wellington', type: 'figure', shortDescription: 'The Iron Duke who orchestrated Napoleon\'s final defeat at Waterloo.', role: 'Adversary' },
      { name: 'Tsar Alexander I', type: 'figure', shortDescription: 'Russian Emperor whose alliance with Napoleon collapsed, leading to the disastrous 1812 campaign.', role: 'Rival' },
    ],
    relatedTopics: [
      { name: 'The French Revolution', type: 'event', shortDescription: 'The political upheaval that created the conditions for Napoleon\'s rise.' },
      { name: 'The Napoleonic Code', type: 'event', shortDescription: 'The civil code that standardized French law and influenced legal systems worldwide.' },
    ],
    relatedEvents: [
      { name: 'Battle of Trafalgar', type: 'conflict', shortDescription: 'Nelson\'s naval victory that ensured British dominance of the seas.' },
      { name: 'Congress of Vienna', type: 'event', shortDescription: 'The diplomatic conference that redrew the map of Europe after Napoleon\'s defeat.' },
    ],
    region: 'Europe',
    createdAt: new Date('2023-10-12').toISOString(),
    coverTheme: 'imperial-navy',
    quote: '"Impossible is a word to be found only in the dictionary of fools."',
    quoteAuthor: 'Napoleon Bonaparte',
    heroImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8q2yyH9qDAcqA0QYAzghkp8Z1haR-DaBfhHfF2gnvOYRpwM9WIkV5dvNuviVzPNRrc-3ylxBQ9TCJ45sFEz2_5G4zeaA-qsr6HupqJqBKwC5dVcGfqEzNllDW5S-9QgP071GxMxex-3gF5dvRLHz7HTRkm-K89M4TH6rTe7bGNx3IGfdRhY1ZukT0Kwk0tNbcT1NbKjEq9WkmvmDbx0oXwVP7A6X06yCBu56xYAqWrEGPGO0CxZcmwKFfXXQlmk_V5cuTRBPdXKY',
    heroImageAlt: 'Cinematic wide shot of Roman Forum ruins at twilight',
    volumeNumber: 'Vol. I',
  },
  {
    id: 'ottoman-empire',
    title: 'The Sublime Porte',
    slug: 'ottoman-empire',
    query: 'Ottoman Empire',
    category: 'empire',
    era: '1299 – 1922 AD',
    summary: 'For over six centuries, the Ottoman Empire stood as a colossus bridging Europe, Asia, and Africa. From its founding by Osman I to its dissolution after World War I, it reshaped the political, cultural, and religious landscape of three continents.',
    fullContent: `The Ottoman Empire, born from the ashes of the Seljuk Sultanate in the late thirteenth century, grew from a small Anatolian beylik into one of the largest and most enduring empires in world history. At its zenith under Suleiman the Magnificent, it controlled vast swathes of southeastern Europe, western Asia, and northern Africa.

The empire's greatest architectural achievement — the Hagia Sophia's conversion into a mosque — symbolized the Ottoman synthesis of Byzantine grandeur with Islamic elegance. This synthesis permeated every aspect of Ottoman culture, from its legal system to its cuisine.

The Janissary corps, an elite military force originally composed of converted Christian boys, became both the empire's greatest military asset and, eventually, a powerful political faction that could make or break sultans.

The slow decline of the Ottoman state — the so-called "Sick Man of Europe" — was a complex process driven by military defeats, nationalist revolts, and the inability to keep pace with European industrialization. Its final dissolution after World War I gave birth to the modern Middle East and the Republic of Turkey.`,
    timelineEvents: [
      { year: '1299', title: 'Foundation', description: 'Osman I establishes the Ottoman beylik in northwestern Anatolia.' },
      { year: '1453', title: 'Fall of Constantinople', description: 'Sultan Mehmed II conquers Constantinople, ending the Byzantine Empire and making the city the Ottoman capital.' },
      { year: '1520', title: 'Age of Suleiman', description: 'Suleiman the Magnificent begins his 46-year reign, the empire\'s golden age.' },
      { year: '1683', title: 'Siege of Vienna', description: 'The failed siege marks the beginning of Ottoman territorial retreat in Europe.' },
      { year: '1922', title: 'Abolition of the Sultanate', description: 'The Grand National Assembly abolishes the Ottoman Sultanate, ending 623 years of rule.' },
    ],
    keyFigures: [
      { name: 'Suleiman the Magnificent', type: 'figure', shortDescription: 'The longest-reigning Ottoman sultan who presided over the empire\'s golden age.', role: 'Sultan' },
      { name: 'Mehmed II', type: 'figure', shortDescription: 'The conqueror of Constantinople who transformed a beylik into an empire.', role: 'Sultan' },
    ],
    relatedTopics: [
      { name: 'Byzantine Empire', type: 'civilization', shortDescription: 'The Eastern Roman Empire that the Ottomans ultimately replaced.' },
      { name: 'Republic of Turkey', type: 'country', shortDescription: 'The modern nation-state that emerged from the Ottoman dissolution.' },
    ],
    relatedEvents: [
      { name: 'Fall of Constantinople', type: 'event', shortDescription: 'The 1453 siege that ended the medieval world and began the modern era.' },
      { name: 'World War I', type: 'conflict', shortDescription: 'The global conflict that hastened the empire\'s final collapse.' },
    ],
    region: 'Europe / Middle East / North Africa',
    createdAt: new Date('2023-11-05').toISOString(),
    coverTheme: 'royal-purple',
    quote: '"The state is a ship, and the sultan is its captain."',
    quoteAuthor: 'Ottoman Proverb',
    volumeNumber: 'Vol. II',
  },
  {
    id: 'ancient-egypt',
    title: 'Shadows of Giza',
    slug: 'ancient-egypt',
    query: 'Ancient Egypt',
    category: 'civilization',
    era: '3100 BC – 30 BC',
    summary: 'Three millennia of pharaonic rule produced some of humanity\'s most enduring monuments, a sophisticated system of writing, and a deeply complex religious worldview that continues to captivate the modern imagination.',
    fullContent: `The civilization of Ancient Egypt emerged along the fertile banks of the Nile around 3100 BC, when Upper and Lower Egypt were unified under the legendary King Narmer. For the next three thousand years, this narrow strip of green amid endless desert would produce one of the most remarkable civilizations in human history.

The pyramids of Giza, constructed during the Fourth Dynasty, remain the most visible testament to Egyptian ambition. The Great Pyramid of Khufu, originally standing at 146 meters, was the tallest structure in the world for nearly four millennia. Its construction required the organized labor of tens of thousands of workers and a level of mathematical and engineering sophistication that continues to inspire debate.

The Egyptian system of writing — hieroglyphics — was far more than a utilitarian script. It was considered a gift from Thoth, the god of knowledge, and wielded a sacred power. To write a king's name was to ensure his immortality; to erase it was to condemn him to oblivion.

The obsession with the afterlife permeated every aspect of Egyptian culture. The elaborate mummification process, the construction of vast tomb complexes, and the composition of the Book of the Dead all served a single purpose: to ensure the deceased's safe passage through the underworld and into the eternal reed fields of Aaru.`,
    timelineEvents: [
      { year: '3100 BC', title: 'Unification of Egypt', description: 'King Narmer unifies Upper and Lower Egypt, establishing the First Dynasty.' },
      { year: '2560 BC', title: 'Great Pyramid Completed', description: 'The Great Pyramid of Giza is completed for Pharaoh Khufu.' },
      { year: '1332 BC', title: 'Reign of Tutankhamun', description: 'The boy-king ascends the throne and restores traditional Egyptian religion.' },
      { year: '1274 BC', title: 'Battle of Kadesh', description: 'Ramesses II fights the Hittites in one of the largest chariot battles in history.' },
      { year: '30 BC', title: 'Death of Cleopatra', description: 'The last pharaoh dies, and Egypt becomes a province of the Roman Empire.' },
    ],
    keyFigures: [
      { name: 'Ramesses II', type: 'figure', shortDescription: 'The Great Builder, whose 66-year reign defined the New Kingdom.', role: 'Pharaoh' },
      { name: 'Cleopatra VII', type: 'figure', shortDescription: 'The last active ruler of the Ptolemaic Kingdom, famed for her intellect and diplomacy.', role: 'Pharaoh' },
    ],
    relatedTopics: [
      { name: 'Roman Empire', type: 'empire', shortDescription: 'The power that absorbed Egypt after Cleopatra\'s defeat.' },
      { name: 'Nubian Kingdoms', type: 'civilization', shortDescription: 'The southern neighbors who both traded with and rivaled Egypt.' },
    ],
    relatedEvents: [
      { name: 'Building of the Pyramids', type: 'event', shortDescription: 'The monumental construction projects of the Old Kingdom.' },
      { name: 'Amarna Revolution', type: 'event', shortDescription: 'Akhenaten\'s radical religious reformation.' },
    ],
    region: 'North Africa',
    createdAt: new Date('2023-11-05').toISOString(),
    coverTheme: 'ancient-sand',
    quote: '"I am yesterday, today, and tomorrow, for I am born again and again."',
    quoteAuthor: 'Book of the Dead',
    volumeNumber: 'Vol. III',
  },
  {
    id: 'renaissance-florence',
    title: 'The Renaissance in Florence',
    slug: 'renaissance-florence',
    query: 'Renaissance Florence',
    category: 'era',
    era: '1300 – 1600 AD',
    summary: 'A meticulous exploration into the epicenter of the human rebirth, where art, intellect, and stone converged to redefine the modern world.',
    fullContent: `Florence, in the fifteenth century, was not merely a city but an alchemical vessel. Within its narrow medieval streets, the traditional structures of the Middle Ages dissolved, replaced by a fierce resurgence of Classical antiquity. The air itself seemed thick with the scent of wet plaster and the smoke of ironworks, as the city transformed into a laboratory of human potential.

This was the age of the merchant-prince and the artisan-scholar. Prosperity from the wool trade and banking provided the fuel, but the spark was a radical shift in perspective. Linear perspective, rediscovered by Brunelleschi, did more than just revolutionize painting; it repositioned the human eye as the center of the perceived universe. No longer were figures flattened against a golden void; they stood in measurable space, anchored by shadow and light.

To walk through Florence today is to tread upon the ghosts of this tectonic shift. Every arch of the Duomo, every sculpted muscle of the David, serves as a testament to a time when mankind dared to view itself as the measure of all things.`,
    timelineEvents: [
      { year: '1401', title: 'The Competition for the Baptistery Doors', description: 'Ghiberti and Brunelleschi battle for the commission of the North Doors, marking the formal arrival of the early Renaissance aesthetic.' },
      { year: '1436', title: 'Consecration of the Duomo', description: 'Brunelleschi completes the impossible dome of Santa Maria del Fiore, a feat of engineering that defied the architectural limits of the known world.' },
      { year: '1494', title: 'The Expulsion of the Medici', description: 'Political instability and the rise of Savonarola\'s fundamentalism bring a temporary halt to the city\'s golden era of hedonistic art.' },
    ],
    keyFigures: [
      { name: 'Leonardo da Vinci', type: 'figure', shortDescription: 'Driven by an insatiable curiosity, Leonardo bridged the gap between the anatomy of the body and the mechanics of the machine.', role: 'The Polymath' },
      { name: 'Lorenzo de\' Medici', type: 'figure', shortDescription: 'The de facto ruler of the Florentine Republic and the most powerful patron of the Renaissance.', role: 'The Magnificent' },
    ],
    relatedTopics: [
      { name: 'Roman Empire', type: 'empire', shortDescription: 'The classical civilization whose rediscovery fueled the Renaissance.' },
      { name: 'Medici Banking Dynasty', type: 'dynasty', shortDescription: 'The financial powerhouse behind Florentine patronage.' },
    ],
    relatedEvents: [
      { name: 'Fall of Constantinople', type: 'event', shortDescription: 'Greek scholars fleeing 1453 brought classical texts westward.' },
      { name: 'Invention of the Printing Press', type: 'event', shortDescription: 'Gutenberg\'s press democratized knowledge across Europe.' },
    ],
    region: 'Italy',
    createdAt: new Date('2024-01-15').toISOString(),
    coverTheme: 'bronze-civilization',
    quote: '"Beauty is the adjustment of all parts proportionately so that one cannot add or subtract or change without impairing the whole."',
    quoteAuthor: 'Leon Battista Alberti',
    heroImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGwLT7zTNET65ehixH_cRJ625IVO_4cl5TcHdKlfEcmODSOMLazFQdOi5AHm7w7TR3Wp9WzbTKty4jBBcfn-yL4CkL8qbebZrjmQWq973YmT6_lNK59RmW3ezF4biaIIx3UPsEHadM8vaM22853uv7bw8a9VDqEnJ_6Ep23v-2dRGqpMpidj3Vg0sc73jD8F57Hx2o6rO3oxiixEL4gwGh2tbgiI5X0EJ2y_aSRGBIeLGvVuTqn3UKdwnCYSvumQzkUREhfROyoMs',
    heroImageAlt: 'Cinematic panorama of Florence Duomo at dusk',
    volumeNumber: 'Vol. IV',
  },
  {
    id: 'world-war-i',
    title: 'The War to End All Wars',
    slug: 'world-war-i',
    query: 'World War I',
    category: 'war',
    era: '1914 – 1918 AD',
    summary: 'The Great War shattered empires, redrew borders, and introduced mechanized slaughter on an unprecedented scale, forever altering the trajectory of the twentieth century.',
    fullContent: `The assassination of Archduke Franz Ferdinand on June 28, 1914, in Sarajevo triggered a chain reaction that engulfed the world in the most devastating conflict humanity had yet witnessed. Within weeks, the intricate web of alliances that European powers had built transformed a Balkan crisis into a global conflagration.

The Western Front became the defining theatre of horror. From the English Channel to the Swiss border, a continuous line of trenches scarred the landscape. In the mud and blood of Verdun, the Somme, and Passchendaele, an entire generation learned that industrial technology had outpaced tactical doctrine, turning warfare into mechanized attrition.

The war introduced new weapons of terrifying efficiency: the machine gun, poison gas, the tank, and the submarine. Each innovation multiplied the capacity for destruction while diminishing the individual soldier to a statistical unit of expenditure.

When the guns finally fell silent on November 11, 1918, four empires had collapsed — the German, Austro-Hungarian, Ottoman, and Russian — and the political map of Europe had been redrawn in ways that would generate conflicts for the next century.`,
    timelineEvents: [
      { year: '1914', title: 'Assassination of Archduke Franz Ferdinand', description: 'The spark that ignited the powder keg of European alliances.' },
      { year: '1915', title: 'Gallipoli Campaign', description: 'The disastrous Allied attempt to force the Dardanelles.' },
      { year: '1916', title: 'Battle of the Somme', description: '1.1 million casualties in five months of grinding attrition.' },
      { year: '1917', title: 'United States Enters the War', description: 'American intervention tips the balance in favor of the Allies.' },
      { year: '1918', title: 'Armistice', description: 'The guns fall silent on the 11th hour of the 11th day of the 11th month.' },
    ],
    keyFigures: [
      { name: 'Archduke Franz Ferdinand', type: 'figure', shortDescription: 'Heir to the Austro-Hungarian throne whose assassination triggered the war.', role: 'Catalyst' },
      { name: 'Kaiser Wilhelm II', type: 'figure', shortDescription: 'German Emperor whose ambitions and miscalculations contributed to the outbreak of war.', role: 'German Emperor' },
    ],
    relatedTopics: [
      { name: 'Treaty of Versailles', type: 'event', shortDescription: 'The peace settlement that sowed the seeds of World War II.' },
      { name: 'Ottoman Empire', type: 'empire', shortDescription: 'One of the great empires dissolved by the conflict.' },
    ],
    relatedEvents: [
      { name: 'Russian Revolution', type: 'event', shortDescription: 'The Bolshevik seizure of power that reshaped global politics.' },
      { name: 'Armenian Genocide', type: 'event', shortDescription: 'The systematic extermination during the Ottoman collapse.' },
    ],
    region: 'Global',
    createdAt: new Date('2024-01-19').toISOString(),
    coverTheme: 'oxblood-war',
    quote: '"The lamps are going out all over Europe, we shall not see them lit again in our lifetime."',
    quoteAuthor: 'Sir Edward Grey',
    volumeNumber: 'Vol. V',
  },
  {
    id: 'roman-empire',
    title: 'Pax Romana',
    slug: 'roman-empire',
    query: 'Roman Empire',
    category: 'empire',
    era: '27 BC – 476 AD',
    summary: 'From a city of seven hills to the masters of the known world, the Roman Empire established the legal, architectural, and cultural foundations upon which Western civilization would be built.',
    fullContent: `The Roman Empire, at its greatest extent under Trajan in 117 AD, encompassed some 5 million square kilometers and governed an estimated 70 million people — roughly one-quarter of the world's population. It was not merely an empire of territory; it was an empire of ideas.

Roman law, codified and systematized over centuries, established principles — the presumption of innocence, the right to a fair trial, the distinction between public and private law — that form the bedrock of modern Western legal systems. The Twelve Tables, inscribed in bronze and displayed in the Forum, represented one of humanity's earliest attempts to subject governance to the rule of written law.

The engineering achievements of Rome were equally staggering. The road network, extending over 80,000 kilometers, connected every corner of the empire. The aqueducts delivered fresh water to cities of a million inhabitants. The Colosseum, capable of seating 50,000 spectators, demonstrated a mastery of crowd management and architectural ambition that would not be equaled for nearly two millennia.`,
    timelineEvents: [
      { year: '27 BC', title: 'Augustus becomes Emperor', description: 'Octavian takes the title Augustus, marking the beginning of the Roman Empire.' },
      { year: '79 AD', title: 'Eruption of Vesuvius', description: 'The catastrophic eruption buries Pompeii and Herculaneum.' },
      { year: '117 AD', title: 'Greatest Extent', description: 'Under Trajan, the empire reaches its maximum territorial extent.' },
      { year: '313 AD', title: 'Edict of Milan', description: 'Constantine legalizes Christianity throughout the empire.' },
      { year: '476 AD', title: 'Fall of the Western Empire', description: 'Romulus Augustulus is deposed, traditionally marking the end of ancient Rome.' },
    ],
    keyFigures: [
      { name: 'Augustus Caesar', type: 'figure', shortDescription: 'The first Roman Emperor who transformed the Republic into the Empire.', role: 'Emperor' },
      { name: 'Marcus Aurelius', type: 'figure', shortDescription: 'The philosopher-emperor whose Meditations remain a cornerstone of Stoic philosophy.', role: 'Emperor' },
    ],
    relatedTopics: [
      { name: 'Byzantine Empire', type: 'empire', shortDescription: 'The eastern continuation of Roman civilization.' },
      { name: 'Renaissance Florence', type: 'era', shortDescription: 'The rediscovery of Roman ideals that sparked the modern age.' },
    ],
    relatedEvents: [
      { name: 'Fall of Constantinople', type: 'event', shortDescription: 'The end of the Eastern Roman Empire in 1453.' },
      { name: 'Punic Wars', type: 'conflict', shortDescription: 'The titanic struggle between Rome and Carthage for Mediterranean supremacy.' },
    ],
    region: 'Mediterranean',
    createdAt: new Date('2024-02-01').toISOString(),
    coverTheme: 'imperial-navy',
    quote: '"I found Rome a city of bricks and left it a city of marble."',
    quoteAuthor: 'Augustus Caesar',
    volumeNumber: 'Vol. VI',
  },
  {
    id: 'victorian-era',
    title: 'Smoke & Velvet',
    slug: 'victorian-era',
    query: 'Victorian Era',
    category: 'era',
    era: '1837 – 1901 AD',
    summary: 'The duality of smog-filled streets and the emergence of luxury textiles defined an era of industrial revolution, imperial expansion, and social transformation.',
    fullContent: `The Victorian Era, spanning the 64-year reign of Queen Victoria, witnessed the transformation of Britain from an agrarian society into the world's first industrial superpower. The period was defined by profound contradictions: staggering wealth alongside grinding poverty, revolutionary scientific progress alongside rigid social conservatism.

The Great Exhibition of 1851, housed in Joseph Paxton's revolutionary Crystal Palace, showcased British industrial might to the world. Over six million visitors marveled at displays of machinery, manufactured goods, and colonial treasures from every corner of the globe.

Yet behind the facade of progress, the industrial cities teemed with suffering. Charles Dickens' novels and the social investigations of Henry Mayhew exposed conditions in the factories and workhouses that challenged the prevailing narrative of progress.`,
    timelineEvents: [
      { year: '1837', title: 'Victoria Ascends the Throne', description: 'The 18-year-old princess becomes Queen, beginning the longest reign in British history to that point.' },
      { year: '1851', title: 'The Great Exhibition', description: 'The Crystal Palace hosts the first international exhibition of manufactured products.' },
      { year: '1859', title: 'Origin of Species', description: 'Darwin publishes his revolutionary theory, challenging centuries of religious orthodoxy.' },
      { year: '1901', title: 'Death of Victoria', description: 'The Queen dies at age 81, closing an era of transformation.' },
    ],
    keyFigures: [
      { name: 'Queen Victoria', type: 'figure', shortDescription: 'The monarch whose reign defined an era of unprecedented change.', role: 'Queen' },
      { name: 'Charles Darwin', type: 'figure', shortDescription: 'The naturalist whose theory of evolution transformed human self-understanding.', role: 'Scientist' },
    ],
    relatedTopics: [
      { name: 'British Empire', type: 'empire', shortDescription: 'The global empire that reached its zenith during Victoria\'s reign.' },
    ],
    relatedEvents: [
      { name: 'Industrial Revolution', type: 'event', shortDescription: 'The technological transformation that reshaped human civilization.' },
    ],
    region: 'United Kingdom',
    createdAt: new Date('2024-01-19').toISOString(),
    coverTheme: 'obsidian-industrial',
    quote: '"We are not interested in the possibilities of defeat; they do not exist."',
    quoteAuthor: 'Queen Victoria',
    volumeNumber: 'Vol. VII',
  },
  {
    id: 'alexander-the-great',
    title: 'The Conqueror of Worlds',
    slug: 'alexander-the-great',
    query: 'Alexander the Great',
    category: 'figure',
    era: '356 – 323 BC',
    summary: 'In just thirteen years, Alexander III of Macedon carved out one of the largest empires in ancient history, spreading Hellenistic culture from Greece to the borders of India.',
    fullContent: `Alexander the Great, born in 356 BC to King Philip II of Macedon and Olympias of Epirus, was perhaps the most successful military commander in human history. Tutored by Aristotle, he combined intellectual curiosity with unmatched martial ambition.

By the age of thirty, he had created an empire stretching from Greece to northwestern India, covering approximately 5.2 million square kilometers. His campaigns brought Greek culture, language, and thought to the East, birthing the Hellenistic Age — a period of unprecedented cultural fusion.

His death at 32, likely from fever compounded by exhaustion and heavy drinking in Babylon, left an empire without a clear successor. The Wars of the Diadochi — the struggles among his generals for control — shattered his conquests into competing kingdoms but paradoxically ensured the spread of Greek culture throughout the ancient world.`,
    timelineEvents: [
      { year: '336 BC', title: 'Ascension to the Throne', description: 'Alexander becomes King of Macedon after the assassination of his father Philip II.' },
      { year: '334 BC', title: 'Crossing the Hellespont', description: 'Alexander invades the Persian Empire, beginning his legendary eastern campaign.' },
      { year: '331 BC', title: 'Battle of Gaugamela', description: 'Decisive victory over Darius III that effectively ends the Achaemenid Empire.' },
      { year: '326 BC', title: 'Battle of the Hydaspes', description: 'Alexander defeats King Porus in India, the easternmost point of his conquests.' },
      { year: '323 BC', title: 'Death in Babylon', description: 'Alexander dies at age 32, leaving behind an empire without an heir.' },
    ],
    keyFigures: [
      { name: 'Aristotle', type: 'figure', shortDescription: 'The philosopher who tutored the young Alexander and shaped his intellectual worldview.', role: 'Mentor' },
      { name: 'Darius III', type: 'figure', shortDescription: 'The last king of the Achaemenid Persian Empire, defeated by Alexander.', role: 'Adversary' },
    ],
    relatedTopics: [
      { name: 'Ancient Greece', type: 'civilization', shortDescription: 'The culture Alexander carried to the edges of the known world.' },
      { name: 'Persian Empire', type: 'empire', shortDescription: 'The great eastern power that Alexander conquered.' },
    ],
    relatedEvents: [
      { name: 'Wars of the Diadochi', type: 'conflict', shortDescription: 'The power struggles among Alexander\'s generals after his death.' },
    ],
    region: 'Mediterranean / Near East / Central Asia',
    createdAt: new Date('2024-02-10').toISOString(),
    coverTheme: 'midnight-scholar',
    quote: '"There is nothing impossible to him who will try."',
    quoteAuthor: 'Alexander the Great',
    volumeNumber: 'Vol. VIII',
  },
];

export const featuredCivilizations = [
  {
    id: 'egypt',
    name: 'The Kingdom of Kemet',
    era: '3100 BC – 30 BC',
    description: 'An odyssey through the architecture of the afterlife and the divine pharaohs.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXGGslImw7dfKG6-2nrzyvGHoJqE5Pk4kyisgCWKrKiI0jiHyQTYRyF0KidAsAN_SXioa5PVp1aqcoNOMyEjs7kFvJs4NMh5msw2LNT0e33ixw-4O94CzsqfLFO1Dzo22YdqEclACCRn0zVLe4EWzs6SvGGMED5cv131NzpFcoNfDa7KZ0tL1xpsyGb1ZS1bgW3OP1DeSTLx15QL6UKEwcIQdWKxh-x8nbQMzmSsC3vrviRvP_i1-I6K7ZXfwRtslAgLTed8Z-CmE',
    imageAlt: 'Great Sphinx of Giza',
  },
  {
    id: 'edo',
    name: 'Edo Transcendence',
    era: '1603 – 1868 AD',
    description: 'The era of the Shogunate, the floating world, and the birth of modern Kyoto.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5IDafi5jKyfixZxKIZKvm4fUyPuzWm63WvOQyVwGcDBKw6P2fw-waUVRK-Ys-6slZXDGbSnC-xdinMMMnxQlmVH95GN-9n3jpVLUe6CEcZlGEehuiFOlaMqn7om7PS_EXhM6wzuY3mKrFYRfwQjiSn4bg3jFTyjMYS7LaVWxJgtsWhbZIfiOFGeKGDDTd04enLFWpOuVnS77OkqBnssnSULz2AMF0RJWIj5PCNE5XZDbVnU-nQsjCP5om3t3TjjUZrvte7QgyGLg',
    imageAlt: 'Japanese pagoda in Kyoto',
  },
  {
    id: 'maya',
    name: 'Celestial Architects',
    era: '2000 BC – 1500 AD',
    description: 'Decoding the astronomy and deep-jungle engineering of the Mayan kings.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXKNh98U9p2OQXyDbfjd85RumiiVkLw1DTM-rRalp7j10Er_Xlw-xae45vgbfS7TE_hCPvNqkg7mIav-TEjdqY7peVsBi0KSMzc9UMJaxdwWJKS0dcuZ12POhBpR-yl-dBE5_xtQPmofdHZS10IpnHzx4UiU6xttggQBJc6GGfg4ekll-5iAdRWMF9sVsugUzblKVn5ztELEqLyEk6Nm8_unZRPUy0J-86TXMAQZd92waxxYnqdrcSs9_JbFua9dOH4a0S6TFtJkg',
    imageAlt: 'Tikal Temple in Guatemala',
  },
];

export const suggestedSearches = [
  "Pompeii's Last Day",
  'Library of Alexandria',
  'Silk Road Secrets',
  'Kingdom of Morocco',
  'History of Algeria',
  'Hundred Years\' War',
  'Byzantine Empire',
];
