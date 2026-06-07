import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://asiahcrutchfield.com";
const postsPath = path.join(rootDir, "blog", "metadata", "posts.json");
const seriesPath = path.join(rootDir, "blog", "metadata", "series.json");
const outputPath = path.join(rootDir, "sitemap.xml");
const robotsPath = path.join(rootDir, "robots.txt");

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

function seriesSlugFor(post, series) {
    return series?.[post.series?.id]?.slug || post.series?.id || "posts";
}

function postUrl(post, series) {
    if (post.series?.is_series === false) {
        return `${siteUrl}/blog/${post.slug}/`;
    }

    return `${siteUrl}/blog/${seriesSlugFor(post, series)}/${post.slug}/`;
}

const posts = JSON.parse(await readFile(postsPath, "utf8"));
const series = JSON.parse(await readFile(seriesPath, "utf8"));
const sitemapPosts = posts.filter((post) => post?.published?.uploaded);

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
