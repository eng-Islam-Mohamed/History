'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookmarkPlus, PencilLine, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { getExperienceCopy } from '@/i18n/experience-copy';
import {
  createTopicBookmarkForCurrentUser,
  createTopicNoteForCurrentUser,
  deleteTopicBookmarkForCurrentUser,
  deleteTopicNoteForCurrentUser,
  getTopicAnnotationsForCurrentUser,
  updateTopicNoteForCurrentUser,
} from '@/lib/experience/browser';
import { TopicBookmark, TopicNote } from '@/types/experience';

interface TopicNotebookPanelProps {
  topicSlug: string;
  topicTitle: string;
  savedResearchId?: string | null;
  sections: Array<{ key: string; label: string }>;
}

export default function TopicNotebookPanel({
  topicSlug,
  topicTitle,
  savedResearchId,
  sections,
}: TopicNotebookPanelProps) {
  const { isAuthenticated } = useAuth();
  const { locale } = useI18n();
  const copy = getExperienceCopy(locale);
  const [notes, setNotes] = useState<TopicNote[]>([]);
  const [bookmarks, setBookmarks] = useState<TopicBookmark[]>([]);
  const [draft, setDraft] = useState('');
  const [sectionKey, setSectionKey] = useState(sections[0]?.key ?? 'overview');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function load() {
      const result = await getTopicAnnotationsForCurrentUser(topicSlug);
      if (!result.error) {
        setNotes(result.notes);
        setBookmarks(result.bookmarks);
      }
    }

    void load();
  }, [isAuthenticated, topicSlug]);

  const bookmarkLookup = useMemo(
    () => new Set(bookmarks.map((bookmark) => bookmark.sectionKey)),
    [bookmarks]
  );

  if (!isAuthenticated) {
    return null;
  }

  async function handleSaveNote() {
    if (!draft.trim()) {
      return;
    }

    if (editingId) {
      const result = await updateTopicNoteForCurrentUser(editingId, draft);
      if (!result.error && result.note) {
        setNotes((current) =>
          current.map((note) => (note.id === result.note?.id ? result.note : note))
        );
      }
    } else {
      const result = await createTopicNoteForCurrentUser({
        topicSlug,
        topicTitle,
        savedResearchId,
        sectionKey,
        content: draft,
      });

      if (!result.error && result.note) {
        setNotes((current) => [result.note!, ...current]);
      }
    }

    setDraft('');
    setEditingId(null);
  }

  async function handleDeleteNote(id: string) {
    const result = await deleteTopicNoteForCurrentUser(id);
    if (!result.error) {
      setNotes((current) => current.filter((note) => note.id !== id));
    }
  }

  async function toggleBookmark(nextSectionKey: string) {
    const existing = bookmarks.find((bookmark) => bookmark.sectionKey === nextSectionKey);

    if (existing) {
      const result = await deleteTopicBookmarkForCurrentUser(existing.id);
      if (!result.error) {
        setBookmarks((current) =>
          current.filter((bookmark) => bookmark.id !== existing.id)
        );
      }
      return;
    }

    const result = await createTopicBookmarkForCurrentUser({
      topicSlug,
      topicTitle,
      savedResearchId,
      sectionKey: nextSectionKey,
    });

    if (!result.error && result.bookmark) {
      setBookmarks((current) => [result.bookmark!, ...current]);
    }
  }

  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_320px]">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
            {copy.topic.notes}
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
            Research notebook
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)_auto]">
          <select
            value={sectionKey}
            onChange={(event) => setSectionKey(event.target.value)}
            className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface focus:border-primary/40 focus:outline-none"
          >
            {sections.map((section) => (
              <option key={section.key} value={section.key} className="bg-surface text-on-surface">
                {section.label}
              </option>
            ))}
          </select>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={4}
            placeholder={copy.topic.notePlaceholder}
            className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base leading-relaxed text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSaveNote}
            className="rounded-[1.2rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
          >
            {editingId ? copy.topic.updateNote : copy.topic.saveNote}
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4"
            >
              <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
                {note.sectionKey || 'general'}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-300">{note.content}</p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDraft(note.content);
                    setSectionKey(note.sectionKey || sectionKey);
                    setEditingId(note.id);
                  }}
                  className="inline-flex items-center gap-2 text-sm text-primary transition hover:text-primary-fixed"
                >
                  <PencilLine size={15} />
                  {copy.topic.updateNote}
                </button>
                <button
                  type="button"
                  onClick={() => void handleDeleteNote(note.id)}
                  className="inline-flex items-center gap-2 text-sm text-stone-400 transition hover:text-error"
                >
                  <Trash2 size={15} />
                  {copy.topic.deleteNote}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
          {copy.topic.bookmarks}
        </p>
        <div className="mt-6 space-y-3">
          {sections.map((section) => {
            const isBookmarked = bookmarkLookup.has(section.key);
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => void toggleBookmark(section.key)}
                className="flex w-full items-center justify-between rounded-[1.2rem] border border-white/8 bg-black/20 px-4 py-3 text-left text-sm text-stone-300 transition hover:border-primary/25"
              >
                <span>{section.label}</span>
                <BookmarkPlus
                  size={16}
                  className={isBookmarked ? 'text-primary' : 'text-stone-500'}
                />
              </button>
            );
          })}
        </div>
      </aside>
    </section>
  );
}
