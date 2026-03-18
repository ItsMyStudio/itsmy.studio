'use client';

import { useState } from 'react';
import { ComponentListEditor } from '@/components/builders/message/component-list-editor';
import { MessagePreview } from '@/components/builders/message/preview';
import { BuilderShell } from '@/components/builders/shell';
import { BuilderToggleField } from '@/components/builders/ui';
import {
  MESSAGE_BUILDER_DEFINITION,
  TOP_LEVEL_COMPONENTS,
  type MessageBuilderState,
} from '@/lib/builders/message';

function resolveNextState<T>(updater: T | ((current: T) => T), current: T) {
  return typeof updater === 'function' ? (updater as (current: T) => T)(current) : updater;
}

export function MessageBuilder({
  config: controlledConfig,
  onChange,
}: {
  config?: MessageBuilderState;
  onChange?: (config: MessageBuilderState) => void;
}) {
  const [internalConfig, setInternalConfig] = useState<MessageBuilderState>(
    MESSAGE_BUILDER_DEFINITION.createInitialState,
  );
  const isControlled = controlledConfig !== undefined && onChange !== undefined;
  const config = isControlled ? controlledConfig : internalConfig;

  function setConfig(updater: MessageBuilderState | ((current: MessageBuilderState) => MessageBuilderState)) {
    const next = resolveNextState(updater, config);

    if (isControlled) {
      onChange(next);
      return;
    }

    setInternalConfig(next);
  }

  const output = MESSAGE_BUILDER_DEFINITION.serialize(config);

  return (
    <BuilderShell
      options={{
        title: 'Message Options',
        children: (
          <div className="grid gap-4 md:grid-cols-2">
            <BuilderToggleField
              label="Ephemeral"
              description="Only works when the message is sent from an interaction."
              checked={config.ephemeral}
              onCheckedChange={(checked) =>
                setConfig((current) => ({ ...current, ephemeral: checked }))
              }
            />
            <BuilderToggleField
              label="Disable Mentions"
              description="Prevent mentions in the message from pinging users or roles."
              checked={config.disableMentions}
              onCheckedChange={(checked) =>
                setConfig((current) => ({ ...current, disableMentions: checked }))
              }
            />
          </div>
        ),
      }}
      editor={{
        title: 'Components',
        children: (
          <ComponentListEditor
            components={config.components}
            onChange={(components) => setConfig((current) => ({ ...current, components }))}
            allowedTypes={TOP_LEVEL_COMPONENTS}
            emptyLabel="Start by adding your first component."
          />
        ),
      }}
      preview={{
        title: 'Preview',
        description: 'A simplified preview to check the structure before copying the config.',
        children: <MessagePreview config={config} />,
      }}
      output={output}
      outputConfig={MESSAGE_BUILDER_DEFINITION.output}
    />
  );
}
