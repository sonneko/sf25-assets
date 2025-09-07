# sf25-assets

SF25フロントエンドから直接アクセスできるデータセット。

## 使い方

### アセットの取得
アセットへは、`https://assets.seikosf25.jp/[../]*..\.[json | md]`でアクセス可能。データの形式のドキュメントは、`https://assets.seikosf25.jp/docs`を参照。

### TypeScript型定義のライブラリのインストール

```bash
$ npm install github:sonneko/sf25-assets#lib
```

### データの編集のやり方

1. `src`ディレクトリ内にスキーマに従いデータを記述する。
2. 変更をコミットし`main`ブランチにプッシュする。
3. 自動で型定義ライブラリとアセットが生成されデプロイされる。

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
  - `gen-lib.ts`: バリデーションライブラリの生成
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


## ページ出力のディレクトリ構造

**（`out`ディレクトリの中に生成され、outディレクトリ内のみ配信される）**

- `index.json`: 検索インデックスと小さいデータたち
- `booths`: 企画情報関連
  - `[booth_id].md`: 各々の企画のコンテンツ
- `blogs`: ブログ用情報の場所。
  - `[blog_id].md`: 各々のブログのコンテンツ
- `timetable.json`: タイムテーブル用の情報
- `news.json`: ニュース用の情報
- `docs`: 出力スキーマから自動生成したhtmlドキュメントをここに配置する

## ライブラリ出力のディレクトリ構造

**（`dist`ディレクトリ内に生成され、レポジトリ全体がライブラリとして`lib`ブランチに自動でcommitされる。）**

- `source`: ソース側
  - `booth.d.ts`: 企画情報
  - `blog.d.ts`: ブログ情報
  - `news.d.ts`: ニュース情報
- `output`: 出力側
  - `index.d.ts`: 検索インデックスと小さいデータたち用
  - `timetable.d.ts`: タイムテーブル用の情報
  - `news.d.ts`: ニュース情報

## CI/CD

### assetsのデプロイ
mainブランチにpushされると自動でGitHubActionで`npm install && npm run build`が実行されて、その結果出力された`out`ディレクトリの内容がGitHubPagesで静的に配信されます。

### バリデーションライブラリのpublish
schemasディレクトリ内にあるスキーマからTypeScript型を`dist`ディレクトリ内に生成します。
