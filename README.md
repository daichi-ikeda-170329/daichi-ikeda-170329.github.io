# ルート大全

大学受験の参考書 1,052 冊を科目別に図鑑化し、志望校から逆算した参考書ルートを提示する無料サイト。

公開 URL: https://daichi-ikeda-170329.github.io/

## 概要

英語・国語・数学・理科・社会の 5 科目それぞれについて、市販の参考書を難易度・役割・接続関係で整理した「参考書図鑑」と、志望校と現在地から組み立てる「参考書ルート」を提供する。

サイトは 2 層でできている。

- **科目トップ**（`<科目>/index.html`）— 外部依存のない単一 HTML の SPA。図鑑・ルート・診断・学習ガイドを内包する。手で編集する
- **生成ページ**（`<科目>/books/`、`<科目>/routes/`、`<科目>/guides/`）— 科目トップの `BOOKS` / `ROUTES` を正本として `build/` のスクリプトが出力する。手で編集しない

収益はページ内の書籍リンク（Amazon アソシエイト・楽天アフィリエイト）による。

## 収録数とページ数

| 科目 | ディレクトリ | 収録冊数 | 志望レベル | 記事 | テーマカラー |
|---|---|---|---|---|---|
| 英語 | `english/` | 173 | 9 | 3 | `#B5432A` |
| 国語 | `japanese/` | 152 | 8 | 1 | `#8A6D2F` |
| 数学 | `math/` | 113 | 9 | 2 | `#24427C` |
| 理科 | `science/` | 347 | 8 | 1 | `#2F6E4F` |
| 社会 | `social/` | 267 | 8 | 1 | `#5B4E9E` |
| 全科目共通 | `guides/` | — | — | 1 | — |
| 合計 | — | 1,052 | 42 | 9 | — |

公開ページ数は 1,125（`sitemap.xml` の URL 数と一致する）。冊数は各科目の `BOOKS` 配列（`BOOKS.push()` による追加分を含む）の要素数と一致する。

## ディレクトリ構成

| パス | 用途 | 編集方法 |
|---|---|---|
| `index.html` | ポータル。5 科目への入口・FAQ・法定表記 | 手で編集 |
| `<科目>/index.html` | 科目トップ（単一 HTML の SPA） | 手で編集 |
| `<科目>/books/index.html` | 参考書一覧（役割別・難易度順） | 生成 |
| `<科目>/books/<id>/index.html` | 参考書 1 冊の詳細ページ | 生成 |
| `<科目>/routes/index.html` | 志望レベル一覧 | 生成 |
| `<科目>/routes/<tier>/index.html` | 志望レベル別ルート | 生成 |
| `<科目>/guides/<slug>/index.html` | 解説記事 | 生成 |
| `guides/<slug>/index.html` | 科目に属さない解説記事 | 生成 |
| `404.html` | 404 ページ | 手で編集 |
| `assets/site.css` | 生成ページ共通のスタイル | 手で編集 |
| `assets/ogp*.png` | OGP 画像。冊数を画像内に焼き込んでいる | 再生成が必要 |
| `favicon.svg` | ファビコン | 手で編集 |
| `sitemap.xml` | サイトマップ | 生成 |
| `robots.txt` | クローラー設定 | 手で編集 |
| `.nojekyll` | GitHub Pages の Jekyll 処理を無効化 | — |
| `build/` | 生成スクリプト | 手で編集 |

科目トップの内部構造は 5 科目で共通で、次の要素を同じクラス名で持つ。

- `.pr-bar` — アフィリエイト広告の明示（景品表示法のステマ規制対応）
- `.xbar` — 科目切り替えバー。全ページ相互リンクの起点
- `.view` — ホーム / 図鑑 / ルート / 診断 / 学習ガイドの各画面
- `.cat-index` — 生成ページ（一覧・ルート）への導線バナー
- `.foot-subjects` — フッターの他科目リンク
- `LEGAL` — 運営者情報・プライバシーポリシー・免責事項・広告についてのモーダル

## ビルド

```bash
node build/generate-books.mjs      # 参考書の詳細ページ 1,052 件
node build/generate-index.mjs      # 参考書一覧 5 件
node build/generate-routes.mjs     # 志望校別ルート 47 件
node build/generate-articles.mjs   # 解説記事 15 件
node build/generate-sitemap.mjs    # sitemap.xml（最後に実行する）
```

科目トップの `BOOKS` や `ROUTES` を編集したら、`generate-sitemap.mjs` を含めて全部を流し直す。生成物はリポジトリにコミットする（GitHub Pages はビルドを実行しないため）。

