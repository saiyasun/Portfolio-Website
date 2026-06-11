import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(rootDir, "blog", "posts", "en");
const zhPostsDir = path.join(rootDir, "blog", "posts", "zh");
const articleMediaBasePath = "/blog/assets/media/";
const outputPath = path.join(rootDir, "blog", "metadata", "posts.json");

const errors = [];
const warnings = [];

function parseFrontmatter(markdown, file) {
    const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

    if (!match) {
        errors.push(`${file}: missing JSON frontmatter`);
        return null;
    }

    try {
        return JSON.parse(match[1]);
    } catch (error) {
        errors.push(`${file}: invalid JSON frontmatter (${error.message})`);
        return null;
    }
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

async function markdownFileMap(dir) {
    const files = await markdownFiles(dir);
    return new Map(files.map((filePath) => [path.basename(filePath), filePath]));
}

function requireString(post, field, file) {
    const value = field.split(".").reduce((current, key) => current?.[key], post);

    if (typeof value !== "string" || value.trim() === "") {
        errors.push(`${file}: missing ${field}`);
    }
}

function requireNumber(post, field, file) {
    const value = field.split(".").reduce((current, key) => current?.[key], post);

    if (typeof value !== "number" || !Number.isFinite(value)) {
        errors.push(`${file}: missing numeric ${field}`);
    }
}

function articleIdFromFilename(file) {
    const match = file.match(/^(s\d{3}-\d{2}|a\d{3})-/);
    return match?.[1] || "";
}

function publicPathToFsPath(publicPath) {
    return path.join(rootDir, publicPath.replace(/^\//, ""));
}

function validatePreviewImage(post, file, articleId) {
    const previewImage = post.preview_image;

    if (previewImage === undefined || previewImage === "") return;

    if (typeof previewImage !== "string") {
        errors.push(`${file}: preview_image must be a string when present`);
        return;
    }

    if (!previewImage.startsWith("/")) {
        errors.push(`${file}: preview_image must be a root-relative public path`);
        return;
    }

    if (previewImage.includes("\\") || previewImage.includes("..")) {
        errors.push(`${file}: preview_image must not contain Windows separators or parent-directory segments`);
        return;
    }

    if (!previewImage.startsWith(articleMediaBasePath)) {
        warnings.push(`${file}: preview image should live under ${articleMediaBasePath}${articleId}/ (${previewImage})`);
    } else if (!previewImage.startsWith(`${articleMediaBasePath}${articleId}/`)) {
        warnings.push(`${file}: preview image is outside this article's media folder (${previewImage})`);
    }

    if (!existsSync(publicPathToFsPath(previewImage))) {
        warnings.push(`${file}: preview image not found (${previewImage})`);
    }
}

function validatePost(post, file, articleId) {
    requireString(post, "slug", file);
    requireString(post, "title.en", file);
    requireString(post, "title.zh", file);
    requireString(post, "description.en", file);
    requireString(post, "description.zh", file);
    requireString(post, "published.uploaded", file);

    if (!articleId) {
        errors.push(`${file}: filename must start with s###-## or a###`);
    }

    validatePreviewImage(post, file, articleId);

    if (post.featured === undefined) {
        errors.push(`${file}: missing featured`);
    }

    if (post.series?.is_series === true) {
        validateSeriesPost(post, file);
    } else if (post.series?.is_series === false) {
        validateStandalonePost(post, file);
    } else {
        errors.push(`${file}: series.is_series must be true or false`);
    }

    const uploaded = Date.parse(post.published?.uploaded || "");
    if (Number.isNaN(uploaded)) {
        errors.push(`${file}: invalid published.uploaded date`);
    }
}

function validateSeriesPost(post, file) {
    requireString(post, "series.id", file);
    requireNumber(post, "series.order", file);

    const expectedFilename = `${post.series?.id}-${String(post.series?.order).padStart(2, "0")}-${post.slug}.md`;
    if (file !== expectedFilename) {
        errors.push(`${file}: filename should be ${expectedFilename}`);
    }

    if (!zhFilesByName.has(expectedFilename)) {
        warnings.push(`${file}: no matching zh post found`);
    }
}

function validateStandalonePost(post, file) {
    const match = file.match(/^(a\d{3})-(.+)\.md$/);

    if (!match) {
        errors.push(`${file}: standalone filename should be a###-${post.slug}.md`);
        return;
    }

    const [, articleId, filenameSlug] = match;

    if (filenameSlug !== post.slug) {
        errors.push(`${file}: filename slug should match ${post.slug}`);
    }

    if (post.series?.id || post.series?.order !== undefined) {
        errors.push(`${file}: standalone posts must not set series.id or series.order`);
    }

    const expectedFilename = `${articleId}-${post.slug}.md`;
    if (!zhFilesByName.has(expectedFilename)) {
        warnings.push(`${file}: no matching zh post found`);
    }
}

const zhFilesByName = await markdownFileMap(zhPostsDir);
const files = await markdownFiles(postsDir);

const posts = [];

for (const filePath of files) {
    const file = path.basename(filePath);
    const markdown = await readFile(filePath, "utf8");
    const post = parseFrontmatter(markdown, path.relative(rootDir, filePath));

    if (!post) continue;

    const articleId = articleIdFromFilename(file);
    validatePost(post, file, articleId);
    posts.push({ ...post, article_id: articleId });
}

const slugs = new Set();
const seriesOrders = new Set();

for (const post of posts) {
    if (slugs.has(post.slug)) {
        errors.push(`duplicate slug: ${post.slug}`);
    }
    slugs.add(post.slug);

    if (post.series?.is_series === true) {
        const seriesKey = `${post.series?.id}:${post.series?.order}`;
        if (seriesOrders.has(seriesKey)) {
            errors.push(`duplicate series order: ${seriesKey}`);
        }
        seriesOrders.add(seriesKey);
    }
}

if (errors.length > 0) {
    console.error("Could not generate posts.json:");
    errors.forEach((error) => console.error(`- ${error}`));

    if (warnings.length > 0) {
        console.warn("\nWarnings:");
        warnings.forEach((warning) => console.warn(`- ${warning}`));
    }

    process.exit(1);
}

posts.sort((a, b) => {
    if (a.series?.is_series !== b.series?.is_series) {
        return a.series?.is_series ? -1 : 1;
    }

    if (a.series?.is_series === false) {
        return Date.parse(a.published?.uploaded || "") - Date.parse(b.published?.uploaded || "");
    }

    const seriesCompare = String(a.series.id).localeCompare(String(b.series.id));
    if (seriesCompare !== 0) return seriesCompare;

    return a.series.order - b.series.order;
});

await writeFile(outputPath, `${JSON.stringify(posts, null, 4)}\n`, "utf8");

console.log(`Generated ${path.relative(rootDir, outputPath)} from ${posts.length} posts.`);

if (warnings.length > 0) {
    console.warn("\nWarnings:");
    warnings.forEach((warning) => console.warn(`- ${warning}`));
}
