'use client';

import type { ReactNode } from 'react';
import { BuilderField, BuilderToggleField, builderInputClassName } from '@/components/builders/ui';
import type { ContainerComponent } from '@/lib/builders/message';

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
          <input
            value={component.color}
            onChange={(event) => onChange({ ...component, color: event.target.value })}
            className={`${builderInputClassName} w-36`}
            placeholder="#5865F2"
          />
        </BuilderField>
        <BuilderToggleField
          label="Spoiler"
          description="Hide the container until the user clicks on it."
          checked={component.spoiler}
          variant="inline"
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
