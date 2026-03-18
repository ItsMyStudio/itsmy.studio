export type BuilderOutputDefinition = {
  title: string;
  description: string;
  lang?: string;
};

export type BuilderDefinition<TState> = {
  kind: string;
  label: string;
  description?: string;
  output: BuilderOutputDefinition;
  createInitialState: () => TState;
  serialize: (state: TState) => string;
};

export type BuilderOption<TValue extends string = string> = {
  value: TValue;
  label: string;
  hint?: string;
};

export function createIdFactory(start = 0) {
  let idCounter = start;

  return (prefix: string) => {
    idCounter += 1;
    return `${prefix}-${idCounter}`;
  };
}

export function replaceAt<T>(items: T[], index: number, nextItem: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? nextItem : item));
}

export function removeAt<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

export function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items;

  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
