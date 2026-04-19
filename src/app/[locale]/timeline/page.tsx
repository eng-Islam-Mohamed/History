import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import TimelineEngine from '@/components/experience/TimelineEngine';
import { mockTopics } from '@/data/mockTopics';
import { buildTimelineEvents } from '@/lib/experience/intelligence';

export default function LocalizedTimelinePage() {
  const events = mockTopics
    .flatMap((topic) => buildTimelineEvents(topic))
    .sort((a, b) => a.startYear - b.startYear);

  return (
    <>
      <Navbar />
      <main className="overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <section className="mx-auto max-w-7xl">
          <TimelineEngine
            events={events}
            title="World history through clustered turning points"
            description="This shared timeline engine powers topic pages, compare mode, and deep-dive paths. Use it here as a global surface for political, cultural, military, and civilizational shifts."
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
