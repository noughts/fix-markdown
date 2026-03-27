# fix-markdown

**Say goodbye to broken asterisks in Markdown.**

fix-markdown emphasis formatting by inserting spaces around markers containing brackets and special characters.

## Problem

When you write `僕は**「こんにちは」**と言った。`, it should render as:

> 僕は<b>「こんにちは」</b>と言った。

But most Markdown parsers fail to parse the emphasis, rendering it literally as:

> 僕は\*\*「こんにちは」\*\*と言った。

This is due to the [CommonMark spec](https://spec.commonmark.org/0.31.2/#emphasis-and-strong-emphasis) — characters like `「」（）` are classified as Unicode punctuation, which breaks the delimiter run detection rules. Fixing this at the spec level would be costly and unrealistic.

## Solution

Since changing the CommonMark spec is not practical, this utility takes a pragmatic workaround: insert spaces around emphasis markers so that parsers can recognize them correctly.

This means extra spaces will appear in the output (e.g. `僕は **「こんにちは」** と言った。`), but visible spaces are far better than raw asterisks leaking into the rendered text.

## Usage

```typescript
import { fixMarkdown } from 'fix-markdown';

const input = '僕は**「こんにちは」**と言った。';
const fixed = fixMarkdown(input);
// Output: '僕は **「こんにちは」** と言った。'
```

## Supported Emphasis Formats

- Bold: `**text**`, `__text__`
- Italic: `*text*`, `_text_`