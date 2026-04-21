class SiteNavbar extends HTMLElement {
    async connectedCallback() {
        const response = await fetch("/components/navbar/navbar.html");
        const html = await response.text();

        this.innerHTML = html;

        this.setupLinks();

        // make sure language param logic runs AFTER links exist
        if (typeof updateLocalizedLinks === "function") {
            updateLocalizedLinks(this);
        }

        // if translations exist, re-apply to navbar
        if (window.translateUI) {
            document.dispatchEvent(
                new CustomEvent("languagechange", {
                    detail: { lang: document.documentElement.lang }
                })
            );
        }
    }

    setupLinks() {
        const isHomePage =
            window.location.pathname === "/" ||
            window.location.pathname === "/index.html";

        const links = this.querySelectorAll("[data-link]");

        links.forEach(link => {
            const section = link.dataset.link;

            if (section === "home") {
                link.href = isHomePage ? "#hero" : "/index.html";
                return;
            }

            link.href = isHomePage
                ? `#${section}`
                : `/index.html#${section}`;
        });
    }
}

customElements.define("site-navbar", SiteNavbar);