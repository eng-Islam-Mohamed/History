import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import TimelineEngine from '@/components/experience/TimelineEngine';
import { Locale } from '@/i18n/config';
import { getExperienceCopy } from '@/i18n/experience-copy';
import { mockTopics } from '@/data/mockTopics';
import { buildTimelineEvents } from '@/lib/experience/intelligence';

interface LocalizedTimelinePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function LocalizedTimelinePage({
  params,
}: LocalizedTimelinePageProps) {
  const { locale } = await params;
  const copy = getExperienceCopy(locale);
  const events = mockTopics
    .flatMap((topic) => buildTimelineEvents(topic, locale))
    .sort((a, b) => a.startYear - b.startYear);

  return (
    <>
      <Navbar />
      <main className="overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <section className="mx-auto max-w-7xl">
          <TimelineEngine
            events={events}
            title={copy.timeline.title}
            description={copy.timeline.description}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
