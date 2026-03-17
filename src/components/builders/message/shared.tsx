'use client';

import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  BuilderDescriptionTip,
  BuilderIconActionButton,
} from '@/components/builders/ui';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';

export function NestedEditorCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-lg border border-fd-border/70 bg-fd-primary-foreground p-3', className)}>
      {children}
    </div>
  );
}

export function EditorHeader({
  label,
  description,
  actions,
}: {
  label: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex flex-1 items-center gap-1.5 text-left">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-fd-muted-foreground">
          {label}
        </p>
        {description ? <BuilderDescriptionTip description={description} /> : null}
      </div>
      {actions}
    </div>
  );
}

export function ReorderActions({
  itemLabel,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  itemLabel: string;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {onMoveUp ? (
        <BuilderIconActionButton
          ariaLabel={`Move ${itemLabel} up`}
          disabled={!canMoveUp}
          onClick={onMoveUp}
        >
          <ChevronUp className="size-4" />
        </BuilderIconActionButton>
      ) : null}
      {onMoveDown ? (
        <BuilderIconActionButton
          ariaLabel={`Move ${itemLabel} down`}
          disabled={!canMoveDown}
          onClick={onMoveDown}
        >
          <ChevronDown className="size-4" />
        </BuilderIconActionButton>
      ) : null}
      {onRemove ? (
        <BuilderIconActionButton ariaLabel={`Remove ${itemLabel}`} onClick={onRemove}>
          <Trash2 className="size-4" />
        </BuilderIconActionButton>
      ) : null}
    </div>
  );
}

export function AddItemButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(buttonVariants({ color: 'secondary', size: 'sm' }), 'gap-2 self-start')}
    >
      <Plus className="size-3.5" />
      {label}
    </button>
  );
}
