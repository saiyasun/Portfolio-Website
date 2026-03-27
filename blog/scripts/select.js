function getCurrentLang() {
    return document.documentElement.lang
}
const blogTitle = document.title
const comingSoon = document.getElementById("coming-soon") // display if there are no posts
const blogHomepage = document.getElementById("blog_homepage")
const postsMetadata = "/blog/metadata/"
const uiTranslations = "/blog/translations/"
const translationFiles = ["/blog/translations/ui_translations.json", "/translations/universal_ui.json"]

async function fetchContent(path, file) {
    const response = await fetch(`${path}${file}`)
    const data = await response.text()
    
    if (!data.trim()) return []

    return JSON.parse(data)
}

/*
===========
Fetch posts
=========== 
*/ 
const getPosts = async () => {
    const postsResponse = await fetchContent(postsMetadata, "posts.json")

    return postsResponse
}

// hide blog homepage if there are no posts
async function initBlog() {
    const posts = await getPublishedPosts();

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
initBlog()

async function getPublishedPosts() {
    const posts = await getPosts();
    return posts.filter(post => isPublished(post?.published?.uploaded));
}

function getTaiwanNow() {
    const now = new Date();
    const taiwanString = now.toLocaleString("en-US", { timeZone: "Asia/Taipei" });
    return new Date(taiwanString);
}

function isPublished(uploadedIso) {
    if (!uploadedIso) return false;

    const uploadedDate = new Date(uploadedIso);
    if (isNaN(uploadedDate.getTime())) return false;

    const taiwanNow = getTaiwanNow();
    return uploadedDate <= taiwanNow;
}

// populate post card
async function populateSelection() {
    const posts = await getPublishedPosts();
    const selectLang = getCurrentLang()

    const blogTemplate = document.getElementById("blog-template");
    const selectionContainer = document.querySelector("#blog_selection");

    selectionContainer.innerHTML = "";

    posts.forEach(post => {
        const clone = blogTemplate.content.cloneNode(true);

        // 1. add link
        const selectLink = clone.querySelector(".blog_item");
        const slug = post.slug;
        selectLink.href = `/blog/post.html?slug=${slug}`;

        // 2. add preview image
        const previewImage = clone.querySelector(".blog_item-img");
        previewImage.src = `/blog/assets/images/preview_images/${post.preview_image}`;
        previewImage.alt = post.title[selectLang];

        // 3. get title
        const selectTitleEl = clone.querySelector(".blog_item-title");
        const selectTitle = post.title[selectLang];
        selectTitleEl.textContent = selectTitle.toUpperCase();

        // 4. get date
        const timestamp = Date.parse(post.published?.uploaded);
        const monthEl = clone.querySelector(".blog_item-month");
        const dayEl = clone.querySelector(".blog_item-day");
        const yearEl = clone.querySelector(".blog_item-year");

        if (post.published?.uploaded && !isNaN(timestamp)) {
            const dateObj = new Date(timestamp);

            monthEl.textContent = `${dateObj
                .toLocaleString(selectLang === "zh" ? "zh-TW" : "en-US", { month: "short" })
                .toLowerCase()} `;

            dayEl.textContent = dateObj.getDate();
            yearEl.textContent = `, ${dateObj.getFullYear()}`;

            if (selectLang === "zh") {
                monthEl.textContent = `${dateObj
                .toLocaleString(selectLang === "zh" ? "zh-TW" : "en-US", { month: "short" })
                .toLowerCase()}`;
                yearEl.textContent = `，${dateObj.getFullYear()}`
                dayEl.textContent = `${dateObj.getDate()}日`;
            }
        } else {
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
}

async function renderBlogSelection() {
    await initBlog()
    await populateSelection()
    await translateUI(document.documentElement.lang, translationFiles)
}

document.addEventListener("languagechange", async (event) => {
    await renderBlogSelection(event.detail.lang)
})

renderBlogSelection()