'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { localizePath } from '@/i18n/navigation';
import { cleanText } from '@/lib/utils';

interface CivilizationCardProps {
  name: string;
  era: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  index?: number;
  className?: string;
}

export default function CivilizationCard({
  name,
  era,
  description,
  imageUrl,
  imageAlt,
  index = 0,
  className = '',
}: CivilizationCardProps) {
  const { locale } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.72,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      <Link
        href={`${localizePath(locale, '/search')}?q=${encodeURIComponent(name)}`}
        className="group block"
      >
        <article className="soft-panel h-full rounded-[2rem]">
          <div className="relative h-64 overflow-hidden rounded-t-[2rem]">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          </div>

          <div className="p-6 md:p-7">
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary/80">
              {cleanText(era)}
            </p>
            <div className="mt-3 flex items-start justify-between gap-4">
              <h4 className="font-[family-name:var(--font-headline)] text-3xl leading-tight text-on-surface">
                {cleanText(name)}
              </h4>
              <ArrowUpRight
                size={18}
                className="mt-2 shrink-0 text-primary/75 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-stone-400 md:text-base">
              {cleanText(description)}
            </p>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
