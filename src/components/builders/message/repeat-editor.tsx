'use client';

import type { ReactNode } from 'react';
import { BuilderField, builderInputClassName } from '@/components/builders/ui';
import type { RepeatComponent } from '@/lib/builders/message';

export function RepeatEditor({
  component,
  onChange,
  children,
}: {
  component: RepeatComponent;
  onChange: (component: RepeatComponent) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <BuilderField
        label="Data Source"
        description="Example: pagination-items or any placeholder returning a list."
      >
        <input
          value={component.dataSource}
          onChange={(event) => onChange({ ...component, dataSource: event.target.value })}
          className={builderInputClassName}
          placeholder="pagination-items"
        />
      </BuilderField>
      <BuilderField
        label="Template"
        description="Template components repeated for each item in the data source."
      >
        {children}
      </BuilderField>
    </div>
  );
}
