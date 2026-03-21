const lang = document.documentElement.lang
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
    const posts = await getPosts()

    // if (!posts || posts.length == 0) {
        comingSoon.classList.remove("hidden")
        blogHomepage.classList.add("hidden")
        document.body.style.display = "flex"
        document.body.style.alignItems = "center"
        document.body.style.height = "100dvh"
    // }
}
initBlog()

// populate post card
async function populateSelection() {
    const posts = await getPosts()

    const blogTemplate = document.getElementById("blog-template")
    const selectionContainer = document.querySelector("#blog_selection")

    posts.forEach(post => {
        const clone = blogTemplate.content.cloneNode(true)

        // 1. add link
        const selectLink = clone.querySelector(".blog_item")
            const slug = post.slug
            // add slug to url
            selectLink.href = `/blog/post.html?post=${slug}`

        // 2. add preview image
        const previewImage = clone.querySelector(".blog_item-img")
            previewImage.src = `/blog/assests/images/preview_images/${post.preview_image}`
            previewImage.alt = post.title[lang]
        
        // 3. get title
        const selectTitle = clone.querySelector(".blog_item-title")
            selectTitle.textContent = post.title[lang]

        // 4. get date
        // convert to date object first
        // Check if iso_date exists and can be parsed
        const timestamp = Date.parse(post.iso_date);
        const monthEl = clone.querySelector(".blog_item-month");
        const dayEl = clone.querySelector(".blog_item-day");
        const yearEl = clone.querySelector(".blog_item-year");

        if (post.iso_date && !isNaN(timestamp)) {
            const dateObj = new Date(timestamp);
            
            // Get month name (e.g., "mar")
            monthEl.textContent = dateObj.toLocaleString(lang, { month: 'short' }).toLowerCase();
            dayEl.textContent = dateObj.getDate();
            yearEl.textContent = dateObj.getFullYear();
        } else {
            // FALLBACK: If date is missing/invalid
            monthEl.textContent = "---";
            dayEl.textContent = "--";
            yearEl.textContent = "TBD";
    
        // Optional: Add a class to style it differently
        clone.querySelector(".blog_item-date").classList.add("is-pending");
}

        // 5. get description
        const selectDescription = clone.querySelector(".blog_item-description")
            selectDescription.textContent = post.description[lang]

        // 6. append tags
        const tagContainer = clone.querySelector(".blog_item-tag_container")
            // clear the container
            tagContainer.innerHTML = ""

            const selectTags = post.tags[lang]
                // add tags and append to tag container
                selectTags.forEach(tag => {
                   // i. create the list element
                   li.className = "blog_item-tag blog-tag";
                   li.innerHTML = `
                    <span class="tag-bracket tag-bracket_left">[</span>
                    <span class="blog-tag_text">${tag}</span>
                    <span class="tag-bracket tag-bracket_right">]</span>
                    `;
                    tagContainer.append(li);
                })
    selectionContainer.append(clone)
    })
}