`generate-books.mjs` は科目名と id を引数に取れる。1 件だけ確認したいときに使う。

```bash
node build/generate-books.mjs math ao
```

### 生成スクリプトの構成

| ファイル | 役割 |
|---|---|
| `build/lib/extract.mjs` | 科目 HTML の `<script>` を vm 上で実行し、`BOOKS` / `ROUTES` / `TIERS` / `STAGES` / `UNIS` を回収する。id の重複や URL に使えない id はここで検出して停止する |
| `build/lib/parts.mjs` | `<head>`・ヘッダー・フッター・パンくず・JSON-LD の共通パーツ |
| `build/content/articles.mjs` | 解説記事の本文 |

`ROUTES` の階層は科目によって 3 通りある。理科だけ「トラック → 志望レベル」の順で、他科目とは逆になっている。`generate-routes.mjs` の `normalize()` で吸収しているので、新しい科目を追加するときはここを確認する。

### 記事を追加する

`build/content/articles.mjs` の `ARTICLES` に追加して `generate-articles.mjs` を実行する。決まりごとが 3 つある。

- 難易度・問題数・想定学習時間・到達目安は本文に書かず、`bookTable` ブロックで `BOOKS` から引く。記事とデータがずれるのを構造的に防ぐため
- 本文中の `[[id]]` または `[[id|表示名]]` はその書籍の個別ページへのリンクになる。id が `BOOKS` に無ければビルドが止まる
- 記事を追加したら、ポータル `index.html` の「参考書の選び方を読む」セクションにも手でリンクを足す

## ローカル確認

```bash
python3 -m http.server 8899 --bind 127.0.0.1
```

`http://127.0.0.1:8899/` を開く。ルート相対パス（`/english/` など）を使っているため、`file://` で直接開くと科目間リンクが機能しない。必ず HTTP サーバー経由で確認する。

内部リンクの実在確認は、生成後に次のスクリプトで行う（`${b.id}` を含む 5 件は JS のテンプレート文字列なので無視してよい）。

```bash
python3 -c "
import os, re
bad = []
for dp, dn, fn in os.walk('.'):
    if '.git' in dp or 'build' in dp: continue
    for f in fn:
        if not f.endswith('.html'): continue
        for m in re.finditer(r'href=\"(/[^\"#?]*)\"', open(os.path.join(dp, f), encoding='utf-8').read()):
            h = m.group(1); t = h.lstrip('/')
            ok = os.path.isfile(os.path.join(t, 'index.html')) if h.endswith('/') else os.path.isfile(t)
            if not ok: bad.append(h)
print(sorted(set(bad)) or 'リンク切れなし')
"
```

## アフィリエイト ID の設定

各科目トップの `<script>` 冒頭にある `CONFIG` に ID を入れる。空文字のままなら通常のリンクとして動作する。

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
- 生成ページのリンクにも同じ ID が使われる。**ID を入れたあとは必ず全ページを再生成する**

```bash
# 5 科目へ一括反映する（ID は自分のものに置き換える）
for f in english japanese math science social; do
  sed -i '' 's/amazonTag:  ""/amazonTag:  "xxxxx-22"/' "$f/index.html"
done
node build/generate-books.mjs && node build/generate-index.mjs \
  && node build/generate-routes.mjs && node build/generate-articles.mjs \
  && node build/generate-sitemap.mjs
```

## 更新手順

```bash
git add -A
git commit -m "feat: <変更内容>"
git push
```

`main` への push で GitHub Pages が再ビルドされる。反映まで 1〜2 分かかる。

参考書を追加・改訂したときは、次の 5 か所の整合を取る。

1. 該当科目の `BOOKS` 配列
2. `build/` の全スクリプトを再実行
3. この README の収録数テーブル
4. ポータル `index.html` の科目カードとヒーローの冊数
5. `assets/ogp*.png`（冊数を画像内に焼き込んでいるため、`build/` 外の生成手順で作り直す）

## 外部サービスの登録状況

| サービス | 状態 | 用途 |
|---|---|---|
| GitHub Pages | 有効 | ホスティング |
| Amazon アソシエイト | 未登録 | 書籍リンクの収益化 |
| 楽天アフィリエイト | 未登録 | 書籍リンクの収益化 |
| Google Search Console | 未登録 | インデックス登録・検索順位の把握 |
| Google Analytics | 未導入 | アクセス解析 |
| Bing Webmaster Tools | 未登録 | Bing / DuckDuckGo 向けインデックス |
