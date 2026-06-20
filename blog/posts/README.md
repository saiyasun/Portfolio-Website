# Blog Post Source Layout

Markdown files are the source of truth for blog article content.

- `s###-##-slug.md` is a series article. The `s###` portion is the series ID, and `##` is the article order inside that series.
- `a###-slug.md` is a standalone article.
- English and Chinese versions must use matching filenames.
- Series posts belong in their matching `s###` folder, such as `en/s001/` or `zh/s001/`.
- Arc/subseries posts can live in a slug folder under their parent series, such as `en/s007/as-one-v2/` or `zh/s007/as-one-v2/`.
- Arc frontmatter uses the stable arc ID, such as `"arc": "arc001"`; the folder uses the arc slug from `series.json`.
- Standalone posts belong in `standalone/`.
- Drafts belong under `drafts/<language>/<series-or-standalone>/`.
- `blog/metadata/posts.json` is generated from these Markdown files and should not be edited manually.
