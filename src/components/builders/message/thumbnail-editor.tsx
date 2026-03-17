'use client';

import { BuilderField, builderInputClassName } from '@/components/builders/ui';
import type { ThumbnailComponent } from '@/lib/builders/message';
import { EditorHeader, NestedEditorCard } from './shared';

export function ThumbnailEditor({
  thumbnail,
  onChange,
}: {
  thumbnail: ThumbnailComponent;
  onChange: (thumbnail: ThumbnailComponent) => void;
}) {
  return (
    <NestedEditorCard>
      <EditorHeader
        label="Thumbnail"
        description="Display an image accessory on the right side of the section."
        actions={
          thumbnail.url ? (
            <img src={thumbnail.url} alt="" className="size-12 rounded-lg border object-cover" />
          ) : null
        }
      />

      <div className="pt-4">
        <BuilderField label="Thumbnail URL" description="Use an image URL accessible by Discord.">
          <input
            value={thumbnail.url}
            onChange={(event) =>
              onChange({
                ...thumbnail,
                url: event.target.value,
              })
            }
            className={builderInputClassName}
            placeholder="https://example.com/image.png"
          />
        </BuilderField>
      </div>
    </NestedEditorCard>
  );
}
