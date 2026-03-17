'use client';

import { Copy } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { buttonVariants } from '@/components/ui/button';
import type { BuilderOutputDefinition } from '@/lib/builders/core';
import { cn } from '@/lib/cn';
import { BuilderPanel } from './ui';

type BuilderShellSection = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function BuilderShell({
  options,
  editor,
  preview,
  output,
  outputConfig,
}: {
  options?: BuilderShellSection;
  editor: BuilderShellSection;
  preview: BuilderShellSection;
  output: string;
  outputConfig: BuilderOutputDefinition;
}) {
  const [copied, setCopied] = useState(false);

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="not-prose flex flex-col gap-6">
      <div className="flex min-w-0 flex-col gap-6">
        {options ? (
          <BuilderPanel
            title={options.title}
            description={options.description}
            action={options.action}
          >
            {options.children}
          </BuilderPanel>
        ) : null}

        <BuilderPanel
          title={editor.title}
          description={editor.description}
          action={editor.action}
        >
          {editor.children}
        </BuilderPanel>
      </div>

      <div className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-20 xl:self-start">
        <BuilderPanel
          title={preview.title}
          description={preview.description}
          action={preview.action}
        >
          {preview.children}
        </BuilderPanel>

        <BuilderPanel
          title={outputConfig.title}
          description={outputConfig.description}
          action={
            <button
              type="button"
              onClick={copyOutput}
              className={cn(buttonVariants({ color: 'secondary', size: 'sm' }), 'gap-2')}
            >
              <Copy className="size-3.5" />
              {copied ? outputConfig.copiedLabel ?? 'Copied' : outputConfig.copyLabel ?? 'Copy'}
            </button>
          }
        >
          <DynamicCodeBlock lang={outputConfig.lang ?? 'yaml'} code={output} />
        </BuilderPanel>
      </div>
    </section>
  );
}
