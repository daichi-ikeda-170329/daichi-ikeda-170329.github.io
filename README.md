# ルート大全

大学受験の参考書 1,052 冊を科目別に図鑑化し、志望校から逆算した参考書ルートを提示する無料サイト。

公開 URL: https://daichi-ikeda-170329.github.io/

## 概要

英語・国語・数学・理科・社会の 5 科目それぞれについて、市販の参考書を難易度・役割・接続関係で整理した「参考書図鑑」と、志望校と現在地から組み立てる「参考書ルート」を提供する。各科目ページは外部依存のない単一 HTML で、ビルド工程を持たない。

収益はページ内の書籍リンク（Amazon アソシエイト・楽天アフィリエイト）による。

## 収録数

| 科目 | ディレクトリ | 収録冊数 | テーマカラー |
|---|---|---|---|
| 英語 | `english/` | 173 | `#B5432A` |
| 国語 | `japanese/` | 152 | `#8A6D2F` |
| 数学 | `math/` | 113 | `#24427C` |
| 理科 | `science/` | 347 | `#2F6E4F` |
| 社会 | `social/` | 267 | `#5B4E9E` |
| 合計 | — | 1,052 | — |

冊数は各ページの `BOOKS` 配列（`BOOKS.push()` による追加分を含む）の要素数と一致する。参考書を追加したら、この表とポータル `index.html` の記載値を併せて更新する。

## ディレクトリ構成

| パス | 用途 |
|---|---|
| `index.html` | ポータル。5 科目への入口・FAQ・法定表記 |
| `english/index.html` | 英語ルート大全（単一 HTML の SPA） |
| `japanese/index.html` | 国語ルート大全 |
| `math/index.html` | 数学ルート大全 |
| `science/index.html` | 理科ルート大全 |
| `social/index.html` | 社会ルート大全 |
| `404.html` | 404 ページ。各科目への導線を持つ |
| `assets/` | OGP 画像（`ogp*.png`）、`apple-touch-icon.png` |
| `favicon.svg` | ファビコン |
| `sitemap.xml` | サイトマップ。ページを増やしたら追記する |
| `robots.txt` | クローラー設定 |
| `.nojekyll` | GitHub Pages の Jekyll 処理を無効化 |

各科目ページの内部構造は共通で、次の要素を同じクラス名で持つ。

- `.pr-bar` — アフィリエイト広告の明示（景品表示法のステマ規制対応）
- `.xbar` — 科目切り替えバー。全ページ相互リンクの起点
- `.app-header` — ロゴとビュー切り替えナビ
- `.view` — ホーム / 図鑑 / ルート / 診断 / 学習ガイドの各画面
- `.foot-subjects` — フッターの他科目リンク
- `LEGAL` — 運営者情報・プライバシーポリシー・免責事項・広告についてのモーダル

## ローカル確認

```bash
python3 -m http.server 8899 --bind 127.0.0.1
```

`http://127.0.0.1:8899/` を開く。ルート相対パス（`/english/` など）を使っているため、`file://` で直接開くと科目間リンクが機能しない。必ず HTTP サーバー経由で確認する。

## アフィリエイト ID の設定

各科目ページの `<script>` 冒頭にある `CONFIG` に ID を入れると、書籍リンクにトラッキング ID が付与される。空文字のままなら通常のリンクとして動作する。

```js
const CONFIG = {
  siteName:   "英語ルート大全",
  operator:   "ルート大全 編集部",
  contact:    "",
  amazonTag:  "",   // Amazon アソシエイトのトラッキング ID（例 "xxxxx-22"）
  rakutenId:  ""    // 楽天アフィリエイト ID
};
```

- `amazonTag` を設定すると、フッターと「広告について」に Amazon アソシエイトの必須表記が自動で表示される。未設定のうちは表示されない（未参加の状態で参加者の表記を出さないため）
- `rakutenId` を設定すると、書籍詳細に楽天ブックスのボタンが追加される
- 設定箇所は科目ごとに独立している。5 ファイルすべてに同じ ID を入れる

```bash
# 5 ファイルへ一括反映する例（ID は自分のものに置き換える）
for f in english japanese math science social; do
  sed -i '' 's/amazonTag:  ""/amazonTag:  "xxxxx-22"/' "$f/index.html"
done
```

## 更新手順

```bash
git add -A
git commit -m "feat: <変更内容>"
git push
```

`main` への push で GitHub Pages が再ビルドされる。反映まで 1〜2 分かかる。

参考書を追加・改訂したときは、次の 4 か所の整合を取る。

1. 該当科目の `BOOKS` 配列
2. この README の収録数テーブル
3. ポータル `index.html` の科目カードとヒーローの冊数
4. `assets/ogp*.png`（冊数を画像内に焼き込んでいるため）

ページを新設したときは `sitemap.xml` に `<url>` を追記する。

## 外部サービスの登録状況

| サービス | 状態 | 用途 |
|---|---|---|
| GitHub Pages | 有効 | ホスティング |
| Amazon アソシエイト | 未登録 | 書籍リンクの収益化 |
| 楽天アフィリエイト | 未登録 | 書籍リンクの収益化 |
| Google Search Console | 未登録 | インデックス登録・検索順位の把握 |
| Bing Webmaster Tools | 未登録 | Bing / DuckDuckGo 向けインデックス |
