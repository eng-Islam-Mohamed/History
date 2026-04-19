import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import CompareWorkspace from '@/components/experience/CompareWorkspace';
import {
  getCollectionsForCurrentUser,
  getComparisonRecordForCurrentUserById,
} from '@/lib/experience/server';

export default async function LocalizedComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const savedId = typeof params.saved === 'string' ? params.saved : null;
  const [collections, savedComparison] = await Promise.all([
    getCollectionsForCurrentUser(),
    savedId ? getComparisonRecordForCurrentUserById(savedId) : Promise.resolve(null),
  ]);

  return (
    <>
      <Navbar />
      <main className="overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <CompareWorkspace
          initialCollections={collections}
          initialSavedComparison={savedComparison}
        />
      </main>
      <Footer />
    </>
  );
}
