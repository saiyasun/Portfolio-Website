// UNIVERSAL
const htmlTitle = document.title;
const zhName = document.querySelector(".zh-name").textContent;
let enName = document.querySelector("#en-name").textContent;
    const firstLast = enName.split(" ")
    if (enName.includes(zhName)) {
        enName = enName.replace(zhName, "").trim()
    }
const hideClass = "is_hidden"
const activeLink = "nav_active"

// adds active class to currently clicked link
function activeSelect(navbar, active) {
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

// toggles which sections get hidden or shown
function toggleSection(nav, div) {
    nav.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const targetID = link.getAttribute("href").slice(1); // removes "#"

            div.forEach(section => {
                section.classList.toggle(hideClass, section.id !== targetID);
            })
        })
    })
}

// clones template
function mkTemplate(template, container) {
    const content = template.content.cloneNode(true)
    container.appendChild(content)
}

// •nav•
const mainNav = document.querySelectorAll("#main-nav a:not([data-static])")
const mobileNav = document.querySelectorAll(".nav-rail a")

// make clicked link active
activeSelect(mainNav, activeLink);
activeSelect(mobileNav, activeLink);

// !Hero!

// 👨🏾About👨🏾
const aboutSection = document.getElementById("about-container") // container for all subsections
const aboutNav = document.querySelectorAll("#bio-navigation a")
const aboutSubSections = document.querySelectorAll(".about-subsection")

activeSelect(aboutNav, activeLink); // make clicked link active

// Get the href attribute for each subsection to decide which to hide
toggleSection(aboutNav, aboutSubSections); 

// 🤹Skills🤹
// ~languages~
const fluencyLevels = ["beginner", "intermediate", "advanced", "native"]
// !~language template~!
const langTemplate = document.getElementById("lang_template")
const langContainer = document.getElementById("languages")

// ~tech~
const techNav = document.querySelectorAll("#tech-nav a")
const techSubSections = document.querySelectorAll(".tech-container")
const activeTechLink = "tech-nav_active"
const techCats = ["design", "backend", "frontend"]

activeSelect(techNav, activeTechLink); // make clicked link active
toggleSection(techNav, techSubSections); 

// !~tech template~!
const techTemplate = document.getElementById("tech_template")
const techContainerU = document.getElementById("tech_stack-u") // unordered
const techContainerO = document.querySelectorAll(".tech_cat-container") // ordered

// !~certs template~!
const certTemplate = document.getElementById("cert_template")
const certContainer = document.getElementById("cert-container")

// 🛠️Projects🛠️
// !~projects template~!
const projTemplate = document.getElementById("project_template")
const projContainer = document.getElementById("projects-container")

// 🎓👷Experience/Education🎓👷
const dutyBtn = document.querySelectorAll(".duties-btn")
const dutiesList = document.querySelectorAll(".duties-list")

dutyBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        const list = btn.nextElementSibling; // <ul> right after the button
        if (!list || !list.classList.contains("duties-list")) return;

        list.classList.toggle(hideClass)
    })
})

// !~experience template~!
const expjTemplate = document.getElementById("exp_template")
const expContainer = document.getElementById("exp-container")
const expReverseClass = "exp-reverse"

// !~education template~!
const eduTemplate = document.getElementById("edu_template")
const eduContainer = document.getElementById("edu-container")

// ✉️Contact✉️