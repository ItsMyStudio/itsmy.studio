import type {
  ActionRowChildComponent,
  BuilderComponent,
  ButtonComponent,
  MediaGalleryItem,
  MessageBuilderState,
  SectionAccessory,
  SelectMenuComponent,
  TextDisplayComponent,
} from '@/lib/builders/message';
import type {
  CheckboxComponent,
  CheckboxGroupComponent,
  FileUploadComponent,
  ModalChoiceOption,
  ModalBuilderComponent,
  ModalBuilderState,
  RadioGroupComponent,
  TextInputComponent,
} from '@/lib/builders/modal';
import type {
  GeneratedCheckboxComponent,
  GeneratedCheckboxGroupComponent,
  GeneratedChoiceOption,
  GeneratedFileUploadComponent,
  GeneratedActionRowComponent,
  GeneratedButtonComponent,
  GeneratedContainerComponent,
  GeneratedFileComponent,
  GeneratedLabelComponent,
  GeneratedMediaGalleryComponent,
  GeneratedMediaGalleryItem,
  GeneratedMessageComponent,
  GeneratedMessageConfig,
  GeneratedModalComponent,
  GeneratedModalConfig,
  GeneratedModalInputComponent,
  GeneratedRadioGroupComponent,
  GeneratedRepeatComponent,
  GeneratedSectionAccessory,
  GeneratedSectionComponent,
  GeneratedSelectMenuComponent,
  GeneratedSelectMenuOption,
  GeneratedSeparatorComponent,
  GeneratedTextDisplayComponent,
  GeneratedTextInputComponent,
  GeneratedThumbnailComponent,
} from './index';
import { isHexColor } from './utils';

export function buildGeneratedMessageConfig(
  state: MessageBuilderState,
): GeneratedMessageConfig {
  return {
    ...(state.ephemeral ? { ephemeral: true } : {}),
    ...(state.disableMentions ? { 'disable-mentions': true } : {}),
    components: state.components.map(buildGeneratedMessageComponent),
  };
}

export function buildGeneratedModalConfig(state: ModalBuilderState): GeneratedModalConfig {
  return {
    title: state.title,
    ...(state.customId.trim().length > 0 ? { 'custom-id': state.customId } : {}),
    components: state.components.map(buildGeneratedModalComponent),
  };
}

function buildGeneratedMessageComponent(
  component: BuilderComponent,
): GeneratedMessageComponent {
  switch (component.type) {
    case 'text-display':
      return buildGeneratedTextDisplay(component);

    case 'separator':
      return {
        type: 'separator',
        spacing: component.spacing,
        ...(component.divider ? {} : { divider: false }),
      } satisfies GeneratedSeparatorComponent;

    case 'action-row':
      return {
        type: 'action-row',
        components: component.components.map(buildGeneratedActionRowChild),
      } satisfies GeneratedActionRowComponent;

    case 'section':
      return {
        type: 'section',
        components: component.components.map(buildGeneratedTextDisplay),
        ...(component.accessory
          ? { accessory: buildGeneratedAccessory(component.accessory) }
          : {}),
      } satisfies GeneratedSectionComponent;

    case 'container':
      return {
        type: 'container',
        ...(component.color.trim().length > 0 && isHexColor(component.color)
          ? { color: component.color.trim() }
          : {}),
        ...(component.spoiler ? { spoiler: true } : {}),
        components: component.components.map(buildGeneratedMessageComponent),
      } satisfies GeneratedContainerComponent;

    case 'media-gallery':
      return {
        type: 'media-gallery',
        items: component.items.map(buildGeneratedMediaGalleryItem),
      } satisfies GeneratedMediaGalleryComponent;

    case 'file':
      return {
        type: 'file',
        ...(component.url.trim().length > 0 ? { url: component.url } : {}),
        ...(component.spoiler ? { spoiler: true } : {}),
      } satisfies GeneratedFileComponent;

    case 'repeat':
      return {
        type: 'repeat',
        ...(component.dataSource.trim().length > 0
          ? { 'data-source': component.dataSource }
          : {}),
        template: component.template.map(buildGeneratedMessageComponent),
      } satisfies GeneratedRepeatComponent;
  }
}

function buildGeneratedModalComponent(
  component: ModalBuilderComponent,
): GeneratedModalComponent {
  if (component.type === 'text-display') {
    return buildGeneratedTextDisplay(component);
  }

  return {
    type: 'label',
    ...(component.label.trim().length > 0 ? { label: component.label } : {}),
    ...(component.description.trim().length > 0
      ? { description: component.description }
      : {}),
    component: buildGeneratedModalInput(component.component),
  } satisfies GeneratedLabelComponent;
}

function buildGeneratedModalInput(
  component:
    | TextInputComponent
    | SelectMenuComponent
    | FileUploadComponent
    | CheckboxComponent
    | CheckboxGroupComponent
    | RadioGroupComponent,
): GeneratedModalInputComponent {
  switch (component.type) {
    case 'text-input':
      return buildGeneratedTextInput(component);
    case 'select-menu':
      return buildGeneratedSelectMenu(component);
    case 'file-upload':
      return buildGeneratedFileUpload(component);
    case 'checkbox':
      return buildGeneratedCheckbox(component);
    case 'checkbox-group':
      return buildGeneratedCheckboxGroup(component);
    case 'radio-group':
      return buildGeneratedRadioGroup(component);
  }
}

