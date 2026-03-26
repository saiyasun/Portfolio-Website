let currentLang = document.documentElement.lang;

const langButtons = document.querySelectorAll(".lang-btn");

async function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = currentLang;

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

langButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
        await applyLanguage(btn.dataset.lang);
    });
});
