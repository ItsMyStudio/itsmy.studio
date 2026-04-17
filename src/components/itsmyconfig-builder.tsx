'use client';

import { ChevronRight, Clipboard, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'fumadocs-ui/components/ui/collapsible';
import { ItsMyConfigPreview } from '@/components/builders/itsmyconfig/preview';
import { BuilderShell } from '@/components/builders/shell';
import {
  BuilderField,
  BuilderOptionTabs,
  BuilderToggleField,
  builderInputClassName,
  builderSelectClassName,
} from '@/components/builders/ui';
import { cn } from '@/lib/cn';
import {
  createItsMyConfigStateFromPreset,
  createInitialItsMyConfigState,
  deserializeItsMyConfigConfig,
  ITSMYCONFIG_BUILDER_DEFINITION,
  ITSMYCONFIG_BUILDER_PRESETS,
  ITSMYCONFIG_VIEW_OPTIONS,
  isItsMyConfigPlaceholderVisible,
  type ItsMyConfigBuilderState,
  type ItsMyConfigPlaceholder,
  type ItsMyConfigPreviewView,
} from '@/lib/builders/itsmyconfig';

function resolveNextState<T>(updater: T | ((current: T) => T), current: T) {
  return typeof updater === 'function' ? (updater as (current: T) => T)(current) : updater;
}

export function ItsMyConfigBuilder({
  config: controlledConfig,
  onChange,
}: {
  config?: ItsMyConfigBuilderState;
  onChange?: (config: ItsMyConfigBuilderState) => void;
}) {
  const [internalConfig, setInternalConfig] = useState<ItsMyConfigBuilderState>(
    createInitialItsMyConfigState,
  );
  const [activeView, setActiveView] = useState<ItsMyConfigPreviewView>('chat');
  const [selectedPresetId, setSelectedPresetId] = useState(ITSMYCONFIG_BUILDER_PRESETS[0]?.id ?? 'default');
  const [openPlaceholders, setOpenPlaceholders] = useState<Record<string, boolean>>(() =>
    createPlaceholderOpenState(controlledConfig?.placeholders ?? createInitialItsMyConfigState().placeholders),
  );
  const [importState, setImportState] = useState<{ tone: 'success' | 'error'; message: string } | null>(
    null,
  );
  const isControlled = controlledConfig !== undefined && onChange !== undefined;
  const config = isControlled ? controlledConfig : internalConfig;
  const visiblePlaceholderEntries = config.placeholders.flatMap((placeholder, index) =>
    isItsMyConfigPlaceholderVisible(placeholder) ? [{ placeholder, index }] : [],
  );

  function setConfig(
    updater: ItsMyConfigBuilderState | ((current: ItsMyConfigBuilderState) => ItsMyConfigBuilderState),
  ) {
    const next = resolveNextState(updater, config);

    if (isControlled) {
      onChange(next);
      return;
    }

    setInternalConfig(next);
  }

  function replacePlaceholder(index: number, nextPlaceholder: ItsMyConfigPlaceholder) {
    setConfig((current) => ({
      ...current,
      placeholders: current.placeholders.map((placeholder, placeholderIndex) =>
        placeholderIndex === index ? nextPlaceholder : placeholder,
      ),
    }));
  }

  async function importFromClipboard() {
    try {
      const yaml = await navigator.clipboard.readText();

      if (!yaml.trim()) {
        throw new Error('Clipboard is empty.');
      }

      const { load } = await import('js-yaml');
      const parsed = load(yaml);
      const importedState = deserializeItsMyConfigConfig(parsed);
      setConfig((current) => ({
        ...current,
        ...importedState,
        templates: current.templates,
      }));
      setOpenPlaceholders(createPlaceholderOpenState(importedState.placeholders));
      setImportState({ tone: 'success', message: 'Placeholder YAML imported from clipboard.' });
    } catch {
      setImportState({
        tone: 'error',
        message: 'Unable to import this YAML. Paste a valid ItsMyConfig placeholder file.',
      });
    }

    window.setTimeout(() => setImportState(null), 2600);
  }

  function resetDefaults() {
    const nextState = createInitialItsMyConfigState();
    setConfig((current) => ({
      ...nextState,
      templates: current.templates,
    }));
    setOpenPlaceholders(createPlaceholderOpenState(nextState.placeholders));
    setImportState({ tone: 'success', message: 'Default placeholders restored.' });
    window.setTimeout(() => setImportState(null), 2200);
  }

  function applyPreset() {
    const preset = ITSMYCONFIG_BUILDER_PRESETS.find((entry) => entry.id === selectedPresetId);
    const nextState = createItsMyConfigStateFromPreset(selectedPresetId);

    setConfig(nextState);
    setOpenPlaceholders(createPlaceholderOpenState(nextState.placeholders));
    setImportState({
      tone: 'success',
      message: preset ? `Preset "${preset.label}" applied.` : 'Preset applied.',
    });
    window.setTimeout(() => setImportState(null), 2200);
  }

  const output = ITSMYCONFIG_BUILDER_DEFINITION.serialize(config);

  return (
    <BuilderShell
      options={{
        title: 'Builder Options',
        description: 'Import or reset default placeholders before copying the generated YAML.',
        action: (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={importFromClipboard}
              className={cn(buttonVariants({ color: 'secondary', size: 'sm' }), 'gap-2')}
            >
              <Clipboard className="size-3.5" />
              Import clipboard
            </button>
            <button
              type="button"
              onClick={resetDefaults}
              className={cn(buttonVariants({ color: 'secondary', size: 'sm' }), 'gap-2')}
            >
              <RotateCcw className="size-3.5" />
              Reset defaults
            </button>
          </div>
        ),
        children: (
          <div className="flex flex-col gap-4">
            <BuilderField
              label="Preset"
              description="Apply ready config data. Add more presets in `src/lib/builders/itsmyconfig.ts`."
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={selectedPresetId}
                  onChange={(event) => setSelectedPresetId(event.target.value)}
                  className={builderSelectClassName}
                >
                  {ITSMYCONFIG_BUILDER_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={applyPreset}
                  className={cn(buttonVariants({ color: 'secondary', size: 'sm' }), 'shrink-0')}
                >
                  Apply preset
                </button>
              </div>
            </BuilderField>

            {importState ? (
              <p
                className={cn(
                  'text-sm',
                  importState.tone === 'error' ? 'text-red-600' : 'text-emerald-600',
                )}
              >
                {importState.message}
              </p>
            ) : null}
          </div>
        ),
      }}
      editor={{
        title: 'Placeholders & Examples',
        description: 'The example snippets are already there. Change values and adjust the fixed templates.',
        children: (
          <div className="grid gap-3">
            {visiblePlaceholderEntries.map(({ placeholder, index }) => (
              <PlaceholderCard
                key={placeholder.id}
                placeholder={placeholder}
                open={openPlaceholders[placeholder.id] ?? false}
                onOpenChange={(open) =>
                  setOpenPlaceholders((current) => ({
                    ...current,
                    [placeholder.id]: open,
                  }))
                }
                onChange={(nextPlaceholder) => replacePlaceholder(index, nextPlaceholder)}
              />
            ))}
          </div>
        ),
      }}
      preview={{
        title: 'Minecraft Preview',
        children: (
          <div className="grid gap-3">
            <BuilderOptionTabs
              value={activeView}
              onChange={setActiveView}
              options={ITSMYCONFIG_VIEW_OPTIONS}
              compact
            />

            <ItsMyConfigPreview state={config} view={activeView} />
          </div>
        ),
      }}
      output={output}
      outputConfig={ITSMYCONFIG_BUILDER_DEFINITION.output}
    />
  );
}

function PlaceholderCard({
  placeholder,
  open,
  onOpenChange,
  onChange,
}: {
  placeholder: ItsMyConfigPlaceholder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (placeholder: ItsMyConfigPlaceholder) => void;
}) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <div className="rounded-xl border border-fd-border/70 bg-fd-background p-3">
        <div className="flex items-start gap-2">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              aria-label={open ? `Collapse ${placeholder.id}` : `Expand ${placeholder.id}`}
              className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md text-fd-muted-foreground transition hover:bg-fd-accent/60 hover:text-fd-foreground"
            >
              <ChevronRight className={cn('size-4 transition-transform', open && 'rotate-90')} />
            </button>
          </CollapsibleTrigger>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <h4 className="text-sm font-semibold">{placeholder.id}</h4>
              {placeholder.description ? (
                <p className="text-xs text-fd-muted-foreground">{placeholder.description}</p>
              ) : null}
            </div>

            {!open ? (
              <p className="mt-1 truncate text-xs text-fd-muted-foreground">
                {getPlaceholderSummary(placeholder)}
              </p>
            ) : null}
          </div>
        </div>

        <CollapsibleContent className="pt-3">
          {placeholder.type === 'string' || placeholder.type === 'colored_text' ? (
            <textarea
              value={placeholder.value}
              onChange={(event) => onChange({ ...placeholder, value: event.target.value })}
              className={cn(builderInputClassName, 'min-h-[72px] py-2 leading-5 resize-y')}
              spellCheck={false}
              aria-label={`${placeholder.id} value`}
            />
          ) : null}

          {placeholder.type === 'color' ? (
            <div className="grid gap-3">
              <input
                value={placeholder.value}
                onChange={(event) => onChange({ ...placeholder, value: event.target.value })}
                className={builderInputClassName}
                spellCheck={false}
                placeholder="yellow"
                aria-label={`${placeholder.id} color`}
              />

              <div className="grid gap-2 md:grid-cols-2">
                <BuilderToggleField
                  label="Bold"
                  description="Adds `<bold>` to the opening color tag."
                  checked={placeholder.bold}
                  onCheckedChange={(bold) => onChange({ ...placeholder, bold })}
                />
                <BuilderToggleField
                  label="Italic"
                  description="Adds `<italic>` to the opening color tag."
                  checked={placeholder.italic}
                  onCheckedChange={(italic) => onChange({ ...placeholder, italic })}
                />
                <BuilderToggleField
                  label="Underlined"
                  description="Adds `<underlined>` to the opening color tag."
                  checked={placeholder.underlined}
                  onCheckedChange={(underlined) => onChange({ ...placeholder, underlined })}
                />
                <BuilderToggleField
                  label="Strikethrough"
                  description="Adds `<strikethrough>` to the opening color tag."
                  checked={placeholder.strikethrough}
                  onCheckedChange={(strikethrough) => onChange({ ...placeholder, strikethrough })}
                />
              </div>
            </div>
          ) : null}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function createPlaceholderOpenState(placeholders: ItsMyConfigPlaceholder[], open = false) {
  return placeholders.reduce<Record<string, boolean>>((state, placeholder) => {
    if (isItsMyConfigPlaceholderVisible(placeholder)) {
      state[placeholder.id] = open;
    }

    return state;
  }, {});
}

function getPlaceholderSummary(placeholder: ItsMyConfigPlaceholder) {
  switch (placeholder.type) {
    case 'string':
    case 'colored_text':
    case 'color':
      return placeholder.value;
  }
}