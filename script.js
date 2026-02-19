// UNIVERSAL
const htmlTitle = document.title;
const zhName = document.querySelector("#zh-name").textContent;
let enName = document.querySelector("#en-name").textContent;
    const firstLast = enName.split(" ")
    if (enName.includes(zhName)) {
        enName = enName.replace(zhName, "").trim()
    }
const hideClass = "is_hidden"
const activeLink = "nav_active"
let currentLang = document.documentElement.lang

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
const templateTranslations = "translations/trans_temp_content.json"
const uiTranslations = "translations/ui_trans.json"

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

// get length of nav elements. If width exceeds nav then center them
function centerMobileNav() {
    const mNavUL = document.querySelector(".nav-rail")
    const navWidth = mNavUL.getBoundingClientRect().width
    const items = mNavUL.querySelectorAll("li")
    let navElLength = 0

    items.forEach(li => {
        navElLength += li.getBoundingClientRect().width
    })

    if (navElLength < navWidth) {
        mNavUL.style.justifyContent = "center"
    } else {
        mNavUL.style.justifyContent = ""
    }
}

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
const fluencyStyles = [
    {w: 25, color: "red"}, // beginner
    {w: 50, color: "yellow"}, // intermediate
    {w: 75, color: "blue"}, // advanced
    {w: 100, color: "green"}, // native
]
// !~language template~!
const langTemplate = document.getElementById("lang_template")
const langContainer = document.getElementById("languages")
const langSection = document.getElementById('hLanguages')

async function buildLanguages() {
    const langData = await fetchContent(templateContent)
    const languages = langData.skills.languages
    const fluencyLevels = langData.skills.fluencyLevels

    languages.forEach((lang, index) => {
        const clone = langTemplate.content.cloneNode(true);

        const langName = clone.querySelector(".lang-name")
        const langFlag = clone.querySelector(".lang-flag")
        const langFluency = clone.querySelector(".fluency")
        const progress = clone.querySelector(".lang-progress")

        langName.textContent = lang.lang
            langName.dataset.i18n = `skills.languages.${index}.lang`
        langFlag.src = `images/icons/${lang.flag}`
        langFluency.textContent = fluencyLevels[lang.fluency]
            langFluency.dataset.i18n = `skills.fluencyLevels.${lang.fluency}`
        // store default English
        langName.dataset.i18nDefault = lang.lang
        langFluency.dataset.i18nDefault = fluencyLevels[lang.fluency]

        const {w, color} = fluencyStyles[lang.fluency] ?? {w: 0, color: "#999"};
        progress.style.setProperty("--bar-w", `${w}%`);
        progress.style.setProperty("--bar-color", color)

        langContainer.append(clone)
    })
}

// ~tech~
const techNav = document.querySelectorAll("#tech-nav a")
const techSubSections = document.querySelectorAll(".tech-container")
const activeTechLink = "tech-nav_active"

activeSelect(techNav, activeTechLink); // make clicked link active
toggleSection(techNav, techSubSections); 

// !~tech template~!
const techTemplate = document.getElementById("tech_template")
const techContainerU = document.getElementById("tech_stack-u") // unordered
const techContainerO = document.querySelectorAll(".tech_stack-o") // ordered
    const techCategoryMap = {}
    techContainerO.forEach(list => {
        const cat = list.dataset.tech_cat; // "frontend", "backend", etc (eg: frontend: <ul data-tech_cat="frontend"></ul>)
        techCategoryMap[cat] = list
    })
const techSection = document.getElementById("technologies")

async function buildTech() {
    const techData = await fetchContent(templateContent)
    const technology = techData.skills.technologies

    technology.forEach((tech, index) => {
        const cloneU = techTemplate.content.cloneNode(true);

        const techName = cloneU.querySelector(".tech-name")
        const techImg = cloneU.querySelector(".tech-img")

        techName.textContent = tech.name
            techName.dataset.i18n = `skills.technologies.${index}.name`
        techImg.src = `images/icons/tech/${tech.img}`

        // save English default
        techName.dataset.i18nDefault = tech.name

        // always append to unordered list
        techContainerU.append(cloneU)
        
        // add to ordered list
        const cloneO = techTemplate.content.cloneNode(true);

        cloneO.querySelector(".tech-name").textContent = tech.name
        cloneO.querySelector(".tech-img").src = `images/icons/tech/${tech.img}`

        const targetList = techCategoryMap[tech.category]

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
            certName.dataset.i18n = `skills.certifications.${index}.name`
        certDate.textContent = cert.year != 0 ? cert.year : "in progress"

        // save English defaults
        certName.dataset.i18nDefault = cert.name
        
        certContainer.append(clone)
    })
}

// 🛠️Projects🛠️
// !~projects template~!
const projTemplate = document.getElementById("project_template")
const projContainer = document.getElementById("projects-container")
const projectsSection = document.getElementById('projects')

