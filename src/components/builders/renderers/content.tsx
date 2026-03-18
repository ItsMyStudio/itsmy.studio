import { Fragment, type ReactNode } from 'react';
import { SimpleMarkdown, rules } from 'discord-markdown-parser';
import { cn } from '@/lib/cn';
import { resolveEmojiAsset } from './utils';

type ParsedNode = {
  type?: string;
  content?: unknown;
  target?: string;
  lang?: string;
  name?: string;
  id?: string;
  animated?: boolean;
  level?: number;
  timestamp?: string | number;
  shortcode?: string;
};

export function DiscordTextContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const shortcodeEmojiRule = {
    order: rules.twemoji.order,
    match: (source: string) => /^:([a-z0-9_+-]{1,32}):/i.exec(source),
    parse: (capture: { [index: number]: string | undefined }) => {
      return {
        type: 'shortcodeEmoji',
        shortcode: String(capture[1] ?? '').toLowerCase(),
      };
    },
  };

  const newRules = {
    ...rules,
    shortcodeEmoji: shortcodeEmojiRule,
  };

  const parser = SimpleMarkdown.parserFor(newRules);

  const parsedNodes = parser(content, { inline: true });
  const emojiNodes = parsedNodes.filter((node) =>
    ['emoji', 'twemoji', 'shortcodeEmoji'].includes(node.type ?? ''),
  );
  const jumbo =
    emojiNodes.length > 0 &&
    emojiNodes.length <= 25 &&
    parsedNodes.every(
      (node) =>
        ['emoji', 'twemoji', 'shortcodeEmoji'].includes(node.type ?? '') ||
        (node.type === 'text' &&
          typeof node.content === 'string' &&
          node.content.trim().length === 0),
    );

  return (
    <div className={cn('min-w-0 text-[15px] leading-snug text-[#dbdee1]', className)}>
      {renderNodes(parsedNodes, jumbo)}
    </div>
  );
}

function renderNodes(nodes: unknown, jumbo: boolean): ReactNode {
  if (Array.isArray(nodes)) {
    return nodes.map((node, index) => (
      <Fragment key={index}>
        {renderNode(node as ParsedNode, jumbo)}
      </Fragment>
    ));
  }

  return renderNode(nodes as ParsedNode, jumbo);
}

function renderNode(node: ParsedNode | null | undefined, jumbo: boolean): ReactNode {
  if (!node) {
    return null;
  }

  switch (node.type) {
    case 'text':
      return node.content as string;

    case 'heading': {
      const level = node.level ?? 3;
      const className =
        level <= 1
          ? 'mb-1 text-[1.5rem] font-semibold leading-8 text-white'
          : level === 2
            ? 'mb-1 text-[1.25rem] font-semibold leading-7 text-white'
            : 'mb-1 text-[1.05rem] font-semibold leading-6 text-white';

      return <div className={className}>{renderNodes(node.content, jumbo)}</div>;
    }

    case 'link':
    case 'url':
    case 'autolink':
      return (
        <a
          href={node.target}
          target="_blank"
          rel="noreferrer"
          className="text-[#00a8fc] underline-offset-2 hover:underline"
        >
          {renderNodes(node.content, jumbo)}
        </a>
      );

    case 'blockQuote':
      return (
        <div className="my-1 rounded-r-md border-l-4 border-[#4e5058] pl-3 text-[#caccce]">
          {renderNodes(node.content, jumbo)}
        </div>
      );

    case 'br':
    case 'newline':
      return <br />;

    case 'codeBlock':
      return (
        <pre className="my-2 overflow-x-auto rounded-lg border border-[#1f2124] bg-[#1e1f22] px-3 py-2 text-[13px] leading-5 text-[#f2f3f5]">
          <code>{typeof node.content === 'string' ? node.content : ''}</code>
        </pre>
      );

    case 'inlineCode':
      return (
        <code className="rounded bg-[#1e1f22] px-1 py-0.5 font-mono text-[0.92em] text-[#f2f3f5]">
          {typeof node.content === 'string' ? node.content : ''}
        </code>
      );

    case 'em':
      return <em>{renderNodes(node.content, jumbo)}</em>;

    case 'strong':
      return <strong className="font-semibold text-white">{renderNodes(node.content, jumbo)}</strong>;

    case 'underline':
      return <span className="underline">{renderNodes(node.content, jumbo)}</span>;

    case 'strikethrough':
      return <span className="line-through">{renderNodes(node.content, jumbo)}</span>;

    case 'spoiler':
      return (
        <span className="rounded bg-[#1e1f22] px-1 text-transparent [text-shadow:0_0_7px_rgba(242,243,245,0.55)]">
          {renderNodes(node.content, jumbo)}
        </span>
      );

    case 'emoji':
    case 'twemoji':
    case 'shortcodeEmoji':
      return <DiscordEmoji node={node} jumbo={jumbo} />;

    case 'timestamp': {
      const value = typeof node.timestamp === 'number' ? node.timestamp : Number(node.timestamp);
      const dateValue =
        Number.isFinite(value) && value < 10_000_000_000 ? value * 1000 : value;

      return (
        <span className="rounded bg-[#1e1f22] px-1 py-0.5 text-[0.92em] text-[#caccce]">
          {Number.isFinite(dateValue)
            ? new Date(dateValue).toLocaleString()
            : 'Invalid timestamp'}
        </span>
      );
    }

    case 'channel':
    case 'role':
    case 'user': {
      const prefix = node.type === 'channel' ? '#' : node.type === 'role' ? '@&' : '@';
      const id = node.id ?? '';
      const name = node.name ?? id;

      return (
        <span className="rounded bg-[#40456C] px-1 text-[#CCD6FE]">
          {prefix}
          {name}
        </span>
      );
    }

    default: {
      if (typeof node.content === 'string') {
        return node.content;
      }

      return renderNodes(node.content, jumbo);
    }
  }
}

function DiscordEmoji({
  node,
  jumbo,
}: {
  node: ParsedNode;
  jumbo: boolean;
}) {
  const source =
    node.type === 'emoji'
      ? resolveEmojiAsset({
          name: node.name ?? '',
          id: node.id ?? '',
          animated: node.animated ?? false,
        })
      : node.type === 'shortcodeEmoji'
        ? resolveEmojiAsset(`:${node.shortcode ?? ''}:`)
        : resolveEmojiAsset(node.name ?? '');

  if (!source) {
    if (node.type === 'shortcodeEmoji') {
      return `:${node.shortcode ?? ''}:`;
    }

    return node.name ?? null;
  }

  return (
    <img
      src={source}
      alt={node.name ?? ''}
      className={cn(
        'mx-0.5 inline-block object-contain align-[-0.22em]',
        jumbo ? 'size-12' : 'size-[1.35em]',
      )}
    />
  );
}
