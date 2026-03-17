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

export function MessageBuilder() {
  const [config, setConfig] = useState<MessageBuilderState>(
    MESSAGE_BUILDER_DEFINITION.createInitialState,
  );
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
        description: 'Add, reorder, and edit the building blocks of the message.',
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
