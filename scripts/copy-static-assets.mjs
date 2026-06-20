import { cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");

async function copyIfExists(source, destination = source) {
    const sourcePath = path.join(rootDir, source);
    if (!existsSync(sourcePath)) return;

    await cp(sourcePath, path.join(distDir, destination), {
        recursive: true,
        force: true,
    });
}

await mkdir(distDir, { recursive: true });

const rootFiles = [
    "index.html",
    "style.css",
    "script.js",
    "universal.js",
    "CNAME",
];

const rootDirs = [
    "components",
    "content",
    "docs",
    "images",
    "resources",
    "translations",
];

const blogFiles = [
    "blog/index.html",
    "blog/blog.css",
    "blog/post.css",
    "blog/post.html",
];

const blogDirs = [
    "blog/assets",
    "blog/metadata",
    "blog/posts",
    "blog/scripts",
    "blog/translations",
];

for (const file of rootFiles) {
    await copyIfExists(file);
}

for (const dir of rootDirs) {
    await copyIfExists(dir);
}

for (const file of blogFiles) {
    await copyIfExists(file);
}

for (const dir of blogDirs) {
    await copyIfExists(dir);
}

console.log("Copied static files to dist.");
