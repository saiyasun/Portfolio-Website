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

// 3. get correct metadata
const getMetadata = async () => {
    const data = await findMetadata()
    
    const postMeta = data.find(post => post.slug === articleSlug)

    return postMeta || null
}

// 3. populate article
async function showArticle() {
    const article = await getArticle()
        const metadata = await getMetadata()
    const blogContainer = document.querySelector(".blog")
    const articleTemplate = document.querySelector("#blog-template")

    if (!metadata) {
        document.querySelector(blogContainer).innerHTML = "<p>Post not found</p>"
        return
    }

    const clone = articleTemplate.content.cloneNode(true)
    const blogArticleContainer = clone.querySelector(".blog_post-article")
        blogArticleContainer.innerHTML = marked.parse(article)
    const blogTitle = document.querySelector(".blog_post-title")
        blogTitle.textContent = metadata.title[postLang]

    blogContainer.append(true)
}