import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import PathCard from '@/components/experience/PathCard';
import { getExperienceCopy } from '@/i18n/experience-copy';
import { Locale } from '@/i18n/config';
import { deepDivePaths } from '@/data/experience';

interface LocalizedPathsPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function LocalizedPathsPage({
  params,
}: LocalizedPathsPageProps) {
  const { locale } = await params;
  const copy = getExperienceCopy(locale);

  return (
    <>
      <Navbar />
      <main className="overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <section className="mx-auto max-w-7xl">
          <div className="vault-frame rounded-[2.2rem] p-6 md:p-8 lg:p-10">
            <p className="text-[11px] uppercase tracking-[0.36em] text-primary/85">
              {copy.paths.eyebrow}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-headline)] text-4xl leading-tight text-on-surface md:text-6xl">
              {copy.paths.title}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-stone-400 md:text-base">
              {copy.paths.description}
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {deepDivePaths.map((path) => (
              <PathCard key={path.slug} path={path} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
