/**
 * 強調パターンのリスト: 太字(** と __)を先に処理
 */
const emphasisPatterns = [
  {
    marker: '**',
    regex: /\*\*([^\*]+?)\*\*/g,
  },
  {
    marker: '__',
    regex: /__([^_]+?)__/g,
  },
  {
    marker: '*',
    regex: /(?<!\*)\*(?!\*)([^\*]+?)\*(?!\*)/g,
  },
  {
    marker: '_',
    regex: /(?<!_)_(?!_)([^_]+?)_(?!_)/g,
  },
];

/**
 * 行内のテキストに対して強調マーカーの処理を適用
 * @param text - 処理対象のテキスト
 * @param isListItemContent - このテキストが箇条書きアイテムの内容かどうか
 * @returns 処理済みのテキスト
 */
function processEmphasisInText(text: string, isListItemContent: boolean = false): string {
  let result = text;

  for (const pattern of emphasisPatterns) {
    result = result.replace(pattern.regex, (match, innerText) => {
      // マーカーを抽出
      const marker = pattern.marker;

      // 前後の文字を確認
      const firstChar = innerText.charAt(0);
      const lastChar = innerText.charAt(innerText.length - 1);

      // 鉤括弧や括弧などの記号で始まる/終わるかチェック
      const symbolsNeedingSpace = '「『（【';
      const symbolsNeedingSpaceEnd = '」』）】';

      // 括弧を含むかチェック
      const hasOpeningBracket = symbolsNeedingSpace.split('').some(bracket => innerText.includes(bracket));
      const hasClosingBracket = symbolsNeedingSpaceEnd.split('').some(bracket => innerText.includes(bracket));

      // 特殊文字（記号）かチェック
      // 句読点や%などの特殊文字を検出（全角・半角括弧、クォート含む、全角角括弧含む）
      const specialCharPattern = /[%！？。、，；：！＠＃＄％＆＊（）()"'\[\]［］]/;
      const hasSpecialChar = specialCharPattern.test(innerText);

      // 前方にスペースが必要か
      // テキストが括弧で始まるか、括弧や特殊文字を含む場合
      let needsSpaceBefore = symbolsNeedingSpace.includes(firstChar) || (hasOpeningBracket || hasClosingBracket || hasSpecialChar);

      // 後方にスペースが必要か
      // テキストが括弧で終わるか、括弧や特殊文字を含む場合
      let needsSpaceAfter = symbolsNeedingSpaceEnd.includes(lastChar) || (hasOpeningBracket || hasClosingBracket || hasSpecialChar);

      // リストアイテムの内容では、強調マーカーの前後のスペース挿入を行わない
      // これによりリストの構造（インデント）が保持される
      if (isListItemContent) {
        needsSpaceBefore = false;
        needsSpaceAfter = false;
      }

      // スペースを挿入（マーカーの中にではなく、マーカーの前後に）
      let result = match;
      if (needsSpaceAfter) {
        result = result + ' ';
      }
      if (needsSpaceBefore) {
        result = ' ' + result;
      }

      return result;
    });
  }

  return result;
}

/**
 * Markdown の強調タグを修正する関数
 * 鉤括弧などの記号を含む強調表現の前後に半角スペースを挿入します
 * また、URL を含む全角括弧を半角括弧に変換します
 *
 * @param markdown - 修正対象の Markdown 文字列
 * @returns 修正済みの Markdown 文字列
 */
export function fixMarkdown(markdown: string): string {
  let result = markdown;

  // URL を含む全角括弧を半角括弧に変換し、前後にスペースを挿入
  // スペースの有無を正規化する
  result = result.replace(
    /\s*（\s*(https?:\/\/[^）]+)\s*）\s*/g,
    (match, url) => {
      // 前後のスペースを1つに正規化
      return ` (${url}) `;
    }
  );

  // URL を含む半角括弧の前後にスペースを挿入
  // スペースの有無を正規化する
  // ただし、Markdownリンク記法 [テキスト](URL) は除外
  result = result.replace(
    /(?<!\])\s*\(\s*(https?:\/\/[^)\s]+)\s*\)\s*/g,
    (match, url) => {
      // 前後のスペースを1つに正規化
      return ` (${url}) `;
    }
  );

  // 行単位で処理：行頭のインデント（および箇条書きマーカー）を保持して、行内容に対して強調マーカー処理を適用
  result = result
    .split('\n')
    .map((line) => {
      // 行頭のインデント + 箇条書きマーカー（* - +）+ スペース を抽出
      // これにより、箇条書きのアスタリスクが強調マーカーとして誤認識されるのを防ぐ
      const isListItem = /^(\s*[\*\-\+]\s+)(.*)$/.test(line);
      const structureMatch = line.match(/^(\s*[\*\-\+]\s+)(.*)$/) || line.match(/^(\s*)(.*)$/);
      const structure = structureMatch?.[1] ?? '';
      const content = structureMatch?.[2] ?? '';

      // インデント部分を除いた内容に対して強調マーカー処理を適用
      // リストアイテムの場合は、isListItemContent=true を渡して、スペース挿入を行わない
      const processedContent = processEmphasisInText(content, isListItem);

      // インデントと処理済みの内容を結合
      return structure + processedContent;
    })
    .join('\n');

  return result;
}

