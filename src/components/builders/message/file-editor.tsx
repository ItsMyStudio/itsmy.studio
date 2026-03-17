'use client';

import { BuilderField, BuilderToggleField, builderInputClassName } from '@/components/builders/ui';
import type { FileComponent } from '@/lib/builders/message';

export function FileEditor({
  component,
  onChange,
}: {
  component: FileComponent;
  onChange: (component: FileComponent) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <BuilderField label="URL" description="Use a public URL accessible by Discord.">
        <input
          value={component.url}
          onChange={(event) => onChange({ ...component, url: event.target.value })}
          className={builderInputClassName}
          placeholder="https://example.com/file.png"
        />
      </BuilderField>
      <BuilderToggleField
        label="Spoiler"
        description="Hide the file until the user clicks on it."
        checked={component.spoiler}
        variant="inline"
        onCheckedChange={(checked) => onChange({ ...component, spoiler: checked })}
      />
    </div>
  );
}
