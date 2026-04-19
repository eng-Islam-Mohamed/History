import { getTopicBySlug } from '@/lib/ai/historyService';
import TopicDetailView from '@/components/topic/TopicDetailView';
import {
  getSavedTopicForCurrentUser,
  getSavedTopicForCurrentUserById,
} from '@/lib/researches/server';

export default async function LocalizedTopicDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const savedId = typeof query.saved === 'string' ? query.saved : null;
  const topic =
    (savedId ? await getSavedTopicForCurrentUserById(savedId) : null) ??
    (await getSavedTopicForCurrentUser(slug)) ??
    getTopicBySlug(slug);

  return <TopicDetailView slug={slug} topic={topic} />;
}
