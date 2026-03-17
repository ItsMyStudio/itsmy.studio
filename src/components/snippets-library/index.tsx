import { getSnippets } from '@/lib/snippets';
import { SnippetLibraryClient } from './client';

export async function SnippetLibrary({ product }: { product: string }) {
  const snippets = await getSnippets(product);

  return <SnippetLibraryClient snippets={snippets} />;
}
