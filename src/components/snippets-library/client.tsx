'use client';

import { Suspense, startTransition, useDeferredValue, useEffect, useState, type ReactNode } from 'react';
import { Search, Share2, UserRound, X } from 'lucide-react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@/lib/cn';
import type { Snippet } from '@/lib/snippets.types';
import browserCollections from '../../../.source/browser';
import { getMDXComponents } from '@/mdx-components';

const SUGGESTED_TAGS = ['No Addons', 'Presets', 'Custom Command', 'Meta', 'Tickets'];

const snippetContentLoader = browserCollections.snippets.createClientLoader({
  component: (loaded) => {
    const MDX = loaded.default;

    return <MDX components={getMDXComponents()} />;
  },
});

type Props = {
  snippets: Snippet[];
};

export function SnippetLibraryClient({ snippets }: Props) {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [copiedLinkSlug, setCopiedLinkSlug] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    syncSelectionFromUrl();

    const handlePopState = () => {
      syncSelectionFromUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!selectedSlug) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSlug]);

  const availableTags = orderTags(
    snippets.flatMap((snippet) => snippet.tags).filter((tag) => tag.trim().length > 0),
  );
  const query = deferredSearch.trim().toLowerCase();
  const filteredSnippets = snippets.filter((snippet) => {
    const matchesTag = !activeTag || snippet.tags.includes(activeTag);
    if (!matchesTag) return false;

    if (!query) return true;

    const searchableText = [
      snippet.title,
      snippet.description
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(query);
  });

  const selectedSnippet = snippets.find((snippet) => snippet.slug === selectedSlug) ?? null;

  useEffect(() => {
    if (!selectedSnippet) return;

    void snippetContentLoader.preload(selectedSnippet.path);
  }, [selectedSnippet]);

  function syncSelectionFromUrl() {
    const params = new URLSearchParams(window.location.search);
    setSelectedSlug(params.get('snippet') ?? params.get('script'));
  }

  function updateUrl(nextSlug: string | null, mode: 'push' | 'replace' = 'push') {
    const url = new URL(window.location.href);

    if (nextSlug) url.searchParams.set('snippet', nextSlug);
    else url.searchParams.delete('snippet');
    url.searchParams.delete('script');

    const method = mode === 'replace' ? 'replaceState' : 'pushState';
    window.history[method](null, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function openSnippet(snippet: Snippet) {
    void snippetContentLoader.preload(snippet.path);
    setSelectedSlug(snippet.slug);
    updateUrl(snippet.slug);
  }

  function closeModal() {
    setSelectedSlug(null);
    updateUrl(null, 'replace');
  }

  function toggleTag(tag: string) {
    setActiveTag((current) => (current === tag ? null : tag));
  }

  async function copySnippetLink(snippet: Snippet) {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('snippet', snippet.slug);
    shareUrl.searchParams.delete('script');

    await navigator.clipboard.writeText(shareUrl.toString());
    setCopiedLinkSlug(snippet.slug);
    window.setTimeout(() => setCopiedLinkSlug((current) => (current === snippet.slug ? null : current)), 1800);
  }

  return (
    <section className="flex flex-col not-prose gap-2">
      <label className="relative w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fd-muted-foreground" />
        <input
          value={search}
          id="snippet-search"
          name="snippet-search"
          onChange={(event) => {
            const value = event.target.value;
            startTransition(() => setSearch(value));
          }}
          placeholder="Search snippets, tags..."
          className="h-11 w-full pl-9 pr-3 rounded-lg border bg-fd-secondary/50 hover:bg-fd-accent hover:text-fd-accent-foreground text-fd-muted-foreground text-sm outline-none transition focus:border-fd-primary focus:text-fd-foreground"
        />
      </label>
      {availableTags.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-4">
          {availableTags.map((tag) => {
            const isActive = activeTag === tag;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-sm transition',
                  isActive
                    ? 'border-fd-border bg-fd-primary/10 text-fd-primary'
                    : 'border-fd-border bg-fd-secondary/50 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      ) : null}

      {filteredSnippets.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 @container">
          {filteredSnippets.map((snippet) => {
            return (
              <article
                key={snippet.slug}
                role="button"
                tabIndex={0}
                onClick={() => openSnippet(snippet)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openSnippet(snippet);
                  }
                }}
                className="block rounded-xl border bg-fd-card p-4 text-fd-card-foreground transition-colors @max-lg:col-span-full hover:bg-fd-accent/80"
              >
                <div className="mb-2 flex flex-wrap gap-2 text-xs text-fd-muted-foreground">
                  <UserRound className="size-3.5" />
                  {snippet.author}
                </div>
                <div className="flex flex-col pr-14 mb-2">
                  <h3 className="not-prose mb-1 text-sm font-medium">{snippet.title}</h3>
                  <div className="min-h-10">
                    {snippet.description ? (
                      <p
                        className="min-h-10 text-sm leading-5 text-fd-muted-foreground"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {snippet.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                {snippet.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {snippet.tags.map((tag) => (
                      <TagButton
                        key={tag}
                        tag={tag}
                        showActiveState
                        active={activeTag === tag}
                        onClick={() => toggleTag(tag)}
                      />
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed bg-fd-card/40 px-5 py-10 text-center text-sm text-fd-muted-foreground">
          No snippets match your search yet.
        </div>
      )}

      {selectedSnippet ? (
        <>
          <button
            type="button"
            aria-label="Close snippet modal"
            className="fixed inset-0 z-50 backdrop-blur-xs bg-fd-overlay data-open:animate-fd-fade-in data-closed:animate-fd-fade-out"
            onClick={closeModal}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="snippet-library-title"
            className="fixed inset-x-4 top-[4vh] z-50 mx-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border bg-fd-background shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b px-5 py-4 md:px-6">
              <div>
                <p className="text-sm text-fd-muted-foreground">
                  Snippet library
                </p>
                <h3 id="snippet-library-title" className="mt-2 text-[1.75em] font-semibold">
                  {selectedSnippet.title}
                </h3>
                {selectedSnippet.description ? (
                  <p className="mt-3 max-w-3xl text-lg text-fd-muted-foreground">
                    {selectedSnippet.description}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-fd-muted-foreground">
                  <UserRound className="size-4.5" />
                  {selectedSnippet.author}
                </div>
                {selectedSnippet.tags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedSnippet.tags.map((tag) => (
                      <TagButton
                        key={tag}
                        tag={tag}
                        active={activeTag === tag}
                        onClick={() => toggleTag(tag)}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void copySnippetLink(selectedSnippet)}
                  className={cn(
                    buttonVariants({
                      color: 'secondary',
                      size: 'sm',
                    }),
                    'shrink-0 gap-2',
                  )}
                >
                  <Share2 className="size-3.5" />
                  {copiedLinkSlug === selectedSnippet.slug ? 'Copied' : 'Share'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className={cn(
                    buttonVariants({
                      color: 'secondary',
                      size: 'icon-sm',
                    }),
                    'shrink-0 rounded-full'
                  )}
                  aria-label="Close modal"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="min-h-0 overflow-y-auto">
              <div className="bg-fd-background p-5 md:p-6">
                <div className="prose max-w-none">
                  <Suspense
                    fallback={
                      <div className="text-sm text-fd-muted-foreground">
                        Loading snippet...
                      </div>
                    }
                  >
                    {snippetContentLoader.useContent(selectedSnippet.path)}
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

function TagButton({
  active,
  onClick,
  showActiveState,
  tag,
}: {
  active: boolean;
  onClick: () => void;
  showActiveState?: boolean;
  tag: string;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        'rounded-full border px-2.5 py-1 text-xs transition',
        active && showActiveState
          ? 'border-fd-border bg-fd-primary/10 text-fd-primary'
          : 'border-fd-border bg-fd-secondary/50 text-fd-muted-foreground',
        showActiveState 
          ? 'hover:bg-fd-accent hover:text-fd-accent-foreground'
          : 'cursor-default',
      )}
    >
      {tag}
    </button>
  );
}

function orderTags(tags: string[]) {
  const uniqueTags = Array.from(new Set(tags));

  return uniqueTags.sort((left, right) => {
    const leftIndex = SUGGESTED_TAGS.indexOf(left);
    const rightIndex = SUGGESTED_TAGS.indexOf(right);

    if (leftIndex !== -1 || rightIndex !== -1) {
      if (leftIndex === -1) return 1;
      if (rightIndex === -1) return -1;
      return leftIndex - rightIndex;
    }

    return left.localeCompare(right);
  });
}
