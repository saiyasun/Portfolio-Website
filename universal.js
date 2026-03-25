let currentLang = document.documentElement.lang

// change the current language based on what button is clicked
const langButtons = document.querySelectorAll(".lang-btn");

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