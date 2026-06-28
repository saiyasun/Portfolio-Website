import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://asiahcrutchfield.com";
const postsPath = path.join(rootDir, "blog", "metadata", "posts.json");
const seriesPath = path.join(rootDir, "blog", "metadata", "series.json");
const outputPath = path.join(rootDir, "dist", "sitemap.xml");
const robotsPath = path.join(rootDir, "dist", "robots.txt");

function escapeXml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

function dateOnly(isoOrDate) {
    if (typeof isoOrDate === "string") {
        const match = isoOrDate.match(/^\d{4}-\d{2}-\d{2}/);
        if (match) return match[0];
    }

    const date = isoOrDate ? new Date(isoOrDate) : new Date();
    return date.toISOString().slice(0, 10);
}

function getTaiwanNow() {
    const now = new Date();
    const taiwanString = now.toLocaleString("en-US", { timeZone: "Asia/Taipei" });
    return new Date(taiwanString);
}

function isPublished(uploadedIso) {
    if (!uploadedIso) return false;

    const uploadedDate = new Date(uploadedIso);
    if (Number.isNaN(uploadedDate.getTime())) return false;

    return uploadedDate <= getTaiwanNow();
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

function arcSlugFor(post, series) {
    if (typeof post.arcSlug === "string" && post.arcSlug.trim()) return post.arcSlug.trim();

    const arcId = typeof post.arc === "string" && post.arc.trim() ? post.arc.trim() : "";
    const arc = findArc(series, post.series?.id, arcId);
    return typeof arc?.slug === "string" ? arc.slug : "";
}

function postUrl(post, series) {
    if (post.series?.is_series === false) {
        return `${siteUrl}/blog/${post.slug}/`;
    }

    const arcSlug = arcSlugFor(post, series);
    if (arcSlug) {
        return `${siteUrl}/blog/${seriesSlugFor(post, series)}/${arcSlug}/${post.slug}/`;
    }

    return `${siteUrl}/blog/${seriesSlugFor(post, series)}/${post.slug}/`;
}

const posts = JSON.parse(await readFile(postsPath, "utf8"));
const series = JSON.parse(await readFile(seriesPath, "utf8"));
const sitemapPosts = posts.filter((post) => isPublished(post?.published?.uploaded));

const urls = [
    {
        loc: `${siteUrl}/`,
        lastmod: dateOnly(),
    },
    {
        loc: `${siteUrl}/blog/`,
        lastmod: dateOnly(),
    },
];

sitemapPosts.forEach((post) => {
    urls.push({
        loc: postUrl(post, series),
        lastmod: dateOnly(post.published?.edited?.en || post.published?.uploaded),
    });
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `    <url>
        <loc>${escapeXml(url.loc)}</loc>
        <lastmod>${escapeXml(url.lastmod)}</lastmod>
    </url>`).join("\n")}
</urlset>
`;

await writeFile(outputPath, sitemap, "utf8");
await writeFile(robotsPath, `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`, "utf8");

console.log(`Generated sitemap.xml with ${urls.length} URLs and robots.txt.`);
