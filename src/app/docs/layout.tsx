import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout 
      tree={source.getPageTree()} 
      {...baseOptions()}
      sidebar={{
        tabs: [
          {
            title: 'ItsMyBot',
            description: 'Hello World!',
            // active for `/docs/components` and sub routes like `/docs/components/button`
            url: '/docs/itsmybot',

            // optionally, you can specify a set of urls which activates the item
            // urls: new Set(['/docs/test', '/docs/components']),
          },
          {
            title: 'ItsMyConfig',
            description: 'Hello World!',
            // active for `/docs/components` and sub routes like `/docs/components/button`
            url: '/docs/itsmyconfig',

            // optionally, you can specify a set of urls which activates the item
            // urls: new Set(['/docs/test', '/docs/components']),
          },
        ],
      }}
    >
      {children}
    </DocsLayout>
  );
}