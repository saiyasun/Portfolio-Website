import { getCurrentLang, translateUI } from "../../lib/i18n";

/** Applies homepage copy and presentation changes when the language changes. */
export function initializeHomeLocalization(translationFiles: string[]) {
    const defaultTitle = document.title;
    const englishName = document.querySelector<HTMLElement>("#en-name");
    const chineseName = document.querySelector<HTMLElement>("#zh-name");
    const englishNameText = englishName?.textContent?.replace(chineseName?.textContent || "", "").trim() || "Asiah Crutchfield";
    const chineseNameText = chineseName?.textContent || "孫賽亞";
    const favicon = document.querySelector<HTMLLinkElement>("#favicon");

    async function updatePage(lang: string) {
        await translateUI(lang, translationFiles);

        englishName?.classList.toggle("active-name", lang !== "zh");
        englishName?.classList.toggle("passive-name", lang === "zh");
        chineseName?.classList.toggle("active-name", lang === "zh");
        chineseName?.classList.toggle("passive-name", lang !== "zh");

        document.title = lang === "zh" ? `${chineseNameText} | ${englishNameText}` : defaultTitle;

        if (favicon) {
            favicon.href = `images/meta/favicon/favicon-${lang}.svg`;
        }
    }

    document.addEventListener("languagechange", (event: Event) => {
        const lang = (event as CustomEvent<{ lang: string }>).detail.lang;
        void updatePage(lang);
    });

    void updatePage(getCurrentLang());
}
