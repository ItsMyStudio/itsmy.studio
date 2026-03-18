'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { TextDisplayEditor } from '@/components/builders/message/text-display-editor';
import { SelectMenuEditor } from '@/components/builders/message/select-menu-editor';
import {
  CollapsibleEditorCard,
  NestedEditorCard,
  ReorderActions,
} from '@/components/builders/message/shared';
import {
  BuilderDescriptionTip,
  BuilderField,
  BuilderOptionTabs,
  BuilderToggleField,
  builderInputClassName,
} from '@/components/builders/ui';
import { buttonVariants } from '@/components/ui/button';
import { moveItem, removeAt, replaceAt } from '@/lib/builders/core';
import {
  MODAL_COMPONENTS,
  MODAL_INPUT_COMPONENTS,
  TEXT_INPUT_STYLES,
  createModalComponent,
  createModalInputComponent,
  createModalSelectMenuOption,
  describeModalComponent,
  formatModalComponentType,
  type AddableModalComponentType,
  type LabelComponent,
  type ModalBuilderComponent,
  type ModalInputComponentType,
  type TextInputComponent,
  type TextInputStyle,
} from '@/lib/builders/modal';
import { cn } from '@/lib/cn';

const textInputStyleOptions: { value: TextInputStyle; label: string; hint: string }[] =
  TEXT_INPUT_STYLES.map((style) => ({
    value: style,
    label: style === 'short' ? 'Short' : 'Paragraph',
    hint: style,
  }));

const modalInputOptions: { value: ModalInputComponentType; label: string; hint: string }[] =
  MODAL_INPUT_COMPONENTS.map((type) => ({
    value: type,
    label: formatModalComponentType(type),
    hint: type,
  }));

function clampInteger(value: string, min: number, max: number, fallback: number | null) {
  if (value.trim().length === 0) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}

function summarizeModalComponent(component: ModalBuilderComponent) {
  if (component.type === 'text-display') {
    const text = component.content.replace(/\s+/g, ' ').trim();
    return text.length > 0 ? text : 'No text';
  }

  const inputLabel = formatModalComponentType(component.component.type);
  const inputSummary =
    component.component.type === 'text-input'
      ? component.component.customId || 'No custom ID'
      : component.component.placeholder || component.component.customId || 'No placeholder';

  return [component.label || 'Untitled label', inputLabel, inputSummary].join(' • ');
}

function AddComponentRow({
  allowedTypes,
  onAdd,
}: {
  allowedTypes: AddableModalComponentType[];
  onAdd: (type: AddableModalComponentType) => void;
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
          {formatModalComponentType(type)}
        </button>
      ))}
    </div>
  );
}

function TextInputEditor({
  component,
  onChange,
}: {
  component: TextInputComponent;
  onChange: (component: TextInputComponent) => void;
}) {
  return (
    <NestedEditorCard>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex flex-1 items-center gap-1.5">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-fd-muted-foreground">
            Text Input
          </p>
          <BuilderDescriptionTip description={describeModalComponent('text-input')} />
        </div>
      </div>

      <div className="pt-4">
        <div className="grid gap-3 md:grid-cols-2">
          <BuilderField label="Style">
            <BuilderOptionTabs
              compact
              value={component.style}
              onChange={(style) => onChange({ ...component, style })}
              options={textInputStyleOptions}
            />
          </BuilderField>

          <BuilderField label="Custom ID">
            <input
              value={component.customId}
              onChange={(event) => onChange({ ...component, customId: event.target.value })}
              className={builderInputClassName}
              placeholder="modal_text_input"
            />
          </BuilderField>

          <BuilderField label="Placeholder">
            <input
              value={component.placeholder}
              onChange={(event) => onChange({ ...component, placeholder: event.target.value })}
              className={builderInputClassName}
              placeholder="Type your answer"
            />
          </BuilderField>

          <BuilderField label="Default Value">
            <input
              value={component.value}
              onChange={(event) => onChange({ ...component, value: event.target.value })}
              className={builderInputClassName}
              placeholder="Prefilled value"
            />
          </BuilderField>

          <BuilderField label="Min Length">
            <input
              type="number"
              min={0}
              max={4000}
              value={component.minLength ?? ''}
              onChange={(event) =>
                onChange({
                  ...component,
                  minLength: clampInteger(event.target.value, 0, 4000, component.minLength),
                })
              }
              className={builderInputClassName}
            />
          </BuilderField>

          <BuilderField label="Max Length">
            <input
              type="number"
              min={1}
              max={4000}
              value={component.maxLength ?? ''}
              onChange={(event) =>
                onChange({
                  ...component,
                  maxLength: clampInteger(event.target.value, 1, 4000, component.maxLength),
                })
              }
              className={builderInputClassName}
            />
          </BuilderField>

          <div className="md:col-span-2">
            <BuilderToggleField
              label="Required"
              description="Require the user to fill this field before submitting the modal."
              checked={component.required}
              onCheckedChange={(checked) => onChange({ ...component, required: checked })}
            />
          </div>
        </div>
      </div>
    </NestedEditorCard>
  );
}

