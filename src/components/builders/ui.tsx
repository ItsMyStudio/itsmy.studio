'use client';

import { Check, CircleHelp } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { BuilderOption } from '@/lib/builders/core';
import { cn } from '@/lib/cn';

export const builderInputClassName =
  'h-9 w-full rounded-lg border bg-fd-background px-3 text-sm text-fd-foreground outline-none transition focus:border-fd-primary';
export const builderSelectClassName =
  'h-9 w-full rounded-lg border bg-fd-background px-3 text-sm text-fd-foreground outline-none transition focus:border-fd-primary';

export function BuilderPanel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description ? <p className="mt-1 text-sm text-fd-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function BuilderToggleField({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const inputId = useId();

  return (
    <div className='flex items-center justify-between gap-3 py-1'>
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="sr-only"
      />
      <div className="min-w-0 flex items-center gap-3">
        <label htmlFor={inputId} className="flex min-w-0 cursor-pointer items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              'flex size-5 shrink-0 items-center justify-center rounded-md border transition',
              checked
                ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground shadow-sm'
                : 'border-fd-border bg-fd-background text-transparent',
            )}
          >
            <Check className="size-3.5" />
          </span>
          <span className="truncate text-sm font-medium">{label}</span>
        </label>
        <BuilderDescriptionTip description={description} />
      </div>
    </div>
  );
}

export function BuilderIconActionButton({
  children,
  ariaLabel,
  disabled,
  onClick,
}: {
  children: ReactNode;
  ariaLabel: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(buttonVariants({ color: 'secondary', size: 'icon-xs' }), 'shrink-0')}
    >
      {children}
    </button>
  );
}

export function BuilderOptionTabs<TValue extends string>({
  value,
  onChange,
  options,
  compact = false,
}: {
  value: TValue;
  onChange: (value: TValue) => void;
  options: BuilderOption<TValue>[];
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        compact
          ? 'inline-flex flex-wrap items-center gap-1 rounded-xl border border-fd-border/70 bg-fd-secondary/20 p-1'
          : 'grid gap-2 rounded-xl border border-fd-border/70 bg-fd-secondary/20 p-1',
        compact ? 'w-fit' : options.length <= 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2',
      )}
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              compact ? 'rounded-md px-2.5 py-1 text-left transition' : 'rounded-lg px-3 py-1.5 text-left transition',
              active
                ? 'bg-fd-background shadow-sm ring-1 ring-fd-primary/25'
                : 'text-fd-muted-foreground hover:bg-fd-accent/60 hover:text-fd-foreground',
            )}
          >
            <p
              className={cn(
                'truncate text-sm font-medium leading-5',
                active ? 'text-fd-foreground' : 'text-inherit',
              )}
            >
              {option.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export function BuilderField({
  label,
  description,
  headerControl,
  children,
  direction = 'column'
}: {
  label: string;
  description?: string;
  headerControl?: ReactNode;
  children?: ReactNode;
  direction?: 'column' | 'row';
}) {
  if (direction === 'row') {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {label}
          {description ? <BuilderDescriptionTip description={description} /> : null}
        </span>
        {children ? <div className="w-fit shrink-0">{children}</div> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {label}
          {description ? <BuilderDescriptionTip description={description} /> : null}
        </span>
        {headerControl ? <div className="w-fit shrink-0">{headerControl}</div> : null}
      </div>
      {children ? children : null}
    </div>
  );
}

export function BuilderDescriptionTip({ description }: { description: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Show field description"
          className="inline-flex size-4.5 shrink-0 items-center justify-center rounded-full text-fd-muted-foreground transition hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          <CircleHelp className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-w-xs p-3 leading-6">
        {description}
      </PopoverContent>
    </Popover>
  );
}
