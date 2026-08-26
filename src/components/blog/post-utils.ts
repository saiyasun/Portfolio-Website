/** Shared blog rules used by the index and individual-post pages. */
export function getTaiwanNow() {
    const taiwanString = new Date().toLocaleString("en-US", { timeZone: "Asia/Taipei" });
    return new Date(taiwanString);
}

export function isPublished(uploadedIso: string | undefined) {
    if (!uploadedIso) return false;

    const uploadedDate = new Date(uploadedIso);
    return !Number.isNaN(uploadedDate.getTime()) && uploadedDate <= getTaiwanNow();
}

export function getPreviewImagePath(previewImage: unknown) {
    if (typeof previewImage !== "string" || !previewImage.trim()) return "";

    const path = previewImage.trim();
    return path.startsWith("/") ? path : "";
}

export function getPostUrl(post: any, seriesMetadata: Record<string, any> = {}) {
    if (post?.series?.is_series === false) return `/blog/${post.slug}/`;

    const seriesSlug = seriesMetadata?.[post?.series?.id]?.slug || post?.series?.id || "posts";
    return `/blog/${seriesSlug}/${post.slug}/`;
}
