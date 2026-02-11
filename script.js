<<<<<<< HEAD
// UNIVERSAL
const htmlTitle = document.title;
const zhName = document.querySelector(".zh-name").textContent;
let enName = document.querySelector("#en-name").textContent;
    const firstLast = enName.split(" ")
    if (enName.includes(zhName)) {
        enName = enName.replace(zhName, "").trim()
=======
// ** UNIVERSAL **
let defaultLang = 'en';
const translateBtn = document.getElementById("button_translate");
const ogTranslateText = translateBtn.textContent
// **   **

// ~~ TITLE ~~
const titleNameEn = 'Asiah Crutchfield'
const titleNameZh = '孫賽亞'
const title = document.title

function switchTitle (lang) {
    if (lang == 'zh') {
        document.title = `${titleNameZh} | ${titleNameEn}`
    } else {
        document.title = title
    }
}
// ~~ ~~

// || HERO SECTION || 
// Switch names
function switchNames (lang) { // switch names when changing languages
    const enName = document.getElementById('hero_en-name');
    const zhName = document.getElementById('hero_zh-name');
    const langName = lang.toLowerCase();

    if (langName.startsWith('en')) {
        enName.classList.add('name-active');
        enName.classList.remove('name-inactive');

        zhName.classList.add('name-inactive');
        zhName.classList.remove('name-active');
    } else if (langName.startsWith('zh')) {
        zhName.classList.add('name-active');
        zhName.classList.remove('name-inactive');

        enName.classList.add('name-inactive');
        enName.classList.remove('name-active');
>>>>>>> d4f93fb28ab3f4a5b3df255d52ed76a73a8cfdf8
    }
const hideClass = "is_hidden"
const activeLink = "nav_active"

<<<<<<< HEAD
// adds active class to currently clicked link
function activeSelect(navbar, active) {
    navbar.forEach(link => {
        link.addEventListener("click", () => {

            // 1. remove active class from all
            navbar.forEach(l => {
                l.classList.remove(active)
=======
// Hero Intro
const heroBio = document.getElementById('hero_bio')
const taglineContainer = document.getElementById('hero_tagline')
const tagline = document.querySelectorAll('.tagline-item')
const resumeText = document.querySelector('.resume_text');
    const ogHeroBio = heroBio.textContent
        const englishHeight = heroBio.offsetHeight
    const ogTagline = Array.from(tagline).map(item => item.textContent)
    const ogResume = resumeText.textContent

async function translateHero(lang) {
    const response = await fetch("translations/hero.json");
    const data = await response.json();
        const chineseTranslation = data.hero_bio;
        const taglineItems = data["tagline-item"]
    const zhHeroBio = data.hero_bio;

    heroBio.textContent = (lang === 'zh') ? data.hero_bio : ogHeroBio;

    // Update tagline items
    tagline.forEach((item, i) => {
        // Set the main text
        item.textContent = (lang === 'zh') ? taglineItems[i] : ogTagline[i];
    });

    // Update RESUME text
    resumeText.textContent = (lang === 'zh') ? data.hero_resume : ogResume;
}
// ||   || 


// !! PROJECTS SECTION !! 
async function translateProjects(lang) {
    const response = await fetch("translations/projects.json");
    const projects = await response.json();
        const projectsList = projects[lang];
        const linkText = projects.viewProjectLang[lang];
        const statusText = projects.projectStatusLang[lang];
        const sectionTitle = projects.projectSectionTitle[lang];
            const mainTitle = document.querySelector("#projects-section_title")
            mainTitle.textContent = sectionTitle;

    const wrapper = document.querySelector(".projects_projects-wrapper");
    const template = document.getElementById("projects_template");

    wrapper.innerHTML = "";

    projectsList.forEach(project => {
        const clone = template.content.cloneNode(true);

        const title = clone.querySelector(".project-title");
        const desc = clone.querySelector(".project-description");
        const img = clone.querySelector(".project-img");
        const link = clone.querySelectorAll(".project-link");
        const status = clone.querySelector(".project-status");
        const textLink = clone.querySelector(".projects_project-status-wrapper a.project-link");

        title.textContent = project.projectTitle.toUpperCase();
        desc.textContent = project.projectDescription;
        img.style.backgroundImage = `url(${project.projectImg})`;
        img.alt = project.projectTitle;
        link.forEach(a => {
            a.href = project.projectLink;
        })
        

        textLink.textContent = linkText;

        if (project.projectStatus) {
            status.textContent = statusText;
            status.style.display = "block";
        } else {
            status.style.display = "none";
        }

        // Append updated node after populating
        wrapper.appendChild(clone);
    });

}
translateProjects(defaultLang);
// !!   !!

// ++ SKILLS SECTION ++
    // Section title
    async function translateSkillsTitle(lang) {
        const response = await fetch('translations/skills/skills-title.json');
        const title = await response.json();
            const htmlTitle = document.getElementById('skills-section_title');
            htmlTitle.textContent = title.skillsSectionTitle[lang];
    }

    //Technologies
    const technologyTitle = document.querySelector('#skills_technologies-title');
        const languageTitle = document.querySelector('#lang-title');
        const frameworkTitle = document.querySelector('#framework-title');
        const toolTitle = document.querySelector('#tool-title');

        const ogTechTitle = technologyTitle.textContent;
        const ogLangTitle = languageTitle.textContent;
        const ogFrameworkTitle = frameworkTitle.textContent;
        const ogToolTitle = toolTitle.textContent;
    

    async function translateTechnologies(lang) {
        const response = await fetch("translations/skills/technologies.json");
        const technologies = await response.json();
        
        const techTitle = technologies.technologiesSectionTitle[lang];
        
        technologyTitle.textContent = (lang === 'zh') ? techTitle : ogTechTitle;
        languageTitle.textContent = (lang === 'zh') ? technologies.techSection.languages : ogLangTitle;
        toolTitle.textContent = (lang === 'zh') ? technologies.techSection.tools : ogToolTitle;
        frameworkTitle.textContent = (lang === 'zh') ? technologies.techSection.frameworks : ogFrameworkTitle;
    };

    //Languages
    async function translateLanguages(lang) {
        const response = await fetch("translations/skills/languages.json");
        const languages = await response.json();
            const languageList = languages[lang];
            const langSectionTitle = languages.languageSectionTitle[lang];
            const zhLangFluency = ["初學者", "會話程度", "中級", "精通", "流利","母語者"];
            const enLangFluency = ["beginner", "conversational", "intermediate", "proficient", "fluent", "native"];
                const titleHTML = document.querySelector("#skills_language-title");
                    titleHTML.textContent = langSectionTitle;

        const wrapper = document.querySelector("#skills_language-container");
        const languageTemplate = document.querySelector("#language-template")

        wrapper.innerHTML = "";

        languageList.forEach(language => {
            const clone = languageTemplate.content.cloneNode(true);

            const img = clone.querySelector(".language-img");
            const languageName = clone.querySelector(".language-name");
            const languageProgress = clone.querySelector(".language-progress");
                const languageProgressPercent = [10, 25, 50, 65, 80, 100];
            const fluency = clone.querySelector(".language-fluency");
                const fluencyColors = ["red", "blue", "purple", "yellow", "green", "gold"];
                const fluencyLevel = language.languageFluency - 1;
            
            img.src = language.languageImg;
            languageName.textContent = language.languageName;
            if (lang === 'zh') {
                fluency.textContent = zhLangFluency[fluencyLevel]
            } else {
                fluency.textContent = enLangFluency[fluencyLevel]
            }
                languageProgress.style.backgroundColor = fluencyColors[fluencyLevel];
                languageProgress.style.width = `${languageProgressPercent[fluencyLevel]}%`;
            
            wrapper.appendChild(clone);
        })
    }
    translateLanguages(defaultLang)
    translateTechnologies(defaultLang)
    //++++

    // Certifications
    async function translateCerts(lang) {
        const response = await fetch("translations/skills/certificates.json");
        const certifications = await response.json();
            const certs = certifications[lang];
            const certTitle = certifications.certSectionTitle;
                const sectionTitle = document.getElementById('skills_certs-title');
                    sectionTitle.textContent = certTitle[lang];
        
        const wrapper = document.getElementById('skills_certs-container');
        const template = document.getElementById('cert-template');

        wrapper.innerHTML = '';

        certs.forEach(cert => {
            const clone = template.content.cloneNode(true);

            const certLink = clone.querySelector('.cert-link');
            const certification = clone.querySelector('.cert');

            if (cert.certificateLink) {
                certLink.href = cert.certificateLink;
            } else {
                certLink.style.display = 'none'
            };

            certification.textContent = cert.certificate;

            wrapper.append(clone);
        })
    }
    translateCerts(defaultLang);
    //++++
// ++   ++


// $$ EXPERIENCE SECTION $$
async function translateExperience(lang) {
    const response = await fetch("translations/experience.json");
    const experience = await response.json();
        const xpLang = experience[lang];
        const expTitle = experience.expSectionTitle[lang];
            const htmlTitle = document.getElementById('experience-section_title');
                htmlTitle.textContent = expTitle;
    
    const wrapper = document.getElementById('experience_exp-wrapper');
    const template = document.getElementById('experience_template');

    wrapper.innerHTML = '';

    xpLang.forEach((exp, index) => {
        const clone = template.content.cloneNode(true);

        const expName = exp.expName;
            const nameHTML = clone.querySelector('.exp_name')
        const expPosition = exp.expPosition;
            const positionHTML = clone.querySelector('.exp_position')
        const expStartMonth = exp.expStartMonth;
            const startMonthHTML = clone.querySelector('.start-month')
            const expStartDate = exp.expStartDate;
                const startDateHTML = clone.querySelector('.start-date')
        const expEndMonth = exp.expEndMonth;
            const endMonthHTML = clone.querySelector('.end-month')
            const expEndDate = exp.expEndDate;
                const endDateHTML = clone.querySelector('.end-date')
        const expCity = exp.expCity;
            const cityHTML = clone.querySelector('.exp_city')
        const expCountry = exp.expCountry;
            const countryHTML = clone.querySelector('.exp_country')
        const expSummary = exp.expSummary;
            const summaryHTML = clone.querySelector('.exp_summary')
        const expDuties = exp.expDuties;
            const dutiesHTML = clone.querySelector('.exp_duties')
            dutiesHTML.innerHTML = '';
        const duties_separator = clone.querySelector('.exp_line-separator')

        nameHTML.textContent = expName;
        positionHTML.textContent = expPosition;
        startMonthHTML.textContent = expStartMonth;
        startDateHTML.textContent = expStartDate;
        endMonthHTML.textContent = expEndMonth;
        endDateHTML.textContent = expEndDate;
        cityHTML.textContent = expCity;
        countryHTML.textContent = expCountry;
        summaryHTML.textContent = expSummary;

        // Top separator
        const topHr = document.createElement('hr');
        topHr.className = 'exp_line-separator';
        dutiesHTML.appendChild(topHr);

            expDuties.forEach(dutyText => {
                const li = document.createElement('li');
                li.textContent = dutyText;
                dutiesHTML.appendChild(li);
>>>>>>> d4f93fb28ab3f4a5b3df255d52ed76a73a8cfdf8
            });
        link.classList.add(active)
        });
    });
}

<<<<<<< HEAD
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

    languages.forEach(lang => {
        const clone = langTemplate.content.cloneNode(true);

        const langName = clone.querySelector(".lang-name")
        const langFlag = clone.querySelector(".lang-flag")
        const langFluency = clone.querySelector(".fluency")
        const progress = clone.querySelector(".lang-progress")

        langName.textContent = lang.lang
        langFlag.src = `images/icons/${lang.flag}`
        langFluency.textContent = fluencyLevels[lang.fluency]

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
=======
        // Bottom separator
        const bottomHr = document.createElement('hr');
        bottomHr.className = 'exp_line-separator';
        dutiesHTML.appendChild(bottomHr);
        
        if (index === xpLang.length - 1) {
            const separators = clone.querySelectorAll(".exp_separator");
            separators[separators.length - 1].style.display = 'none'; // Hide the last separator in the clone
>>>>>>> d4f93fb28ab3f4a5b3df255d52ed76a73a8cfdf8
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
const projectsSection = document.getElementById('projects')

async function buildProjects() {
    const projData = fetchContent(templateContent)
    const projects = projData.projects

    projects.forEach(proj => {
        const clone = projTemplate.content.cloneNode(true)

<<<<<<< HEAD
        const title = clone.querySelector(".project-title")
        const img = clone.querySelector("project-img")
        const imgLink = clone.querySelector(".p_img-link")
        const description = clone.querySelector(".project-desc")
        const linkList = clone.querySelector(".project-links")
        const pLinks = clone.querySelector(".p_links")
            const pLinkItems = proj.pLinks
        const linkImg = clone.querySelector(".p_link-img")

        title.textContent = proj.name
        img.src = `images/icons/projects/${proj.img}`
        imgLink.href = !proj.imgLink || proj.imgLink == "" ? "" : proj.imgLink
        description.textContent = proj.description

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
        projContainer.append(proj)
    })
=======
    const hobbyList = about.hobbies[lang];  // e.g., ["Working out", "Language learning", "Walking"]

    wrapper.querySelectorAll('.hobby_text').forEach((span, i) => {
        // Make sure there is a corresponding hobby
        if (hobbyList[i]) {
            span.textContent = hobbyList[i];
        }
    });
}

async function showYoutubeVideos() {
    const youtubeAPI = "AIzaSyAhz5U5uitUrt_I0nCTyPsP3m1v1dJbm_0";
    const channelID = "UCQlqj15bBd8Ah6kAgw0IyGA";
    const maxResults = 5;

    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${youtubeAPI}&channelId=${channelID}&part=snippet,id&order=date&maxResults=${maxResults}`;

    const youtubeResponse = await fetch(apiURL);
    const data = await youtubeResponse.json();

    const mediaList = document.getElementById("hobbies-media");
        mediaList.innerHTML = ''

    data.items.forEach(item => {
      if (item.id.kind === "youtube#video") {
        const videoId = item.id.videoId;
        const li = document.createElement("li");
        li.classList.add("youtube-vid")

        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        li.appendChild(iframe);
        mediaList.appendChild(li);
      }
    });
>>>>>>> d4f93fb28ab3f4a5b3df255d52ed76a73a8cfdf8
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
<<<<<<< HEAD
=======
translateReferences(defaultLang);
showYoutubeVideos()
// %%   %%
>>>>>>> d4f93fb28ab3f4a5b3df255d52ed76a73a8cfdf8

// !~education template~!
const eduTemplate = document.getElementById("edu_template")
const eduContainer = document.getElementById("edu-container")
const eduSection = document.getElementById("edu-container")

<<<<<<< HEAD
async function buildEducation() {
    const eduData = await fetchContent(templateContent)
    const education = eduData.exp_edu.education

    education.forEach(edu => {
        const clone = eduTemplate.content.cloneNode(true)

        const eduName = clone.querySelector(".edu-title")
        const eduDegree = clone.querySelector(".edu-degree")
        const eduStartDate = clone.querySelector(".edu-start_date")
        const eduEndDate = clone.querySelector(".edu-end_date")
        const eduEstDate = clone.querySelector(".est-date")
        const eduStartEndDate = clone.querySelector(".edu-start_end_date")

        eduName.textContent = edu.title
        eduDegree.textContent = edu.degree
        eduStartDate.textContent = edu.start_date
        eduEndDate.textContent = edu.end_date
        eduEstDate.textContent = edu.est_date

        if (education.start_date && education.end_date) {
            eduEstDate.style.display = "none"
        } else {
            eduStartEndDate.style.display = "none"
        }

        eduContainer.append(clone)
    })
=======
    const sectionTitle = document.getElementById('contact-section_title')
    const emailTitle = document.getElementById('email_title')
    const linkText = document.getElementById('contact_resume-text')
    const socialsTitle = document.getElementById('socials-title')
    
    sectionTitle.textContent = contactLang.sectionTitle;
    emailTitle.textContent = contactLang.contactTitle;
    linkText.textContent = contactLang.linkText;
    socialsTitle.textContent = contactLang.socialsTitle;
>>>>>>> d4f93fb28ab3f4a5b3df255d52ed76a73a8cfdf8
}

<<<<<<< HEAD
// ✉️Contact✉️

// function to visualize accessing json content
async function loadContent(filePath) {
    const response = await fetch(filePath);
    const data = await response.json()

    const {languages, technologies, certifications} = data.skills
    const {experience, education} = data.exp_edu
    const {projects} = data.projects

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
=======
translateBtn.addEventListener("click", function() {
    if (defaultLang === 'en') {
        defaultLang = 'zh';
        translateBtn.textContent = "Hi! (en)";
        document.title = "孫賽亞"
    } else {
        defaultLang = 'en';
        translateBtn.textContent = ogTranslateText;
        document.title = "Asiah Crutchfield";
    }

    switchTitle (defaultLang);
    translateHero(defaultLang);
    translateProjects(defaultLang); 
    // Skills
    translateSkillsTitle(defaultLang);
    translateTechnologies(defaultLang);
    translateCerts(defaultLang);
    translateLanguages(defaultLang)
    // ++++
    translateExperience(defaultLang);
    translateEducation(defaultLang);
    translateAbout(defaultLang);
    translateReferences(defaultLang);
    translateContact(defaultLang);
        switchNames(defaultLang);
})
>>>>>>> d4f93fb28ab3f4a5b3df255d52ed76a73a8cfdf8
