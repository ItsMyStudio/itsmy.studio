import { createIdFactory, type BuilderDefinition } from './core';
import { asRecord, readBoolean, readInteger, readString } from './import-utils';
import type {
  SelectMenuComponent,
  SelectMenuOption,
  TextDisplayComponent,
} from './message';

export type AddableModalComponentType = 'text-display' | 'label';
export type ModalInputComponentType = 'text-input' | 'select-menu';
export type TextInputStyle = 'short' | 'paragraph';

export type TextInputComponent = {
  id: string;
  type: 'text-input';
  style: TextInputStyle;
  customId: string;
  placeholder: string;
  minLength: number | null;
  maxLength: number | null;
  required: boolean;
  value: string;
};

export type LabelComponent = {
  id: string;
  type: 'label';
  label: string;
  description: string;
  component: TextInputComponent | SelectMenuComponent;
};

export type ModalBuilderComponent = TextDisplayComponent | LabelComponent;

export type ModalBuilderState = {
  title: string;
  customId: string;
  components: ModalBuilderComponent[];
};

export const MODAL_COMPONENTS: AddableModalComponentType[] = ['text-display', 'label'];
export const MODAL_INPUT_COMPONENTS: ModalInputComponentType[] = ['text-input', 'select-menu'];
export const TEXT_INPUT_STYLES: TextInputStyle[] = ['short', 'paragraph'];

const nextModalId = createIdFactory();

export function createModalTextDisplay(
  content = 'Explain what the modal is for before showing the fields.',
): TextDisplayComponent {
  return {
    id: nextModalId('modal-text'),
    type: 'text-display',
    content,
  };
}

export function createModalSelectMenuOption(
  overrides: Partial<Omit<SelectMenuOption, 'id'>> = {},
): SelectMenuOption {
  return {
    id: nextModalId('modal-select-option'),
    label: 'Option',
    value: 'option',
    ...overrides,
  };
}

export function createModalSelectMenu(
  overrides: Partial<Omit<SelectMenuComponent, 'id' | 'type'>> = {},
): SelectMenuComponent {
  return {
    id: nextModalId('modal-select-menu'),
    type: 'select-menu',
    customId: 'modal_select',
    placeholder: 'Select an option',
    minValues: 1,
    maxValues: 1,
    options: [
      createModalSelectMenuOption({ label: 'Option 1', value: 'option_1' }),
      createModalSelectMenuOption({ label: 'Option 2', value: 'option_2' }),
    ],
    ...overrides,
  };
}

export function createTextInput(
  overrides: Partial<Omit<TextInputComponent, 'id' | 'type'>> = {},
): TextInputComponent {
  return {
    id: nextModalId('modal-text-input'),
    type: 'text-input',
    style: 'short',
    customId: 'modal_text_input',
    placeholder: '',
    minLength: null,
    maxLength: null,
    required: true,
    value: '',
    ...overrides,
  };
}

export function createLabel(): LabelComponent {
  return {
    id: nextModalId('modal-label'),
    type: 'label',
    label: 'Question',
    description: 'Help the user understand what to enter.',
    component: createTextInput(),
  };
}

export function createModalComponent(type: AddableModalComponentType): ModalBuilderComponent {
  switch (type) {
    case 'text-display':
      return createModalTextDisplay();
    case 'label':
      return createLabel();
  }
}

export function createModalInputComponent(type: ModalInputComponentType) {
  switch (type) {
    case 'text-input':
      return createTextInput();
    case 'select-menu':
      return createModalSelectMenu();
  }
}

export function createInitialModalBuilderState(): ModalBuilderState {
  return {
    title: 'Feedback Modal',
    customId: 'feedback_modal',
    components: [
      createModalTextDisplay('Tell users what you need before they fill the modal.'),
      createLabel(),
    ],
  };
}

