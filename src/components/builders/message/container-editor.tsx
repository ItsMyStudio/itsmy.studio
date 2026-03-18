'use client';

import type { ReactNode } from 'react';
import { BuilderField, BuilderToggleField, builderInputClassName } from '@/components/builders/ui';
import type { ContainerComponent } from '@/lib/builders/message';

function isHexColor(value: string) {
  return /^#([0-9a-fA-F]{6})$/.test(value);
}

export function ContainerEditor({
  component,
  onChange,
  children,
}: {
  component: ContainerComponent;
  onChange: (component: ContainerComponent) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <BuilderField
          label="Color"
          description="Hex color used by the container accent. Leave empty to omit it."
          direction="row"
        >
          <div className="flex items-center gap-2">
            <input
              value={component.color}
              onChange={(event) => onChange({ ...component, color: event.target.value })}
              className={`${builderInputClassName} w-36`}
              placeholder="#5865F2"
            />
            <label className="relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-fd-border bg-fd-background">
              <input
                type="color"
                value={isHexColor(component.color) ? component.color : '#5865F2'}
                onChange={(event) => onChange({ ...component, color: event.target.value })}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Pick container color"
              />

              {isHexColor(component.color) ? (
                <span
                  className="absolute inset-0"
                  style={{ backgroundColor: component.color }}
                  aria-hidden="true"
                />
              ) : (
                <>
                  <span
                    className="absolute inset-0 opacity-60"
                    aria-hidden="true"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, rgba(148,163,184,0.18) 25%, transparent 25%, transparent 50%, rgba(148,163,184,0.18) 50%, rgba(148,163,184,0.18) 75%, transparent 75%, transparent)',
                      backgroundSize: '10px 10px',
                    }}
                  />
                  <span
                    className="absolute left-1/2 top-1/2 h-0.5 w-14 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-fd-muted-foreground/70"
                    aria-hidden="true"
                  />
                </>
              )}
            </label>
          </div>
        </BuilderField>
        <BuilderToggleField
          label="Spoiler"
          description="Hide the container until the user clicks on it."
          checked={component.spoiler}
          onCheckedChange={(checked) => onChange({ ...component, spoiler: checked })}
        />
      </div>
      <BuilderField
        label="Nested Components"
        description="Containers support text, sections, action rows, galleries, files, and repeat blocks."
      >
        {children}
      </BuilderField>
    </div>
  );
}
