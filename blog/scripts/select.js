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
// hide blog homepage if there are no posts
async function initBlog() {
    const posts = await getPublishedPosts();
    const currentLang = getCurrentLang();
    currentLang === "en" ? document.title = "Blog | Asiah Crutchfield" : document.title = "孫賽亞 | 部落格";
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
function blogPageUrl(page) {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(page));
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
// populate post card
async function populateSelection() {
    const posts = await getPublishedPosts();
    const selectLang = getCurrentLang();
    const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));
    const currentPage = Math.min(getBlogPage(), totalPages);
    const start = (currentPage - 1) * postsPerPage;
    const visiblePosts = posts.slice(start, start + postsPerPage);
    const blogTemplate = document.getElementById("blog-template");
    const selectionContainer = document.querySelector("#blog_selection");
    selectionContainer.innerHTML = "";
    visiblePosts.forEach(post => {
        const clone = blogTemplate.content.cloneNode(true);
        // 1. add link
        const selectLink = clone.querySelector(".blog_item");
        const slug = post.slug;
        selectLink.href = `/blog/post.html?slug=${slug}`;
        // 2. add preview image
        const previewImage = clone.querySelector(".blog_item-img");
        const previewImagePath = getPreviewImagePath(post.preview_image);
        const previewTitle = post.title?.[selectLang] || post.title?.en || post.slug || "";
        if (previewImagePath) {
            previewImage.src = previewImagePath;
            previewImage.alt = previewTitle;
        }
        else {
            previewImage.removeAttribute("src");
            previewImage.alt = "";
            previewImage.classList.add("is-placeholder");
            previewImage.setAttribute("aria-hidden", "true");
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
    renderPagination(posts.length, currentPage);
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
