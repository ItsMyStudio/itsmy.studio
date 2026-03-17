import { createIdFactory, type BuilderDefinition } from './core';

export type ButtonStyle = 'primary' | 'secondary' | 'success' | 'danger' | 'link';
export type AddableComponentType =
  | 'text-display'
  | 'container'
  | 'section'
  | 'action-row'
  | 'media-gallery'
  | 'separator'
  | 'file'
  | 'repeat';
export type AddableActionRowComponentType = 'button' | 'select-menu';

export type TextDisplayComponent = {
  id: string;
  type: 'text-display';
  content: string;
};

export type SeparatorComponent = {
  id: string;
  type: 'separator';
  spacing: 1 | 2;
  divider: boolean;
};

export type ButtonComponent = {
  id: string;
  type: 'button';
  label: string;
  style: ButtonStyle;
  customId: string;
  url: string;
  emoji: string;
  disabled: boolean;
};

export type SelectMenuOption = {
  id: string;
  label: string;
  value: string;
};

export type SelectMenuComponent = {
  id: string;
  type: 'select-menu';
  customId: string;
  placeholder: string;
  minValues: number;
  maxValues: number;
  options: SelectMenuOption[];
};

export type ThumbnailComponent = {
  id: string;
  type: 'thumbnail';
  url: string;
};

export type MediaGalleryItem = {
  id: string;
  url: string;
  description: string;
  spoiler: boolean;
};

export type MediaGalleryComponent = {
  id: string;
  type: 'media-gallery';
  items: MediaGalleryItem[];
};

export type FileComponent = {
  id: string;
  type: 'file';
  url: string;
  spoiler: boolean;
};

export type RepeatComponent = {
  id: string;
  type: 'repeat';
  dataSource: string;
  template: BuilderComponent[];
};

export type ActionRowChildComponent = ButtonComponent | SelectMenuComponent;

export type ActionRowComponent = {
  id: string;
  type: 'action-row';
  components: ActionRowChildComponent[];
};

export type SectionAccessory = ButtonComponent | ThumbnailComponent;

export type SectionComponent = {
  id: string;
  type: 'section';
  components: TextDisplayComponent[];
  accessory: SectionAccessory | null;
};

export type ContainerComponent = {
  id: string;
  type: 'container';
  color: string;
  spoiler: boolean;
  components: BuilderComponent[];
};

export type BuilderComponent =
  | TextDisplayComponent
  | SeparatorComponent
  | ActionRowComponent
  | SectionComponent
  | ContainerComponent
  | MediaGalleryComponent
  | FileComponent
  | RepeatComponent;

export type DisplayComponentType =
  | AddableComponentType
  | AddableActionRowComponentType
  | SectionAccessory['type'];

export type MessageBuilderState = {
  ephemeral: boolean;
  disableMentions: boolean;
  components: BuilderComponent[];
};

export const TOP_LEVEL_COMPONENTS: AddableComponentType[] = [
  'text-display',
  'container',
  'section',
  'action-row',
  'media-gallery',
  'separator',
  'file',
  'repeat',
];

export const CONTAINER_COMPONENTS: AddableComponentType[] = [
  'text-display',
  'section',
  'action-row',
  'media-gallery',
  'separator',
  'file',
  'repeat',
];

export const ACTION_ROW_COMPONENTS: AddableActionRowComponentType[] = ['button', 'select-menu'];

export const BUTTON_STYLES: ButtonStyle[] = [
  'primary',
  'secondary',
  'success',
  'danger',
  'link',
];

const nextMessageId = createIdFactory();

export function createTextDisplay(
  content = '### Welcome\nBuild your message here and copy the generated YAML.',
): TextDisplayComponent {
  return {
    id: nextMessageId('text'),
    type: 'text-display',
    content,
  };
}

export function createButton(
  overrides: Partial<Omit<ButtonComponent, 'id' | 'type'>> = {},
): ButtonComponent {
  return {
    id: nextMessageId('button'),
    type: 'button',
    label: 'Click me',
    style: 'primary',
    customId: 'script_button',
    url: '',
    emoji: '',
    disabled: false,
    ...overrides,
  };
}

export function createSelectMenuOption(
  overrides: Partial<Omit<SelectMenuOption, 'id'>> = {},
): SelectMenuOption {
  return {
    id: nextMessageId('select-option'),
    label: 'Option',
    value: 'option',
    ...overrides,
  };
}

export function createSelectMenu(
  overrides: Partial<Omit<SelectMenuComponent, 'id' | 'type'>> = {},
): SelectMenuComponent {
  return {
    id: nextMessageId('select-menu'),
    type: 'select-menu',
    customId: 'script_select_menu',
    placeholder: 'Select an option',
    minValues: 1,
    maxValues: 1,
    options: [
      createSelectMenuOption({ label: 'Option 1', value: 'option_1' }),
      createSelectMenuOption({ label: 'Option 2', value: 'option_2' }),
    ],
    ...overrides,
  };
}

