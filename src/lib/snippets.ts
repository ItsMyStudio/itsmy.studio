import { snippets as snippetCollection } from 'fumadocs-mdx:collections/server';
import type { Snippet } from './snippets.types';

export async function getSnippets(product: string): Promise<Snippet[]> {
  const prefix = `${product}/`;
  const snippets = await Promise.all(
    snippetCollection
      .filter((entry) => entry.info.path.startsWith(prefix))
      .map(async (entry) => ({
        path: entry.info.path,
        slug: entry.info.path.slice(prefix.length).replace(/\.(md|mdx)$/u, ''),
        title: entry.title,
        description: entry.description ?? '',
        author: entry.author,
        content: await entry.getText('processed'),
        tags: entry.tags,
      })),
  );

  return snippets.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
}