export function formatModalComponentType(
  type: AddableModalComponentType | ModalInputComponentType,
) {
  switch (type) {
    case 'text-display':
      return 'Text Display';
    case 'label':
      return 'Label';
    case 'text-input':
      return 'Text Input';
    case 'select-menu':
      return 'Select Menu';
  }
}

export function describeModalComponent(
  type: AddableModalComponentType | ModalInputComponentType,
) {
  switch (type) {
    case 'text-display':
      return 'Plain text shown at the top of the modal.';
    case 'label':
      return 'A labeled field wrapping either a text input or a select menu.';
    case 'text-input':
      return 'Collect short or long text directly from the user.';
    case 'select-menu':
      return 'Let the user choose one or more predefined options.';
  }
}

export function serializeModalConfig(config: ModalBuilderState) {
  const lines: string[] = [`title: ${quoteString(config.title)}`];

  if (config.customId.trim().length > 0) {
    lines.push(`custom-id: ${quoteString(config.customId)}`);
  }

  if (config.components.length === 0) {
    lines.push('components: []');
  } else {
    lines.push('components:');
    lines.push(...serializeComponents(config.components, 1));
  }

  return lines.join('\n');
}

export function deserializeModalConfig(value: unknown): ModalBuilderState {
  const root = asRecord(value, 'modal');

  return {
    title: readString(root.title, 'Untitled Modal'),
    customId: readString(root['custom-id']),
    components: Array.isArray(root.components)
      ? root.components.map((component, index) =>
          deserializeModalComponent(component, `components[${index}]`),
        )
      : [],
  };
}

function deserializeModalComponent(value: unknown, path: string): ModalBuilderComponent {
  const component = asRecord(value, path);
  const type = readString(component.type);

  switch (type) {
    case 'text-display':
      return createModalTextDisplay(readString(component.content));
    case 'label':
      return {
        ...createLabel(),
        label: readString(component.label),
        description: readString(component.description),
        component: deserializeModalInputComponent(component.component, `${path}.component`),
      };
    default:
      throw new Error(`${path}.type "${type}" is not supported by the modal builder.`);
  }
}

function deserializeModalInputComponent(
  value: unknown,
  path: string,
): TextInputComponent | SelectMenuComponent {
  const component = asRecord(value, path);
  const type = readString(component.type);

  switch (type) {
    case 'text-input':
      return createTextInput({
        style: normalizeTextInputStyle(readString(component.style, 'short')),
        customId: readString(component['custom-id']),
        placeholder: readString(component.placeholder),
        minLength:
          component['min-length'] === undefined
            ? null
            : readInteger(component['min-length'], 0),
        maxLength:
          component['max-length'] === undefined
            ? null
            : readInteger(component['max-length'], 0),
        required: readBoolean(component.required, false),
        value: readString(component.value),
      });
    case 'select-menu':
      return createModalSelectMenu({
        customId: readString(component['custom-id']),
        placeholder: readString(component.placeholder),
        minValues: readInteger(component['min-values'], 1),
        maxValues: readInteger(component['max-values'], 1),
        options: Array.isArray(component.options)
          ? component.options.map((option, index) =>
              deserializeModalSelectMenuOption(option, `${path}.options[${index}]`),
            )
          : [],
      });
    default:
      throw new Error(`${path}.type "${type}" is not supported inside modal label.`);
  }
}

function deserializeModalSelectMenuOption(value: unknown, path: string): SelectMenuOption {
  const option = asRecord(value, path);

  return createModalSelectMenuOption({
    label: readString(option.label),
    value: readString(option.value),
  });
}

function normalizeTextInputStyle(style: string): TextInputStyle {
  return style.toLowerCase() === 'paragraph' ? 'paragraph' : 'short';
}

function serializeComponents(components: ModalBuilderComponent[], indentLevel: number) {
  return components.flatMap((component) => serializeComponent(component, indentLevel));
}

