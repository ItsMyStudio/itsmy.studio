'use client';

import { DiscordModalRenderer } from '@/components/builders/renderers';
import { buildGeneratedModalConfig } from '@/components/builders/renderers/generated';
import type { ModalBuilderState } from '@/lib/builders/modal';

export function ModalPreview({ config }: { config: ModalBuilderState }) {
  return <DiscordModalRenderer config={buildGeneratedModalConfig(config)} />;
}