async function buildProjects() {
    const projData = await fetchContent(templateContent)
    const projects = projData.projects

    projects.forEach((proj, index) => {
        const clone = projTemplate.content.cloneNode(true)

        const title = clone.querySelector(".project-title")
        const img = clone.querySelector(".project-img")
        const imgLink = clone.querySelector(".p_img-link")
        const description = clone.querySelector(".project-desc")
        const linkList = clone.querySelector(".project-links")
        const pLinks = clone.querySelector(".p_links")
            const pLinkItems = proj.pLinks
        const linkImg = clone.querySelector(".p_link-img")

        title.textContent = proj.name
            title.dataset.i18n = `projects.${index}.title`
        img.src = `images/icons/projects/${proj.img}`
        imgLink.href = !proj.imgLink || proj.imgLink == "" ? "" : proj.imgLink
        description.textContent = proj.description
            description.dataset.i18n = `projects.${index}.description`

        linkList.innerHTML = ""
        pLinkItems.forEach(links => {
            const li = document.createElement('li')
            const a = document.createElement('a')
            const img = document.createElement('img')
            a.classList.add('p_link')
            img.classList.add('p_link-img')

            a.href = links[0]
            img.src = `images/icons/socials/${links[1]}`

            a.append(img)
            li.append(a)
            linkList.append(li)
        })

        // get English default
        title.dataset.i18nDefault = proj.name
        description.dataset.i18nDefault = proj.description

        projContainer.append(clone)
    })
}

// 🎓👷Experience/Education🎓👷
const dutyBtn = document.querySelectorAll(".duties-btn")
const dutiesList = document.querySelectorAll(".duties-list")
const expSection = document.getElementById('experience')

expSection.addEventListener("click", (e) => {
    const btn = e.target.closest(".duties-btn")
    if (!btn) return

    const list = btn.nextElementSibling;

    if (!list || !list.classList.contains("duties-list")) return;

    btn.textContent = btn.textContent == "+" ? "-" : "+"

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
        const expPosition = clone.querySelector(".position")

        expTitle.textContent = exp.title
            expTitle.dataset.i18n = `exp_edu.experience.${index}.title`
        expStartDate.textContent = exp.start_date
        expEndDate.textContent = exp.end_date == 0 ? "present" : exp.end_date
        expCity.textContent = exp.city
            expCity.dataset.i18n = `exp_edu.experience.${index}.city`
        expCountry.textContent = exp.country
            expCountry.dataset.i18n = `exp_edu.experience.${index}.country`
        expPosition.textContent = exp.position
            expPosition.dataset.i18n = `exp_edu.experience.${index}.position`
        expSummary.textContent = exp.summary
            expSummary.dataset.i18n = `exp_edu.experience.${index}.summary`
        // clear list
        expDuties.innerHTML = ""
        const expDutiesList = exp.duties
        expDutiesList.forEach((duty, i) => {
            const li = document.createElement('li')
            li.textContent = duty
            expDuties.append(li)

            li.dataset.i18n = `exp_edu.experience.${i}.duties`

            // store default English
            li.dataset.i18nDefault = duty
        })

        // store default English
        expTitle.dataset.i18nDefault = exp.title
        expCity.dataset.i18nDefault = exp.city
        expCountry.dataset.i18nDefault = exp.country
        expPosition.dataset.i18nDefault = exp.position
        expSummary.dataset.i18nDefault = exp.summary

        expContainer.append(clone)
    })
    const expCards = expContainer.querySelectorAll(".exp")
    const moreExpBtn = document.getElementById("more_exp-btn")
    const expBtnPlus = document.getElementById("more_exp-+")
    const expBtnText = document.getElementById("more-text")
    
    if (expCards.length <= 3) return

    // 1. show the button 
    moreExpBtn.classList.remove(hideClass)

    // 2. hide everything after the first 3
    expCards.forEach((card, i) => {
        card.classList.toggle(hideClass, i >= 3)
    })

    moreExpBtn.addEventListener("click", () => {
        const isHidden = expCards[3].classList.contains(hideClass) // current state

        expBtnPlus.textContent = isHidden ? "-" : "+"
        expBtnText.textContent = isHidden ? "Less" : "More"
        expCards.forEach((card, i) => {
            if (i >= 3) card.classList.toggle(hideClass)
        })
    })
}

// !~education template~!
const eduTemplate = document.getElementById("edu_template")
const eduContainer = document.getElementById("edu-container")
const eduSection = document.getElementById("edu-container")

