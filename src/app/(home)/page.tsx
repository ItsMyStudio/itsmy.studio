import type { CSSProperties, ReactNode } from 'react';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import Link from 'next/link';
import { ArrowRight, Bot, FileBox, Wrench, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

type Product = {
  title: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: string;
  accentSoft: string;
};

const products: Product[] = [
  {
    title: 'ItsMyBot',
    label: 'Discord Bot',
    description: 'Self-hosted Bot with addons, scripts, and configurable Discord workflows.',
    href: '/docs/itsmybot',
    icon: Bot,
    accent: 'var(--itsmybot-color)',
    accentSoft: 'rgba(106, 78, 232, 0.12)',
  },
  {
    title: 'ItsMyConfig',
    label: 'Minecraft Plugin',
    description: 'Placeholder and MiniMessage tooling for advanced configuration in any plugin.',
    href: '/docs/itsmyconfig',
    icon: Wrench,
    accent: 'var(--itsmyconfig-color)',
    accentSoft: 'rgba(28, 118, 255, 0.12)',
  },
  {
    title: 'ItsMyConvert',
    label: 'Schematic conversion',
    description: 'A focused CLI for moving schematics across Minecraft versions without friction.',
    href: '/docs/itsmyconvert',
    icon: FileBox,
    accent: 'var(--itsmyconvert-color)',
    accentSoft: 'rgba(35, 208, 67, 0.12)',
  },
];

export const metadata: Metadata = {
  title: 'ItsMyStudio',
  description:
    'ItsMyStudio builds focused tools for Discord, Minecraft, and more.',
};

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(252,252,252,0.98)_0%,rgba(247,247,247,0.9)_46%,rgba(244,244,244,0.82)_72%,rgba(244,244,244,0.76)_100%)] dark:bg-[linear-gradient(180deg,rgba(12,12,12,0.98)_0%,rgba(11,11,11,0.92)_46%,rgba(10,10,10,0.86)_72%,rgba(10,10,10,0.8)_100%)]" />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-192 bg-[radial-gradient(circle_at_top_left,rgba(28,118,255,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(106,78,232,0.18),transparent_30%),radial-gradient(circle_at_70%_78%,rgba(35,208,67,0.14),transparent_28%)]"
        style={{
          WebkitMaskImage:
            'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.94) 52%, rgba(0,0,0,0.6) 76%, transparent 100%)',
          maskImage:
            'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.94) 52%, rgba(0,0,0,0.6) 76%, transparent 100%)',
        }}
      />
      <div
        className="absolute left-[8%] top-24 -z-10 size-56 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(28, 118, 255, 0.12)' }}
      />
      <div
        className="absolute right-[12%] top-14 -z-10 size-64 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(106, 78, 232, 0.14)' }}
      />

      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col justify-center px-6 pb-16 pt-20 sm:px-8 lg:px-10 lg:pb-20 lg:pt-24">
        <div className="max-w-4xl">
          <h1
            className={cn(
              spaceGrotesk.className,
              'mt-8 max-w-4xl text-5xl font-medium tracking-[-0.08em] text-balance sm:text-6xl lg:text-7xl'
            )}
          >
            Focused software for communities, servers, and builders.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-black/68 sm:text-lg dark:text-white/68">
            ItsMyStudio builds tools for Discord, Minecraft, and more.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <HomeLink href="/docs" tone="solid">
              Open docs
            </HomeLink>
            <HomeLink href="https://itsmy.studio/discord" tone="ghost" external>
              Join Discord
            </HomeLink>
          </div>
        </div>

        <div className="mt-16">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
              Products
            </p>
            <p className="hidden text-sm text-black/50 dark:text-white/50 sm:block">
              Three focused tools. One studio.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.title} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon;
  const style = {
    '--accent': product.accent,
    '--accent-soft': product.accentSoft,
  } as CSSProperties;

  return (
    <Link
      href={product.href}
      style={style}
      className="group rounded-[1.75rem] border border-black/10 bg-white/78 p-5 shadow-[0_24px_80px_rgba(18,18,18,0.06)] backdrop-blur-sm transition hover:-translate-y-1 hover:border-black/15 dark:border-white/10 dark:bg-white/4 dark:shadow-none dark:hover:border-white/18"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="flex size-12 items-center justify-center rounded-[1.1rem]"
          style={{
            backgroundColor: 'var(--accent-soft)',
            color: 'var(--accent)',
          }}
        >
          <Icon className="size-5" />
        </div>
        <ArrowRight className="mt-1 size-4 text-black/35 transition group-hover:translate-x-0.5 dark:text-white/35" />
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black/42 dark:text-white/42">
          {product.label}
        </p>
        <h2 className={cn(spaceGrotesk.className, 'mt-2 text-2xl tracking-[-0.05em]')}>
          {product.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-black/64 dark:text-white/64">
          {product.description}
        </p>
      </div>
    </Link>
  );
}

function HomeLink({
  children,
  href,
  tone,
  external = false,
}: {
  children: ReactNode;
  href: string;
  tone: 'solid' | 'ghost';
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition',
        tone === 'solid'
          ? 'bg-black text-white hover:bg-black/86 dark:bg-white dark:text-black dark:hover:bg-white/92'
          : 'border border-black/10 bg-white/78 text-black/78 hover:border-black/18 hover:bg-white dark:border-white/10 dark:bg-white/4 dark:text-white/78 dark:hover:border-white/18 dark:hover:bg-white/[0.07]'
      )}
    >
      {children}
      <ArrowRight className="size-4" />
    </Link>
  );
}
