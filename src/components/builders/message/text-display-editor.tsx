'use client';

import { useLayoutEffect, useRef } from 'react';
import type { TextDisplayComponent } from '@/lib/builders/message';

export function TextDisplayEditor({
  component,
  onChange,
}: {
  component: TextDisplayComponent;
  onChange: (component: TextDisplayComponent) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = '0px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [component.content]);

  return (
    <textarea
      ref={textareaRef}
      value={component.content}
      onChange={(event) => onChange({ ...component, content: event.target.value })}
      rows={1}
      className="w-full resize-none overflow-hidden rounded-lg border bg-fd-background mt-2 px-3 py-2 -mb-1.5 text-sm text-fd-foreground outline-none transition focus:border-fd-primary"
      placeholder="Write your text..."
    />
  );
}