async function buildEducation() {
    const eduData = await fetchContent(templateContent)
    const education = eduData.exp_edu.education

    education.forEach((edu, index) => {
        const clone = eduTemplate.content.cloneNode(true)

        const eduName = clone.querySelector(".edu-title")
        const eduDegree = clone.querySelector(".edu-degree")
        const eduStartDate = clone.querySelector(".edu-start_date")
        const eduEndDate = clone.querySelector(".edu-end_date")
        const eduEstDate = clone.querySelector(".est-date")
        const eduStartEndDate = clone.querySelector(".edu-start_end_date")
        const eduCity = clone.querySelector(".edu_city")
        const eduCountry = clone.querySelector(".edu_country")

        eduName.textContent = edu.title
            eduName.dataset.i18n = `exp_edu.education.${index}.title`
        eduDegree.textContent = edu.degree
            eduDegree.dataset.i18n = `exp_edu.education.${index}.degree`
        eduStartDate.textContent = edu.start_date
        eduEndDate.textContent = edu.end_date
        eduEstDate.textContent = edu.est_date
        eduCity.textContent = edu.city
            eduCity.dataset.i18n = `exp_edu.education.${index}.city`
        eduCountry.textContent = edu.country
            eduCountry.dataset.i18n = `exp_edu.education.${index}.country`

        if (education.start_date && education.end_date) {
            eduEstDate.style.display = "none"
        } else {
            eduStartEndDate.style.display = "none"
        }

        // save English defaults
        eduName.dataset.i18nDefault = edu.title
        eduDegree.dataset.i18nDefault = edu.degree
        eduCity.dataset.i18nDefault = edu.city
        eduCountry.dataset.i18nDefault = edu.country

        eduContainer.append(clone)
    })
}

// ✉️Contact✉️


// function to visualize accessing json content
async function loadContent(filePath) {
    const response = await fetch(filePath);
    const data = await response.json()

    const {languages, technologies, certifications} = data.skills
    const {experience, education} = data.exp_edu
    const projects = data.projects

    // Skills
    if (!ifEmpty(langSection, languages)) {
        buildLanguages();
    }
    
    if (!ifEmpty(techSection, technologies)) {
        buildTech();
    }

    if (!ifEmpty(certSection, certifications)) {
        buildCerts();
    }

    // Projects
    if (!ifEmpty(projectsSection, projects)) {
        buildProjects();
    } else {
        document.querySelectorAll('a[href="#projects"]').forEach(link =>
            link.closest("li")?.remove()
        )
    }

    // Education & experience
    if (!ifEmpty(expSection, experience)) {
        buildExperience();
    }

    if (!ifEmpty(eduSection, education)) {
        buildEducation();
    }
    console.log(data)
}

loadContent(templateContent)

// LANGUAGE TOGGLE
const langButtons = document.querySelectorAll(".lang-btn");

function swapNames(lang) {
    const engName = document.getElementById("en-name")
    const zhongName = document.getElementById("zh-name")

    if (lang == 'zh') {
        engName.classList.remove("active-name")
        zhongName.classList.remove("passive-name")
        engName.classList.add("passive-name")
        zhongName.classList.add("active-name")
    } else {
        engName.classList.remove("passive-name")
        zhongName.classList.remove("active-name")
        engName.classList.add("active-name")
        zhongName.classList.add("passive-name")
    }
}

function titleSwap(lang) {
    if (lang == 'zh') {
        document.title = `${zhName} | ${enName}`
    } else {
        document.title = htmlTitle
    }
}

function faviconSwap(lang) {
    const favicon = document.getElementById("favicon")
    let faviconPath = "images/favicon"

    favicon.href = `${faviconPath}/favicon-${lang}.svg`
}

// helper: true if el is inside a <template>
const inTemplate = (el) => el.closest("template") !== null;

// helper: read nested keys like "nav.home"
// function getNested(obj, path) {
//  return path.split(".").reduce((acc, key) => acc && acc[key], obj);
// }

// beginner friendly getNested() function
function getNested(obj, path) {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (current === undefined || current === null) {
      return undefined;
    }

    current = current[key];
  }

  return current;
}

// function to translate html elements/ui (NOT templates)
async function translateUI(lang) {
  // get all [data-i18n] that are NOT inside templates
  const uiElements = [...document.querySelectorAll("[data-i18n]")]
    .filter(el => !inTemplate(el));

  // 1) store original English text ONCE
  uiElements.forEach(el => {
    if (!el.dataset.i18nDefault) {
      el.dataset.i18nDefault = el.textContent; // ex: creates <li data-i18n-default="Builder"></li>
    }
  });

  // 2) if English, restore originals and stop (NO json needed)
  if (lang === "en") {
    uiElements.forEach(el => {
      el.textContent = el.dataset.i18nDefault; 
    });

    return;
  }

  // 3) otherwise load translations (zh)
  const translations = await fetchContent(uiTranslations);
  const tempTranslations = await fetchContent(templateTranslations)
  const dict = translations[lang];
  const tempDict = tempTranslations[lang]
  if (!dict) return;

  // 4) apply translations
  uiElements.forEach(el => {
        const key = el.dataset.i18n;        // "nav.home"
        const value = getNested(dict, key) ?? getNested(tempDict, key);

        if (value !== undefined) {
            el.textContent = value;
        }
    });
}


async function translatePage(lang) {
    await translateUI(lang)

    // swap hero name based on language
    swapNames(lang)

    // swap page title
    titleSwap(lang)

    // swap favicon
    faviconSwap(lang)

    // get proper style for mobile nav
    centerMobileNav()
}

// change the current language based on what button is clicked
langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // 1. update language variable
        currentLang = btn.dataset.lang

        // 2. update the html lang <html lang="">
        document.documentElement.lang = currentLang

        // 3. update hidden button
        langButtons.forEach(b => b.classList.toggle("is_hidden"));

        // 4. call translate function
        translatePage(currentLang)
    })
})