function serializeComponent(component: ModalBuilderComponent, indentLevel: number): string[] {
  switch (component.type) {
    case 'text-display':
      return serializeTextDisplay(component, indentLevel);
    case 'label':
      return serializeLabel(component, indentLevel);
  }
}

function serializeTextDisplay(component: TextDisplayComponent, indentLevel: number) {
  const lines = [`${indent(indentLevel)}- type: text-display`];
  pushStringField(lines, indentLevel + 1, 'content', component.content);
  return lines;
}

function serializeLabel(component: LabelComponent, indentLevel: number) {
  const lines = [`${indent(indentLevel)}- type: label`];
  pushStringField(lines, indentLevel + 1, 'label', component.label);
  pushStringField(lines, indentLevel + 1, 'description', component.description);
  lines.push(`${indent(indentLevel + 1)}component:`);
  lines.push(...serializeInputComponent(component.component, indentLevel + 2));
  return lines;
}

function serializeInputComponent(
  component: TextInputComponent | SelectMenuComponent,
  indentLevel: number,
) {
  if (component.type === 'text-input') {
    const lines = [`${indent(indentLevel)}type: text-input`];
    lines.push(`${indent(indentLevel + 1)}style: ${quoteString(component.style)}`);
    pushStringField(lines, indentLevel + 1, 'custom-id', component.customId);
    pushStringField(lines, indentLevel + 1, 'placeholder', component.placeholder);
    if (component.minLength !== null) {
      lines.push(`${indent(indentLevel + 1)}min-length: ${component.minLength}`);
    }
    if (component.maxLength !== null) {
      lines.push(`${indent(indentLevel + 1)}max-length: ${component.maxLength}`);
    }
    if (component.required) {
      lines.push(`${indent(indentLevel + 1)}required: true`);
    }
    pushStringField(lines, indentLevel + 1, 'value', component.value);
    return lines;
  }

  const lines = [`${indent(indentLevel)}type: select-menu`];
  pushStringField(lines, indentLevel + 1, 'custom-id', component.customId);

  if (component.options.length === 0) {
    lines.push(`${indent(indentLevel + 1)}options: []`);
  } else {
    lines.push(`${indent(indentLevel + 1)}options:`);
    for (const option of component.options) {
      lines.push(`${indent(indentLevel + 2)}- label: ${quoteString(option.label)}`);
      lines.push(`${indent(indentLevel + 3)}value: ${quoteString(option.value)}`);
    }
  }

  if (component.placeholder.trim().length > 0) {
    pushStringField(lines, indentLevel + 1, 'placeholder', component.placeholder);
  }

  if (component.minValues !== 1) {
    lines.push(`${indent(indentLevel + 1)}min-values: ${component.minValues}`);
  }

  if (component.maxValues !== 1) {
    lines.push(`${indent(indentLevel + 1)}max-values: ${component.maxValues}`);
  }

  return lines;
}

function pushStringField(lines: string[], indentLevel: number, key: string, value: string) {
  if (value.trim().length === 0) return;

  if (value.includes('\n')) {
    lines.push(`${indent(indentLevel)}${key}: |`);
    for (const line of value.split('\n')) {
      lines.push(`${indent(indentLevel + 1)}${line}`);
    }
    return;
  }

  lines.push(`${indent(indentLevel)}${key}: ${quoteString(value)}`);
}

function quoteString(value: string) {
  return JSON.stringify(value);
}

function indent(level: number) {
  return '  '.repeat(level);
}

export const MODAL_BUILDER_DEFINITION: BuilderDefinition<ModalBuilderState> = {
  kind: 'modal',
  label: 'Modal Builder',
  description: 'Build Discord modals and export the matching YAML.',
  output: {
    title: 'Generated YAML',
    description: 'Copy this output into modal fields, modal actions, or preset configurations.',
    lang: 'yaml'
  },
  createInitialState: createInitialModalBuilderState,
  serialize: serializeModalConfig,
};
