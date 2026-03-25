const postLang = document.documentElement.lang
let blogTitle = document.title
const postsMetadata = "/blog/metadata/"
const postsPath = "/blog/posts/"

// 1. get the slug
function getSlug() {
    // 1. get current url
    const currentUrl = new URLSearchParams(window.location.search)
    // 2. get the slug
    const selectSlug = currentUrl.get("slug")

    return selectSlug
}
const articleSlug = getSlug()

// 1a. get content
async function fetchJSON(path, file) {
    const response = await fetch(`${path}${file}`)
    const data = await response.text()
    
    if (!data.trim()) return []

    return JSON.parse(data)
}

async function fetchText(path, file) {
    const response = await fetch(`${path}${file}`)
    const data = await response.text()

    return data
}

// 2. fetch the post
const getArticle = async () => {
    const article = await fetchText(postsPath, `${articleSlug}.md`)

    return article
}

// 2a. get json file
const findMetadata = async () => {
    const metadata = await fetchJSON(postsMetadata, "posts.json")

    return metadata
}
// helper for metadata
async function getPublishedMetadata() {
    const metadata = await findMetadata();
    return metadata.filter(post => isPublished(post?.published?.uploaded));
}

// 3. get correct metadata
const getMetadata = async () => {
    const data = await getPublishedMetadata()
    
    const postMeta = data.find(post => post.slug === articleSlug)

    return postMeta || null
}

