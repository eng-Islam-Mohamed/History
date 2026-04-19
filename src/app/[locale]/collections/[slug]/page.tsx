import { notFound } from 'next/navigation';
import CollectionDetailClient from './CollectionDetailClient';
import { getCollectionBySlugForCurrentUser } from '@/lib/experience/server';

export default async function LocalizedCollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCollectionBySlugForCurrentUser(slug);

  if (!data) {
    notFound();
  }

  return <CollectionDetailClient collection={data.collection} initialItems={data.items} />;
}
