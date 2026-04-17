'use client';

import type { CSSProperties } from 'react';
import type {
  ItsMyConfigBuilderState,
  ItsMyConfigColorPlaceholder,
  ItsMyConfigPlaceholder,
  ItsMyConfigPreviewView,
} from '@/lib/builders/itsmyconfig';
import { splitItsMyConfigLines } from '@/lib/builders/itsmyconfig';

type PreviewSegment = {
  text: string;
  style: CSSProperties;
};

type ActiveStyleToken =
  | {
      kind: 'color';
      name: string;
      color: string;
    }
  | {
      kind: 'gradient';
      name: 'gradient';
      colors: string[];
    }
  | {
      kind: 'bold' | 'italic' | 'underlined' | 'strikethrough' | 'obfuscated' | 'smallcaps';
      name: 'bold' | 'italic' | 'underlined' | 'strikethrough' | 'obfuscated' | 'smallcaps';
    };

type ParsedStyleTag =
  | {
      kind: 'open';
      token: ActiveStyleToken;
    }
  | {
      kind: 'close';
      name: string;
    };

const NAMED_COLORS: Record<string, string> = {
  black: '#000000',
  dark_blue: '#0000aa',
  dark_green: '#00aa00',
  dark_aqua: '#00aaaa',
  dark_red: '#aa0000',
  dark_purple: '#aa00aa',
  gold: '#ffaa00',
  gray: '#aaaaaa',
  dark_gray: '#555555',
  blue: '#5555ff',
  green: '#55ff55',
  aqua: '#55ffff',
  red: '#ff5555',
  light_purple: '#ff55ff',
  yellow: '#ffff55',
  white: '#ffffff',
};

const LEGACY_COLORS: Record<string, string> = {
  '&0': 'black',
  '&1': 'dark_blue',
  '&2': 'dark_green',
  '&3': 'dark_aqua',
  '&4': 'dark_red',
  '&5': 'dark_purple',
  '&6': 'gold',
  '&7': 'gray',
  '&8': 'dark_gray',
  '&9': 'blue',
  '&a': 'green',
  '&b': 'aqua',
  '&c': 'red',
  '&d': 'light_purple',
  '&e': 'yellow',
  '&f': 'white',
};

const TABLIST_PLAYERS = [
  'Skyssy',
  'BuilderFox',
  'MinerWave',
  'PixelRift',
  'CraftNova',
  'ItsMyStudio',
];

const SMALL_CAPS_ORIGINAL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const SMALL_CAPS_REPLACEMENTS =
  'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘꞯʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘꞯʀsᴛᴜᴠᴡxʏᴢ';

const SMALL_CAPS_MAP = createCharacterMap(SMALL_CAPS_ORIGINAL, SMALL_CAPS_REPLACEMENTS);

