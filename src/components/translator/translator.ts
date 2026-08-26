// @ts-nocheck
import { initLanguageButtons } from "../../ts/universal";
import translatorTemplate from "./translator.html?raw";
import "./translator.css";
class Translator extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = translatorTemplate;

        // re-init buttons AFTER they exist
        initLanguageButtons();
    }
}

customElements.define("site-translator", Translator);
