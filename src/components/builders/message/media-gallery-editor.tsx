'use client';

import { BuilderField, BuilderToggleField, builderInputClassName } from '@/components/builders/ui';
import { createMediaGalleryItem, type MediaGalleryComponent, type MediaGalleryItem } from '@/lib/builders/message';
import { moveItem, removeAt, replaceAt } from '@/lib/builders/core';
import { AddItemButton, ReorderActions } from './shared';

function MediaGalleryItemsEditor({
  items,
  onChange,
}: {
  items: MediaGalleryItem[];
  onChange: (items: MediaGalleryItem[]) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-l border-fd-border/80 pl-4">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-fd-border/70 p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-fd-muted-foreground">
              Media Item {index + 1}
            </p>
            <ReorderActions
              itemLabel="media item"
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
              onMoveUp={() => onChange(moveItem(items, index, index - 1))}
              onMoveDown={() => onChange(moveItem(items, index, index + 1))}
              onRemove={() => onChange(removeAt(items, index))}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <BuilderField label="URL">
              <input
                value={item.url}
                onChange={(event) =>
                  onChange(replaceAt(items, index, { ...item, url: event.target.value }))
                }
                className={builderInputClassName}
                placeholder="https://example.com/image.png"
              />
            </BuilderField>

            <BuilderField label="Description">
              <input
                value={item.description}
                onChange={(event) =>
                  onChange(replaceAt(items, index, { ...item, description: event.target.value }))
                }
                className={builderInputClassName}
                placeholder="Optional description"
              />
            </BuilderField>
          </div>

          <div className="pt-3">
            <BuilderToggleField
              label="Spoiler"
              description="Hide the media until the user clicks on it."
              checked={item.spoiler}
              variant="inline"
              onCheckedChange={(checked) =>
                onChange(replaceAt(items, index, { ...item, spoiler: checked }))
              }
            />
          </div>
        </div>
      ))}

      <AddItemButton
        label="Add media item"
        onClick={() => onChange([...items, createMediaGalleryItem()])}
      />
    </div>
  );
}

export function MediaGalleryEditor({
  component,
  onChange,
}: {
  component: MediaGalleryComponent;
  onChange: (component: MediaGalleryComponent) => void;
}) {
  return (
    <BuilderField
      label="Items"
      description="Each media item can define a URL, a description, and spoiler mode."
    >
      <MediaGalleryItemsEditor
        items={component.items}
        onChange={(items) => onChange({ ...component, items })}
      />
    </BuilderField>
  );
}
