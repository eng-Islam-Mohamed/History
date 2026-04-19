import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

export default function CollectionsRedirectPage() {
  redirect(`/${defaultLocale}/collections`);
}
