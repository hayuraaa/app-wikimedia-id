// Gaya isi artikel (.article-content) — dipakai halaman /rubrik/[slug] dan editor /tulis-artikel
// agar tulisan di editor tampil sama dengan artikel yang sudah terbit.
export const ARTICLE_CONTENT_CSS = `
.article-content {
  font-family: var(--font-source-serif);
  font-size: 17px;
  line-height: 1.85;
  color: #1a1a18;
  max-width: 720px;
}
.article-content p { margin: 0 0 1.5em; }
.article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6 { font-family: var(--font-montserrat); }
.article-content h2 { font-size: 1.55em; font-weight: 700; color: #0d0d0d; margin: 2em 0 0.6em; line-height: 1.25; padding-bottom: 8px; border-bottom: 2px solid #e5e2dd; }
.article-content h3 { font-size: 1.25em; font-weight: 700; color: #0d0d0d; margin: 1.6em 0 0.5em; line-height: 1.3; }
.article-content h4 { font-size: 1.1em; font-weight: 700; color: #2a2826; margin: 1.4em 0 0.4em; }
.article-content a { color: #1e4d7b; text-decoration: underline; text-underline-offset: 3px; transition: color 0.15s; }
.article-content a:hover { color: #0C57A8; }
.article-content blockquote { margin: 2em 0; padding: 16px 24px; border-left: 4px solid #0C57A8; background: rgba(12,87,168,0.04); border-radius: 0 4px 4px 0; font-style: italic; color: #3a3a3a; }
.article-content blockquote p { margin: 0; }
.article-content ul { list-style-type: disc; margin: 0 0 1.5em; padding-left: 1.75em; }
.article-content ol { list-style-type: decimal; margin: 0 0 1.5em; padding-left: 1.75em; }
.article-content ul ul { list-style-type: circle; margin: 0.25em 0 0.25em; }
.article-content ul ul ul { list-style-type: square; }
.article-content li { margin-bottom: 0.4em; }
.article-content li > p { margin: 0; }
.article-content img { max-width: 100%; height: auto; border-radius: 4px; margin: 1.5em 0 0; border: 1px solid #e5e2dd; display: block; }
.article-content figure { margin: 1.8em 0; }
.article-content figure img { margin: 0; width: 100%; }
/* Perataan gambar dari editor (data-align) & lebar hasil ubah ukuran (style width) */
.article-content figure[data-align="center"] img { margin-left: auto; margin-right: auto; }
.article-content figure[data-align="right"] img { margin-left: auto; }
.article-content figcaption { margin-top: 6px; font-size: 0.82em; color: #7a7874; font-style: italic; font-family: var(--font-montserrat); text-align: center; line-height: 1.45; padding: 0 8px; }
.article-content figcaption p { margin: 0; }
.article-content code { font-family: 'Courier New', monospace; font-size: 0.88em; background: #f0eeec; border: 1px solid #e5e2dd; padding: 1px 6px; border-radius: 3px; color: #0C57A8; }
.article-content pre { background: #0d0d0d; color: #f8f8f6; padding: 20px 24px; border-radius: 4px; overflow-x: auto; margin: 1.5em 0; font-size: 0.875em; line-height: 1.6; }
.article-content pre code { background: none; border: none; padding: 0; color: inherit; font-size: inherit; }
.article-content table { width: 100%; border-collapse: collapse; margin: 1.5em 0; font-size: 0.9em; font-family: var(--font-montserrat); }
.article-content th { background: #0d0d0d; color: #fff; padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
.article-content td { padding: 10px 14px; border-bottom: 1px solid #e5e2dd; color: #2a2826; }
.article-content tr:hover td { background: #faf9f7; }
.article-content strong { font-weight: 700; color: #0d0d0d; }
.article-content em { font-style: italic; }
.article-content u { text-decoration: underline; text-underline-offset: 2px; }
.article-content s, .article-content del { text-decoration: line-through; color: #6b7280; }
.article-content sup { vertical-align: super; font-size: 0.75em; }
.article-content sub { vertical-align: sub; font-size: 0.75em; }
.article-content mark { background-color: #fef08a; color: inherit; border-radius: 2px; padding: 0 2px; }
.article-content hr { border: none; border-top: 2px solid #e5e2dd; margin: 2.5em 0; }
/* Task List */
.article-content ul[data-type="taskList"] { list-style: none; padding-left: 0.25em; }
.article-content ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5em; }
.article-content ul[data-type="taskList"] li > label { flex-shrink: 0; margin-top: 0.2em; }
.article-content ul[data-type="taskList"] li > label input[type="checkbox"] { width: 1em; height: 1em; accent-color: #0C57A8; cursor: default; }
.article-content ul[data-type="taskList"] li > div { flex: 1; }
.article-content ul[data-type="taskList"] li[data-checked="true"] > div { text-decoration: line-through; color: #9ca3af; }
`;