export function createThumbnail(
  url = 'https://itsmy.studio/itsmystudio-logo.svg',
): ThumbnailComponent {
  return {
    id: nextMessageId('thumbnail'),
    type: 'thumbnail',
    url,
  };
}

export function createMediaGalleryItem(
  overrides: Partial<Omit<MediaGalleryItem, 'id'>> = {},
): MediaGalleryItem {
  return {
    id: nextMessageId('media-item'),
    url: 'https://itsmy.studio/itsmystudio-logo.svg',
    description: '',
    spoiler: false,
    ...overrides,
  };
}

export function createMediaGallery(
  items: MediaGalleryItem[] = [
    createMediaGalleryItem(),
    createMediaGalleryItem(),
  ],
): MediaGalleryComponent {
  return {
    id: nextMessageId('media-gallery'),
    type: 'media-gallery',
    items,
  };
}

export function createFile(
  overrides: Partial<Omit<FileComponent, 'id' | 'type'>> = {},
): FileComponent {
  return {
    id: nextMessageId('file'),
    type: 'file',
    url: 'https://itsmy.studio/itsmystudio-logo.svg',
    spoiler: false,
    ...overrides,
  };
}

export function createRepeat(
  overrides: Partial<Omit<RepeatComponent, 'id' | 'type'>> = {},
): RepeatComponent {
  return {
    id: nextMessageId('repeat'),
    type: 'repeat',
    dataSource: 'pagination-items',
    template: [createTextDisplay('Repeated item content')],
    ...overrides,
  };
}

export function createActionRow(
  components: ActionRowChildComponent[] = [
    createButton({
      label: 'Join Discord',
      style: 'link',
      url: 'https://itsmy.studio/discord',
      customId: '',
    }),
  ],
): ActionRowComponent {
  return {
    id: nextMessageId('action-row'),
    type: 'action-row',
    components,
  };
}

export function createSection(): SectionComponent {
  return {
    id: nextMessageId('section'),
    type: 'section',
    components: [createTextDisplay('Section title\nMore details about your message go here.')],
    accessory: createAccessory('button'),
  };
}

export function createContainer(): ContainerComponent {
  return {
    id: nextMessageId('container'),
    type: 'container',
    color: '#5865F2',
    spoiler: false,
    components: [createTextDisplay('This content is grouped inside a container.')],
  };
}

export function createSeparator(): SeparatorComponent {
  return {
    id: nextMessageId('separator'),
    type: 'separator',
    spacing: 1,
    divider: true,
  };
}

export function createActionRowChildComponent(
  type: AddableActionRowComponentType,
): ActionRowChildComponent {
  switch (type) {
    case 'button':
      return createButton();
    case 'select-menu':
      return createSelectMenu();
  }
}

export function createComponent(type: AddableComponentType): BuilderComponent {
  switch (type) {
    case 'text-display':
      return createTextDisplay('Your text here');
    case 'container':
      return createContainer();
    case 'section':
      return createSection();
    case 'action-row':
      return createActionRow();
    case 'media-gallery':
      return createMediaGallery();
    case 'separator':
      return createSeparator();
    case 'file':
      return createFile();
    case 'repeat':
      return createRepeat();
  }
}

export function createAccessory(type: string): SectionAccessory | null {
  if (type === 'button') {
    return createButton({
      label: 'Learn more',
      style: 'link',
      url: 'https://itsmy.studio/discord',
      customId: '',
    });
  }

  if (type === 'thumbnail') {
    return createThumbnail();
  }

  return null;
}

export function createInitialMessageBuilderState(): MessageBuilderState {
  return {
    ephemeral: false,
    disableMentions: false,
    components: [
      createTextDisplay(
        '### Welcome [[member_display_name]]\nThanks for joining **%server_name%**.',
      ),
      createTextDisplay(
        'Use placeholders, markdown, buttons, sections, galleries, and files to shape the message.',
      ),
      createActionRow(),
    ],
  };
}

export function formatComponentType(type: DisplayComponentType) {
  switch (type) {
    case 'text-display':
      return 'Text Display';
    case 'container':
      return 'Container';
    case 'section':
      return 'Section';
    case 'action-row':
      return 'Action Row';
    case 'media-gallery':
      return 'Media Gallery';
    case 'separator':
      return 'Separator';
    case 'file':
      return 'File';
    case 'repeat':
      return 'Repeat';
    case 'button':
      return 'Button';
    case 'select-menu':
      return 'Select Menu';
    case 'thumbnail':
      return 'Thumbnail';
  }
}

