'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Clock3,
  Landmark,
  ScrollText,
  Sparkles,
  Swords,
  UserRound,
} from 'lucide-react';
import { useI18n } from '@/components/i18n/LocaleProvider';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import CivilizationCard from '@/components/history/CivilizationCard';
import { featuredCivilizations } from '@/data/mockTopics';
import { getExperienceCopy } from '@/i18n/experience-copy';
import { localizePath } from '@/i18n/navigation';

const categoryIcons = [UserRound, Swords, ScrollText, Landmark];
const featureIcons = [BookMarked, Sparkles, Clock3];

export default function LocalizedLandingPage() {
  const router = useRouter();
  const { dictionary, locale } = useI18n();
  const experienceCopy = getExperienceCopy(locale);
  const [searchQuery, setSearchQuery] = useState('');
  const premiumExperienceCards = [
    {
      ...experienceCopy.homePremium.cards[0],
      href: '/compare',
      icon: Sparkles,
    },
    {
      ...experienceCopy.homePremium.cards[1],
      href: '/timeline',
      icon: Clock3,
    },
    {
      ...experienceCopy.homePremium.cards[2],
      href: '/map',
      icon: Landmark,
    },
    {
      ...experienceCopy.homePremium.cards[3],
      href: '/paths',
      icon: BookMarked,
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const nextQuery = searchQuery.trim();
    if (!nextQuery) return;

    router.push(
      `${localizePath(locale, '/search')}?q=${encodeURIComponent(nextQuery)}`
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    router.push(
      `${localizePath(locale, '/search')}?q=${encodeURIComponent(suggestion)}`
    );
  };

  return (
    <>
      <Navbar />

      <main className="overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <section className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-white/10">
          <div className="absolute inset-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8q2yyH9qDAcqA0QYAzghkp8Z1haR-DaBfhHfF2gnvOYRpwM9WIkV5dvNuviVzPNRrc-3ylxBQ9TCJ45sFEz2_5G4zeaA-qsr6HupqJqBKwC5dVcGfqEzNllDW5S-9QgP071GxMxex-3gF5dvRLHz7HTRkm-K89M4TH6rTe7bGNx3IGfdRhY1ZukT0Kwk0tNbcT1NbKjEq9WkmvmDbx0oXwVP7A6X06yCBu56xYAqWrEGPGO0CxZcmwKFfXXQlmk_V5cuTRBPdXKY"
              alt="Roman ruins at twilight"
              fill
              priority
              sizes="100vw"
              className="object-cover brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/62 to-black/48" />
            <div className="museum-grid absolute inset-0 opacity-35" />
            <div className="scanner-line" />
          </div>

          <div className="relative z-10 grid gap-10 px-6 py-14 md:px-10 md:py-16 lg:grid-cols-[minmax(0,1.12fr)_380px] lg:gap-12 lg:px-14 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl"
            >
              <p className="text-[11px] uppercase tracking-[0.38em] text-primary/80">
                {dictionary.home.heroEyebrow}
              </p>
              <h1 className="text-glow mt-5 font-[family-name:var(--font-headline)] text-5xl leading-[0.95] text-on-surface sm:text-6xl lg:text-[5.5rem]">
                {dictionary.home.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-300 md:text-lg">
                {dictionary.home.heroDescription}
              </p>

              <form onSubmit={handleSearch} className="mt-8 max-w-3xl">
                <div className="vault-frame rounded-[1.75rem] p-3">
                  <div className="flex flex-col gap-3 rounded-[1.2rem] border border-white/8 bg-black/30 p-3 md:flex-row md:items-center md:p-4">
                    <div className="flex items-center gap-3 px-2 text-primary/75">
                      <BookOpen size={18} />
                      <span className="text-[11px] uppercase tracking-[0.32em] text-stone-400">
                        {dictionary.common.search}
                      </span>
                    </div>

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={dictionary.home.heroSearchPlaceholder}
                      className="w-full bg-transparent px-2 text-base text-on-surface placeholder:text-stone-500 focus:outline-none"
                    />

                    <button
                      type="submit"
                      className="rounded-[1rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110 md:px-6"
                    >
                      {dictionary.common.search}
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-6 flex flex-wrap gap-3">
                {dictionary.home.heroSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-stone-200 transition hover:border-primary/30 hover:text-primary"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="space-y-5"
            >
              <div className="vault-frame rounded-[2rem] p-6">
                <p className="text-[11px] uppercase tracking-[0.32em] text-primary/80">
                  {dictionary.home.whatYouGet}
                </p>
                <div className="mt-5 space-y-4">
                  {dictionary.home.whatYouGetItems.map((item) => (
                    <div key={item} className="flex gap-3 text-sm text-stone-300">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary/70" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {dictionary.home.stats.map((item) => (
                  <div key={item.label} className="soft-panel rounded-[1.5rem] p-5">
                    <p className="font-[family-name:var(--font-headline)] text-3xl text-primary">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm text-stone-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-7xl md:mt-20">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                {dictionary.home.categoriesEyebrow}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-headline)] text-4xl text-on-surface md:text-5xl">
                {dictionary.home.categoriesTitle}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-stone-400 md:text-base">
              {dictionary.home.categoriesDescription}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dictionary.home.categories.map((item, index) => {
              const Icon = categoryIcons[index];

              return (
                <motion.button
                  key={item.label}
                  type="button"
                  onClick={() => handleSuggestionClick(item.query)}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="group soft-panel rounded-[1.7rem] p-6 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <Icon size={18} />
                    </div>
                    <ArrowRight
                      size={17}
                      className="text-stone-500 transition-transform group-hover:translate-x-1"
                    />
                  </div>
                  <h3 className="mt-5 font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                    {item.label}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-400">
                    {item.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-7xl md:mt-24">
          <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
            <div className="soft-panel rounded-[2rem] p-7 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                {dictionary.home.whyEyebrow}
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-headline)] text-4xl leading-tight text-on-surface">
                {dictionary.home.whyTitle}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-stone-400 md:text-base">
                {dictionary.home.whyDescription}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {dictionary.home.features.map((item, index) => {
                const Icon = featureIcons[index];

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="vault-frame rounded-[1.8rem] p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-on-surface">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-stone-400">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-7xl md:mt-24">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                {experienceCopy.homePremium.eyebrow}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-headline)] text-4xl text-on-surface md:text-5xl">
                {experienceCopy.homePremium.title}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-stone-400 md:text-base">
              {experienceCopy.homePremium.description}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {premiumExperienceCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.title}
                  type="button"
                  onClick={() => router.push(localizePath(locale, card.href))}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="group soft-panel rounded-[1.8rem] p-6 text-left"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-400">
                    {card.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm text-primary transition group-hover:translate-x-0.5">
                    {experienceCopy.homePremium.open}
                    <ArrowRight size={15} />
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        <section id="collections" className="mx-auto mt-20 max-w-7xl md:mt-24">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                {dictionary.home.collectionsEyebrow}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-headline)] text-4xl text-on-surface md:text-5xl">
                {dictionary.home.collectionsTitle}
              </h2>
            </div>
            <button
              onClick={() => handleSuggestionClick('Byzantine Empire')}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary-fixed"
            >
              {dictionary.home.collectionsAction}
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {featuredCivilizations.map((civ, index) => (
              <CivilizationCard
                key={civ.id}
                name={dictionary.home.featuredCivilizations[index].name}
                era={civ.era}
                description={dictionary.home.featuredCivilizations[index].description}
                imageUrl={civ.imageUrl}
                imageAlt={civ.imageAlt}
                index={index}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-7xl md:mt-24">
          <div className="luminous-panel rounded-[2.25rem] px-7 py-10 md:px-10 md:py-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:items-center">
              <div>
                <p className="text-[11px] uppercase tracking-[0.34em] text-primary/80">
                  {dictionary.home.ctaEyebrow}
                </p>
                <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-headline)] text-4xl leading-tight text-white md:text-5xl">
                  {dictionary.home.ctaTitle}
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
                  {dictionary.home.ctaDescription}
                </p>
              </div>

              <div className="space-y-4">
                {dictionary.home.ctaSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex w-full items-center justify-between rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-4 text-left text-white/85 transition hover:bg-black/28"
                  >
                    <span>{suggestion}</span>
                    <ArrowRight size={16} className="text-primary" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
