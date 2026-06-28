import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(rootDir, "blog", "posts", "en");
const zhPostsDir = path.join(rootDir, "blog", "posts", "zh");
const articleMediaBasePath = "/blog/assets/media/";
const outputPath = path.join(rootDir, "blog", "metadata", "posts.json");
const seriesPath = path.join(rootDir, "blog", "metadata", "series.json");
const relaunchStart = Date.parse("2026-07-01T00:00:00+08:00");

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
    return new Map(files.map((filePath) => [relativePostPath(filePath, dir), filePath]));
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
    const match = file.match(/^(s\d{3}(?:-arc\d{3})?-\d{2}|a\d{3})-/);
    return match?.[1] || "";
}

function relativePostPath(filePath, baseDir) {
    return path.relative(baseDir, filePath).split(path.sep).join("/");
}

function filenameForSeriesPost(post) {
    const order = String(post.series?.order).padStart(2, "0");
    const arcId = arcIdFor(post);

    if (arcId) {
        return `${post.series?.id}-${arcId}-${order}-${post.slug}.md`;
    }

    return `${post.series?.id}-${order}-${post.slug}.md`;
}

function arcIdFor(post) {
    if (typeof post.arc === "string" && post.arc.trim()) return post.arc.trim();
    if (typeof post.series?.arc?.id === "string" && post.series.arc.id.trim()) return post.series.arc.id.trim();
    return "";
}

function findArc(seriesId, arcId) {
    if (!seriesId || !arcId) return null;

    const arcs = seriesMetadata?.[seriesId]?.arcs;
    if (!Array.isArray(arcs)) return null;

    return arcs.find((arc) => arc?.id === arcId) || null;
}

function arcMetadataFor(post) {
    const seriesId = post.series?.id;
    const arcId = arcIdFor(post);
    const arc = findArc(seriesId, arcId);

    if (!arc) return {};

    return {
        arc: arcId,
        arcSlug: arc.slug,
        arcTitle: arc.title,
    };
}

function eraMetadataFor(post) {
    const uploaded = Date.parse(post.published?.uploaded || "");
    const isArchive = Number.isFinite(uploaded) && uploaded < relaunchStart;

    return {
        era: isArchive ? "pre-relaunch" : "relaunch",
        ...(isArchive ? { archive: true } : {}),
    };
}

