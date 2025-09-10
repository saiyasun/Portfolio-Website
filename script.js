// ** UNIVERSAL **
let defaultLang = 'en';
const translateBtn = document.getElementById("button_translate");
// **   **

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
    }
}

// Hero Intro
const heroBio = document.getElementById('hero_bio')
const taglineContainer = document.getElementById('hero_tagline')
const tagline = document.querySelectorAll('.tagline-item')
const resume = document.getElementById('hero_resume')
    const ogHeroBio = heroBio.textContent
    const ogTagline = Array.from(tagline).map(item => item.textContent)
    const ogResume = resume.textContent

async function translateHero(lang) {
    const response = await fetch("translations/hero.json");
    const data = await response.json();
        const taglineItems = data["tagline-item"]

    heroBio.textContent = (lang === 'zh') ? data.hero_bio : ogHeroBio;

    // Update tagline items
    tagline.forEach((item, i) => {
        // Set the main text
        item.textContent = (lang === 'zh') ? taglineItems[i] : ogTagline[i];
    });

    // Update RESUME text
    resume.textContent = (lang === 'zh') ? data.hero_resume : ogResume;
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

        nameHTML.textContent = expName;
        positionHTML.textContent = expPosition;
        startMonthHTML.textContent = expStartMonth;
        startDateHTML.textContent = expStartDate;
        endMonthHTML.textContent = expEndMonth;
        endDateHTML.textContent = expEndDate;
        cityHTML.textContent = expCity;
        countryHTML.textContent = expCountry;
        summaryHTML.textContent = expSummary;
            expDuties.forEach(dutyText => {
                const li = document.createElement('li');
                li.textContent = dutyText;
                dutiesHTML.appendChild(li);
            });

        if (index === xpLang.length - 1) {
            const separators = clone.querySelectorAll(".exp_separator");
            separators[separators.length - 1].style.display = 'none'; // Hide the last separator in the clone
        }

        // Duty toggle button
        const dutyButton = clone.querySelector('.exp_button')
        const dutyButtonText = experience.expDutyButton[lang];
        dutyButton.textContent = dutyButtonText[0];
        dutyButton.addEventListener("click", function() {
            const card = dutyButton.closest('.experience'); // or whatever your card's class is
            const dutyCard = card.querySelector('.exp_duties');
            const currentDisplay = window.getComputedStyle(dutyCard).display;

            if (currentDisplay === 'none') {
                dutyCard.style.display = 'flex';
                dutyButton.textContent = dutyButtonText[1];
            } else {
                dutyCard.style.display = 'none';
                dutyButton.textContent = dutyButtonText[0];
            }
        })
        // $$$$

        wrapper.appendChild(clone);
    })
}
translateExperience(defaultLang)
// $$   $$


// @@ EDUCATION SECTION @@
async function translateEducation(lang) {
    const response = await fetch('translations/education.json');
    const education = await response.json();
    eduLang = education[lang];
    const sectionTitle = document.getElementById('education-section_title');
        const titleLang = education.educationSectionTitle[lang];
        sectionTitle.textContent = titleLang;

    const wrapper = document.getElementById('education-wrapper');
    const template = document.getElementById('education_template');

    wrapper.innerHTML = '';

    eduLang.forEach(edu => {
        const clone = template.content.cloneNode(true);

        const school = edu.school;
            const schoolHTML = clone.querySelector('.education_school');
        const degree = edu.degree;
            const degreeHTML = clone.querySelector('.education_degree');
        const startYear = edu.startDate;
            const startYearHTML = clone.querySelector('.education_start-date');
        const endYear = edu.endDate;
            const endYearHTML = clone.querySelector('.education_end-date');
                const graduateSection = clone.querySelector('.education_graduation');
        const estYear = edu.estDate;
            const estYearHTML = clone.querySelector('.education_est-date');
            const estYearSection = clone.querySelector('.education_est-graduation');
            const hasEstYear = 'estDate' in edu;
        const location = edu.location;
            const locationHTML = clone.querySelector('.education_location');

        schoolHTML.textContent = school;
        degreeHTML.textContent = degree;
        startYearHTML.textContent = startYear;
        endYearHTML.textContent = endYear;
        estYearHTML.textContent = estYear;
        locationHTML.textContent = location;

        if (hasEstYear) {
            graduateSection.style.display = 'none'
        } else {
            estYearSection.style.display = 'none';
        } 
        
        wrapper.appendChild(clone)
    })
}
translateEducation(defaultLang); 
// @@   @@

