/**
 * Markdown の強調タグを修正する関数
 * 鉤括弧などの記号を含む強調表現の前後に半角スペースを挿入します
 *
 * @param markdown - 修正対象の Markdown 文字列
 * @returns 修正済みの Markdown 文字列
 */
export function fixMarkdownEmphasis(markdown: string): string {
  // 強調パターンのリスト: 太字(** と __)を先に処理
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

  let result = markdown;

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
      // 句読点や%などの特殊文字を検出（全角・半角括弧、クォート含む）
      const specialCharPattern = /[%！？。、，；：！＠＃＄％＆＊（）()"']/;
      const hasSpecialChar = specialCharPattern.test(innerText);

      // 前方にスペースが必要か
      // テキストが括弧で始まるか、括弧や特殊文字を含む場合
      const needsSpaceBefore = symbolsNeedingSpace.includes(firstChar) || (hasOpeningBracket || hasClosingBracket || hasSpecialChar);

      // 後方にスペースが必要か
      // テキストが括弧で終わるか、括弧や特殊文字を含む場合
      const needsSpaceAfter = symbolsNeedingSpaceEnd.includes(lastChar) || (hasOpeningBracket || hasClosingBracket || hasSpecialChar);

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

