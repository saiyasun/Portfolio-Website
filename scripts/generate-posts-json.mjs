import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(rootDir, "blog", "posts", "en");
const zhPostsDir = path.join(rootDir, "blog", "posts", "zh");
const previewImagesDir = path.join(rootDir, "blog", "assets", "images", "preview_images");
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

function validatePost(post, file) {
    requireString(post, "slug", file);
    requireString(post, "title.en", file);
    requireString(post, "title.zh", file);
    requireString(post, "description.en", file);
    requireString(post, "description.zh", file);
    requireString(post, "preview_image", file);
    requireString(post, "published.uploaded", file);
    requireString(post, "series.id", file);
    requireNumber(post, "series.order", file);

    if (post.featured === undefined) {
        errors.push(`${file}: missing featured`);
    }

    if (post.series?.is_series !== true) {
        errors.push(`${file}: series.is_series must be true`);
    }

    const uploaded = Date.parse(post.published?.uploaded || "");
    if (Number.isNaN(uploaded)) {
        errors.push(`${file}: invalid published.uploaded date`);
    }

    const expectedFilename = `${post.series?.id}-${String(post.series?.order).padStart(2, "0")}-${post.slug}.md`;
    if (file !== expectedFilename) {
        errors.push(`${file}: filename should be ${expectedFilename}`);
    }

    if (post.preview_image && !existsSync(path.join(previewImagesDir, post.preview_image))) {
        warnings.push(`${file}: preview image not found (${post.preview_image})`);
    }

    const zhPath = path.join(zhPostsDir, expectedFilename);
    if (!existsSync(zhPath)) {
        warnings.push(`${file}: no matching zh post found`);
    }
}

const files = (await readdir(postsDir))
    .filter((file) => file.endsWith(".md"))
    .sort();

const posts = [];

for (const file of files) {
    const markdown = await readFile(path.join(postsDir, file), "utf8");
    const post = parseFrontmatter(markdown, file);

    if (!post) continue;

    validatePost(post, file);
    posts.push(post);
}

const slugs = new Set();
const seriesOrders = new Set();

for (const post of posts) {
    if (slugs.has(post.slug)) {
        errors.push(`duplicate slug: ${post.slug}`);
    }
    slugs.add(post.slug);

    const seriesKey = `${post.series?.id}:${post.series?.order}`;
    if (seriesOrders.has(seriesKey)) {
        errors.push(`duplicate series order: ${seriesKey}`);
    }
    seriesOrders.add(seriesKey);
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