// %% ABOUT SECTION %%
const originalBioText = Array.from(document.querySelectorAll('.about_bio')).map(p => p.textContent);

async function translateAbout(lang) {
    const response = await fetch('translations/about/about.json');
    const about = await response.json();
    const titleLang = about.aboutSectionTitle[lang];
    const hobbyTitleLang = about.hobbyTitle[lang];
        const aboutSectionTitle = document.getElementById('about-section_title');
        const hobbySectionTitle = document.getElementById('about_hobbies-title');
        aboutSectionTitle.textContent = titleLang;
        hobbySectionTitle.textContent = hobbyTitleLang;

    
    // Update bio
    const bioContainer = document.getElementById('about_about-me');
    const bioElements = bioContainer.querySelectorAll('.about_bio');
    if (lang === 'zh') {
        // Loop over paragraphs in JSON and set each <p>
        about.bio[lang].forEach((paragraph, index) => {
            if (bioElements[index]) {
                bioElements[index].textContent = paragraph;
            }
        });
    } else {
        // Restore original English text
        bioElements.forEach((p, i) => {
            p.textContent = originalBioText[i];
        });
    }
    
    const wrapper = document.getElementById('hobbies-list');

    wrapper.innerHTML = '';

    const hobbyList = about.hobbies[lang];
        hobbyList.forEach(hobby => {
            const li = document.createElement('li');
            li.textContent = hobby;
            wrapper.appendChild(li);
        })
}

const refTitle = document.getElementById('about_references-title');
const refTitleText = refTitle.textContent;

async function translateReferences(lang) {
    const response = await fetch('translations/about/references.json');
    const references = await response.json();
    const refLang = references[lang] || [];
    const refNum = refLang.length;
    const refSection = document.getElementById('about_references-wrapper');
    const titleLang = references.referenceSectionTitle[lang];
        if (lang == 'zh') {
            refTitle.textContent = titleLang;
        } else {
            refTitle.textContent = refTitleText;
        }

    if (refNum < 1) {
        refSection.style.display = 'none';
    } else {
        refSection.style.display = 'block'; // show if there are references
    }
        
    const wrapper = document.getElementById('references-container');
    const template = document.getElementById('about_reference-template');

    wrapper.innerHTML = '';

    refLang.forEach(ref => {
        const clone = template.content.cloneNode(true);

        const refPic = ref.img;
            const refPicHTML = clone.querySelector('.references_profile-pic');
        const refName = ref.name;
            const refNameHTML = clone.querySelector('.references_name')
        const refText = ref.reference;
            const refTextHTML = clone.querySelector('.references_bio')

        refPicHTML.src = refPic;
        refNameHTML.textContent = refName;
        refTextHTML.textContent = refText;

        const showRefText = clone.querySelector('.ref_expand-button');
        showRefText.addEventListener("click", function() {
            const referant = showRefText.closest('.reference');
            const refBio = referant.querySelector('.references_bio');
            const bioDisplay = window.getComputedStyle(refBio).display;

            if (bioDisplay === 'none') {
                refBio.style.display = 'block';
                showRefText.textContent = '-'
            } else {
                refBio.style.display = 'none';
                showRefText.textContent = '+'
            }
        })

        wrapper.appendChild(clone);
    })
}
translateReferences(defaultLang);
// %%   %%

// ## CONTACT SECTION ##
async function translateContact(lang) {
    const response = await fetch('translations/contact.json');
    const contact = await response.json();
    const contactLang = contact[lang];

    const sectionTitle = document.getElementById('contact-section_title')
    const emailTitle = document.getElementById('email_title')
    const linkText = document.getElementById('contact_resume-link')
    const socialsTitle = document.getElementById('socials-title')
    
    sectionTitle.textContent = contactLang.sectionTitle;
    emailTitle.textContent = contactLang.contactTitle;
    linkText.textContent = contactLang.linkText;
    socialsTitle.textContent = contactLang.socialsTitle;
}
// ##   ##

translateBtn.addEventListener("click", function() {
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
    translateSkillsTitle(defaultLang);
    translateLanguages(defaultLang);
    translateCerts(defaultLang);
    // ++++
    translateExperience(defaultLang);
    translateEducation(defaultLang);
    translateAbout(defaultLang);
    translateReferences(defaultLang);
    translateContact(defaultLang);
        switchNames(defaultLang);
})