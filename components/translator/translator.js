class Translator extends HTMLElement {
    async connectedCallback() {
        const response = await fetch("/components/translator/translator.html");
        const html = await response.text();

        this.innerHTML = html;

        // re-init buttons AFTER they exist
        if (typeof initLanguageButtons === "function") {
            initLanguageButtons();
        }
    }
}

customElements.define("site-translator", Translator);