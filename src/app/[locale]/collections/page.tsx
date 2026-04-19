import CollectionsPageClient from './CollectionsPageClient';
import { getCollectionsForCurrentUser } from '@/lib/experience/server';

export default async function LocalizedCollectionsPage() {
  const collections = await getCollectionsForCurrentUser();
  return <CollectionsPageClient initialCollections={collections} />;
}
