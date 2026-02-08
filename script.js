// UNIVERSAL
const htmlTitle = document.title;
const zhName = document.querySelector(".zh-name").textContent;
let enName = document.querySelector("#en-name").textContent;
    const firstLast = enName.split(" ")
    if (enName.includes(zhName)) {
        enName = enName.replace(zhName, "").trim()
    }
function activeSelect(navbar) {
    const active = "nav_active";

    navbar.forEach(link => {
        link.addEventListener("click", () => {
            // 1. remove active class from all
            navbar.forEach(l => {
                l.classList.remove(active)
            });
        link.classList.add(active)
        });
    });
}

// !Hero!
const mainNav = document.querySelectorAll("#main-nav a:not([data-static])")
const mobileNav = document.querySelectorAll(".nav-rail a")

// make clicked link active
activeSelect(mainNav);
activeSelect(mobileNav);

// 👨🏾About👨🏾
const aboutSection = document.getElementById("about-container") // container for all subsections
const aboutNav = document.querySelectorAll("#bio-navigation a")
const aboutSubSections = document.querySelectorAll(".about-subsection")

activeSelect(aboutNav); // make clicked link active
aboutNav.forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
    })
})

// 🤹Skills🤹

// 🛠️Projects🛠️

// 🎓👷Experience/Education🎓👷

// ✉️Contact✉️