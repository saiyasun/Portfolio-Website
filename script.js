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
async function translateProjects() {
    const wrapper = document.querySelector(".projects_projects-wrapper");
    const template = document.getElementById("projects_template");
    const cloneTemplate = template.content.cloneNode(true);

    wrapper.appendChild(cloneTemplate);
}
// !!   !!

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
        switchNames(defaultLang);
})