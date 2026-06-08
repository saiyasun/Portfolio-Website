// @ts-nocheck
function getCurrentLang() {
    return document.documentElement.lang;
}
const blogTitle = document.title;
const comingSoon = document.getElementById("coming-soon"); // display if there are no posts
const blogHomepage = document.getElementById("blog_homepage");
const postsMetadata = "/blog/metadata/";
const uiTranslations = "/blog/translations/";
const translationFiles = ["/blog/translations/ui_translations.json", "/translations/universal_ui.json"];
const postsPerPage = 6;
async function fetchContent(path, file) {
    const response = await fetch(`${path}${file}`);
    const data = await response.text();
    if (!data.trim())
        return [];
    return JSON.parse(data);
}
/*
===========
Fetch posts
===========
*/
const getPosts = async () => {
    const postsResponse = await fetchContent(postsMetadata, "posts.json");
    return postsResponse;
};
const getSeries = async () => {
    return await fetchContent(postsMetadata, "series.json");
};
// hide blog homepage if there are no posts
async function initBlog() {
    const posts = await getPublishedPosts();
    const currentLang = getCurrentLang();
    currentLang === "en" ? document.title = "Asides | Asiah Crutchfield" : document.title = "Asides | 孫賽亞";
    if (!posts || posts.length === 0) {
        comingSoon.classList.remove("hidden");
        blogHomepage.classList.add("hidden");
        document.body.style.display = "flex";
        document.body.style.alignItems = "center";
        document.body.style.height = "100dvh";
    }
    comingSoon.classList.add("hidden");
    blogHomepage.classList.remove("hidden");
    document.body.style.display = "";
    document.body.style.alignItems = "";
    document.body.style.height = "";
}
initBlog();
async function getPublishedPosts() {
    const posts = await getPosts();
    return posts
        .filter(post => isPublished(post?.published?.uploaded))
        .sort((a, b) => Date.parse(b.published?.uploaded || "") - Date.parse(a.published?.uploaded || ""));
}
function getBlogPage() {
    const params = new URLSearchParams(window.location.search);
    const page = Number(params.get("page") || "1");
    if (!Number.isInteger(page) || page < 1)
        return 1;
    return page;
}
function getSelectedTag() {
    const params = new URLSearchParams(window.location.search);
    return params.get("tag") || "";
}
function normalizeTag(tag = "") {
    return tag.trim().toLowerCase();
}
function blogPageUrl(page) {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(page));
    return `${url.pathname}${url.search}${url.hash}`;
}
function tagPageUrl(tag = "") {
    const url = new URL(window.location.href);
    url.searchParams.delete("page");
    if (tag) {
        url.searchParams.set("tag", tag);
    }
    else {
        url.searchParams.delete("tag");
    }
    return `${url.pathname}${url.search}${url.hash}`;
}
function renderPagination(totalPosts, currentPage) {
    const pagination = document.getElementById("blog-pagination");
    const prevLink = document.getElementById("blog-page-prev");
    const nextLink = document.getElementById("blog-page-next");
    const status = document.getElementById("blog-page-status");
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    if (!pagination || !prevLink || !nextLink || !status)
        return;
    if (totalPages <= 1) {
        pagination.classList.add("hidden");
        return;
    }
    pagination.classList.remove("hidden");
    status.textContent = `${currentPage} / ${totalPages}`;
    prevLink.classList.toggle("is-disabled", currentPage <= 1);
    nextLink.classList.toggle("is-disabled", currentPage >= totalPages);
    prevLink.setAttribute("aria-disabled", String(currentPage <= 1));
    nextLink.setAttribute("aria-disabled", String(currentPage >= totalPages));
    prevLink.href = currentPage > 1 ? blogPageUrl(currentPage - 1) : "";
    nextLink.href = currentPage < totalPages ? blogPageUrl(currentPage + 1) : "";
}
function getTaiwanNow() {
    const now = new Date();
    const taiwanString = now.toLocaleString("en-US", { timeZone: "Asia/Taipei" });
    return new Date(taiwanString);
}
function isPublished(uploadedIso) {
    if (!uploadedIso)
        return false;
    const uploadedDate = new Date(uploadedIso);
    if (isNaN(uploadedDate.getTime()))
        return false;
    const taiwanNow = getTaiwanNow();
    return uploadedDate <= taiwanNow;
}
function getPreviewImagePath(previewImage) {
    if (!previewImage || typeof previewImage !== "string" || !previewImage.trim())
        return "";
    return `/blog/assets/images/preview_images/${previewImage.trim()}`;
}
function updateTitleLineClasses(scope = document) {
    const titles = scope.querySelectorAll(".blog_item-title");
    titles.forEach(title => {
        title.classList.remove("is-multiline");
        const styles = window.getComputedStyle(title);
        const lineHeight = parseFloat(styles.lineHeight);
        const titleHeight = title.getBoundingClientRect().height;
        if (!lineHeight || !titleHeight)
            return;
        title.classList.toggle("is-multiline", titleHeight > lineHeight * 1.35);
    });
}
function getPostTags(post, lang) {
    return post.tags?.[lang] || post.tags?.en || [];
}
function getPostUrl(post, seriesMetadata = {}) {
    if (post?.series?.is_series === false) {
        return `/blog/${post.slug}/`;
    }
    const seriesSlug = seriesMetadata?.[post.series?.id]?.slug || post.series?.id || "posts";
    return `/blog/${seriesSlug}/${post.slug}/`;
}
function getFilteredPosts(posts, lang) {
    const selectedTag = normalizeTag(getSelectedTag());
    if (!selectedTag)
        return posts;
    return posts.filter(post => {
        const tags = getPostTags(post, lang);
        return tags.some(tag => normalizeTag(tag) === selectedTag);
    });
}
function renderTagFilters(posts, lang) {
    const tagContainer = document.getElementById("blog_homepage-tags");
    const tagTemplate = document.querySelector(".main-tag-template");
    const selectedTag = normalizeTag(getSelectedTag());
    if (!tagContainer || !tagTemplate)
        return;
    const tags = [...new Set(posts.flatMap(post => getPostTags(post, lang)).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, lang === "zh" ? "zh-TW" : "en-US"));
    tagContainer.innerHTML = "";
    if (tags.length === 0) {
        tagContainer.classList.add("hidden");
        return;
    }
    const allLabel = lang === "zh" ? "全部" : "all";
    const allItem = createTagFilterItem(tagTemplate, allLabel, "", selectedTag === "");
    tagContainer.append(allItem);
    tags.forEach(tag => {
        const normalized = normalizeTag(tag);
        tagContainer.append(createTagFilterItem(tagTemplate, tag, tag, selectedTag === normalized));
    });
    tagContainer.classList.remove("hidden");
}
function createTagFilterItem(template, label, tag, isActive) {
    const clone = template.content.cloneNode(true);
    const item = clone.querySelector(".main-tag");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "main-tag-btn";
    button.textContent = label;
    button.setAttribute("aria-pressed", String(isActive));
    if (isActive)
        item.classList.add("is-active");
    button.addEventListener("click", () => {
        window.history.pushState({}, "", tagPageUrl(tag));
        populateSelection();
    });
    item.append(button);
    return clone;
}
// populate post card
async function populateSelection() {
    const posts = await getPublishedPosts();
    const seriesMetadata = await getSeries();
    const selectLang = getCurrentLang();
    const filteredPosts = getFilteredPosts(posts, selectLang);
    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
    const currentPage = Math.min(getBlogPage(), totalPages);
    const start = (currentPage - 1) * postsPerPage;
    const visiblePosts = filteredPosts.slice(start, start + postsPerPage);
    const blogTemplate = document.getElementById("blog-template");
    const selectionContainer = document.querySelector("#blog_selection");
    renderTagFilters(posts, selectLang);
    selectionContainer.innerHTML = "";
    visiblePosts.forEach(post => {
        const clone = blogTemplate.content.cloneNode(true);
        // 1. add link
        const selectLink = clone.querySelector(".blog_item");
        selectLink.href = getPostUrl(post, seriesMetadata);
        // 2. add preview image
        const previewImage = clone.querySelector(".blog_item-img");
        const previewContainer = clone.querySelector(".blog_item-img_container");
        const previewImagePath = getPreviewImagePath(post.preview_image);
        const previewTitle = post.title?.[selectLang] || post.title?.en || post.slug || "";
        const hidePreviewImage = () => {
            previewImage.removeAttribute("src");
            previewImage.alt = "";
            previewImage.hidden = true;
            previewImage.setAttribute("aria-hidden", "true");
            selectLink.classList.add("has-no-image");
            previewContainer?.classList.add("has-no-image");
        };
        const showPreviewImage = () => {
            previewImage.hidden = false;
            previewImage.removeAttribute("aria-hidden");
            selectLink.classList.remove("has-no-image");
            previewContainer?.classList.remove("has-no-image");
        };
        if (previewImagePath) {
            previewImage.hidden = false;
            previewImage.src = previewImagePath;
            previewImage.alt = previewTitle;
            previewImage.addEventListener("error", hidePreviewImage, { once: true });
            previewImage.addEventListener("load", showPreviewImage, { once: true });
        }
        else {
            hidePreviewImage();
        }
        // 3. get title
        const selectTitleEl = clone.querySelector(".blog_item-title");
        const selectTitle = previewTitle;
        selectTitleEl.textContent = selectTitle.toUpperCase();
        // 4. get date
        const timestamp = Date.parse(post.published?.uploaded);
        const monthEl = clone.querySelector(".blog_item-month");
        const dayEl = clone.querySelector(".blog_item-day");
        const yearEl = clone.querySelector(".blog_item-year");
        if (post.published?.uploaded && !isNaN(timestamp)) {
            const dateObj = new Date(timestamp);
            if (monthEl && dayEl && yearEl) {
                fillDateElements(dateObj, monthEl, dayEl, yearEl);
            }
        }
        else {
            monthEl.textContent = "---";
            dayEl.textContent = "--";
            yearEl.textContent = "TBD";
            clone.querySelector(".blog_item-date").classList.add("is-pending");
        }
        // 5. get description
        const selectDescription = clone.querySelector(".blog_item-description");
        selectDescription.textContent = post.description[selectLang];
        // 6. append tags
        const tagContainer = clone.querySelector(".blog_item-tag_container");
        tagContainer.innerHTML = "";
        const selectTags = post.tags[selectLang];
        selectTags.forEach(tag => {
            const li = document.createElement("li");
            li.className = "blog_item-tag blog-tag";
            li.innerHTML = `
                <span class="tag-bracket tag-bracket_left">[</span>
                <span class="blog-tag_text">${tag}</span>
                <span class="tag-bracket tag-bracket_right">]</span>
            `;
            tagContainer.append(li);
        });
        selectionContainer.append(clone);
    });
    requestAnimationFrame(() => updateTitleLineClasses(selectionContainer));
    renderPagination(filteredPosts.length, currentPage);
}
async function renderBlogSelection() {
    await initBlog();
    await populateSelection();
    await translateUI(document.documentElement.lang, translationFiles);
}
document.addEventListener("languagechange", async (event) => {
    await renderBlogSelection(event.detail.lang);
});
renderBlogSelection();