export function ItsMyConfigPreview({
  state,
  view,
}: {
  state: ItsMyConfigBuilderState;
  view: ItsMyConfigPreviewView;
}) {
  const resolver = createResolver(state);

  if (view === 'chat') {
    return (
      <div
        className="flex items-end itsmyconfig-minecraft-preview itsmyconfig-minecraft-font min-h-72 rounded-2xl border border-fd-border/70 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      >
        <div className="flex flex-col bg-[#000000]/40 px-2 ">
          {splitItsMyConfigLines(state.templates.chat.lines).map((line, index) => (
            <PreviewLine key={`chat-${index}`} text={resolver(line)} />
          ))}
        </div>
      </div>
    );
  }

  if (view === 'lore') {
    return (
      <div
        className="itsmyconfig-minecraft-preview min-h-80 rounded-2xl border border-fd-border/70 p-6"
      >
        <div className="w-fit m-auto rounded-sm border-3 border-[#2a2240] bg-[linear-gradient(180deg,rgba(14,9,22,0.85)_0%,rgba(7,5,12,0.85)_100%)] px-2 py-1">
          <div className="mb-1">
            <PreviewLine text={resolver(state.templates.lore.title)} />
          </div>
          <div className="flex flex-col">
            {splitItsMyConfigLines(state.templates.lore.lines).map((line, index) => (
              <PreviewLine key={`lore-${index}`} text={resolver(line)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'scoreboard') {
    return (
      <div
        className="flex items-center flex-row-reverse itsmyconfig-minecraft-preview min-h-80 rounded-2xl border border-fd-border/70 py-6"
      >
        <div className="w-fit h-fit bg-[#000000]/40">
          <div className="bg-[#000000]/20">
            <PreviewLine text={resolver(state.templates.scoreboard.title)} align='center' shadow={false} />
          </div>
          <div className="flex flex-col px-1">
            {splitItsMyConfigLines(state.templates.scoreboard.lines).map((line, index) => (
              <PreviewLine key={`scoreboard-${index}`} text={resolver(line)} align="left" shadow={false}/>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="itsmyconfig-minecraft-preview min-h-72 rounded-2xl border border-fd-border/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"

    >
      <div className="overflow-hidden bg-[#000000]/40 flex flex-col items-center gap-0.5 w-fit m-auto px-3">
        <div>
          {splitItsMyConfigLines(state.templates.tablist.header).map((line, index) => (
            <PreviewLine key={`tab-header-${index}`} text={resolver(line)} align="center" />
          ))}
        </div>

        <div className="grid gap-0.5 w-fit">
          {TABLIST_PLAYERS.map((player) => (
            <div
              key={player}
              className="itsmyconfig-minecraft-font bg-white/10 text-sm leading-6 text-slate-100 px-0.5"
            >
              <PreviewLine key={`tab-${player}`} text={resolver(player)} align="left" />
            </div>
          ))}
        </div>

        <div>
          {splitItsMyConfigLines(state.templates.tablist.footer).map((line, index) => (
            <PreviewLine key={`tab-footer-${index}`} text={resolver(line)} align="center" />
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewLine({
  text,
  align = 'left',
  shadow = true,
}: {
  text: string;
  align?: 'left' | 'center' | 'right';
  shadow?: boolean;
}) {
  return (
    <div
      className="itsmyconfig-minecraft-font min-h-5 whitespace-pre-wrap warp-break-word text-[24px] text-slate-100"
      style={{ textAlign: align }}
    >
      <MinecraftText text={text.length > 0 ? text : ' '} shadow={shadow} />
    </div>
  );
}

function MinecraftText({ text, shadow }: { text: string; shadow?: boolean }) {
  const segments = parseMiniMessageSegments(text, shadow);

  if (segments.length === 0) {
    return <span>{text}</span>;
  }

  return (
    <>
      {segments.map((segment, index) => (
        <span key={`${segment.text}-${index}`} style={segment.style}>
          {segment.text}
        </span>
      ))}
    </>
  );
}

function createResolver(state: ItsMyConfigBuilderState) {
  const placeholderMap = new Map(state.placeholders.map((placeholder) => [placeholder.id, placeholder]));

  return (text: string) => resolveItsMyConfigText(text, placeholderMap);
}
function resolveItsMyConfigText(
  source: string,
  placeholders: Map<string, ItsMyConfigPlaceholder>,
  depth = 0,
): string {
  if (depth > 12 || source.length === 0) return source;

  let cursor = 0;
  let resolved = '';

  while (cursor < source.length) {
    const start = source.indexOf('<', cursor);

    if (start === -1) {
      resolved += source.slice(cursor);
      break;
    }

    resolved += source.slice(cursor, start);

    const end = source.indexOf('>', start + 1);
    if (end === -1) {
      resolved += source.slice(start);
      break;
    }

    const tagContent = source.slice(start + 1, end);
    const placeholderTag = parsePlaceholderTag(tagContent);

    if (!placeholderTag) {
      resolved += source.slice(start, end + 1);
      cursor = end + 1;
      continue;
    }

    const placeholder = placeholders.get(placeholderTag.id);
    if (!placeholder) {
      resolved += source.slice(start, end + 1);
      cursor = end + 1;
      continue;
    }

    if (placeholder.type === 'color') {
      const closeTagStart = findClosingPlaceholderTag(source, end + 1);

      if (closeTagStart !== -1) {
        const innerText = source.slice(end + 1, closeTagStart);
        const resolvedInnerText = resolveItsMyConfigText(innerText, placeholders, depth + 1);

        resolved +=
          buildColorOpeningTags(placeholder) +
          resolvedInnerText +
          buildColorClosingTags(placeholder);

        cursor = closeTagStart + 4; // length of </p>
        continue;
      }
    }

    resolved += resolvePlaceholderValue(placeholder, placeholderTag.args, placeholders, depth + 1);
    cursor = end + 1;
  }

  return resolved;
}

function findClosingPlaceholderTag(source: string, fromIndex: number) {
  return source.indexOf('</p>', fromIndex);
}

function buildColorClosingTags(placeholder: ItsMyConfigColorPlaceholder) {
  const tags: string[] = [];

  if (placeholder.obfuscated) tags.push('</obfuscated>');
  if (placeholder.strikethrough) tags.push('</strikethrough>');
  if (placeholder.underlined) tags.push('</underlined>');
  if (placeholder.italic) tags.push('</italic>');
  if (placeholder.bold) tags.push('</bold>');

  tags.push('</color>');

  return tags.join('');
}

function parsePlaceholderTag(tagContent: string) {
  const prefix = tagContent.startsWith('p:')
    ? 'p:'
    : tagContent.startsWith('placeholder:')
      ? 'placeholder:'
      : null;

  if (!prefix || tagContent.startsWith('/')) return null;

  const parts = splitTagArguments(tagContent.slice(prefix.length));
  const id = parts[0]?.trim();

  if (!id) return null;

  return {
    id,
    args: parts.slice(1).map(normalizeArgument),
  };
}

function splitTagArguments(source: string) {
  const parts: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  for (const character of source) {
    if (quote) {
      current += character;

      if (character === quote) {
        quote = null;
      }

      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      current += character;
      continue;
    }

    if (character === ':') {
      parts.push(current);
      current = '';
      continue;
    }

    current += character;
  }

  parts.push(current);
  return parts;
}

function normalizeArgument(value: string) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function resolvePlaceholderValue(
  placeholder: ItsMyConfigPlaceholder,
  args: string[],
  placeholders: Map<string, ItsMyConfigPlaceholder>,
  depth: number,
) {
  switch (placeholder.type) {
    case 'string':
    case 'colored_text':
      return resolveItsMyConfigText(replacePlaceholderArguments(placeholder.value, args), placeholders, depth);
    case 'color':
      return buildColorOpeningTags(placeholder);
  }
}

function replacePlaceholderArguments(value: string, args: string[]) {
  return value.replace(/\{(\d+)\}/g, (_, index: string) => args[Number(index)] ?? `{${index}}`);
}

function buildColorOpeningTags(placeholder: ItsMyConfigColorPlaceholder) {
  const colorTag = toMiniMessageColorTag(placeholder.value);
  const tags = [colorTag];

  if (placeholder.bold) tags.push('<bold>');
  if (placeholder.italic) tags.push('<italic>');
  if (placeholder.underlined) tags.push('<underlined>');
  if (placeholder.strikethrough) tags.push('<strikethrough>');
  if (placeholder.obfuscated) tags.push('<obfuscated>');

  return tags.join('');
}

function parseMiniMessageSegments(source: string, shadow: boolean = true): PreviewSegment[] {
  const segments: PreviewSegment[] = [];
  const activeTokens: ActiveStyleToken[] = [];
  let cursor = 0;

  while (cursor < source.length) {
    const start = source.indexOf('<', cursor);

    if (start === -1) {
      pushSegment(segments, activeTokens, source.slice(cursor), shadow);
      break;
    }

    pushSegment(segments, activeTokens, source.slice(cursor, start), shadow);

    const end = source.indexOf('>', start + 1);
    if (end === -1) {
      pushSegment(segments, activeTokens, source.slice(start), shadow);
      break;
    }

    const token = parseStyleTag(source.slice(start + 1, end));
    if (token?.kind === 'open') {
      activeTokens.push(token.token);
    } else if (token?.kind === 'close') {
      if (token.name === 'reset') {
        activeTokens.length = 0;
      } else {
        removeLastMatchingToken(activeTokens, token.name);
      }
    }

    cursor = end + 1;
  }

  return segments;
}
function pushSegment(segments: PreviewSegment[], activeTokens: ActiveStyleToken[], text: string, shadow: boolean = true) {
  if (!text) return;

  const transformedText = hasActiveToken(activeTokens, 'smallcaps')
    ? applySmallCaps(text)
    : text;

  const gradientToken = getActiveGradientToken(activeTokens);

  if (!gradientToken) {
    segments.push({
      text: transformedText,
      style: buildSegmentStyle(activeTokens, undefined, shadow),
    });
    return;
  }

  const chars = Array.from(transformedText);
  const visibleChars = chars.filter((char) => char !== ' ');

  if (visibleChars.length === 0) {
    segments.push({
      text: transformedText,
      style: buildSegmentStyle(activeTokens, undefined, shadow),
    });
    return;
  }

  let visibleIndex = 0;

  for (const char of chars) {
    if (char === ' ') {
      segments.push({
        text: char,
        style: buildSegmentStyle(activeTokens, undefined, shadow),
      });
      continue;
    }

    const t = visibleChars.length === 1 ? 0 : visibleIndex / (visibleChars.length - 1);

    segments.push({
      text: char,
      style: buildSegmentStyle(activeTokens, interpolateGradientColor(gradientToken.colors, t), shadow),
    });

    visibleIndex += 1;
  }
}

function parseStyleTag(tagContent: string): ParsedStyleTag | null {
  const normalized = tagContent.trim();
  if (!normalized) return null;

  if (normalized.startsWith('/')) {
    const closingName = normalizeTagName(normalized.slice(1));
    return {
      kind: 'close',
      name: closingName,
    };
  }

  const normalizedName = normalizeTagName(normalized);

  if (normalizedName === 'reset') {
    return {
      kind: 'close',
      name: 'reset',
    };
  }

  if (isHexColor(normalizedName) || normalizedName in NAMED_COLORS) {
    return {
      kind: 'open',
      token: {
        kind: 'color',
        name: normalizedName,
        color: resolveCssColor(normalizedName),
      },
    };
  }

  if (
    normalizedName === 'bold' ||
    normalizedName === 'italic' ||
    normalizedName === 'underlined' ||
    normalizedName === 'strikethrough' ||
    normalizedName === 'obfuscated' ||
    normalizedName === 'smallcaps'
  ) {
    const kind =
      normalizedName === 'bold' ||
      normalizedName === 'italic' ||
      normalizedName === 'underlined' ||
      normalizedName === 'strikethrough' ||
      normalizedName === 'obfuscated' ||
      normalizedName === 'smallcaps'
        ? normalizedName
        : 'bold';

    return {
      kind: 'open',
      token: {
        kind,
        name: kind,
      } as ActiveStyleToken,
    };
  }

  if (normalizedName.startsWith('gradient:')) {
    const gradientParts = normalizedName
      .slice('gradient:'.length)
      .split(':')
      .map((part) => resolveCssColor(part))
      .filter(Boolean);

    if (gradientParts.length >= 2) {
      return {
        kind: 'open',
        token: {
          kind: 'gradient',
          name: 'gradient',
          colors: gradientParts,
        },
      };
    }
  }

  return null;
}

function normalizeTagName(value: string) {
  return value.trim().toLowerCase();
}

function buildSegmentStyle(
  activeTokens: ActiveStyleToken[],
  gradientColor?: string,
  shadow: boolean = true,
): CSSProperties {
  const style: CSSProperties = {
    fontFamily: '"Minecraft Preview", monospace',
    textShadow: shadow ? '2px 2px 0 rgba(0, 0, 0, 0.55)' : undefined,
  };

  for (const token of activeTokens) {
    switch (token.kind) {
      case 'color':
        if (!gradientColor) {
          style.color = token.color;
        }
        break;
      case 'gradient':
        break;
      case 'bold':
        style.fontWeight = 700;
        break;
      case 'italic':
        style.fontStyle = 'italic';
        break;
      case 'underlined':
        style.textDecoration = joinDecorations(style.textDecoration, 'underline');
        break;
      case 'strikethrough':
        style.textDecoration = joinDecorations(style.textDecoration, 'line-through');
        break;
      case 'obfuscated':
        style.filter = 'blur(0.35px)';
        break;
    }
  }

  if (gradientColor) {
    style.color = gradientColor;
  }

  return style;
}

function joinDecorations(current: CSSProperties['textDecoration'], value: string) {
  if (!current || typeof current !== 'string') return value;
  return current.includes(value) ? current : `${current} ${value}`;
}

function removeLastMatchingToken(activeTokens: ActiveStyleToken[], name: string) {
  for (let index = activeTokens.length - 1; index >= 0; index -= 1) {
    if (activeTokens[index].name === name) {
      activeTokens.splice(index, 1);
      return;
    }
  }
}

function toMiniMessageColorTag(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized in LEGACY_COLORS) {
    return `<${LEGACY_COLORS[normalized]}>`;
  }

  if (isHexColor(normalized)) {
    return `<${normalized}>`;
  }

  if (normalized in NAMED_COLORS) {
    return `<${normalized}>`;
  }

  return '<white>';
}

function resolveCssColor(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized in LEGACY_COLORS) {
    return resolveCssColor(LEGACY_COLORS[normalized]);
  }

  if (isHexColor(normalized)) {
    return normalized;
  }

  return NAMED_COLORS[normalized] ?? '#ffffff';
}

function isHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function interpolateGradientColor(colors: string[], t: number) {
  if (colors.length === 0) return '#ffffff';
  if (colors.length === 1) return colors[0];

  const scaled = t * (colors.length - 1);
  const index = Math.floor(scaled);
  const localT = scaled - index;

  const start = hexToRgb(colors[index] ?? colors[0]);
  const end = hexToRgb(colors[index + 1] ?? colors[colors.length - 1]);

  const r = Math.round(start.r + (end.r - start.r) * localT);
  const g = Math.round(start.g + (end.g - start.g) * localT);
  const b = Math.round(start.b + (end.b - start.b) * localT);

  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;
}

function getActiveGradientToken(activeTokens: ActiveStyleToken[]) {
  for (let index = activeTokens.length - 1; index >= 0; index -= 1) {
    const token = activeTokens[index];
    if (token.kind === 'gradient') return token;
  }

  return null;
}

function createCharacterMap(original: string, replacements: string) {
  const originalChars = Array.from(original);
  const replacementChars = Array.from(replacements);

  if (originalChars.length !== replacementChars.length) {
    throw new Error('Original and replacement texts must be of the same length.');
  }

  const map = new Map<string, string>();

  for (let index = 0; index < originalChars.length; index += 1) {
    map.set(originalChars[index]!, replacementChars[index]!);
  }

  return map;
}

function englishifyText(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

function applySmallCaps(text: string) {
  const englishified = englishifyText(text);
  return Array.from(englishified)
    .map((char) => SMALL_CAPS_MAP.get(char) ?? char)
    .join('');
}

function hasActiveToken(
  activeTokens: ActiveStyleToken[],
  kind: ActiveStyleToken['kind'],
) {
  return activeTokens.some((token) => token.kind === kind);
}