import { getTopicBySlug } from '@/lib/ai/historyService';
import TopicDetailView from '@/components/topic/TopicDetailView';
import { getSavedTopicForCurrentUser } from '@/lib/researches/server';

export default async function LocalizedTopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = (await getSavedTopicForCurrentUser(slug)) ?? getTopicBySlug(slug);

  return <TopicDetailView slug={slug} topic={topic} />;
}
