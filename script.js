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

// hides section if json array has no content
function ifEmpty(container, dataArray) {
    if (!dataArray || dataArray.length === 0) {
        container.classList.add(hideClass);
        return true;
    }
    container.classList.remove(hideClass);
    return false
}

// ~file paths~
const templateContent = "content/temp_content.json"
const translationContent = "content/translations.json"

// fetch content
async function fetchContent(filePath) {
    const response = await fetch(filePath);
    const data = await response.json()

    return data
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
const langSection = document.getElementById('hLanguages')

async function buildLanguages() {
    const langData = await fetchContent(templateContent)
    const languages = langData.skills.languages

    languages.forEach(lang => {
        const clone = langTemplate.content.cloneNode(true);

        const langName = clone.querySelector(".lang-name")
        const langFlag = clone.querySelector(".lang-flag")
        const langFluency = clone.querySelector(".fluency")

        langName.textContent = lang.lang
        langFlag.src = `images/icons/${lang.flag}`
        langFluency.textContent = fluencyLevels[lang.fluency]

        langContainer.append(clone)
    })
}

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
const techContainerO = document.querySelectorAll(".tech_stack-o") // ordered
    const techCategoryMap = {}
    techContainerO.forEach(list => {
        const cat = list.dataset.tech_cat; // "frotend", "backend", etc (eg: frontend: <ul data-tech_cat="frontend"></ul>)
        techCategoryMap[cat] = list
    })
const techSection = document.getElementById("technologies")

async function buildTech() {
    const techData = await fetchContent(templateContent)
    const technology = techData.skills.technologies

    technology.forEach(tech => {
        const cloneU = techTemplate.content.cloneNode(true);

        const techName = cloneU.querySelector(".tech-name")
        const techImg = cloneU.querySelector(".tech-img")

        techName.textContent = tech.name
        techImg.src = `images/icons/tech/${tech.img}`

        // always append to unordered list
        techContainerU.append(cloneU)
        
        // add to ordered list
        const cloneO = techTemplate.content.cloneNode(true);

        cloneO.querySelector(".tech-name").textContent = tech.name
        cloneO.querySelector(".tech-img").src = `images/icons/tech/${tech.img}`

        const categoryName = techCats[tech.category]
        const targetList = techCategoryMap[categoryName]

        if (targetList) {
            targetList.appendChild(cloneO)
        }
    })
}

// !~certs template~!
const certTemplate = document.getElementById("cert_template")
const certContainer = document.getElementById("cert-container")
const certSection = document.getElementById("certifications")

async function buildCerts() {
    const certData = await fetchContent(templateContent)
    const certifications = certData.skills.certifications

    certifications.forEach((cert, index) => {
        const clone = certTemplate.content.cloneNode(true);
        const cloneEl = clone.querySelector(".cert")
        if (index % 2 === 1) {
            cloneEl.classList.add("cert-reverse")
        }

        const certName = clone.querySelector(".cert-name")
        const certDate = clone.querySelector(".cert-date")

        certName.textContent = cert.name
        certDate.textContent = cert.year != 0 ? cert.year : "in progress"
        
        certContainer.append(clone)
    })
}

// 🛠️Projects🛠️
// !~projects template~!
const projTemplate = document.getElementById("project_template")
const projContainer = document.getElementById("projects-container")
const expSection = document.getElementById('experience')

// 🎓👷Experience/Education🎓👷
const dutyBtn = document.querySelectorAll(".duties-btn")
const dutiesList = document.querySelectorAll(".duties-list")

expSection.addEventListener("click", (e) => {
    const btn = e.target.closest(".duties-btn")
    if (!btn) return

    const list = btn.nextElementSibling;

    if (!list || !list.classList.contains("duties-list")) return;

    list.classList.toggle(hideClass)
})

// !~experience template~!
const expTemplate = document.getElementById("exp_template")
const expContainer = document.getElementById("exp-container")
const expReverseClass = "exp-reverse"

async function buildExperience() {
    const expData = await fetchContent(templateContent)
    const experience = expData.exp_edu.experience

    experience.forEach((exp, index) => {
        const clone = expTemplate.content.cloneNode(true)
        const cloneEl = clone.querySelector(".exp")
        if (index % 2 === 1) {
            cloneEl.classList.add("exp-reverse")
        }

        const expTitle = clone.querySelector(".exp-title")
        const expStartDate = clone.querySelector(".start-date")
        const expEndDate = clone.querySelector(".end-date")
        const expCity = clone.querySelector(".exp_city")
        const expCountry = clone.querySelector(".exp_country")
        const expSummary = clone.querySelector(".exp-summary")
        const expDuties = clone.querySelector(".duties-list")

        expTitle.textContent = exp.title
        expStartDate.textContent = exp.start_date
        expEndDate.textContent = exp.end_date == 0 ? "present" : exp.end_date
        expCity.textContent = exp.city
        expCountry.textContent = exp.country
        expSummary.textContent = exp.summary
        // clear list
        expDuties.innerHTML = ""
        const expDutiesList = exp.duties
        expDutiesList.forEach(duty => {
            const li = document.createElement('li')
            li.textContent = duty
            expDuties.append(li)
        })

        expContainer.append(clone)
    })
}

// !~education template~!
const eduTemplate = document.getElementById("edu_template")
const eduContainer = document.getElementById("edu-container")

// ✉️Contact✉️

// function to visualize accessing json content
async function loadContent(filePath) {
    const response = await fetch(filePath);
    const data = await response.json()

    const {languages, technologies, certifications} = data.skills
    const {experience, education} = data.exp_edu

    if (!ifEmpty(langSection, languages)) {
        buildLanguages();
    }
    
    if (!ifEmpty(techSection, technologies)) {
        buildTech();
    }

    if (!ifEmpty(certSection, certifications)) {
        buildCerts();
    }

    if (!ifEmpty(expSection, experience)) {
        buildExperience();
    }
    console.log(data)
}

loadContent(templateContent)