import { describe, it, expect } from 'bun:test';
import { fixMarkdownEmphasis } from './index';

describe('fixMarkdownEmphasis', () => {
  describe('太字の強調修正', () => {
    it('基本的な鉤括弧を含む太字は前後にスペースが挿入される', () => {
      const input = '僕は**「こんにちは」**と言った。';
      const expected = '僕は **「こんにちは」** と言った。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('二重括弧を含む太字は前後にスペースが挿入される', () => {
      const input = '彼女は**『ありがとう』**と返した。';
      const expected = '彼女は **『ありがとう』** と返した。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('二重括弧と通常のテキストを含む太字は前後にスペースが挿入される', () => {
      const input = '2025年9月30日、森香澄さんは**TBSラジオ『パンサー向井の#ふらっと』**に出演し、"あざとさ"を個性とする上で意識していることを明かしました。';
      const expected = '2025年9月30日、森香澄さんは **TBSラジオ『パンサー向井の#ふらっと』** に出演し、"あざとさ"を個性とする上で意識していることを明かしました。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('丸括弧を含む太字は前後にスペースが挿入される', () => {
      const input = 'これは**（重要）**な情報です。';
      const expected = 'これは **（重要）** な情報です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('角括弧を含む太字は前後にスペースが挿入される', () => {
      const input = '複数の**【リンク】**です。';
      const expected = '複数の **【リンク】** です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('通常のテキストは修正されない', () => {
      const input = '**通常のテキスト**です。';
      const expected = '**通常のテキスト**です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('スペースが既にある場合は修正される', () => {
      const input = '既に **「正しい」** 形式です。';
      const expected = '既に  **「正しい」**  形式です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });
  });

  describe('斜体の強調修正', () => {
    it('基本的な鉤括弧を含む斜体は前後にスペースが挿入される', () => {
      const input = '彼女は*「ありがとう」*と言った。';
      const expected = '彼女は *「ありがとう」* と言った。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('二重括弧を含む斜体は前後にスペースが挿入される', () => {
      const input = 'これは*『重要』*な情報です。';
      const expected = 'これは *『重要』* な情報です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('通常のテキストの斜体は修正されない', () => {
      const input = '*斜体のテキスト*です。';
      const expected = '*斜体のテキスト*です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });
  });

  describe('アンダースコア太字の強調修正', () => {
    it('基本的な鉤括弧を含むアンダースコア太字は前後にスペースが挿入される', () => {
      const input = 'これは__「重要」__な情報です。';
      const expected = 'これは __「重要」__ な情報です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('括弧を含むアンダースコア太字は前後にスペースが挿入される', () => {
      const input = '注意：__（必須）__項目です。';
      const expected = '注意： __（必須）__ 項目です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('通常のテキストのアンダースコア太字は修正されない', () => {
      const input = '__通常のテキスト__です。';
      const expected = '__通常のテキスト__です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });
  });

  describe('アンダースコア斜体の強調修正', () => {
    it('基本的な鉤括弧を含むアンダースコア斜体は前後にスペースが挿入される', () => {
      const input = 'これは_「重要」_な情報です。';
      const expected = 'これは _「重要」_ な情報です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('通常のテキストのアンダースコア斜体は修正されない', () => {
      const input = '_斜体のテキスト_です。';
      const expected = '_斜体のテキスト_です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });
  });

  describe('複数の強調が混在する場合', () => {
    it('複数の異なる強調が混在している場合は全て修正される', () => {
      const input = '複数の**【リンク】**と*「テキスト」*が混在しています。';
      const expected = '複数の **【リンク】** と *「テキスト」* が混在しています。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('同じ強調が複数出現する場合は全て修正される', () => {
      const input = '最初は**「テキスト」**で、次に**「別のテキスト」**です。';
      const expected = '最初は **「テキスト」** で、次に **「別のテキスト」** です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });
  });

  describe('エッジケース', () => {
    it('空の強調は変更されない', () => {
      const input = '****';
      const expected = '****';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('連続する太字と斜体は正しく処理される', () => {
      const input = 'テキスト**「太字」***「斜体」*です。';
      const expected = 'テキスト **「太字」**  *「斜体」* です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('複雑なネストされた括弧は処理される', () => {
      const input = '**【「ネスト」】**です。';
      const expected = ' **【「ネスト」】** です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('括弧の外側に強調マーカーがある場合は変更されない', () => {
      const input = '僕は「**こんにちは**」と言った。';
      const expected = '僕は「**こんにちは**」と言った。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('数字を含む太字は修正される', () => {
      const input = '精度は**100%**です。';
      const expected = '精度は **100%** です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('括弧と数字を含む太字は修正される', () => {
      const input = '私の名前は**田中(25)**です。';
      const expected = '私の名前は **田中(25)** です。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('ダブルクォートを含む太字は修正される', () => {
      const input = '私の名前は**"田中"**です';
      const expected = '私の名前は **"田中"** です';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('引用符で括られた太字は変更されない', () => {
      const input = '**ひめゆり平和祈念資料館の普天間朝佳館長**は「資料館のこれまでの展示や体験者の証言の中に、西田議員が言っていたような記述や表現は一切ない」と断言。';
      const expected = '**ひめゆり平和祈念資料館の普天間朝佳館長**は「資料館のこれまでの展示や体験者の証言の中に、西田議員が言っていたような記述や表現は一切ない」と断言。';
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('複数の斜体が連続している場合は全て修正される', () => {
      const input = "第一項目*「内容1」*と第二項目*「内容2」*があります。";
      const expected = "第一項目 *「内容1」* と第二項目 *「内容2」* があります。";
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });
  });

  describe('全角括弧とURLの修正', () => {
    it('全角括弧で囲まれたURLを半角括弧に変換し、前後にスペースを挿入', () => {
      const input = "トップログインページ（https://ads.smartnews.com/login）から「確認コードでログイン」を選択し、メールアドレスに送信されるワンタイムパスワードを入力してログインします。";
      const expected = "トップログインページ (https://ads.smartnews.com/login) から「確認コードでログイン」を選択し、メールアドレスに送信されるワンタイムパスワードを入力してログインします。";
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('URL以外の全角括弧は変換しない', () => {
      const input = "これは（注釈です）テキスト";
      const expected = "これは（注釈です）テキスト";
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('既にスペースがある場合も正規化する', () => {
      const input = "ページ （https://example.com） から";
      const expected = "ページ (https://example.com) から";
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('複数のURL付き全角括弧を変換', () => {
      const input = "サイトA（https://a.com）とサイトB（https://b.com）です";
      const expected = "サイトA (https://a.com) とサイトB (https://b.com) です";
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });

    it('http:// で始まるURLも変換する', () => {
      const input = "ポータル（http://example.com）にアクセス";
      const expected = "ポータル (http://example.com) にアクセス";
      expect(fixMarkdownEmphasis(input)).toBe(expected);
    });
  });
});
