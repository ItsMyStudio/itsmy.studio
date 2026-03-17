'use client';

import { ChevronDown } from 'lucide-react';
import { previewButtonClassName, type BuilderComponent, type MessageBuilderState } from '@/lib/builders/message';
import { cn } from '@/lib/cn';

export function MessagePreview({ config }: { config: MessageBuilderState }) {
  return (
    <div className="rounded-2xl border bg-fd-background/80 p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap gap-2">
        <PreviewBadge label={config.ephemeral ? 'Ephemeral' : 'Normal'} />
        <PreviewBadge label={config.disableMentions ? 'Mentions disabled' : 'Mentions enabled'} />
      </div>

      <div className="flex flex-col gap-3">
        {config.components.length > 0 ? (
          config.components.map((component) => (
            <PreviewComponent key={component.id} component={component} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-fd-muted-foreground">
            No components yet.
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border bg-fd-card px-2.5 py-1 text-xs text-fd-muted-foreground">
      {label}
    </span>
  );
}

function PreviewComponent({
  component,
  depth = 0,
}: {
  component: BuilderComponent;
  depth?: number;
}) {
  if (component.type === 'text-display') {
    return (
      <div className="rounded-xl bg-fd-card/70 p-3">{renderTextDisplayPreview(component.content)}</div>
    );
  }

  if (component.type === 'separator') {
    return (
      <div className={component.spacing === 2 ? 'py-4' : 'py-2'}>
        {component.divider ? <div className="border-t border-fd-border" /> : null}
      </div>
    );
  }

  if (component.type === 'action-row') {
    return (
      <div className="flex flex-wrap gap-2 rounded-xl bg-fd-card/70 p-3">
        {component.components.map((child) =>
          child.type === 'button' ? (
            <button
              key={child.id}
              type="button"
              disabled={child.disabled}
              className={cn(
                'inline-flex min-h-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition',
                previewButtonClassName(child.style),
                child.disabled ? 'opacity-60' : '',
              )}
            >
              {child.emoji ? <span className="mr-2">{child.emoji}</span> : null}
              {child.label || 'Button'}
            </button>
          ) : (
            <div
              key={child.id}
              className="flex min-h-9 min-w-[220px] items-center justify-between rounded-lg border bg-fd-background px-3 text-sm text-fd-muted-foreground"
            >
              <span className="truncate">
                {child.placeholder || `Select (${child.options.length} options)`}
              </span>
              <ChevronDown className="size-4 shrink-0" />
            </div>
          ),
        )}
      </div>
    );
  }

  if (component.type === 'section') {
    return (
      <div className="flex items-start justify-between gap-3 rounded-xl bg-fd-card/70 p-3">
        <div className="min-w-0 flex-1 space-y-2">
          {component.components.map((text) => (
            <div key={text.id}>{renderTextDisplayPreview(text.content)}</div>
          ))}
        </div>

        {component.accessory ? (
          <div className="shrink-0">
            {component.accessory.type === 'button' ? (
              <button
                type="button"
                disabled={component.accessory.disabled}
                className={cn(
                  'inline-flex min-h-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition',
                  previewButtonClassName(component.accessory.style),
                  component.accessory.disabled ? 'opacity-60' : '',
                )}
              >
                {component.accessory.emoji ? (
                  <span className="mr-2">{component.accessory.emoji}</span>
                ) : null}
                {component.accessory.label || 'Accessory'}
              </button>
            ) : (
              <img
                src={component.accessory.url}
                alt=""
                className="size-16 rounded-xl border object-cover"
              />
            )}
          </div>
        ) : null}
      </div>
    );
  }

  if (component.type === 'media-gallery') {
    return (
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-fd-card/70 p-3">
        {component.items.map((item) => (
          <div key={item.id} className="relative overflow-hidden rounded-lg border bg-fd-background">
            <img src={item.url} alt="" className="aspect-video w-full object-cover" />
            {item.spoiler ? (
              <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
                Spoiler
              </span>
            ) : null}
            {item.description ? (
              <p className="border-t px-3 py-2 text-xs text-fd-muted-foreground">
                {item.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  if (component.type === 'file') {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-fd-card/70 p-3">
        <div className="flex size-10 items-center justify-center rounded-lg border bg-fd-background text-xs font-semibold">
          FILE
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{getFileLabel(component.url)}</p>
          <p className="mt-0.5 text-xs text-fd-muted-foreground">
            {component.spoiler ? 'Spoiler attachment' : 'Attachment'}
          </p>
        </div>
      </div>
    );
  }

  if (component.type === 'repeat') {
    return (
      <div className="rounded-xl border border-dashed bg-fd-card/70 p-3">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-fd-muted-foreground">
              Repeat
            </p>
            <p className="mt-1 text-sm text-fd-muted-foreground">
              data-source: {component.dataSource || 'missing'}
            </p>
          </div>
        </div>

        {depth >= 2 ? (
          <div className="rounded-lg border border-dashed px-3 py-4 text-sm text-fd-muted-foreground">
            Nested repeat preview truncated.
          </div>
        ) : component.template.length > 0 ? (
          <div className="flex flex-col gap-3">
            {component.template.map((child) => (
              <PreviewComponent key={child.id} component={child} depth={depth + 1} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed px-3 py-4 text-sm text-fd-muted-foreground">
            No template components yet.
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border bg-fd-card/70 p-3"
      style={component.color ? { borderLeftWidth: '4px', borderLeftColor: component.color } : undefined}
    >
      {component.spoiler ? (
        <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-fd-muted-foreground">
          Spoiler container
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        {component.components.map((child) => (
          <PreviewComponent key={child.id} component={child} depth={depth + 1} />
        ))}
      </div>
    </div>
  );
}

function renderTextDisplayPreview(content: string) {
  const lines = content.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        if (line.startsWith('### ')) {
          return (
            <p key={index} className="text-base font-semibold leading-6">
              {line.slice(4)}
            </p>
          );
        }

        if (line.startsWith('## ')) {
          return (
            <p key={index} className="text-lg font-semibold leading-7">
              {line.slice(3)}
            </p>
          );
        }

        if (line.startsWith('# ')) {
          return (
            <p key={index} className="text-xl font-semibold leading-8">
              {line.slice(2)}
            </p>
          );
        }

        if (!line.trim()) {
          return <div key={index} className="h-3" />;
        }

        return (
          <p key={index} className="whitespace-pre-wrap text-sm leading-6 text-fd-foreground">
            {line}
          </p>
        );
      })}
    </div>
  );
}

function getFileLabel(url: string) {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split('/').filter(Boolean).at(-1);
    return filename || url;
  } catch {
    return url || 'Untitled file';
  }
}
