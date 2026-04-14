let currentLang = document.documentElement.lang;

function getLangButtons() {
    return document.querySelectorAll(".lang-btn")
}

async function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = currentLang;

    const langButtons = getLangButtons()

    langButtons.forEach(btn => {
        btn.classList.toggle("is_hidden", btn.dataset.lang === currentLang);
    });

    // universal custom event
    document.dispatchEvent(
        new CustomEvent("languagechange", {
            detail: { lang: currentLang }
        })
    );
}

async function fetchAllJSON(files = []) {
    try {
        // 1. fetch all files
        const responses = await Promise.all(files.map(file => fetch(file)))

        // 2. convert responses to json
        const data = await Promise.all(responses.map(res => res.json()))

        return data
    } catch (error) {
        console.error("One or more files failed to load: ", error)
    }
}

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

window.translateUI =  async function (lang, files = []) {
    const uiElements = [...document.querySelectorAll("[data-i18n]")]
    
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

    // 3. load all translation files
    const uiFiles = await fetchAllJSON(files)
    
    // 4. merge all language dictionaries
    const mergedDict = uiFiles
        .map(file => file?.[lang] || {})
        .reduce((acc, obj) => deepMerge(acc, obj), {})

    // 5. apply translations
    uiElements.forEach(el => {
        const key = el.dataset.i18n
        const value = getNested(mergedDict, key)

        if (value !== undefined) {
            el.textContent = value
        }
    })
}
function deepMerge(target, source) {
  for (const key in source) {

    if (
      typeof source[key] === "object" &&
      source[key] !== null
    ) {
      if (!target[key]) {
        target[key] = {};
      }

      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
}

window.fillDateElements = function(dateObj, monthEl, dayEl, yearEl) {
    const postLang = getCurrentLang()

    monthEl.textContent = dateObj
        .toLocaleString(postLang === "zh" ? "zh-TW" : "en-US", { month: "short" })
        .toLowerCase();

    dayEl.textContent = ` ${dateObj.getDate()}`;
    yearEl.textContent = `, ${dateObj.getFullYear()}`;

    if (postLang === "zh") {
        monthEl.textContent = `${dateObj
        .toLocaleString(postLang === "zh" ? "zh-TW" : "en-US", { month: "short" })
        .toLowerCase()}`;
        yearEl.textContent = `，${dateObj.getFullYear()}`
        dayEl.textContent = `${dateObj.getDate()}日`;
    }
}

async function loadHTMLComponents(targetId, filePath) {
    const target = document.getElementById(targetId);
    if (!target) return
    
    try {
        const response = await fetch(filePath)
        if (!response.ok) {
            throw new Error(`Failed to load component: ${filePath}`)
        }
        const html = await response.text()
        target.innerHTML = html
    } catch (error) {
        console.error(error)
    }
}

function initLanguageButtons() {
    const langButtons = getLangButtons()

    langButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            await applyLanguage(btn.dataset.lang);
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadHTMLComponents("navbar-component", "/components/navbar.html")

    initLanguageButtons()

    await applyLanguage(currentLang)
})