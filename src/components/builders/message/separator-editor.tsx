'use client';

import { BuilderField, BuilderOptionTabs } from '@/components/builders/ui';
import type { SeparatorComponent } from '@/lib/builders/message';

export function SeparatorEditor({
  component,
  onChange,
}: {
  component: SeparatorComponent;
  onChange: (component: SeparatorComponent) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 mt-2">
      <BuilderField
        label="Spacing"
        description="1 is compact, 2 adds more vertical space."
        direction="row"
      >
        <BuilderOptionTabs
          compact
          value={String(component.spacing)}
          onChange={(value) => onChange({ ...component, spacing: Number(value) as 1 | 2 })}
          options={[
            { value: '1', label: 'Compact', hint: 'Small gap' },
            { value: '2', label: 'Large', hint: 'More space' },
          ]}
        />
      </BuilderField>
      <BuilderField
        label="Divider"
        description="Disable it if you only want empty space."
        direction="row"
      >
        <BuilderOptionTabs
          compact
          value={component.divider ? 'true' : 'false'}
          onChange={(value) => onChange({ ...component, divider: value === 'true' })}
          options={[
            { value: 'true', label: 'Visible', hint: 'Show line' },
            { value: 'false', label: 'Hidden', hint: 'Spacing only' },
          ]}
        />
      </BuilderField>
    </div>
  );
}
