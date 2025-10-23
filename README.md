# markdown-fix

Fix Markdown emphasis formatting by inserting spaces around markers containing brackets and special characters.

## Problem

LLMs often output invalid Markdown emphasis when using Japanese brackets:

```markdown
僕は**「こんにちは」**と言った。
```

This should be:

```markdown
僕は **「こんにちは」** と言った。
```

## Solution

This utility automatically fixes emphasis formatting by:
- Detecting brackets (`「」『』（）【】`) and special characters (`%!?。、` etc.) within emphasis markers
- Inserting half-width spaces around the markers

## Usage

```typescript
import { fixMarkdownEmphasis } from 'markdown-fix';

const input = '僕は**「こんにちは」**と言った。';
const fixed = fixMarkdownEmphasis(input);
// Output: '僕は **「こんにちは」** と言った。'
```

## Supported Emphasis Formats

- Bold: `**text**`, `__text__`
- Italic: `*text*`, `_text_`

## Development

Install dependencies:

```bash
bun install
```

Run tests:

```bash
bun test
```

All 22 tests pass ✅
