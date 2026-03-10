import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: 'itsme-to',
  repo: 'ItsMyBot',
  branch: 'main',
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'ItsMyDocs',
    },
    links: [
      {
        text: 'Blog',
        url: '/blog',
        active: 'nested-url',
      },
      {
        type: 'menu',
        text: 'Guide',
        items: [
          {
            text: 'Getting Started',
            description: 'Learn to use Fumadocs',
            url: '/docs',
          },
        ],
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}