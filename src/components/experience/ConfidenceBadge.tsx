'use client';

import { ShieldCheck, TriangleAlert } from 'lucide-react';
import { ConfidenceMetadata } from '@/types/experience';
import { cn } from '@/lib/utils';

interface ConfidenceBadgeProps {
  confidence: ConfidenceMetadata;
  compact?: boolean;
}

export default function ConfidenceBadge({
  confidence,
  compact = false,
}: ConfidenceBadgeProps) {
  const isWarm =
    confidence.level === 'debated' ||
    confidence.level === 'uncertain' ||
    confidence.level === 'approximate';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-left',
        isWarm
          ? 'border-primary/25 bg-primary/8 text-primary'
          : 'border-secondary/20 bg-secondary/10 text-secondary',
        compact ? 'text-xs' : 'text-sm'
      )}
      title={confidence.note}
    >
      {isWarm ? <TriangleAlert size={14} /> : <ShieldCheck size={14} />}
      <span className="font-medium">{confidence.label}</span>
    </div>
  );
}