export function describeComponent(type: DisplayComponentType) {
  switch (type) {
    case 'text-display':
      return 'Plain text with Discord markdown support.';
    case 'container':
      return 'Group multiple blocks under a colored wrapper.';
    case 'section':
      return 'Text on the left with an accessory on the right.';
    case 'action-row':
      return 'A row of buttons or one select menu.';
    case 'media-gallery':
      return 'Display multiple media items in a gallery.';
    case 'separator':
      return 'Add spacing or a divider line.';
    case 'file':
      return 'Attach a file or image to the message.';
    case 'repeat':
      return 'Repeat a template from a data source.';
    case 'button':
      return 'Trigger actions or open external links.';
    case 'select-menu':
      return 'Let users pick one or more options.';
    case 'thumbnail':
      return 'Display an image accessory inside a section.';
  }
}

export function previewButtonClassName(style: ButtonStyle) {
  switch (style) {
    case 'primary':
      return 'bg-[#5865F2] text-white';
    case 'secondary':
      return 'bg-[#4E5058] text-white';
    case 'success':
      return 'bg-[#248046] text-white';
    case 'danger':
      return 'bg-[#DA373C] text-white';
    case 'link':
      return 'border bg-white text-[#1c64f2]';
  }
}

export function serializeMessageConfig(config: MessageBuilderState) {
  const lines: string[] = [];

  if (config.ephemeral) lines.push('ephemeral: true');
  if (config.disableMentions) lines.push('disable-mentions: true');

  if (config.components.length === 0) {
    lines.push('components: []');
  } else {
    lines.push('components:');
    lines.push(...serializeComponents(config.components, 1));
  }

  return lines.join('\n');
}

function serializeComponents(components: BuilderComponent[], indentLevel: number) {
  return components.flatMap((component) => serializeComponent(component, indentLevel));
}

function serializeComponent(component: BuilderComponent, indentLevel: number): string[] {
  switch (component.type) {
    case 'text-display':
      return serializeTextDisplay(component, indentLevel);
    case 'separator':
      return serializeSeparator(component, indentLevel);
    case 'action-row':
      return serializeActionRow(component, indentLevel);
    case 'section':
      return serializeSection(component, indentLevel);
    case 'container':
      return serializeContainer(component, indentLevel);
    case 'media-gallery':
      return serializeMediaGallery(component, indentLevel);
    case 'file':
      return serializeFile(component, indentLevel);
    case 'repeat':
      return serializeRepeat(component, indentLevel);
  }
}

function serializeTextDisplay(component: TextDisplayComponent, indentLevel: number) {
  const lines = [`${indent(indentLevel)}- type: text-display`];
  pushStringField(lines, indentLevel + 1, 'content', component.content);
  return lines;
}

function serializeSeparator(component: SeparatorComponent, indentLevel: number) {
  const lines = [`${indent(indentLevel)}- type: separator`];
  lines.push(`${indent(indentLevel + 1)}spacing: ${component.spacing}`);
  if (!component.divider) {
    lines.push(`${indent(indentLevel + 1)}divider: false`);
  }
  return lines;
}

function serializeActionRow(component: ActionRowComponent, indentLevel: number) {
  const lines = [`${indent(indentLevel)}- type: action-row`];

  if (component.components.length === 0) {
    lines.push(`${indent(indentLevel + 1)}components: []`);
  } else {
    lines.push(`${indent(indentLevel + 1)}components:`);
    lines.push(
      ...component.components.flatMap((child) =>
        child.type === 'button'
          ? serializeButton(child, indentLevel + 2)
          : serializeSelectMenu(child, indentLevel + 2),
      ),
    );
  }

  return lines;
}

function serializeSection(component: SectionComponent, indentLevel: number) {
  const lines = [`${indent(indentLevel)}- type: section`];

  if (component.components.length === 0) {
    lines.push(`${indent(indentLevel + 1)}components: []`);
  } else {
    lines.push(`${indent(indentLevel + 1)}components:`);
    lines.push(
      ...component.components.flatMap((text) => serializeTextDisplay(text, indentLevel + 2)),
    );
  }

  if (component.accessory) {
    lines.push(`${indent(indentLevel + 1)}accessory:`);
    lines.push(...serializeAccessory(component.accessory, indentLevel + 2));
  }

  return lines;
}

