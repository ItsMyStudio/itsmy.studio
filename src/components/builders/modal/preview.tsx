'use client';

import { ChevronDown } from 'lucide-react';
import { type ModalBuilderComponent, type ModalBuilderState } from '@/lib/builders/modal';

export function ModalPreview({ config }: { config: ModalBuilderState }) {
  return (
    <div className="rounded-xl border bg-[#393A42] p-4 shadow-sm">
      <div className="rounded-[1.25rem] border bg-fd-card/70 p-4">
        <div className="mb-4">
          <p className="text-base font-semibold">{config.title || 'Untitled Modal'}</p>
          {config.customId ? (
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-fd-muted-foreground">
              {config.customId}
            </p>
          ) : null}
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
    </div>
  );
}

function PreviewComponent({ component }: { component: ModalBuilderComponent }) {
  if (component.type === 'text-display') {
    return (
      <div className="rounded-xl bg-fd-card/70 p-3">{renderTextDisplayPreview(component.content)}</div>
    );
  }

  return (
    <div className="rounded-xl bg-fd-card/70 p-3">
      <p className="text-sm font-semibold">{component.label || 'Untitled Field'}</p>
      {component.description ? (
        <p className="mt-1 text-xs leading-5 text-fd-muted-foreground">{component.description}</p>
      ) : null}

      <div className="mt-3">
        {component.component.type === 'text-input' ? (
          <div
            className={
              component.component.style === 'paragraph'
                ? 'min-h-24 rounded-lg border bg-fd-background px-3 py-2 text-sm text-fd-muted-foreground'
                : 'flex min-h-10 items-center rounded-lg border bg-fd-background px-3 text-sm text-fd-muted-foreground'
            }
          >
            {component.component.placeholder || 'Text input'}
          </div>
        ) : (
          <div className="flex min-h-10 items-center justify-between rounded-lg border bg-fd-background px-3 text-sm text-fd-muted-foreground">
            <span className="truncate">
              {component.component.placeholder || `Select (${component.component.options.length} options)`}
            </span>
            <ChevronDown className="size-4 shrink-0" />
          </div>
        )}
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
