# sf25-assets

SF25フロントエンドから直接アクセスできるデータセット。
`https://assets.seikosf25.jp/[../]*..\.[json | md]`でアクセス可能。

## レポジトリのディレクトリ構造

- `src`: ソースの場所
  - `booth`
    - `[booth_id].yaml`: 企画それぞれの情報のファイル
    - `[booth_id].md`: 企画の紹介ページ
  - `blog`
    - `[blog_id].yaml`: ブログそれぞれの情報のファイル
    - `[blog_id].md`: ブログのコンテンツ
  - `news`
    - `[news_id].yaml`: ニュースそれぞれのファイル
- `script`: アセット生成のためのJavaScriptファイル
  - `main.ts`: エントリーポイント
  - `search-index.ts`: 検索インデックス生成
  - `booth.ts`: 企画情報用のアセット生成
  - `blog.ts`: ブログ用のアセット生成
  - `timetable.ts`: タイムテーブル用のアセット生成
  - `news.ts`: ニュース情報のアセット生成
  - `cm.ts`: CM動画管理（存在不明）
  - `check.ts`: 入出力のデータがスキーマに準拠しているか確認する
- `schemas`: アセットのスキーマを置く場所。
  - `source`: ソース側のスキーマ
    - `booth.schema.yaml`: 企画情報のスキーマ
    - `blog.schema.yaml`: ブログ情報のスキーマ
    - `news.schema.yaml`: ニュース情報のスキーマ
  - `output`: 出力側のスキーマ
    - `index.schema.yaml`: 検索インデックスと小さいデータたち用のスキーマ
    - `timetable.schema.yaml`: タイムテーブル用の情報のスキーマ
    - `news.schema.yaml`: ニュース情報のスキーマ
- `tests`: テスト
- `README.md`: これ
- `NOTES.md`: 人間が書くメモ
- `LOGS.md`: 管理アプリによる自動ログ
- `package.json`: 依存関係管理
- `.gitignore`: gitignoreファイル
- `robots.txt`: 検索エンジン向け情報


## 出力のディレクトリ構造

> （`out`ディレクトリの中に生成され、outディレクトリ内のみ配信される）

- `index.json`: 検索インデックスと小さいデータたち
- `booths`: 企画情報関連
  - `[booth_id].md`: 各々の企画のコンテンツ
- `blogs`: ブログ用情報の場所。
  - `[blog_id].md`: 各々のブログのコンテンツ
- `timetable.json`: タイムテーブル用の情報
- `news.json`: ニュース用の情報
- `docs`: 出力スキーマから自動生成したhtmlドキュメントをここに配置する

## CI/CD
mainブランチにpushされると自動でGitHubActionで`npm install && npm run build`が実行されて、その結果出力された`out`ディレクトリの内容がGitHubPagesで静的に配信されます。
