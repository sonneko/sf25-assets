# sf25-assets

SF25フロントエンドから直接アクセスできるデータセット。

## 使い方

### アセットの取得
アセットへは、`https://assets.seikosf25.jp/[../]*..\.[json | md | webp]`でアクセス可能。データの形式のドキュメントは、`https://assets.seikosf25.jp/docs`を参照。

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
    - `[booth_id].[%d].webp`: 企画紹介ページの中の画像
  - `blog`
    - `[blog_id].yaml`: ブログそれぞれの情報のファイル
    - `[blog_id].md`: ブログのコンテンツ
    - `[blog_id].[%d].webp`: ブログページの中にある画像
  - `news`
    - `[news_id].yaml`: ニュースそれぞれのファイル
  - `lostItems`
    - `[lostItem_id].yaml`: 落とし物それぞれのファイル
    - `[lostItem_id].webp`: 落とし物それぞれの画像
  - `timeTable.yaml`: タイムテーブルの情報のファイル
  - `config.yaml`: アセット生成ツール(これ)に対する設定ファイル
- `script`: アセット生成のためのJavaScriptファイル
  - `main.ts`: エントリーポイント
  - `check.ts`: 入出力のデータがスキーマに準拠しているか確認する
  - `gen-lib.ts`: バリデーションライブラリの生成
  - `gen-assets.ts`: アセットの生成
  - `lib.ts`: 汎用関数たち
- `schemas`: アセットのスキーマを置く場所。
  - `source`: ソース側のスキーマ
    - `booth.schema.yaml`: 企画情報のスキーマ
    - `blog.schema.yaml`: ブログ情報のスキーマ
    - `news.schema.yaml`: ニュース情報のスキーマ
    - `lostItem.schema.yaml`: 落とし物情報のスキーマ
    - `timeTable.schema.yaml`: タイムテーブルのスキーマ
    - `config.schema.yaml`: 設定ファイルのスキーマ
  - `output`: 出力側のスキーマ
    - `index.schema.yaml`: 検索インデックスと小さいデータたち用のスキーマ
    - `booth.schema.yaml`: 企画情報用の情報のスキーマ
- `README.md`: これ
- `NOTES.md`: 人間が書くメモ
- `LOGS.md`: 管理アプリによる自動ログ
- `package.json`: 依存関係管理
- `.gitignore`: gitignoreファイル
- `robots.txt`: 検索エンジン向け情報


## ページ出力のディレクトリ構造

**（`out`ディレクトリの中に生成され、outディレクトリ内のみ配信される）**

- `index.json`: 小さいデータたち（`output/index.schema.yaml`）
- `booth.json`: 企画情報（`output/booth.schema.yaml`）
- `booths`: 企画それぞれのページ
  - `[booth_id].html`: 各々の企画のコンテンツ
  - `[booth_id].[%d].webp`: 各々の企画のコンテンツの中にある画像
- `blogs`: ブログ用情報の場所。
  - `[blog_id].html`: 各々のブログのコンテンツ
  - `[blog_id].[%d].webp`: 各々のブログのコンテンツの中にある画像
- `docs`: 出力スキーマから自動生成したhtmlドキュメントをここに配置する

## ライブラリ出力のディレクトリ構造

**（`dist`ディレクトリ内に生成され、レポジトリ全体がライブラリとして`lib`ブランチに自動でcommitされる。）**

- `index.js`: エントリーポイント
- `source`: ソース側
  - `booth.d.ts`: 企画情報
  - `blog.d.ts`: ブログ情報
  - `news.d.ts`: ニュース情報
  - `lostItem.d.ts`: 落とし物情報
  - `timeTable.d.ts`: タイムテーブル情報
  - `config.d.ts`: 設定情報
- `output`: 出力側
  - `index.d.ts`: 小さなデータたち
  - `booth.d.ts`: 企画用の情報

## CI/CD

### assetsのデプロイ
mainブランチにpushされると自動でGitHubActionで`npm install && npm run build`が実行されて、その結果出力された`out`ディレクトリの内容がGitHubPagesで静的に配信されます。

### バリデーションライブラリのpublish
schemasディレクトリ内にあるスキーマからTypeScript型を`dist`ディレクトリ内に生成します。
