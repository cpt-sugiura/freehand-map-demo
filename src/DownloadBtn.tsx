import React from 'react';
import * as htmlToImage from 'html-to-image';

// 要素からダウンロード
const downloadElAsPng = (el: HTMLElement, filename: string) => {
  return htmlToImage.toPng(el).then((dataUrl) => {
    const aEl = document.createElement('a');
    aEl.href = dataUrl;
    aEl.download = filename;
    aEl.click();
  });
};
// クエリセレクタからダウンロード
const downloadElAsPngFromQuery = (query: string, filename: string) => {
  const el = document.querySelector(query);
  if (!el) {
    console.error(`要素が見つかりませんでした。query: ${query}`);
    return new Promise(() => null);
  }
  return downloadElAsPng(el as HTMLElement, filename);
};

export const DownloadBtn: React.FC<{ query: string }> = ({ query }) => {
  const filename = '手書き付き地図_' + new Date().toLocaleString().replace(':', '_') + '.png';
  return (
    <button onClick={() => downloadElAsPngFromQuery(query, filename)}>手書き入りの地図を画像化してダウンロード</button>
  );
};
