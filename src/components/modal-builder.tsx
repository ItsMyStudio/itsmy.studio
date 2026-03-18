'use client';

import { useState } from 'react';
import { ModalComponentListEditor } from '@/components/builders/modal/component-list-editor';
import { ModalPreview } from '@/components/builders/modal/preview';
import { BuilderShell } from '@/components/builders/shell';
import { BuilderField, builderInputClassName } from '@/components/builders/ui';
import {
  MODAL_BUILDER_DEFINITION,
  type ModalBuilderState,
} from '@/lib/builders/modal';

function resolveNextState<T>(updater: T | ((current: T) => T), current: T) {
  return typeof updater === 'function' ? (updater as (current: T) => T)(current) : updater;
}

export function ModalBuilder({
  config: controlledConfig,
  onChange,
}: {
  config?: ModalBuilderState;
  onChange?: (config: ModalBuilderState) => void;
}) {
  const [internalConfig, setInternalConfig] = useState<ModalBuilderState>(
    MODAL_BUILDER_DEFINITION.createInitialState,
  );
  const isControlled = controlledConfig !== undefined && onChange !== undefined;
  const config = isControlled ? controlledConfig : internalConfig;

  function setConfig(updater: ModalBuilderState | ((current: ModalBuilderState) => ModalBuilderState)) {
    const next = resolveNextState(updater, config);

    if (isControlled) {
      onChange(next);
      return;
    }

    setInternalConfig(next);
  }

  const output = MODAL_BUILDER_DEFINITION.serialize(config);

  return (
    <BuilderShell
      options={{
        title: 'Modal Options',
        children: (
          <div className="grid gap-4 md:grid-cols-2">
            <BuilderField
              label="Title"
              description="The title displayed at the top of the modal."
            >
              <input
                value={config.title}
                onChange={(event) =>
                  setConfig((current) => ({ ...current, title: event.target.value }))
                }
                className={builderInputClassName}
                placeholder="Feedback Modal"
              />
            </BuilderField>

            <BuilderField
              label="Custom ID"
              description="Used to identify the modal when it is submitted."
            >
              <input
                value={config.customId}
                onChange={(event) =>
                  setConfig((current) => ({ ...current, customId: event.target.value }))
                }
                className={builderInputClassName}
                placeholder="feedback_modal"
              />
            </BuilderField>
          </div>
        ),
      }}
      editor={{
        title: 'Components',
        description: 'Add text blocks and labeled fields to shape the modal.',
        children: (
          <ModalComponentListEditor
            components={config.components}
            onChange={(components) => setConfig((current) => ({ ...current, components }))}
          />
        ),
      }}
      preview={{
        title: 'Preview',
        description: 'A simplified modal preview to check structure before copying the YAML.',
        children: <ModalPreview config={config} />,
      }}
      output={output}
      outputConfig={MODAL_BUILDER_DEFINITION.output}
    />
  );
}
