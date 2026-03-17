'use client';

import { Plus } from 'lucide-react';
import {
  BuilderDescriptionTip,
} from '@/components/builders/ui';
import { buttonVariants } from '@/components/ui/button';
import { moveItem, removeAt, replaceAt } from '@/lib/builders/core';
import {
  CONTAINER_COMPONENTS,
  TOP_LEVEL_COMPONENTS,
  createComponent,
  describeComponent,
  formatComponentType,
  type AddableComponentType,
  type BuilderComponent,
} from '@/lib/builders/message';
import { cn } from '@/lib/cn';
import { ActionRowEditor } from './action-row-editor';
import { ContainerEditor } from './container-editor';
import { FileEditor } from './file-editor';
import { MediaGalleryEditor } from './media-gallery-editor';
import { RepeatEditor } from './repeat-editor';
import { SectionEditor } from './section-editor';
import { SeparatorEditor } from './separator-editor';
import { TextDisplayEditor } from './text-display-editor';
import { ReorderActions } from './shared';

function AddComponentRow({
  allowedTypes,
  onAdd,
}: {
  allowedTypes: AddableComponentType[];
  onAdd: (type: AddableComponentType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-dashed px-4 py-3">
      {allowedTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onAdd(type)}
          className={cn(buttonVariants({ color: 'secondary', size: 'sm' }), 'gap-2')}
        >
          <Plus className="size-3.5" />
          {formatComponentType(type)}
        </button>
      ))}
    </div>
  );
}

function ComponentEditor({
  component,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp,
  canMoveDown,
}: {
  component: BuilderComponent;
  onChange: (component: BuilderComponent) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <div className="rounded-xl border border-fd-border/80 bg-fd-primary-foreground p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex flex-1 items-center gap-1.5">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-fd-muted-foreground">
            {formatComponentType(component.type)}
          </p>
          <BuilderDescriptionTip description={describeComponent(component.type)} />
        </div>

        <ReorderActions
          itemLabel="component"
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onRemove={onRemove}
        />
      </div>

      {component.type === 'text-display' ? (
        <TextDisplayEditor component={component} onChange={onChange} />
      ) : null}

      {component.type === 'separator' ? (
        <SeparatorEditor component={component} onChange={onChange} />
      ) : null}

      {component.type === 'action-row' ? (
        <ActionRowEditor component={component} onChange={onChange} />
      ) : null}

      {component.type === 'section' ? (
        <SectionEditor component={component} onChange={onChange} />
      ) : null}

      {component.type === 'container' ? (
        <ContainerEditor component={component} onChange={onChange}>
          <ComponentListEditor
            components={component.components}
            onChange={(next) => onChange({ ...component, components: next })}
            allowedTypes={CONTAINER_COMPONENTS}
            emptyLabel="Add the first component inside this container."
          />
        </ContainerEditor>
      ) : null}

      {component.type === 'media-gallery' ? (
        <MediaGalleryEditor component={component} onChange={onChange} />
      ) : null}

      {component.type === 'file' ? (
        <FileEditor component={component} onChange={onChange} />
      ) : null}

      {component.type === 'repeat' ? (
        <RepeatEditor component={component} onChange={onChange}>
          <ComponentListEditor
            components={component.template}
            onChange={(template) => onChange({ ...component, template })}
            allowedTypes={TOP_LEVEL_COMPONENTS}
            emptyLabel="Add the first component inside the repeat template."
          />
        </RepeatEditor>
      ) : null}
    </div>
  );
}

export function ComponentListEditor({
  components,
  onChange,
  allowedTypes,
  emptyLabel,
}: {
  components: BuilderComponent[];
  onChange: (components: BuilderComponent[]) => void;
  allowedTypes: AddableComponentType[];
  emptyLabel: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-fd-background p-2">
      {components.length > 0 ? (
        components.map((component, index) => (
          <ComponentEditor
            key={component.id}
            component={component}
            onChange={(next) => onChange(replaceAt(components, index, next))}
            onMoveUp={() => onChange(moveItem(components, index, index - 1))}
            onMoveDown={() => onChange(moveItem(components, index, index + 1))}
            onRemove={() => onChange(removeAt(components, index))}
            canMoveUp={index > 0}
            canMoveDown={index < components.length - 1}
          />
        ))
      ) : (
        <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-fd-muted-foreground">
          {emptyLabel}
        </div>
      )}

      <AddComponentRow
        allowedTypes={allowedTypes}
        onAdd={(type) => onChange([...components, createComponent(type)])}
      />
    </div>
  );
}
