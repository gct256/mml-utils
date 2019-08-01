import chalk from 'chalk';

import { DataSet, DataSetProcessor } from '../types/DataSet';

import { parse as parseByPegParser, SyntaxError } from './pegParser/pegParser';

/**
 * MMLをパースしてトラックごとにまとめる
 *
 * @param mml MML文字列
 */
export const parse = (mml: string): DataSet => {
  const processer = new DataSetProcessor();

  parseByPegParser(mml).some((node) => {
    processer.visit(node);

    return processer.isEnd();
  });

  return processer.getDataSet();
};

/**
 * 行の装飾
 *
 * @param lines 全行
 * @param currentLine 現在の行番号
 * @param error エラー内容
 */
const decorate = (
  lines: string[],
  currentLine: number,
  error: SyntaxError,
): string => {
  const prefix = `${currentLine.toString(10).padStart(5)} | `;
  const line = lines[currentLine];
  const { start, end } = error.location;

  // 範囲外はそのまま
  if (currentLine < start.line || end.line < currentLine) {
    return `${prefix}${line}`;
  }

  // 範囲内

  if (start.line === currentLine) {
    if (end.line === currentLine) {
      // 同じ行にエラーがある場合はそこだけ反転
      return chalk`{magenta ${prefix}${line.slice(
        0,
        start.column - 1,
      )}{inverse ${line.slice(start.column - 1, end.column - 1)}}${line.slice(
        end.column - 1,
      )}}`;
    }

    // 複数行エラーの場合は行末まで反転
    return chalk`{magenta ${prefix}${line.slice(
      0,
      start.column - 1,
    )}{inverse ${line.slice(start.column - 1)}}}`;
  }

  if (end.line === currentLine) {
    // 複数行エラーの末尾なので行頭から該当部分まで反転
    return chalk`{magenta ${prefix}{inverse ${line.slice(
      0,
      end.column - 1,
    )}}${line.slice(end.column - 1)}}`;
  }

  // 複数行エラーの中間はすべて反転
  return chalk`{magenta ${prefix}{inverse ${line}}}`;
};

/**
 * パース時の構文エラーをフォーマット
 *
 * @param error エラー
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatSyntaxError = (mml: string, error?: any): string | Error => {
  if (!(error instanceof SyntaxError)) {
    return error instanceof Error ? error : `${error}`;
  }

  const result: string[] = [error.message, ''];
  // eslint-disable-next-line no-control-regex
  const lines = mml.split(/\x0d\x0a|\x0a|\x0d/);

  lines.unshift('');

  const start = Math.max(1, error.location.start.line - 3);
  const end = Math.min(lines.length - 1, error.location.end.line + 3);

  for (let i = start; i <= end; i += 1) {
    result.push(decorate(lines, i, error));
  }

  result.push('');

  return result.join('\n');
};
