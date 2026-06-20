import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://asiahcrutchfield.com";
const postsDir = path.join(rootDir, "blog", "posts", "en");
const seriesPath = path.join(rootDir, "blog", "metadata", "series.json");
const blogDir = path.join(rootDir, "dist", "blog");

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function parseFrontmatter(markdown, file) {
    const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

    if (!match) {
        throw new Error(`${file}: missing JSON frontmatter`);
    }

    return {
        metadata: JSON.parse(match[1]),
        body: markdown.slice(match[0].length),
    };
}

async function markdownFiles(dir) {
    const files = [];

    async function walk(currentDir) {
        const entries = await readdir(currentDir, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.name.startsWith(".")) continue;

            const entryPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                await walk(entryPath);
                continue;
            }

            if (!entry.isFile()) continue;
            if (!entry.name.endsWith(".md")) continue;
            if (/^readme\.md$/i.test(entry.name)) continue;

            files.push(entryPath);
        }
    }

    await walk(dir);
    return files.sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
}

function inlineMarkdown(value = "") {
    let output = escapeHtml(value);
    output = output.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
    return output;
}

function markdownToHtml(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const blocks = [];
    let paragraph = [];
    let list = [];
    let blockquote = [];
    let inCode = false;
    let code = [];

    function flushParagraph() {
        if (paragraph.length > 0) {
            blocks.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
            paragraph = [];
        }
    }

    function flushList() {
        if (list.length > 0) {
            blocks.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
            list = [];
        }
    }

    function flushBlockquote() {
        if (blockquote.length > 0) {
            blocks.push(`<blockquote>${blockquote.map((line) => `<p>${inlineMarkdown(line)}</p>`).join("")}</blockquote>`);
            blockquote = [];
        }
    }

    for (const line of lines) {
        if (line.startsWith("```")) {
            if (inCode) {
                blocks.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
                inCode = false;
                code = [];
            } else {
                flushParagraph();
                flushList();
                flushBlockquote();
                inCode = true;
            }
            continue;
        }

        if (inCode) {
            code.push(line);
            continue;
        }

        const trimmed = line.trim();

        if (!trimmed) {
            flushParagraph();
            flushList();
            flushBlockquote();
            continue;
        }

        const heading = trimmed.match(/^(#{2,6})\s+(.+)$/);
        if (heading) {
            flushParagraph();
            flushList();
            flushBlockquote();
            const level = heading[1].length;
            blocks.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
            continue;
        }

        const listItem = trimmed.match(/^[-*]\s+(.+)$/);
        if (listItem) {
            flushParagraph();
            flushBlockquote();
            list.push(listItem[1]);
            continue;
        }

        if (trimmed.startsWith("> ")) {
            flushParagraph();
            flushList();
            blockquote.push(trimmed.slice(2));
            continue;
        }

        flushList();
        flushBlockquote();
        paragraph.push(trimmed);
    }

    flushParagraph();
    flushList();
    flushBlockquote();

    return blocks.join("\n");
}

function readingTime(markdown, wpm = 200) {
    const clean = markdown
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`[^`]*`/g, "")
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/\[[^\]]+\]\([^)]+\)/g, "")
        .replace(/[#>*_-]/g, "");
    const words = clean.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / wpm));
}

function seriesSlugFor(post, series) {
    return series?.[post.series?.id]?.slug || post.series?.id || "posts";
}

function findArc(series, seriesId, arcId) {
    if (!seriesId || !arcId) return null;

    const arcs = series?.[seriesId]?.arcs;
    if (!Array.isArray(arcs)) return null;

    return arcs.find((arc) => arc?.id === arcId) || null;
}

function arcIdFor(post) {
    if (typeof post.arc === "string" && post.arc.trim()) return post.arc.trim();
    if (typeof post.series?.arc?.id === "string" && post.series.arc.id.trim()) return post.series.arc.id.trim();
    return "";
}

function arcSlugFor(post, series) {
    if (typeof post.arcSlug === "string" && post.arcSlug.trim()) return post.arcSlug.trim();

    const arc = findArc(series, post.series?.id, arcIdFor(post));
    return typeof arc?.slug === "string" ? arc.slug : "";
}

function postPath(post, series) {
    if (post.series?.is_series === false) {
        return `/blog/${post.slug}/`;
    }

    const arcSlug = arcSlugFor(post, series);
    if (arcSlug) {
        return `/blog/${seriesSlugFor(post, series)}/${arcSlug}/${post.slug}/`;
    }

    return `/blog/${seriesSlugFor(post, series)}/${post.slug}/`;
}

function absolutePostUrl(post, series) {
    return `${siteUrl}${postPath(post, series)}`;
}

function publicPathToFsPath(publicPath) {
    return path.join(rootDir, publicPath.replace(/^\//, ""));
}

function imageUrl(post) {
    if (!post.preview_image) return "";
    return `${siteUrl}${post.preview_image}`;
}

function arcTitleFor(post, series) {
    if (typeof post.arcTitle === "string" && post.arcTitle.trim()) return post.arcTitle.trim();

    const arcId = arcIdFor(post);
    const arc = findArc(series, post.series?.id, arcId);
    const title = arc?.title;

    if (typeof title === "string") return title;
    return title?.en || arcId;
}

function hasPreviewImage(post) {
    if (!post.preview_image || typeof post.preview_image !== "string" || !post.preview_image.trim()) return false;

    const previewImage = post.preview_image.trim();

    if (!previewImage.startsWith("/") || previewImage.includes("\\") || previewImage.includes("..")) return false;

    return existsSync(publicPathToFsPath(previewImage));
}

function formatDateParts(iso) {
    const date = new Date(iso);
    return {
        month: date.toLocaleString("en-US", { month: "short", timeZone: "Asia/Taipei" }).toLowerCase(),
        day: date.toLocaleString("en-US", { day: "2-digit", timeZone: "Asia/Taipei" }),
        year: date.toLocaleString("en-US", { year: "numeric", timeZone: "Asia/Taipei" }),
    };
}

function jsonScript(value) {
    return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

function seriesLinks(currentPost, posts, series) {
    if (currentPost.series?.is_series !== true) return "";

    const matching = posts
        .filter((post) => post.series?.is_series === true && post.series?.id === currentPost.series?.id)
        .sort((a, b) => (a.series?.order || 0) - (b.series?.order || 0));

    if (matching.length <= 1) return "";

    const items = matching.map((post) => {
        const title = escapeHtml(post.title?.en || post.slug);
        const current = post.slug === currentPost.slug ? ' aria-current="page"' : "";
        return `<li><a href="${postPath(post, series)}"${current}>${title}</a></li>`;
    });

    return `<ol class="series-container">\n${items.join("\n")}\n</ol>`;
}

function relatedPosts(currentPost, posts, series) {
    const related = posts
        .filter((post) => post.slug !== currentPost.slug)
        .sort((a, b) => Date.parse(b.published?.uploaded || "") - Date.parse(a.published?.uploaded || ""))
        .slice(0, 5);

    if (related.length === 0) return "";

    return `
        <div id="more_articles-container">
            <h4 id="more_articles-title">more articles</h4>
            <ul id="related-articles">
                ${related.map((post) => `
                    <li class="article-list_item">
                        <div class="related_article">
                            <a class="related_link" href="${postPath(post, series)}">
                                <h5 class="related_article-title">${escapeHtml(post.title?.en || post.slug)}</h5>
                            </a>
                        </div>
                    </li>
                `).join("")}
            </ul>
        </div>`;
}

function renderPostPage(post, bodyHtml, bodyMarkdown, posts, series) {
    const title = post.title?.en || post.slug;
    const description = post.description?.en || "";
    const canonical = absolutePostUrl(post, series);
    const hasImage = hasPreviewImage(post);
    const image = hasImage ? imageUrl(post) : "";
    const date = formatDateParts(post.published.uploaded);
    const edited = post.published?.edited?.en || "";
    const arcTitle = arcTitleFor(post, series);
    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "author": {
            "@type": "Person",
            "name": "Asiah Crutchfield",
        },
        "datePublished": post.published.uploaded,
        ...(edited ? { "dateModified": edited } : {}),
            ...(image ? { "image": image } : {}),
        "url": canonical,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonical,
        },
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} | Asiah Crutchfield</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    ${image ? `<meta property="og:image" content="${image}">` : ""}
    <meta property="og:url" content="${canonical}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    ${image ? `<meta name="twitter:image" content="${image}">` : ""}
    <script type="application/ld+json">${jsonScript(schema)}</script>
    <link rel="stylesheet" href="/components/components.css">
    <link rel="stylesheet" href="/blog/post.css">
    <script src="/components/navbar/navbar.js" defer></script>
    <script src="/components/translator/translator.js" defer></script>
    <script src="/universal.js" defer></script>
</head>
<body>
    <site-navbar></site-navbar>
    <main id="post-container">
        <a class="post-back-link" href="/blog/">← Blog</a>
        <article class="blog">
            <div class="blog_post${hasImage ? "" : " has-no-image"}">
                ${hasImage ? `<img class="blog_post-img" src="${escapeHtml(post.preview_image)}" alt="${escapeHtml(title)}" onerror="this.hidden=true;this.setAttribute('aria-hidden','true');this.closest('.blog_post')?.classList.add('has-no-image');">` : ""}
                <div class="blog_post-intro">
                    <h1 class="blog_post-title">${escapeHtml(title)}</h1>
                    ${arcTitle ? `<div class="blog_post-arc">${escapeHtml(arcTitle)}</div>` : ""}
                    <div class="reading_date-container">
                        <div class="blog_item-date publish-date">
                            <span class="blog_item-month">${date.month}</span>
                            <span class="blog_item-day">${date.day}</span>
                            <span class="blog_item-year">${date.year}</span>
                        </div>
                        <span>|</span>
                        <div class="blog_post-reading_time">
                            <span class="reading_time-text">reading time</span>:
                            <span class="reading_time-time">${readingTime(bodyMarkdown)}</span>
                            <span class="reading_time-marker">minutes</span>
                        </div>
                    </div>
                </div>
                <div class="post_article-container">
                    <div class="blog_post-post">
                        <div class="blog_post-article">
${bodyHtml}
                        </div>
                        ${seriesLinks(post, posts, series)}
                    </div>
                </div>
            </div>
        </article>
        ${relatedPosts(post, posts, series)}
    </main>
    <site-translator></site-translator>
</body>
</html>
`;
}

const series = JSON.parse(await readFile(seriesPath, "utf8"));
const files = await markdownFiles(postsDir);
const posts = [];
const bodies = new Map();

for (const filePath of files) {
    const markdown = await readFile(filePath, "utf8");
    const { metadata, body } = parseFrontmatter(markdown, path.relative(rootDir, filePath));
    posts.push(metadata);
    bodies.set(metadata.slug, body);
}

function postOutputDir(post, series) {
    if (post.series?.is_series === false) {
        return path.join(blogDir, post.slug);
    }

    const arcSlug = arcSlugFor(post, series);
    if (arcSlug) {
        return path.join(blogDir, seriesSlugFor(post, series), arcSlug, post.slug);
    }

    return path.join(blogDir, seriesSlugFor(post, series), post.slug);
}

const generatedDirs = new Set(posts.map((post) => {
    if (post.series?.is_series === false) return post.slug;

    return seriesSlugFor(post, series);
}));

for (const dir of generatedDirs) {
    await rm(path.join(blogDir, dir), { recursive: true, force: true });
}

for (const post of posts) {
    const body = bodies.get(post.slug);
    const outputDir = postOutputDir(post, series);
    const bodyHtml = markdownToHtml(body);
    await mkdir(outputDir, { recursive: true });
    await writeFile(path.join(outputDir, "index.html"), renderPostPage(post, bodyHtml, body, posts, series), "utf8");
}

console.log(`Generated ${posts.length} static blog article pages.`);