function LabelEditor({
  component,
  onChange,
}: {
  component: LabelComponent;
  onChange: (component: LabelComponent) => void;
}) {
  function setInputType(type: ModalInputComponentType) {
    if (component.component.type === type) return;
    onChange({
      ...component,
      component: createModalInputComponent(type),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <BuilderField label="Label">
          <input
            value={component.label}
            onChange={(event) => onChange({ ...component, label: event.target.value })}
            className={builderInputClassName}
            placeholder="Question"
          />
        </BuilderField>

        <BuilderField label="Description">
          <input
            value={component.description}
            onChange={(event) => onChange({ ...component, description: event.target.value })}
            className={builderInputClassName}
            placeholder="Optional helper text"
          />
        </BuilderField>
      </div>

      <BuilderField
        label="Input"
        description="Choose the input displayed under the label."
        headerControl={
          <BuilderOptionTabs
            compact
            value={component.component.type}
            onChange={setInputType}
            options={modalInputOptions}
          />
        }
      >
        <div className="rounded-lg bg-fd-background p-2">
          {component.component.type === 'text-input' ? (
            <TextInputEditor
              component={component.component}
              onChange={(next) => onChange({ ...component, component: next })}
            />
          ) : (
            <SelectMenuEditor
              menu={component.component}
              onChange={(next) => onChange({ ...component, component: next })}
              allowRemove={false}
              collapsible={false}
              title="Select Menu"
              description="Select menu displayed inside the modal field."
              createOption={createModalSelectMenuOption}
            />
          )}
        </div>
      </BuilderField>
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
  defaultOpen = false,
}: {
  component: ModalBuilderComponent;
  onChange: (component: ModalBuilderComponent) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  defaultOpen?: boolean;
}) {
  return (
    <CollapsibleEditorCard
      label={formatModalComponentType(component.type)}
      description={describeModalComponent(component.type)}
      summary={summarizeModalComponent(component)}
      defaultOpen={defaultOpen}
      actions={
        <ReorderActions
          itemLabel="component"
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onRemove={onRemove}
        />
      }
    >
      {component.type === 'text-display' ? (
        <TextDisplayEditor component={component} onChange={onChange} />
      ) : null}

      {component.type === 'label' ? (
        <LabelEditor component={component} onChange={onChange} />
      ) : null}
    </CollapsibleEditorCard>
  );
}

export function ModalComponentListEditor({
  components,
  onChange,
}: {
  components: ModalBuilderComponent[];
  onChange: (components: ModalBuilderComponent[]) => void;
}) {
  const [lastAddedComponentId, setLastAddedComponentId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-fd-background p-2">
      {components.length > 0 ? (
        components.map((component, index) => (
          <ComponentEditor
            key={component.id}
            component={component}
            defaultOpen={component.id === lastAddedComponentId}
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
          Start by adding your first modal component.
        </div>
      )}

      <AddComponentRow
        allowedTypes={MODAL_COMPONENTS}
        onAdd={(type) => {
          const nextComponent = createModalComponent(type);
          setLastAddedComponentId(nextComponent.id);
          onChange([...components, nextComponent]);
        }}
      />
    </div>
  );
}
