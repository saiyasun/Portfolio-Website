class Translator extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="translator">
            <button class="lang-btn is_hidden glass-nav" id="lang_btn-en" data-lang="en">EN</button>
            <button class="lang-btn glass-nav" id="lang_btn-zh" data-lang="zh">中</button>
        </div>
        `
    }
}

customElements.define("site-translator", Translator)