function serializeContainer(component: ContainerComponent, indentLevel: number) {
  const lines = [`${indent(indentLevel)}- type: container`];

  if (component.color.trim().length > 0) {
    lines.push(`${indent(indentLevel + 1)}color: ${quoteString(component.color)}`);
  }

  if (component.spoiler) {
    lines.push(`${indent(indentLevel + 1)}spoiler: true`);
  }

  if (component.components.length === 0) {
    lines.push(`${indent(indentLevel + 1)}components: []`);
  } else {
    lines.push(`${indent(indentLevel + 1)}components:`);
    lines.push(...serializeComponents(component.components, indentLevel + 2));
  }

  return lines;
}

function serializeMediaGallery(component: MediaGalleryComponent, indentLevel: number) {
  const lines = [`${indent(indentLevel)}- type: media-gallery`];

  if (component.items.length === 0) {
    lines.push(`${indent(indentLevel + 1)}items: []`);
    return lines;
  }

  lines.push(`${indent(indentLevel + 1)}items:`);
  for (const item of component.items) {
    lines.push(`${indent(indentLevel + 2)}- url: ${quoteString(item.url)}`);
    if (item.description.trim().length > 0) {
      pushStringField(lines, indentLevel + 3, 'description', item.description);
    }
    if (item.spoiler) {
      lines.push(`${indent(indentLevel + 3)}spoiler: true`);
    }
  }

  return lines;
}

function serializeFile(component: FileComponent, indentLevel: number) {
  const lines = [`${indent(indentLevel)}- type: file`];
  pushStringField(lines, indentLevel + 1, 'url', component.url);
  if (component.spoiler) {
    lines.push(`${indent(indentLevel + 1)}spoiler: true`);
  }
  return lines;
}

function serializeRepeat(component: RepeatComponent, indentLevel: number) {
  const lines = [`${indent(indentLevel)}- type: repeat`];
  pushStringField(lines, indentLevel + 1, 'data-source', component.dataSource);

  if (component.template.length === 0) {
    lines.push(`${indent(indentLevel + 1)}template: []`);
  } else {
    lines.push(`${indent(indentLevel + 1)}template:`);
    lines.push(...serializeComponents(component.template, indentLevel + 2));
  }

  return lines;
}

function serializeButton(button: ButtonComponent, indentLevel: number) {
  const lines = [`${indent(indentLevel)}- type: button`];
  pushStringField(lines, indentLevel + 1, 'label', button.label);
  lines.push(`${indent(indentLevel + 1)}style: ${quoteString(button.style)}`);

  if (button.style === 'link') {
    if (button.url.trim().length > 0) {
      pushStringField(lines, indentLevel + 1, 'url', button.url);
    }
  } else if (button.customId.trim().length > 0) {
    pushStringField(lines, indentLevel + 1, 'custom-id', button.customId);
  }

  if (button.emoji.trim().length > 0) {
    pushStringField(lines, indentLevel + 1, 'emoji', button.emoji);
  }

  if (button.disabled) {
    lines.push(`${indent(indentLevel + 1)}disabled: true`);
  }

  return lines;
}

function serializeSelectMenu(component: SelectMenuComponent, indentLevel: number) {
  const lines = [`${indent(indentLevel)}- type: select-menu`];
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

function serializeAccessory(accessory: SectionAccessory, indentLevel: number) {
  if (accessory.type === 'thumbnail') {
    return [
      `${indent(indentLevel)}type: thumbnail`,
      `${indent(indentLevel + 1)}url: ${quoteString(accessory.url)}`,
    ];
  }

  const lines = [`${indent(indentLevel)}type: button`];
  pushStringField(lines, indentLevel + 1, 'label', accessory.label);
  lines.push(`${indent(indentLevel + 1)}style: ${quoteString(accessory.style)}`);

  if (accessory.style === 'link') {
    if (accessory.url.trim().length > 0) {
      pushStringField(lines, indentLevel + 1, 'url', accessory.url);
    }
  } else if (accessory.customId.trim().length > 0) {
    pushStringField(lines, indentLevel + 1, 'custom-id', accessory.customId);
  }

  if (accessory.emoji.trim().length > 0) {
    pushStringField(lines, indentLevel + 1, 'emoji', accessory.emoji);
  }

  if (accessory.disabled) {
    lines.push(`${indent(indentLevel + 1)}disabled: true`);
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

export const MESSAGE_BUILDER_DEFINITION: BuilderDefinition<MessageBuilderState> = {
  kind: 'message',
  label: 'Message Builder',
  description: 'Build Discord message blocks and export the matching YAML.',
  output: {
    title: 'Generated YAML',
    description:
      'Copy this output into sendMessage, reply, editMessage, presets, or any other message field.',
    lang: 'yaml',
    copyLabel: 'Copy YAML',
    copiedLabel: 'Copied',
  },
  createInitialState: createInitialMessageBuilderState,
  serialize: serializeMessageConfig,
};
