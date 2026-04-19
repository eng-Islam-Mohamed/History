import { notFound } from 'next/navigation';
import PathDetailClient from './PathDetailClient';
import { deepDivePaths } from '@/data/experience';
import { getPathProgressForCurrentUser } from '@/lib/experience/server';

export default async function LocalizedPathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = deepDivePaths.find((entry) => entry.slug === slug);

  if (!path) {
    notFound();
  }

  const progress = await getPathProgressForCurrentUser(path.slug);

  return (
    <PathDetailClient
      path={path}
      initialCompletedSteps={progress?.completed_steps ?? []}
    />
  );
}
