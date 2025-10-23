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
  });
});