function buildGeneratedTextDisplay(
  component: TextDisplayComponent,
): GeneratedTextDisplayComponent {
  return {
    type: 'text-display',
    ...(component.content.trim().length > 0 ? { content: component.content } : {}),
  };
}

function buildGeneratedActionRowChild(
  component: ActionRowChildComponent,
): GeneratedButtonComponent | GeneratedSelectMenuComponent {
  if (component.type === 'button') {
    return buildGeneratedButton(component);
  }

  return buildGeneratedSelectMenu(component);
}

function buildGeneratedAccessory(accessory: SectionAccessory): GeneratedSectionAccessory {
  if (accessory.type === 'thumbnail') {
    return {
      type: 'thumbnail',
      url: accessory.url,
    } satisfies GeneratedThumbnailComponent;
  }

  return buildGeneratedButton(accessory);
}

function buildGeneratedButton(component: ButtonComponent): GeneratedButtonComponent {
  return {
    type: 'button',
    ...(component.label.trim().length > 0 ? { label: component.label } : {}),
    style: component.style,
    ...(component.style === 'link'
      ? component.url.trim().length > 0
        ? { url: component.url }
        : {}
      : component.customId.trim().length > 0
        ? { 'custom-id': component.customId }
        : {}),
    ...(component.emoji.trim().length > 0 ? { emoji: component.emoji } : {}),
    ...(component.disabled ? { disabled: true } : {}),
  };
}

function buildGeneratedSelectMenu(
  component: SelectMenuComponent,
): GeneratedSelectMenuComponent {
  return {
    type: 'select-menu',
    ...(component.customId.trim().length > 0 ? { 'custom-id': component.customId } : {}),
    options: component.options.map(buildGeneratedSelectMenuOption),
    ...(component.placeholder.trim().length > 0
      ? { placeholder: component.placeholder }
      : {}),
    ...(component.minValues !== 1 ? { 'min-values': component.minValues } : {}),
    ...(component.maxValues !== 1 ? { 'max-values': component.maxValues } : {}),
  };
}

function buildGeneratedSelectMenuOption(option: {
  label: string;
  value: string;
}): GeneratedSelectMenuOption {
  return {
    label: option.label,
    value: option.value,
  };
}

function buildGeneratedMediaGalleryItem(
  item: MediaGalleryItem,
): GeneratedMediaGalleryItem {
  return {
    url: item.url,
    ...(item.description.trim().length > 0 ? { description: item.description } : {}),
    ...(item.spoiler ? { spoiler: true } : {}),
  };
}

function buildGeneratedTextInput(
  component: TextInputComponent,
): GeneratedTextInputComponent {
  return {
    type: 'text-input',
    style: component.style,
    ...(component.customId.trim().length > 0 ? { 'custom-id': component.customId } : {}),
    ...(component.placeholder.trim().length > 0
      ? { placeholder: component.placeholder }
      : {}),
    ...(component.minLength !== null ? { 'min-length': component.minLength } : {}),
    ...(component.maxLength !== null ? { 'max-length': component.maxLength } : {}),
    ...(component.required ? { required: true } : {}),
    ...(component.value.trim().length > 0 ? { value: component.value } : {}),
  };
}

function buildGeneratedFileUpload(
  component: FileUploadComponent,
): GeneratedFileUploadComponent {
  return {
    type: 'file-upload',
    ...(component.customId.trim().length > 0 ? { 'custom-id': component.customId } : {}),
    ...(component.minValues !== null ? { 'min-values': component.minValues } : {}),
    ...(component.maxValues !== 1 ? { 'max-values': component.maxValues } : {}),
    ...(component.required ? { required: true } : {}),
  };
}

function buildGeneratedCheckbox(
  component: CheckboxComponent,
): GeneratedCheckboxComponent {
  return {
    type: 'checkbox',
    ...(component.customId.trim().length > 0 ? { 'custom-id': component.customId } : {}),
    ...(component.default ? { default: true } : {}),
  };
}

function buildGeneratedCheckboxGroup(
  component: CheckboxGroupComponent,
): GeneratedCheckboxGroupComponent {
  return {
    type: 'checkbox-group',
    ...(component.customId.trim().length > 0 ? { 'custom-id': component.customId } : {}),
    ...(component.required ? { required: true } : {}),
    ...(component.minValues !== null ? { 'min-values': component.minValues } : {}),
    ...(component.maxValues !== null ? { 'max-values': component.maxValues } : {}),
    options: component.options.map(buildGeneratedChoiceOption),
  };
}

function buildGeneratedRadioGroup(
  component: RadioGroupComponent,
): GeneratedRadioGroupComponent {
  return {
    type: 'radio-group',
    ...(component.customId.trim().length > 0 ? { 'custom-id': component.customId } : {}),
    ...(component.required ? { required: true } : {}),
    options: component.options.map(buildGeneratedChoiceOption),
  };
}

function buildGeneratedChoiceOption(option: ModalChoiceOption): GeneratedChoiceOption {
  return {
    label: option.label,
    value: option.value,
    ...(option.description.trim().length > 0 ? { description: option.description } : {}),
    ...(option.default ? { default: true } : {}),
  };
}