// 3. calculate reading time
function calculateReadingTime(text, wpm = 200) {
    if (!text) return 1

    // use regex to remove markdown syntax
    const cleanText = text.replace(/```[\s\S]*?```/g, "") // remove code blocks
        .replace(/`.*?`/g, "") // remove inline code
        .replace(/!\[.*?\]\(.*?\)/g, "") // remove images
        .replace(/\[.*?\]\(.*?\)/g, "") // remove links
        .replace(/[#>*_\-]/g, "") // remove markdown symbols
    
    const words = cleanText.trim().split(/\s+/).length

    const minutes = Math.ceil(words / wpm)

    return Math.max(1, minutes)
}

// 4. format reading time
function formatReadingTime(minutes, lang) {
    minutes = Math.max(1, minutes || 1)

    if (lang === "zh") {
        if (minutes < 60) {
            return {
                value: String(minutes),
                marker: "分鐘"
            }
        }

        const hours = Math.ceil(minutes / 60)

        return {
            value: String(hours),
            marker: "小時"
        }
    }

    if (minutes < 60) {
        return {
            value: String(minutes),
            marker: minutes === 1 ? "minute" : "minutes"
        }
    }

    const hours = Math.ceil(minutes / 60)

    return {
        value: String(hours),
        marker: hours === 1 ? "hour" : "hours"
    }
}


// 5. add timestamp
function timeUploaded(metadata, scope = document) {
    const uploadedIso = metadata?.published?.uploaded;
    const editedIso = metadata?.published?.edited;

    if (!uploadedIso) {
        return { canDisplay: false };
    }

    const uploadedDate = new Date(uploadedIso);

    if (isNaN(uploadedDate.getTime())) {
        return { canDisplay: false };
    }

    const canDisplay = isPublished(uploadedIso);

    if (!canDisplay) {
        return { canDisplay: false };
    }

    // main published date
    const publishedMonthEl = scope.querySelector(".reading_date-container .blog_item-month");
    const publishedDayEl = scope.querySelector(".reading_date-container .blog_item-day");
    const publishedYearEl = scope.querySelector(".reading_date-container .blog_item-year");

    if (publishedMonthEl && publishedDayEl && publishedYearEl) {
        fillDateElements(uploadedDate, publishedMonthEl, publishedDayEl, publishedYearEl);
    }

    // edited date block
    const editBlock = scope.querySelector(".post_edit");

    if (editedIso) {
        const editedDate = new Date(editedIso);

        // only show edited if valid and later than uploaded
        if (!isNaN(editedDate.getTime()) && editedDate > uploadedDate && editBlock) {
            const editedMonthEl = editBlock.querySelector(".blog_item-month");
            const editedDayEl = editBlock.querySelector(".blog_item-day");
            const editedYearEl = editBlock.querySelector(".blog_item-year");

            fillDateElements(editedDate, editedMonthEl, editedDayEl, editedYearEl);
            editBlock.classList.remove("hidden");
        } else if (editBlock) {
            editBlock.classList.add("hidden");
        }
    } else if (editBlock) {
        editBlock.classList.add("hidden");
    }

    return { canDisplay: true, uploadedDate };
}

// helper functions for timeuploaded
function fillDateElements(dateObj, monthEl, dayEl, yearEl) {
    monthEl.textContent = dateObj
        .toLocaleString(postLang === "zh" ? "zh-TW" : "en-US", { month: "short" })
        .toLowerCase();

    dayEl.textContent = String(dateObj.getDate());
    yearEl.textContent = String(dateObj.getFullYear());
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

// 6. populate article
async function showArticle() {
    const article = await getArticle();
    const metadata = await getMetadata();

    const blogContainer = document.querySelector(".blog");
    const articleTemplate = document.querySelector("#blog-template");

    if (!metadata) {
        blogContainer.innerHTML = "<p>Post not found</p>";
        return;
    }

    const clone = articleTemplate.content.cloneNode(true);

    // check publish timestamp + fill dates
    const publishState = timeUploaded(metadata, clone);

    if (!publishState.canDisplay) {
        blogContainer.innerHTML = `<p>${postLang === "zh" ? "文章尚未發布" : "This article is not published yet."}</p>`;
        return;
    }

    const blogArticleContainer = clone.querySelector(".blog_post-article");
    blogArticleContainer.innerHTML = marked.parse(article);

    const blogTitleEl = clone.querySelector(".blog_post-title");
    blogTitleEl.textContent = metadata.title[postLang];

    // reading time
    const readingTimeEl = clone.querySelector(".reading_time-time");
    const timeMarkerEl = clone.querySelector(".reading_time-marker");
    const readingTime = calculateReadingTime(article);
    const timeDisplay = formatReadingTime(readingTime, postLang);

    readingTimeEl.textContent = timeDisplay.value;
    timeMarkerEl.textContent = timeDisplay.marker;

    // page title
    document.title = metadata.title[postLang];

    blogContainer.innerHTML = "";
    blogContainer.append(clone);
}

async function hideSuggestions() {
    const metadata = await getPublishedMetadata()

    const postLen = metadata.length

    if (postLen < 3) {
        document.querySelector(".blog_post-end")?.classList.add("hidden")
        document.querySelector("#more_articles-container")?.classList.add("hidden")
    }
}

function elapsedTime(isoDate) {
    if (!isoDate) {
        const dateEl = document.querySelector(".related_article-date")
        if (dateEl) dateEl.classList.add("hidden")
        return ""
    }

    const published = new Date(isoDate)
    const today = getTaiwanNow()

    published.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const diffMs = today - published
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
        return postLang === "zh" ? "未來" : "future"
    }

    if (diffDays < 30) {
        if (postLang === "zh") {
            if (diffDays === 0) return "今天"
            if (diffDays === 1) return "1 天前"
            return `${diffDays} 天前`
        }

        if (diffDays === 0) return "today"
        if (diffDays === 1) return "1 day ago"
        return `${diffDays} days ago`
    }

    const diffMonths = Math.floor(diffDays / 30)

    if (diffMonths < 12) {
        if (postLang === "zh") {
            return `${diffMonths} 個月前`
        }

        return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`
    }

    const diffYears = Math.floor(diffMonths / 12)

    if (diffYears < 10) {
        if (postLang === "zh") {
            return `${diffYears} 年前`
        }

        return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`
    }

    const diffDecades = Math.floor(diffYears / 10)

    if (postLang === "zh") {
        return `${diffDecades} 個十年以前`
    }

    return `${diffDecades} ${diffDecades === 1 ? "decade" : "decades"} ago`
}

async function setupSuggestions() {
    const metadata = await getPublishedMetadata();
    const currentIndex = metadata.findIndex(post => post.slug === articleSlug);

    if (metadata.length < 2 || currentIndex === -1) {
        const suggestionBar = document.querySelector(".blog_post-end");
        if (suggestionBar) suggestionBar.classList.add("hidden");
        return;
    }

    const previousContainer = document.querySelector(".previous-article");
    const previousLink = document.querySelector(".previous-link");
    const previousTitle = document.querySelector(".previous-link .blog_post-end_title");

    const nextContainer = document.querySelector(".next-article");
    const nextLink = document.querySelector(".next-link");
    const nextTitle = document.querySelector(".next-link .blog_post-end_title");

    const randomLink = document.querySelector(".random-article a");

    if (currentIndex > 0) {
        const previousPost = metadata[currentIndex - 1];
        previousLink.href = `/blog/post.html?slug=${previousPost.slug}`;
        previousTitle.textContent = previousPost.title[postLang];
    } else {
        previousContainer.classList.add("hidden");
    }

    if (currentIndex < metadata.length - 1) {
        const nextPost = metadata[currentIndex + 1];
        nextLink.href = `/blog/post.html?slug=${nextPost.slug}`;
        nextTitle.textContent = nextPost.title[postLang];
    } else {
        nextContainer.classList.add("hidden");
    }

    if (randomLink) {
        let randomIndex = Math.floor(Math.random() * metadata.length);

        if (metadata.length > 1) {
            while (metadata[randomIndex].slug === articleSlug) {
                randomIndex = Math.floor(Math.random() * metadata.length);
            }
        }

        const randomPost = metadata[randomIndex];
        randomLink.href = `/blog/post.html?slug=${randomPost.slug}`;
        randomLink.textContent = postLang === "zh" ? "隨機文章" : "Random Article";
    }
}

async function populateSuggestions() {
    const metadata = await getPublishedMetadata()

    if (metadata.length >= 3) {
        await setupSuggestions()
    }
    await hideSuggestions()
}

async function initPosts() {
    await showArticle()
    await populateSuggestions()
}