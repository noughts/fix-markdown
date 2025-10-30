import { describe, it, expect } from 'bun:test';
import { marked } from 'marked';
import { fixMarkdown } from './index';

describe('fixMarkdown', () => {
  describe('太字の強調修正', () => {
    it('基本的な鉤括弧を含む太字は前後にスペースが挿入される', () => {
      const input = '僕は**「こんにちは」**と言った。';
      const expected = '僕は **「こんにちは」** と言った。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('二重括弧を含む太字は前後にスペースが挿入される', () => {
      const input = '彼女は**『ありがとう』**と返した。';
      const expected = '彼女は **『ありがとう』** と返した。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('二重括弧と通常のテキストを含む太字は前後にスペースが挿入される', () => {
      const input = '2025年9月30日、森香澄さんは**TBSラジオ『パンサー向井の#ふらっと』**に出演し、"あざとさ"を個性とする上で意識していることを明かしました。';
      const expected = '2025年9月30日、森香澄さんは **TBSラジオ『パンサー向井の#ふらっと』** に出演し、"あざとさ"を個性とする上で意識していることを明かしました。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('丸括弧を含む太字は前後にスペースが挿入される', () => {
      const input = 'これは**（重要）**な情報です。';
      const expected = 'これは **（重要）** な情報です。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('角括弧を含む太字は前後にスペースが挿入される', () => {
      const input = '複数の**【リンク】**です。';
      const expected = '複数の **【リンク】** です。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('半角角括弧を含む太字は前後にスペースが挿入される', () => {
      const input = 'サイト右上にある**[アカウント開設]**を押下します。';
      const expected = 'サイト右上にある **[アカウント開設]** を押下します。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('全角角括弧を含む太字は前後にスペースが挿入される', () => {
      const input = 'メールアドレスを記入し**［次へ］**ボタンを押すと、ワンタイムパスワードがメールで届きます。';
      const expected = 'メールアドレスを記入し **［次へ］** ボタンを押すと、ワンタイムパスワードがメールで届きます。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('通常のテキストは修正されない', () => {
      const input = '**通常のテキスト**です。';
      const expected = '**通常のテキスト**です。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('スペースが既にある場合は修正される', () => {
      const input = '既に **「正しい」** 形式です。';
      const expected = '既に  **「正しい」**  形式です。';
      expect(fixMarkdown(input)).toBe(expected);
    });
  });

  describe('斜体の強調修正', () => {
    it('基本的な鉤括弧を含む斜体は前後にスペースが挿入される', () => {
      const input = '彼女は*「ありがとう」*と言った。';
      const expected = '彼女は *「ありがとう」* と言った。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('二重括弧を含む斜体は前後にスペースが挿入される', () => {
      const input = 'これは*『重要』*な情報です。';
      const expected = 'これは *『重要』* な情報です。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('通常のテキストの斜体は修正されない', () => {
      const input = '*斜体のテキスト*です。';
      const expected = '*斜体のテキスト*です。';
      expect(fixMarkdown(input)).toBe(expected);
    });
  });

  describe('アンダースコア太字の強調修正', () => {
    it('基本的な鉤括弧を含むアンダースコア太字は前後にスペースが挿入される', () => {
      const input = 'これは__「重要」__な情報です。';
      const expected = 'これは __「重要」__ な情報です。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('括弧を含むアンダースコア太字は前後にスペースが挿入される', () => {
      const input = '注意：__（必須）__項目です。';
      const expected = '注意： __（必須）__ 項目です。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('通常のテキストのアンダースコア太字は修正されない', () => {
      const input = '__通常のテキスト__です。';
      const expected = '__通常のテキスト__です。';
      expect(fixMarkdown(input)).toBe(expected);
    });
  });

  describe('アンダースコア斜体の強調修正', () => {
    it('基本的な鉤括弧を含むアンダースコア斜体は前後にスペースが挿入される', () => {
      const input = 'これは_「重要」_な情報です。';
      const expected = 'これは _「重要」_ な情報です。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('通常のテキストのアンダースコア斜体は修正されない', () => {
      const input = '_斜体のテキスト_です。';
      const expected = '_斜体のテキスト_です。';
      expect(fixMarkdown(input)).toBe(expected);
    });
  });

  describe('複数の強調が混在する場合', () => {
    it('複数の異なる強調が混在している場合は全て修正される', () => {
      const input = '複数の**【リンク】**と*「テキスト」*が混在しています。';
      const expected = '複数の **【リンク】** と *「テキスト」* が混在しています。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('同じ強調が複数出現する場合は全て修正される', () => {
      const input = '最初は**「テキスト」**で、次に**「別のテキスト」**です。';
      const expected = '最初は **「テキスト」** で、次に **「別のテキスト」** です。';
      expect(fixMarkdown(input)).toBe(expected);
    });
  });

  describe('エッジケース', () => {
    it('空の強調は変更されない', () => {
      const input = '****';
      const expected = '****';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('連続する太字と斜体は正しく処理される', () => {
      const input = 'テキスト**「太字」***「斜体」*です。';
      const expected = 'テキスト **「太字」**  *「斜体」* です。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('複雑なネストされた括弧は処理される', () => {
      const input = '**【「ネスト」】**です。';
      const expected = ' **【「ネスト」】** です。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('括弧の外側に強調マーカーがある場合は変更されない', () => {
      const input = '僕は「**こんにちは**」と言った。';
      const expected = '僕は「**こんにちは**」と言った。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('数字を含む太字は修正される', () => {
      const input = '精度は**100%**です。';
      const expected = '精度は **100%** です。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('括弧と数字を含む太字は修正される', () => {
      const input = '私の名前は**田中(25)**です。';
      const expected = '私の名前は **田中(25)** です。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('ダブルクォートを含む太字は修正される', () => {
      const input = '私の名前は**"田中"**です';
      const expected = '私の名前は **"田中"** です';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('引用符で括られた太字は変更されない', () => {
      const input = '**ひめゆり平和祈念資料館の普天間朝佳館長**は「資料館のこれまでの展示や体験者の証言の中に、西田議員が言っていたような記述や表現は一切ない」と断言。';
      const expected = '**ひめゆり平和祈念資料館の普天間朝佳館長**は「資料館のこれまでの展示や体験者の証言の中に、西田議員が言っていたような記述や表現は一切ない」と断言。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('複数の斜体が連続している場合は全て修正される', () => {
      const input = "第一項目*「内容1」*と第二項目*「内容2」*があります。";
      const expected = "第一項目 *「内容1」* と第二項目 *「内容2」* があります。";
      expect(fixMarkdown(input)).toBe(expected);
    });
  });

  describe('全角括弧とURLの修正', () => {
    it('全角括弧で囲まれたURLを半角括弧に変換し、前後にスペースを挿入', () => {
      const input = "トップログインページ（https://ads.smartnews.com/login）から「確認コードでログイン」を選択し、メールアドレスに送信されるワンタイムパスワードを入力してログインします。";
      const expected = "トップログインページ (https://ads.smartnews.com/login) から「確認コードでログイン」を選択し、メールアドレスに送信されるワンタイムパスワードを入力してログインします。";
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('URL以外の全角括弧は変換しない', () => {
      const input = "これは（注釈です）テキスト";
      const expected = "これは（注釈です）テキスト";
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('既にスペースがある場合も正規化する', () => {
      const input = "ページ （https://example.com） から";
      const expected = "ページ (https://example.com) から";
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('複数のURL付き全角括弧を変換', () => {
      const input = "サイトA（https://a.com）とサイトB（https://b.com）です";
      const expected = "サイトA (https://a.com) とサイトB (https://b.com) です";
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('http:// で始まるURLも変換する', () => {
      const input = "ポータル（http://example.com）にアクセス";
      const expected = "ポータル (http://example.com) にアクセス";
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('半角括弧で囲まれたURLの前後にスペースを挿入', () => {
      const input = '公式サポート(https://smartnews-ads.zendesk.com/hc/ja/requests/new)までお問い合わせください。';
      const expected = '公式サポート (https://smartnews-ads.zendesk.com/hc/ja/requests/new) までお問い合わせください。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('複数の半角括弧URLを変換', () => {
      const input = "リンクA(https://a.com)とリンクB(https://b.com)です";
      const expected = "リンクA (https://a.com) とリンクB (https://b.com) です";
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('半角括弧URLの既存スペースを正規化', () => {
      const input = "サイト ( https://example.com ) です";
      const expected = "サイト (https://example.com) です";
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('Markdownリンク記法の括弧は変更されない', () => {
      const input = '詳しくは[ヘルプページ](http://example.com)をご覧ください。';
      const expected = '詳しくは[ヘルプページ](http://example.com)をご覧ください。';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('複数のMarkdownリンクを含むテキストは変更されない', () => {
      const input = '[リンク1](http://a.com)と[リンク2](https://b.com)です';
      const expected = '[リンク1](http://a.com)と[リンク2](https://b.com)です';
      expect(fixMarkdown(input)).toBe(expected);
    });

    it('Markdownリンクと単独の括弧URLが混在する場合', () => {
      const input = '[ヘルプ](http://help.com)と情報(https://info.com)です';
      const expected = '[ヘルプ](http://help.com)と情報 (https://info.com) です';
      expect(fixMarkdown(input)).toBe(expected);
    });
  });

  describe('箇条書きのインデント保持', () => {
    it('インデント付きの箇条書きのアスタリスク位置が保持される', () => {
      const input = `SmartNews Adsでは、主に以下の広告フォーマットが利用可能です。

*   **Large Unit**
    *   **ブランド認知キャンペーン**目的の、視認領域の大きな広告フォーマットです。
    *   動画および静止画広告で利用でき、従来よりも大きな視認領域を提供し、ユーザーの注目を効果的に集めます。

*   **カルーセル広告（Story creative）**
    *   **静止画のみ**に対応しており、クリエイティブをスクロールさせることでストーリー性を持たせた訴求が可能です。`;

      const output = fixMarkdown(input);
      const inputLines = input.split('\n');
      const outputLines = output.split('\n');

      // インデントと箇条書き記号が保持されることを確認
      for (let i = 0; i < inputLines.length; i++) {
        const inputLine = inputLines[i];
        const outputLine = outputLines[i];

        // 箇条書き行であれば、インデントと * の位置が保持されることを確認
        if (inputLine.match(/^\s*\*\s+/)) {
          // インデントの検出
          const inputIndent = inputLine.match(/^(\s*)\*/)[1].length;
          const outputIndent = outputLine.match(/^(\s*)\*/)[1].length;
          expect(inputIndent).toBe(outputIndent);
        }
      }
    });

    it('括弧を含む太字が行頭のインデントに影響を与えない', () => {
      const input = '*   **カルーセル広告（Story creative）**';
      const output = fixMarkdown(input);

      // 入力と出力の行全体が一致することを確認（アスタリスクの位置と後続のスペースを保持）
      expect(input).toBe(output);
    });

    it('複数の括弧を含む太字が行頭のインデントに影響を与えない', () => {
      const input = '    *   **カルーセル広告（Story creative）**';
      const output = fixMarkdown(input);

      // インデントが保持されることを確認
      expect(input.match(/^(\s*)\*/)[1]).toBe(output.match(/^(\s*)\*/)[1]);
    });

    it('Markdownリンク付きの複数の箇条書きアイテムのインデントが正しく保持される', () => {
      const input = `*   **[審査基準解説資料](https://help-ads.smartnews.com/item-7651/)**
    *   SmartNews Adsの広告掲載基準の事例を交え、特に薬機法に関連した基本的な審査基準の考え方やNG事例が豊富に紹介されています。
*   **[EC広告 医薬品・化粧品・健康食品商材の掲載基準と注意点](https://help-ads.smartnews.com/item-7649/)**
    *   こちらも同様に、SmartNews Adsの広告掲載基準の事例を交え、薬機法に関連する審査基準の考え方やNG事例が紹介されており、資料のダウンロードが可能です。`;

      const output = fixMarkdown(input);
      const inputLines = input.split('\n');
      const outputLines = output.split('\n');

      // 各行について検証
      for (let i = 0; i < inputLines.length; i++) {
        const inputLine = inputLines[i];
        const outputLine = outputLines[i];

        if (inputLine.match(/^\s*\*\s+/)) {
          // リストマーカーの位置を確認
          const inputMatch = inputLine.match(/^(\s*)\*(\s+)/);
          const outputMatch = outputLine.match(/^(\s*)\*(\s+)/);

          expect(inputMatch[1].length).toBe(outputMatch[1].length); // インデント
          expect(inputMatch[2].length).toBe(outputMatch[2].length); // アスタリスク後のスペース
        }
      }

      // 入出力が完全に一致することを確認
      expect(input).toBe(output);
    });
  });

  describe('Markdownパーサーでの検証', () => {
    it('修正されたMarkdownが有効なリスト構造としてパースされる', () => {
      const input = `*   **[審査基準解説資料](https://help-ads.smartnews.com/item-7651/)**
    *   SmartNews Adsの広告掲載基準の事例を交え、特に薬機法に関連した基本的な審査基準の考え方やNG事例が豊富に紹介されています。
*   **[EC広告 医薬品・化粧品・健康食品商材の掲載基準と注意点](https://help-ads.smartnews.com/item-7649/)**
    *   こちらも同様に、SmartNews Adsの広告掲載基準の事例を交え、薬機法に関連する審査基準の考え方やNG事例が紹介されており、資料のダウンロードが可能です。`;

      const output = fixMarkdown(input);
      const tokens = marked.lexer(output);

      // リストトークンを抽出
      const listTokens = tokens.filter((token: any) => token.type === 'list');

      // リストが存在することを確認
      expect(listTokens.length).toBeGreaterThan(0);

      // 最初のリストを検査
      const firstList = listTokens[0] as any;

      // リストアイテムが正しく認識されていることを確認
      expect(firstList.items.length).toBeGreaterThanOrEqual(2);

      // ネストされたリストが存在することを確認
      // marked では、ネストされたリストは item.tokens 配列の中に list トークンとして格納される
      const itemsWithNestedLists = firstList.items.filter((item: any) =>
        item.tokens && item.tokens.some((token: any) => token.type === 'list')
      );
      expect(itemsWithNestedLists.length).toBeGreaterThan(0);
    });

    it('リンク付きの太字がリスト内で正しく解釈される', () => {
      const input = `*   **[リンクテキスト](https://example.com)**
    *   サブアイテム`;

      const output = fixMarkdown(input);
      const html = marked(output);

      // HTMLが生成されることを確認
      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(0);

      // リスト構造を含むことを確認
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>');

      // リンクが含まれることを確認
      expect(html).toContain('<a href');
      expect(html).toContain('リンクテキスト');
    });

    it('複雑なネストされたリストがパースされる', () => {
      const input = `*   **[審査基準解説資料](https://help-ads.smartnews.com/item-7651/)**
    *   SmartNews Adsの広告掲載基準の事例を交え、特に薬機法に関連した基本的な審査基準の考え方やNG事例が豊富に紹介されています。
*   **[EC広告 医薬品・化粧品・健康食品商材の掲載基準と注意点](https://help-ads.smartnews.com/item-7649/)**
    *   こちらも同様に、SmartNews Adsの広告掲載基準の事例を交え、薬機法に関連する審査基準の考え方やNG事例が紹介されており、資料のダウンロードが可能です。`;

      const output = fixMarkdown(input);
      const html = marked(output);

      // 最上位のリストが1つであることを確認（<ul>は1つ）
      const ulMatches = html.match(/<ul>/g);
      expect(ulMatches?.length).toBeGreaterThanOrEqual(1);

      // ネストされたリストが存在することを確認
      expect(html).toContain('<ul>\n<li>');

      // 複数のリストアイテムが存在することを確認
      const liMatches = html.match(/<li>/g);
      expect(liMatches?.length).toBeGreaterThanOrEqual(4); // 上位2つ + ネスト2つ以上

      // リンクが含まれることを確認
      expect(html.match(/<a href/g)?.length).toBeGreaterThanOrEqual(2);
    });
  });
});
