let blogLang = document.documentElement.lang
const blogTitle = document.title
const comingSoon = document.getElementById("coming-soon") // display if there are no posts
const blogHomepage = document.getElementById("blog_homepage")
const postsPath = "/blog/posts/"
const postsMetadata = "/blog/metadata/"

async function fetchContent(path, file) {
    const response = await fetch(`${path}${file}`)
    const data = await response.text()
    
    if (!data.trim()) return []

    return JSON.parse(data)
}

async function getPosts() {
    const postsResponse = await fetchContent(postsMetadata, "posts.json")

    return postsResponse
}

// hide blog homepage if there are no posts
async function initBlog() {
    const posts = await getPosts()
    console.log(posts.length)
    if (!posts || posts.length == 0) {
        comingSoon.classList.remove("hidden")
        blogHomepage.classList.add("hidden")
    }

    document.body.style.display = "flex"
    document.body.style.alignItems = "center"
    document.body.style.height = "100dvh"
}
// initBlog()