function publicPathToFsPath(publicPath) {
    return path.join(rootDir, publicPath.replace(/^\//, ""));
}

function validatePreviewImage(post, file, articleId) {
    const previewImage = post.preview_image;
    const expectedMediaPath = post.series?.is_series === true && post.series?.id
        ? `${articleMediaBasePath}${post.series.id}/${articleId}/`
        : `${articleMediaBasePath}standalone/${articleId}/`;

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
        warnings.push(`${file}: preview image should live under ${expectedMediaPath} (${previewImage})`);
    } else if (!previewImage.startsWith(expectedMediaPath)) {
        warnings.push(`${file}: preview image is outside this article's media folder (${previewImage})`);
    }

    if (!existsSync(publicPathToFsPath(previewImage))) {
        warnings.push(`${file}: preview image not found (${previewImage})`);
    }
}

function validatePost(post, file, articleId, relativeFile) {
    requireString(post, "slug", file);
    requireString(post, "title.en", file);
    requireString(post, "title.zh", file);
    requireString(post, "description.en", file);
    requireString(post, "description.zh", file);
    requireString(post, "published.uploaded", file);

    if (!articleId) {
        errors.push(`${relativeFile}: filename must start with s###-## or a###`);
    }

    validatePreviewImage(post, file, articleId);

    if (post.featured === undefined) {
        errors.push(`${file}: missing featured`);
    }

    if (post.series?.is_series === true) {
        validateSeriesPost(post, file, relativeFile);
    } else if (post.series?.is_series === false) {
        validateStandalonePost(post, file, relativeFile);
    } else {
        errors.push(`${file}: series.is_series must be true or false`);
    }

    const uploaded = Date.parse(post.published?.uploaded || "");
    if (Number.isNaN(uploaded)) {
        errors.push(`${file}: invalid published.uploaded date`);
    }
}

function validateSeriesPost(post, file, relativeFile) {
    requireString(post, "series.id", file);
    requireNumber(post, "series.order", file);

    const arcId = arcIdFor(post);
    const arc = findArc(post.series?.id, arcId);
    const expectedFilename = filenameForSeriesPost(post);

    if (file !== expectedFilename) {
        errors.push(`${relativeFile}: filename should be ${expectedFilename}`);
    }

    if (arcId) {
        if (post.series?.id !== "s007") {
            errors.push(`${relativeFile}: only s007 posts can set arc`);
        }

        if (!arc) {
            errors.push(`${relativeFile}: unknown ${post.series?.id} arc "${arcId}"`);
        } else if (typeof arc.slug !== "string" || !arc.slug.trim()) {
            errors.push(`${relativeFile}: arc "${post.series?.id}:${arcId}" is missing slug`);
        } else if (typeof arc.title !== "string" || !arc.title.trim()) {
            errors.push(`${relativeFile}: arc "${post.series?.id}:${arcId}" is missing title`);
        }

        if (post.series?.arc && typeof post.series.arc.order !== "number") {
            errors.push(`${relativeFile}: missing numeric series.arc.order`);
        }
    }

    const expectedRelativeFiles = arc
        ? [
            `${post.series?.id}/${arc.id}/${expectedFilename}`,
            `${post.series?.id}/${arc.slug}/${expectedFilename}`,
        ]
        : [`${post.series?.id}/${expectedFilename}`];

    if (!expectedRelativeFiles.includes(relativeFile)) {
        warnings.push(`${relativeFile}: expected series path ${expectedRelativeFiles.join(" or ")}`);
    }

    if (!zhFilesByName.has(relativeFile)) {
        warnings.push(`${relativeFile}: no matching zh post found`);
    }
}

function validateStandalonePost(post, file, relativeFile) {
    const match = file.match(/^(a\d{3})-(.+)\.md$/);

    if (!match) {
        errors.push(`${relativeFile}: standalone filename should be a###-${post.slug}.md`);
        return;
    }

    const [, articleId, filenameSlug] = match;

    if (filenameSlug !== post.slug) {
        errors.push(`${relativeFile}: filename slug should match ${post.slug}`);
    }

    if (post.series?.id || post.series?.order !== undefined) {
        errors.push(`${relativeFile}: standalone posts must not set series.id or series.order`);
    }

    if (arcIdFor(post)) {
        errors.push(`${relativeFile}: standalone posts must not set arc`);
    }

    const expectedFilename = `${articleId}-${post.slug}.md`;
    const expectedRelativeFile = `standalone/${expectedFilename}`;
    if (!zhFilesByName.has(expectedRelativeFile)) {
        warnings.push(`${relativeFile}: no matching zh post found`);
    }
}

const seriesMetadata = JSON.parse(await readFile(seriesPath, "utf8"));
const zhFilesByName = await markdownFileMap(zhPostsDir);
const files = await markdownFiles(postsDir);

const posts = [];

for (const filePath of files) {
    const file = path.basename(filePath);
    const relativeFile = relativePostPath(filePath, postsDir);
    const markdown = await readFile(filePath, "utf8");
    const post = parseFrontmatter(markdown, path.relative(rootDir, filePath));

    if (!post) continue;

    const articleId = articleIdFromFilename(file);
    validatePost(post, file, articleId, relativeFile);
    posts.push({
        ...post,
        ...arcMetadataFor(post),
        ...eraMetadataFor(post),
        article_id: articleId,
        source_path: relativeFile,
    });
}

const slugs = new Set();
const seriesOrders = new Set();

for (const post of posts) {
    if (slugs.has(post.slug)) {
        errors.push(`duplicate slug: ${post.slug}`);
    }
    slugs.add(post.slug);

    if (post.series?.is_series === true) {
        const arcId = arcIdFor(post);
        const seriesKey = arcId
            ? `${post.series?.id}:${arcId}:${post.series?.arc?.order || post.series?.order}`
            : `${post.series?.id}:${post.series?.order}`;
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

    const arcCompare = String(arcIdFor(a)).localeCompare(String(arcIdFor(b)));
    if (arcCompare !== 0) return arcCompare;

    return (a.series?.arc?.order || a.series.order) - (b.series?.arc?.order || b.series.order);
});

await writeFile(outputPath, `${JSON.stringify(posts, null, 4)}\n`, "utf8");

console.log(`Generated ${path.relative(rootDir, outputPath)} from ${posts.length} posts.`);

if (warnings.length > 0) {
    console.warn("\nWarnings:");
    warnings.forEach((warning) => console.warn(`- ${warning}`));
}
