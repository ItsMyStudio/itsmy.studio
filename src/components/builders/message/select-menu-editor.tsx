'use client';

import { BuilderField, builderInputClassName } from '@/components/builders/ui';
import { createSelectMenuOption, type SelectMenuComponent, type SelectMenuOption } from '@/lib/builders/message';
import { moveItem, removeAt, replaceAt } from '@/lib/builders/core';
import { AddItemButton, EditorHeader, NestedEditorCard, ReorderActions } from './shared';

function clampInteger(value: string, min: number, max: number, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}

function SelectMenuOptionsEditor({
  options,
  onChange,
}: {
  options: SelectMenuOption[];
  onChange: (options: SelectMenuOption[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-fd-background p-2">
      {options.map((option, index) => (
        <div key={option.id} className="rounded-lg border border-fd-border/70 p-3 bg-fd-primary-foreground">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-fd-muted-foreground">
              Option {index + 1}
            </p>
            <ReorderActions
              itemLabel="option"
              canMoveUp={index > 0}
              canMoveDown={index < options.length - 1}
              onMoveUp={() => onChange(moveItem(options, index, index - 1))}
              onMoveDown={() => onChange(moveItem(options, index, index + 1))}
              onRemove={() => onChange(removeAt(options, index))}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <BuilderField label="Label">
              <input
                value={option.label}
                onChange={(event) =>
                  onChange(replaceAt(options, index, { ...option, label: event.target.value }))
                }
                className={builderInputClassName}
                placeholder="Option label"
              />
            </BuilderField>

            <BuilderField label="Value">
              <input
                value={option.value}
                onChange={(event) =>
                  onChange(replaceAt(options, index, { ...option, value: event.target.value }))
                }
                className={builderInputClassName}
                placeholder="option_value"
              />
            </BuilderField>
          </div>
        </div>
      ))}

      <AddItemButton label="Add option" onClick={() => onChange([...options, createSelectMenuOption()])} />
    </div>
  );
}

export function SelectMenuEditor({
  menu,
  onChange,
  onRemove,
  allowRemove,
}: {
  menu: SelectMenuComponent;
  onChange: (menu: SelectMenuComponent) => void;
  onRemove?: () => void;
  allowRemove: boolean;
}) {
  return (
    <NestedEditorCard>
      <EditorHeader
        label="Select Menu"
        description="A single select menu can be placed inside an action row."
        actions={
          allowRemove ? (
            <ReorderActions itemLabel="select menu" onRemove={onRemove} />
          ) : null
        }
      />

      <div className="pt-4">
        <div className="grid gap-3 md:grid-cols-2">
          <BuilderField
            label="Custom ID"
            description="Use a `script_` prefix if you want to detect selections in scripts."
          >
            <input
              value={menu.customId}
              onChange={(event) => onChange({ ...menu, customId: event.target.value })}
              className={builderInputClassName}
              placeholder="script_select_menu"
            />
          </BuilderField>

          <BuilderField label="Placeholder">
            <input
              value={menu.placeholder}
              onChange={(event) => onChange({ ...menu, placeholder: event.target.value })}
              className={builderInputClassName}
              placeholder="Select an option"
            />
          </BuilderField>

          <BuilderField label="Min Values">
            <input
              type="number"
              min={1}
              max={25}
              value={menu.minValues}
              onChange={(event) =>
                onChange({ ...menu, minValues: clampInteger(event.target.value, 1, 25, 1) })
              }
              className={builderInputClassName}
            />
          </BuilderField>

          <BuilderField label="Max Values">
            <input
              type="number"
              min={1}
              max={25}
              value={menu.maxValues}
              onChange={(event) =>
                onChange({ ...menu, maxValues: clampInteger(event.target.value, 1, 25, 1) })
              }
              className={builderInputClassName}
            />
          </BuilderField>
        </div>

        <div className="pt-4">
          <BuilderField label="Options" description="Define the options visible inside the menu.">
            <SelectMenuOptionsEditor
              options={menu.options}
              onChange={(options) => onChange({ ...menu, options })}
            />
          </BuilderField>
        </div>
      </div>
    </NestedEditorCard>
  );
}
