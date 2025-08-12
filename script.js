// ** UNIVERSAL **
let defaultLang = 'en';
const translateBtn = document.getElementById("button_translate");
// **   **

// || HERO SECTION || 
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
    }
}

async function translateHero(lang) {
    const resumeLink = document.getElementById("hero_resume");

    try {
        const res = await fetch("translations/hero.json");
        const data = await res.json();

        // Update tagline items
        const taglineItems = document.querySelectorAll("#hero_tagline .tagline-item");
        const translations = data[lang]["tagline-item"];

        taglineItems.forEach((item, i) => {
            item.textContent = translations[i] || item.textContent;
        });

        // Update RESUME text
        resumeLink.innerHTML = `<img class="hero_img" src="images/logos_icons/white/resume_white.svg"> ${data[lang]["hero_resume"] || "RESUME"}`;

    } catch (err) {
        console.error("Translation error:", err);
    }
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
        const link = clone.querySelector(".project-link");
        const status = clone.querySelector(".project-status");
        const textLink = clone.querySelector(".projects_project-status-wrapper a.project-link");

        title.textContent = project.projectTitle.toUpperCase();
        desc.textContent = project.projectDescription;
        img.style.backgroundImage = `url(${project.projectImg})`;
        img.alt = project.projectTitle;
        link.href = project.projectLink;
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
        const response = await fetch('translations/skills.json/skills-title.json');
        const title = await response.json();
            const htmlTitle = document.getElementById('skills-section_title');
            htmlTitle.textContent = title.skillsSectionTitle[lang];
    }

    //Languages
    async function translateLanguages(lang) {
        const response = await fetch("translations/skills.json/languages.json");
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
    //++++

    // Certifications
    async function translateCerts(lang) {
        const response = await fetch("translations/skills.json/certificates.json");
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

            const certLink = clone.querySelector('.skills_cert');
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

translateBtn.addEventListener("click", function () {
    if (defaultLang === 'en') {
        defaultLang = 'zh';
        translateBtn.textContent = "Hi!";
        document.title = "孫賽亞"
    } else {
        defaultLang = 'en';
        translateBtn.textContent = "你好!";
        document.title = "Asiah Crutchfield";
    }

    translateHero(defaultLang);
    translateProjects(defaultLang); 
    // Skills
    translateSkillsTitle(defaultLang)
    translateLanguages(defaultLang);
    translateCerts(defaultLang);
    // ++++
        switchNames(defaultLang);
})
