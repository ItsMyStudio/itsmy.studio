'use client';

import { builderTextareaClassName } from '@/components/builders/ui';
import type { TextDisplayComponent } from '@/lib/builders/message';

export function TextDisplayEditor({
  component,
  onChange,
}: {
  component: TextDisplayComponent;
  onChange: (component: TextDisplayComponent) => void;
}) {
  return (
    <textarea
      value={component.content}
      onChange={(event) => onChange({ ...component, content: event.target.value })}
      className={builderTextareaClassName}
      placeholder="Write your text..."
    />
  );
}
