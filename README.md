# sf25-assets

SF25フロントエンドから直接アクセスできるデータセット。
`https://assets.seikosf25.jp/assets/[../]*..\.[json | md]`でアクセス可能。

## レポジトリのディレクトリ構造

- `script`: アセット生成のためのJavaScriptファイル
  - `main.js`: エントリーポイント
  - `search-index.js`: 検索インデックス生成
  - `booth.js`: 企画情報用のアセット生成
  - `blog.js`: ブログ用のアセット生成
  - `timetable.js`: タイムテーブル用のアセット生成
  - `news.js`: ニュース情報のアセット生成
  - `cm.js`: CM動画管理（存在不明）
- `assets`: アセット本体の場所。
  - `index.json`: 検索インデックス
  - `booths`: 企画情報関連
    - `[booth_id]`: 各々の企画の情報
      - `data.json`:　メタデータ系
      - `content.md`: コンテンツ
  - `blogs`: ブログ用情報の場所。
    - `[blog_id].md`: 各々のブログのコンテンツ
  - `timetable.json`: タイムテーブル用の情報
  - `news.json`: ニュース用の情報
- `schemas`: アセットのスキーマを置く場所。
- `README.md`: これ
- `NOTES.md`: 人間が書くメモ
- `LOGS.md`: 管理アプリによる自動ログ
- `.gitignore`: gitignoreファイル

それぞれのスキーマは、`/schemas`を参照すべし。
